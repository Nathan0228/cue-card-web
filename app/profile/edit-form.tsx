'use client'

import { useTransition } from 'react'
import { updateProfile } from '@/app/profile/actions'
import { Button } from '@/app/ui/button'

type EditFormProps = {
	fullName: string | null
	avatarUrl: string | null
	phone: string | null
}

export default function EditProfileForm({ fullName, avatarUrl, phone }: EditFormProps) {
	const [pending, start] = useTransition()

	return (
		
		<form action={(fd) => start(() => updateProfile(fd))} className="space-y-4">
			<div>
				<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">用户名</label>
				<input
					id="full_name"
					name="full_name"
					type="text"
					defaultValue={fullName ?? ''}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-500 focus:ring-0"
				/>
			</div>
			<div>
				<label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">头像地址</label>
				<input
					id="avatar_url"
					name="avatar_url"
					type="url"
					defaultValue={avatarUrl ?? ''}
					placeholder="https://example.com/avatar.png"
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-500 focus:ring-0"
				/>
			</div>
			<div>
				<label htmlFor="phone" className="block text-sm font-medium text-gray-700">手机号</label>
				<input
					id="phone"
					name="phone"
					type="tel"
					defaultValue={phone ?? ''}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-500 focus:ring-0"
				/>
			</div>
			<div className="pt-2">
				<Button type="submit" disabled={pending}>
					{pending ? '保存中…' : '保存信息'}
				</Button>
			</div>
		</form>
	)
} 