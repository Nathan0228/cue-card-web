import { CreateCardForm } from '@/app/options/createcardform'
import { createCard } from '@/app/cue-cards/actions'
import { createClient } from '@/app/lib/supabase/server'

// 🚨 注意：这是一个 Server Component
export default async function CreateCardPage() {
  const supabase = createClient()

  // 获取当前用户
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <p className="text-center text-red-500">请先登录</p>
  }

  // 查询用户的分类
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name')
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    return <p className="text-center text-red-500">加载分类失败</p>
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Create a new Cue Card</h1>
      <CreateCardForm createAction={createCard} categories={categories ?? []} />
    </div>
  )
}
