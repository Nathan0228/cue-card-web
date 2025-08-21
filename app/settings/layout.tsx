import type { ReactNode } from 'react'
import SettingsNav from '@/app/settings/nav'

export default function SettingsLayout({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
			{/* 移动端：导航在上方 */}
			<div className="block md:hidden mb-6">
				<div className="rounded-lg border border-gray-200 bg-white p-2">
					<SettingsNav />
				</div>
			</div>
			
			{/* 桌面端：左右布局 */}
			<div className="hidden md:flex gap-6">
				<aside className="w-60 shrink-0">
					<div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-2 md:p-3">
						<SettingsNav />
					</div>
				</aside>
				<main className="min-w-0 flex-1">
					{children}
				</main>
			</div>
			
			{/* 移动端：内容区域 */}
			<div className="block md:hidden">
				{children}
			</div>
		</div>
	)
} 