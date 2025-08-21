'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SettingsNav() {
	const pathname = usePathname()
	const items = [
		{ href: '/settings', label: '字体' },
		{ href: '/settings/notifications', label: '通知（占位）' },
		{ href: '/settings/security', label: '安全（占位）' },
	]

	return (
		<nav className="space-y-1">
			{items.map((item) => {
				const active = pathname === item.href
				return (
					<Link
						key={item.href}
						href={item.href}
						className={[
							'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
							active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
						].join(' ')}
					>
						{item.label}
					</Link>
				)
			})}
		</nav>
	)
} 