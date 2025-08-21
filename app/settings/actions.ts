'use server'

import { revalidatePath } from 'next/cache'
import { createClientAction } from '@/app/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function saveFontPreference(formData: FormData) {
	const value = String(formData.get('font') ?? 'font-geist')
	const supabase = createClientAction()
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) return

	await supabase.auth.updateUser({
		data: { preferred_font: value },
	})

	// 同步写入 Cookie，便于布局立即应用,cookie只读
	const cookieStore = await cookies()

	cookieStore.set('preferred_font', value, { path: '/', maxAge: 60 * 60 * 24  }) // 1 天

	// const res = NextResponse.redirect('/')
	// res.cookies.set({
	// 	name: 'preferred_font',
	// 	value,
	// 	path: '/',
	// 	maxAge: 60 * 60 * 24,
	// })

	revalidatePath('/')
} 