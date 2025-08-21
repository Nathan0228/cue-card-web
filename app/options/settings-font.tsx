"use client"

import { useTransition, useState, useMemo } from "react"
import { saveFontPreference } from "@/app/settings/actions"

const options = [
	{ value: "font-geist", label: "Geist" },
	{ value: "font-inter", label: "Inter" },
	{ value: "font-roboto", label: "Roboto" },
	{ value: "font-open-sans", label: "Open Sans" },
	{ value: "font-noto-sans", label: "Noto Sans" },
	{ value: "font-lora", label: "Lora" },
	{ value: "font-merriweather", label: "Merriweather" },
]

type SettingsFontProps = { current?: string }

export default function SettingsFont({ current }: SettingsFontProps) {
	const [pending, start] = useTransition()
	const [value, setValue] = useState(current ?? "font-geist")

	const previewClass = useMemo(() => value, [value])

	return (
		
		<div className="space-y-3">
			<form
				action={(formData) => start(() => saveFontPreference(formData))}
				className="flex flex-wrap items-center gap-3"
			>
				<label htmlFor="font" className="text-sm font-medium text-gray-700">
					界面字体
				</label>
				<select
					id="font"
					name="font"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="min-w-48 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm shadow-sm outline-none transition-colors focus:border-gray-500 focus:ring-0"
				>
					{options.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
				<button
					type="submit"
					disabled={pending}
					className="inline-flex h-9 items-center rounded-md bg-black px-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{pending ? "保存中…" : "保存"}
				</button>
			</form>
			<div className={`font-sample rounded-md border border-dashed border-gray-300 p-4 ${previewClass}`}>
				<p className="text-sm text-gray-500">效果预览：</p>
				<p className="mt-1 text-lg">Cue Card Web is the Best! 2025</p>
				<p className="text-base">这个网站最好啦，2025!</p>
			</div>
		</div>
	)
} 