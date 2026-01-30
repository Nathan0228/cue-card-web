import { createClient } from '@/app/lib/supabase/server'
import { updateCard } from '@/app/cue-cards/actions'
import { EditCardForm } from '@/app/options/edit-card-form'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCardPage({ params }: PageProps) {
  const { id: cardId } = await params
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
        <p className="text-center text-red-500">请先登录</p>
      </div>
    )
  }

  const { data: card, error: cardError } = await supabase
    .from('cue_cards')
    .select('id, question, answer, private, category_id, user_id')
    .eq('id', cardId)
    .single()

  if (cardError || !card) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
        <p className="text-center text-red-500">卡片不存在或无法访问</p>
        <p className="text-center mt-2">
          <Link href="/cue-cards" className="text-indigo-600 hover:underline">返回我的卡片</Link>
        </p>
      </div>
    )
  }

  if (card.user_id !== user.id) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
        <p className="text-center text-red-500">只能修改自己的卡片</p>
        <p className="text-center mt-2">
          <Link href="/cue-cards" className="text-indigo-600 hover:underline">返回我的卡片</Link>
        </p>
      </div>
    )
  }

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .eq('user_id', user.id)

  if (catError) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
        <p className="text-center text-red-500">加载分类失败</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/cue-cards" className="hover:text-indigo-600 hover:underline">我的卡片</Link>
        <span>/</span>
        <span>编辑</span>
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight">编辑卡片</h1>
      <EditCardForm
        cardId={card.id}
        initialQuestion={card.question}
        initialAnswer={card.answer}
        initialCategoryId={card.category_id ?? ''}
        initialVisibility={card.private ? 'private' : 'public'}
        categories={categories ?? []}
        updateAction={updateCard}
      />
    </div>
  )
}
