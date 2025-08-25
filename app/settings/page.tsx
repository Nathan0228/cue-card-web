import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsFont from '@/app/options/settings-font'
import SettingsTagStyle from '@/app/options/settings-tag-style'

export default async function SettingsPage() {
	const supabase = createClient()
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) redirect('/login')

	const meta = (user.user_metadata ?? {}) as Record<string, unknown>
	const preferred = typeof meta.preferred_font === 'string' ? meta.preferred_font : 'font-geist'
	const preferredTagStyle = typeof meta.preferred_tag_style === 'string' ? meta.preferred_tag_style : 'default'

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">设置</h1>
				<p className="text-sm text-gray-500">个性化你的使用体验</p>
			</div>
			
			<section className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
				<h2 className="mb-3 text-lg font-semibold">外观</h2>
				<div className="space-y-6">
					<SettingsFont current={preferred} />
					<SettingsTagStyle current={preferredTagStyle} />
					<p className="text-sm text-gray-500">保存后会应用于整个网站。</p>
				</div>
			</section>
		</div>
	)
} 