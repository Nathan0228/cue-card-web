import { createClient } from '@/app/lib/supabase/server'
import UserMenu from '@/app/ui/user-menu'
import Link from 'next/link'
import { Button } from '@/app/ui/button'

export default async function Header() {
	const supabase = createClient()
	const { data: { user } } = await supabase.auth.getUser()

	let avatarUrl: string | null | undefined = null
	let email: string | null | undefined = null
	let fullName: string | null | undefined = null

	if (user) {
		email = user.email
		const meta = (user.user_metadata ?? {}) as Record<string, unknown>
		fullName = typeof meta.full_name === 'string' ? meta.full_name : null
		avatarUrl = typeof meta.avatar_url === 'string' ? meta.avatar_url : null
	}

	return (
		
		<header className="border-b border-gray-200 bg-white">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
				<Link href="/" className="text-3xl font-bold text-gray-900">
					Cue Card
				</Link>
				
				{user && (
					<div className="flex items-center gap-12 ">
						<Button asChild variant="outline" size="sm">
							<Link className='block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150' href="/cue-cards/create">创建卡片</Link>
						</Button>
						<Button asChild variant="outline" size="sm">
							<Link className='block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150' href="/square">广场</Link>
						</Button>
					</div>
				)}
				
				<div>
					{user ? (
						<UserMenu avatarUrl={avatarUrl ?? null} email={email ?? null} fullName={fullName ?? null} />
					) : (
						<Button asChild variant="outline" size="sm">
							<Link href="/login">登录</Link>
						</Button>
					)}
				</div>
			</div>
		</header>
	)
} 