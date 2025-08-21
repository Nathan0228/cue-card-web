export default function SecuritySettingsPage() {
	return (
		<div className="space-y-2">
			<h1 className="text-2xl font-bold tracking-tight">安全</h1>
			<p className="text-sm text-gray-500">这里将来可以配置密码、两步验证等安全选项。</p>
			<div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6 text-sm text-gray-600">
				暂未开通。不过本网站使用Supabase的用户验证服务，安全高效。
			</div>
		</div>
	)
} 