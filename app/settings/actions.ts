'use server'

import { revalidatePath } from 'next/cache'
import { createClientAction } from '@/app/lib/supabase/server'
import { cookies } from 'next/headers'

export async function saveFontPreference(formData: FormData) {
	const value = String(formData.get('font') ?? 'font-geist')
	const supabase = createClientAction()
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) return

	await supabase.auth.updateUser({
		data: { preferred_font: value },
	})

	// 同步写入 Cookie，便于布局立即应用
	cookies().set('preferred_font', value, { path: '/', maxAge: 60 * 60 * 24 })

	revalidatePath('/')
} 