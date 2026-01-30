import { createClient } from '@/app/lib/supabase/server'
import { searchCards, deleteCard } from '@/app/cue-cards/actions'
import SquareGridClient from '@/app/square/grid-client-square'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = (q ?? '').trim()

  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const currentUser = session
    ? {
        id: session.user.id,
        email: session.user.email ?? '',
        full_name: session.user.user_metadata?.full_name ?? '匿名用户',
      }
    : null

  const cards = query ? await searchCards(query) : []

  const authorIds = [...new Set(cards.map((c) => c.user_id))]
  const authorNames: Record<string, string> = {}
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', authorIds)
    for (const p of profiles ?? []) {
      authorNames[p.id] = p.full_name?.trim() || '匿名用户'
    }
  } catch {
    // profiles 表可能不存在
  }
  for (const id of authorIds) {
    if (!(id in authorNames)) authorNames[id] = '匿名用户'
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">搜索卡片</h1>
      <p className="mt-1 text-sm text-gray-500">
        {query
          ? `关键词「${query}」共找到 ${cards.length} 张卡片（含您的私有卡片与所有公开卡片）`
          : '在顶部搜索框输入问题或答案中的关键词进行搜索'}
      </p>

      {query && cards.length === 0 && (
        <div className="mt-12 text-center text-gray-500">未找到匹配的卡片</div>
      )}

      {query && cards.length > 0 && (
        <div className="mt-6">
          <SquareGridClient
            cards={cards}
            currentUser={currentUser}
            authorNames={authorNames}
            deleteAction={currentUser ? deleteCard : undefined}
          />
        </div>
      )}
    </div>
  )
}
