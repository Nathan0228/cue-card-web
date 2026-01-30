'use server'

import { revalidatePath } from 'next/cache'
import { createClientAction } from '@/app/lib/supabase/server'

export async function createCard(formData: FormData) {
  const supabase = createClientAction()

  // 1. 获取当前用户
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // 2. 获取表单字段
  const question = String(formData.get('question') ?? '')
  const answer = String(formData.get('answer') ?? '')
  const visibility = String(formData.get('visibility') ?? 'private')

  const categoryId = formData.get('categoryId') as string | null
  const newCategoryName = String(formData.get('newCategoryName') ?? '').trim()

  let finalCategoryId: string | null = null

  // 3. 如果用户输入了新的分类名，则先插入分类表
  if (newCategoryName) {
    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert({
        name: newCategoryName,
        user_id: user.id,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('创建分类失败:', insertError.message)
      throw new Error('创建分类失败')
    }

    finalCategoryId = newCategory.id
  } 
  // 否则使用已有分类
  else if (categoryId) {
    finalCategoryId = categoryId
  }

  // 4. 插入 cue_cards 表
  const { error } = await supabase.from('cue_cards').insert({
    question,
    answer,
    user_id: user.id,
    category_id: finalCategoryId, // 如果没有分类，可以是 null
    private: visibility !== 'public',
  })

  if (error) {
    console.error('创建卡片失败:', error.message)
    throw new Error('创建卡片失败')
  }

  // 5. 刷新页面
  revalidatePath('/')
  revalidatePath('/cue-cards')
}

/** 仅当卡片属于当前用户时更新，否则抛错。cardId 从 formData 的 cardId 字段读取 */
export async function updateCard(formData: FormData) {
  const supabase = createClientAction()
  const cardId = String(formData.get('cardId') ?? '')
  if (!cardId) throw new Error('缺少卡片 ID')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('请先登录')

  const { data: card, error: fetchError } = await supabase
    .from('cue_cards')
    .select('id, user_id')
    .eq('id', cardId)
    .single()

  if (fetchError || !card) throw new Error('卡片不存在')
  if (card.user_id !== user.id) throw new Error('只能修改自己的卡片')

  const question = String(formData.get('question') ?? '').trim()
  const answer = String(formData.get('answer') ?? '').trim()
  const visibility = String(formData.get('visibility') ?? 'private')
  const categoryId = (formData.get('categoryId') as string) || null
  const newCategoryName = String(formData.get('newCategoryName') ?? '').trim()

  let finalCategoryId: string | null = null
  if (newCategoryName) {
    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert({ name: newCategoryName, user_id: user.id })
      .select('id')
      .single()
    if (insertError) throw new Error('创建分类失败')
    finalCategoryId = newCategory.id
  } else if (categoryId) {
    finalCategoryId = categoryId
  }

  const { error } = await supabase
    .from('cue_cards')
    .update({
      question,
      answer,
      category_id: finalCategoryId,
      private: visibility !== 'public',
    })
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) throw new Error('更新卡片失败')
  revalidatePath('/')
  revalidatePath('/cue-cards')
  revalidatePath(`/cue-cards/edit/${cardId}`)
}

/** 仅当卡片属于当前用户时删除，否则抛错 */
export async function deleteCard(cardId: string) {
  const supabase = createClientAction()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('请先登录')

  const { data: card, error: fetchError } = await supabase
    .from('cue_cards')
    .select('id, user_id')
    .eq('id', cardId)
    .single()

  if (fetchError || !card) throw new Error('卡片不存在')
  if (card.user_id !== user.id) throw new Error('只能删除自己的卡片')

  const { error } = await supabase
    .from('cue_cards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) throw new Error('删除卡片失败')
  revalidatePath('/')
  revalidatePath('/cue-cards')
}

/** 按 question / answer 搜索卡片；RLS 保证只返回当前用户的私有卡 + 所有公开卡 */
function escapeIlike(q: string): string {
  return q
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
}

export type SearchCardItem = {
  id: string
  question: string
  answer: string
  private: boolean
  user_id: string
  category: { id: string; name: string } | null
}

export async function searchCards(query: string): Promise<SearchCardItem[]> {
  const supabase = createClientAction()
  const q = String(query).trim()
  if (!q) return []

  const escaped = escapeIlike(q)
  const pattern = `%${escaped}%`
  const quoted = `"${pattern.replace(/"/g, '\\"')}"`

  const { data, error } = await supabase
    .from('cue_cards')
    .select(`
      id,
      question,
      answer,
      private,
      user_id,
      category:categories(id, name)
    `)
    .or(`question.ilike.${quoted},answer.ilike.${quoted}`)
    .order('created_at', { ascending: false })

  if (error) return []

  return (data ?? []).map((card) => ({
    id: card.id,
    question: card.question,
    answer: card.answer,
    private: card.private,
    user_id: card.user_id,
    category: Array.isArray(card.category)
      ? card.category.length > 0
        ? (card.category[0] as { id: string; name: string })
        : null
      : (card.category as { id: string; name: string } | null),
  }))
}
