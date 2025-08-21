import { createClient } from '@/app/lib/supabase/server'
import { notFound } from 'next/navigation'
import CueCard from '@/app/ui/cue-card'

interface UserPageProps {
	params: { id: string }
}

export default async function UserPage({ params }: UserPageProps) {
	const supabase = createClient()
	
	// 获取用户信息
	const { data: user, error: userError } = await supabase.auth.admin.getUserById(params.id)
	
	if (userError || !user) {
		notFound()
	}

	// 获取该用户的公开卡片
	const { data: userCards, error: cardsError } = await supabase
		.from('cue_cards')
		.select(`
			id,
			question,
			answer,
			category,
			private,
			user_id,
			users!cue_cards_user_id_fkey (
				id,
				email,
				user_metadata
			)
		`)
		.eq('user_id', params.id)
		.eq('private', false)
		.order('created_at', { ascending: false })

	if (cardsError) {
		return (
			<div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
				<div className="text-center text-red-600">
					获取卡片失败: {cardsError.message}
				</div>
			</div>
		)
	}

	const fullName = user.user_metadata?.full_name
	const displayName = fullName || user.email || '用户'

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">{displayName} 的卡片</h1>
				<p className="text-sm text-gray-500">查看该用户分享的公开卡片</p>
			</div>
			
			{userCards && userCards.length > 0 ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{userCards.map((card) => {
						const userData = card.users as Record<string, any>
						
						return (
							<CueCard
								key={card.id}
								id={card.id}
								question={card.question}
								answer={card.answer}
								category={card.category}
								private={card.private}
								user={{
									id: userData?.id || '',
									email: userData?.email || '',
									full_name: userData?.user_metadata?.full_name,
								}}
								isOwnCard={false}
							/>
						)
					})}
				</div>
			) : (
				<div className="text-center py-12">
					<div className="text-gray-400 text-lg mb-2">该用户暂无公开卡片</div>
					<div className="text-gray-500 text-sm">或者所有卡片都是私密的</div>
				</div>
			)}
		</div>
	)
} 