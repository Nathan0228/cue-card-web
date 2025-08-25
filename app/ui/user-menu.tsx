'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { signOut } from '@/app/auth/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type UserMenuProps = {
	avatarUrl?: string | null
	email?: string | null
	fullName?: string | null
}

export default function UserMenu({ avatarUrl, email, fullName }: UserMenuProps) {
	const [open, setOpen] = useState(false)
	const [isSigningOut, setIsSigningOut] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	const fallback = useMemo(() => ({
		initials: (fullName || email || 'U').slice(0, 1).toUpperCase(),
	}), [fullName, email])

	// 点击外部区域关闭菜单
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false)
			}
		}

		if (open) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [open])

	// 关闭菜单的函数
	const closeMenu = () => setOpen(false)

	// 处理退出登录
	const handleSignOut = async () => {
		setIsSigningOut(true)
		
		closeMenu()
		
		try {
			// 清理浏览器侧的登录信息与缓存
			if (typeof window !== 'undefined') {
				try {
					const keysToRemove: string[] = []
					for (let i = 0; i < localStorage.length; i++) {
						const key = localStorage.key(i)
						if (!key) continue
						// Supabase 本地存储键通常以 sb- 开头，或包含 supabase
						// 也顺带清理应用可能写入的偏好键
						if (
							key.startsWith('sb-') ||
							key.toLowerCase().includes('supabase') ||
							key === 'preferred_font' ||
							key.startsWith('cuecard:')
						) {
							keysToRemove.push(key)
						}
					}
					keysToRemove.forEach((k) => localStorage.removeItem(k))
					// 会话级缓存一并清理
					sessionStorage.clear()
				} catch (e) {
					console.warn('清理本地存储时出错:', e)
				}
			}
			
			await signOut()
			// 退出成功后跳转到登录页
			router.push('/login')
		} catch (error) {
			console.error('退出登录失败:', error)
			setIsSigningOut(false)
		}
	}

	return (
		<div ref={menuRef} style={{ position: 'relative' }}>
			<button
				aria-label="User menu"
				onClick={() => setOpen((v) => !v)}
				style={{
					width: 36,
					height: 36,
					borderRadius: '50%',
					border: '1px solid #e5e7eb',
					overflow: 'hidden',
					background: '#fff',
				}}
			>
				{avatarUrl ? (
					<Image src={avatarUrl} alt="avatar" width={36} height={36} />
				) : (
					<div style={{
						width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
						background: '#f3f4f6', color: '#111827', fontWeight: 600
					}}>{fallback.initials}</div>
				)}
			</button>
			{open && (
				<div
					role="menu"
					style={{
						position: 'absolute', right: 0, marginTop: 8,zIndex: 1,
						background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
						boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)'
					}}
				>
					<div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6' }}>
						<div style={{ fontWeight: 600 }}>{fullName || email || 'User'}</div>
						<div style={{ color: '#6b7280', fontSize: 12 }}>{email || ''}</div>
					</div>
					<Link 
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150" 
						href="/profile"
						onClick={closeMenu}
					>
						用户信息
					</Link>
					<Link 
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150" 
						href="/settings"
						onClick={closeMenu}
					>
						设置
					</Link>

					<button 
						onClick={handleSignOut}
						disabled={isSigningOut}
						className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-gray-900 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSigningOut ? '退出中...' : '退出登录'}
					</button>
				</div>
			)}
		</div>
	)
} 