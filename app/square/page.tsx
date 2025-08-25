import { createClient } from '@/app/lib/supabase/server'
import SquareWrapper from './square-wrapper'

export default async function SquarePage() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // 获取所有分类
    const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

    if (categoriesError) {
        console.error('获取分类失败:', categoriesError)
    }

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

    const cards = publicCards?.map((card) => ({
        id: card.id,
        question: card.question,
        answer: card.answer,
        private: card.private,
        category: Array.isArray(card.category)
            ? card.category.length > 0
                ? card.category[0]
                : null
            : card.category || null,
        user_id: card.user_id,
    })) || []

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">广场</h1>
                <p className="text-sm text-gray-500">
                    <span className='text-green-500 text-sm'>开发中···</span>发现其他用户分享的精彩卡片</p>
            </div>

            <SquareWrapper 
                categories={categories || []} 
                cards={cards} 
                currentUser={currentUser} 
            />
        </div>
    )
}
