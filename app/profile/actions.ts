'use server'

import { createClientAction } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
	const fullName = String(formData.get('full_name') ?? '').trim()
	const avatarUrl = String(formData.get('avatar_url') ?? '').trim()
	const phone = String(formData.get('phone') ?? '').trim()

	const supabase = createClientAction()
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) return

	// 先更新 user_metadata（用户名、头像）
	await supabase.auth.updateUser({
		data: {
			full_name: fullName || null,
			avatar_url: avatarUrl || null,
		},
	})

	// 尝试更新手机号（若项目启用手机登录，可能需要验证）
	if (phone && phone !== user.phone) {
		try {
			await supabase.auth.updateUser({ phone })
		} catch {
            console.log('手机号未验证')
			// 忽略失败（可能需要额外验证流程）
		}
	}

	revalidatePath('/profile')
} 