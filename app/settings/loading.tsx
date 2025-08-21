export default function SettingsLoading() {
	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
			{/* 移动端：导航在上方 */}
			<div className="block md:hidden mb-6">
				<div className="rounded-lg border border-gray-200 bg-white p-2">
					<div className="space-y-2">
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-100"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-100"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-100"></div>
					</div>
				</div>
			</div>
			
			{/* 桌面端：左右布局 */}
			<div className="hidden md:flex gap-6">
				<aside className="w-60 shrink-0">
					<div className="sticky top-4 space-y-2">
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-100"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-100"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-100"></div>
					</div>
				</aside>
				<main className="min-w-0 flex-1">
					<div className="h-8 w-40 animate-pulse rounded-md bg-gray-200"></div>
					<div className="mt-4 space-y-3">
						<div className="h-24 w-full animate-pulse rounded-lg bg-gray-100"></div>
						<div className="h-24 w-full animate-pulse rounded-lg bg-gray-100"></div>
					</div>
				</main>
			</div>
			
			{/* 移动端：内容区域 */}
			<div className="block md:hidden">
				<div className="h-8 w-40 animate-pulse rounded-md bg-gray-200"></div>
				<div className="mt-4 space-y-3">
					<div className="h-24 w-full animate-pulse rounded-lg bg-gray-100"></div>
					<div className="h-24 w-full animate-pulse rounded-lg bg-gray-100"></div>
				</div>
			</div>
		</div>
	)
} 