import { createClient } from '@/app/lib/supabase/server'
import CueCard from '@/app/ui/cue-card'

export default async function SquarePage() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // 获取所有公开的卡片，连同分类信息
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
        .eq('private', false)
        .order('created_at', { ascending: false })

    if (error) {
        return (
            <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
                <div className="text-center text-red-600">
                    获取卡片失败: {error.message}
                </div>
            </div>
        )
    }

    if (!publicCards || publicCards.length === 0) {
        return (
            <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
                <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">暂无公开卡片</div>
                    <div className="text-gray-500 text-sm">成为第一个分享卡片的人吧！</div>
                </div>
            </div>
        )
    }

    // 当前登录用户的信息（可能为空）
    const currentUser = session
        ? {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '匿名用户',
        }
        : null

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">广场</h1>
                <p className="text-sm text-gray-500"><span className="font-bold text-red-600">待实现</span>发现其他用户分享的精彩卡片</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {publicCards.map((card) => {
                    // 判断是不是当前用户的卡片
                    const isOwnCard = currentUser ? card.user_id === currentUser.id : false
                    const category =
                        Array.isArray(card.category)
                        ?card.category.length > 0
                        ?card.category[0]
                             : null
                            :card.category || null


                    return (
                        <CueCard
                            key={card.id}
                            id={card.id}
                            question={card.question}
                            answer={card.answer}
                            category={category}
                            private={card.private}
                            user={{
                                id: card.user_id,
                                // 没有 join users 表，所以这里只能展示 ID
                                // 如果以后要显示用户昵称，可以再查 auth.users 或自己建一张 profiles 表
                                email: '',
                                full_name: isOwnCard
                                    ? currentUser?.full_name || '我'
                                    : '其他用户',
                            }}
                            isOwnCard={isOwnCard}
                        />
                    )
                })}
            </div>
        </div>
    )
}
