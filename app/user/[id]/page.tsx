import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/server'
import SquareGridClient from '@/app/square/grid-client-square'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserPublicCardsPage({ params }: PageProps) {
  const { id: userId } = await params
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()

  const displayName = profile?.full_name?.trim() || '匿名用户'

  const { data: publicCards, error } = await supabase
    .from('cue_cards')
    .select(`
      id,
      question,
      answer,
      private,
      created_at,
      category:categories(id, name),
      user_id
    `)
    .eq('user_id', userId)
    .eq('private', false)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
        <p className="text-center text-red-600">加载失败</p>
        <p className="text-center mt-2">
          <Link href="/square" className="text-indigo-600 hover:underline">返回广场</Link>
        </p>
      </div>
    )
  }

  const cards = (publicCards ?? []).map((card) => ({
    id: card.id,
    question: card.question,
    answer: card.answer,
    private: card.private,
    category: Array.isArray(card.category)
      ? card.category.length > 0
        ? card.category[0]
        : null
      : card.category ?? null,
    user_id: card.user_id,
  }))

  const currentUser = session
    ? {
        id: session.user.id,
        email: session.user.email ?? '',
        full_name: session.user.user_metadata?.full_name ?? '匿名用户',
      }
    : null

  const authorNames: Record<string, string> = { [userId]: displayName }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/square" className="hover:text-indigo-600 hover:underline">广场</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{displayName}</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        {displayName} 的公开卡片
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        共 {cards.length} 张公开卡片
      </p>

      {cards.length === 0 ? (
        <div className="mt-12 text-center text-gray-500">
          该用户暂无公开卡片
        </div>
      ) : (
        <div className="mt-6">
          <SquareGridClient
            cards={cards}
            currentUser={currentUser}
            authorNames={authorNames}
          />
        </div>
      )}
    </div>
  )
}
