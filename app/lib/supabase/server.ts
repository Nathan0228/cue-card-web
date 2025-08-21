import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getCookie(name: string): string | undefined {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (cookies() as any)?.get?.(name)?.value as string | undefined
}

function setCookie(name: string, value: string, options: CookieOptions): void {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(cookies() as any)?.set?.(name, value, options)
	} catch {
		// 在 RSC 环境下不可写，忽略
	}
}

export function createClientReadOnly() {
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get: getCookie,
				set: () => {},
				remove: (_name: string, _options: CookieOptions) => {},
			},
		}
	)
}

// 向后兼容：页面/服务端组件使用只读版本
export const createClient = createClientReadOnly

export function createClientAction() {
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get: getCookie,
				set: setCookie,
				remove: (name: string, options: CookieOptions) => setCookie(name, '', { ...options, maxAge: 0 }),
			},
		}
	)
}