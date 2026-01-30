import { createClient } from '@/app/lib/supabase/server'
import { deleteCard } from '@/app/cue-cards/actions'
import CueCardGridClient from '@/app/cue-cards/grid-client'

export default async function CueCardList() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
        return <p className="text-center text-gray-500 py-8">请登录查看您的卡片</p>
    }

    // 1. 简化查询：移除了对 users 表的关联，因为它是不必要的
    const { data: cueCards, error } = await supabase
        .from('cue_cards')
        .select(`
            id,
            question,
            answer,
            private,
            created_at,
            category:categories(id, name)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return <p className="text-center text-red-600 py-8">获取卡片失败: {error.message}</p>
    }

    if (!cueCards || cueCards.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">暂无卡片</div>
                <div className="text-gray-500 text-sm">创建您的第一张卡片吧！</div>
            </div>
        )
    }

    // 2. 从 session 中直接获取用户信息
    // full_name 存储在 session.user.user_metadata 中
    const currentUser = {
        id: session.user.id,
        email: session.user.email || '',
        full_name: '我' // 当前登录用户名字显示“我”
    };

    const cards = cueCards.map((card) => {
        const category = Array.isArray(card.category)
            ? card.category.length > 0
                ? card.category[0]
                : null
            : card.category || null
        return {
            id: card.id,
            question: card.question,
            answer: card.answer,
            private: card.private,
            category,
        }
    })

    return <CueCardGridClient cards={cards} currentUser={currentUser} deleteAction={deleteCard} />
}