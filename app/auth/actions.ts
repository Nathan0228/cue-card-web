'use server'

import { createClientAction } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function signOut() {
  const supabase = createClientAction()
  
  // 清除 Supabase 会话
  await supabase.auth.signOut()
  
  // 清除字体偏好 Cookie
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(cookies() as any)?.set?.('preferred_font', '', { path: '/', maxAge: 0 })
  
  // 重新验证所有页面
  revalidatePath('/', 'layout')
} 