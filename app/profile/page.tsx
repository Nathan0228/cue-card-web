import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import EditProfileForm from '@/app/profile/edit-form'

export default async function ProfilePage() {
	const supabase = createClient()
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) redirect('/login')

	let avatarUrl: string | null = null
	let fullName: string | null = null

	try {
		const { data } = await supabase
			.from('users')
			.select('avatar_url, full_name')
			.eq('id', user.id)
			.single()
		if (data) {
			avatarUrl = typeof data.avatar_url === 'string' ? data.avatar_url : null
			fullName = typeof data.full_name === 'string' ? data.full_name : null
		}
	} catch {}

	if (!avatarUrl || !fullName) {
		const meta = (user.user_metadata ?? {}) as Record<string, unknown>
		if (!avatarUrl && typeof meta.avatar_url === 'string') avatarUrl = meta.avatar_url
		if (!fullName && typeof meta.full_name === 'string') fullName = meta.full_name
	}

	const createdAt = user.created_at ? new Date(user.created_at).toLocaleString() : ''
	const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>
	let providers = ''
	if (Array.isArray(appMeta.providers) && appMeta.providers.every((p) => typeof p === 'string')) {
		providers = (appMeta.providers as string[]).join(', ')
	} else if (typeof appMeta.provider === 'string') {
		providers = appMeta.provider
	}
	const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>
	const phone = typeof user.phone === 'string' && user.phone.length > 0
		? user.phone
		: (typeof userMeta.phone === 'string' ? userMeta.phone : null)

	return (
		<main className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
			<h1 className="mb-6 text-2xl font-bold tracking-tight">用户信息</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<section className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
					<div className="flex items-center gap-4">
						<div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
							{avatarUrl ? (
								<Image src={avatarUrl} alt="avatar" width={80} height={80} />
							) : (
								<span className="text-2xl font-bold">{(fullName || user.email || 'U').slice(0,1).toUpperCase()}</span>
							)}
						</div>
						<div>
							<div className="text-lg font-semibold">{fullName || user.email || 'User'}</div>
							<div className="text-sm text-gray-600">{user.email}</div>
						</div>
					</div>
					<div className="mt-4 space-y-2 text-sm">
						<div><span className="text-gray-500">注册时间：</span>{createdAt}</div>
						<div><span className="text-gray-500">登录方式：</span>{providers || '—'}</div>
						<div><span className="text-gray-500">手机号：</span>{phone || '—'}</div>
					</div>
				</section>
				<section className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
					<h2 className="mb-4 text-lg font-semibold">修改资料</h2>
					<EditProfileForm fullName={fullName} avatarUrl={avatarUrl} phone={phone} />
				</section>
			</div>
		</main>
	)
} 