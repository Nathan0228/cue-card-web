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
  })

  if (error) {
    console.error('创建卡片失败:', error.message)
    throw new Error('创建卡片失败')
  }

  // 5. 刷新页面
  revalidatePath('/')
}
