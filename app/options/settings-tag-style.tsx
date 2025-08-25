'use client'

import { useTransition, useState, useMemo } from 'react'
import { saveTagStylePreference } from '@/app/settings/actions'
import { Tag } from 'lucide-react'

interface TagStyle {
  backgroundColor: string
  textColor: string
  borderColor: string
  borderRadius: string
  padding: string
}

const defaultTagStyle: TagStyle = {
  backgroundColor: '#eff6ff', // bg-blue-50
  textColor: '#2563eb',      // text-blue-600
  borderColor: '#dbeafe',    // border-blue-200
  borderRadius: '9999px',    // rounded-full
  padding: '0.25rem 0.5rem'  // px-2 py-1
}

const presetStyles = [
  { name: '默认蓝色', style: defaultTagStyle },
  { name: '绿色', style: { backgroundColor: '#f0fdf4', textColor: '#16a34a', borderColor: '#bbf7d0', borderRadius: '9999px', padding: '0.25rem 0.5rem' } },
  { name: '紫色', style: { backgroundColor: '#faf5ff', textColor: '#9333ea', borderColor: '#e9d5ff', borderRadius: '9999px', padding: '0.25rem 0.5rem' } },
  { name: '橙色', style: { backgroundColor: '#fff7ed', textColor: '#ea580c', borderColor: '#fed7aa', borderRadius: '9999px', padding: '0.25rem 0.5rem' } },
  { name: '红色', style: { backgroundColor: '#fef2f2', textColor: '#dc2626', borderColor: '#fecaca', borderRadius: '9999px', padding: '0.25rem 0.5rem' } },
  { name: '灰色', style: { backgroundColor: '#f9fafb', textColor: '#374151', borderColor: '#e5e7eb', borderRadius: '9999px', padding: '0.25rem 0.5rem' } },
]

type SettingsTagStyleProps = { current?: string }

export default function SettingsTagStyle({ current }: SettingsTagStyleProps) {
  const [pending, start] = useTransition()
  const [tagStyle, setTagStyle] = useState<TagStyle>(defaultTagStyle)

  // Parse current style from cookie if available
  useMemo(() => {
    if (current && current !== 'default') {
      try {
        const parsed = JSON.parse(current)
        setTagStyle(parsed)
      } catch {
        // Keep default if parsing fails
      }
    }
  }, [current])

  const previewStyle = useMemo(() => ({
    backgroundColor: tagStyle.backgroundColor,
    color: tagStyle.textColor,
    border: `1px solid ${tagStyle.borderColor}`,
    borderRadius: tagStyle.borderRadius,
    padding: tagStyle.padding,
  }), [tagStyle])

  const handleStyleChange = (property: keyof TagStyle, value: string) => {
    setTagStyle(prev => ({ ...prev, [property]: value }))
  }

  const applyPreset = (style: TagStyle) => {
    setTagStyle(style)
  }

  const resetToDefault = () => {
    setTagStyle(defaultTagStyle)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">标签样式</span>
      </div>

      {/* Preset Styles */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">预设样式</label>
        <div className="flex flex-wrap gap-2">
          {presetStyles.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset.style)}
              className="px-3 py-1 text-xs rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Style Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">背景色</label>
          <input
            type="color"
            value={tagStyle.backgroundColor}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">文字色</label>
          <input
            type="color"
            value={tagStyle.textColor}
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">边框色</label>
          <input
            type="color"
            value={tagStyle.borderColor}
            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">圆角</label>
          <select
            value={tagStyle.borderRadius}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="0">无圆角</option>
            <option value="0.25rem">小圆角</option>
            <option value="0.5rem">中圆角</option>
            <option value="9999px">圆形</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">效果预览</label>
        <div className="flex flex-wrap gap-2">
          <span style={previewStyle} className="inline-flex items-center gap-1 text-xs">
            <Tag className="h-3 w-3" />
            技术
          </span>
          <span style={previewStyle} className="inline-flex items-center gap-1 text-xs">
            <Tag className="h-3 w-3" />
            学习
          </span>
          <span style={previewStyle} className="inline-flex items-center gap-1 text-xs">
            <Tag className="h-3 w-3" />
            未分类
          </span>
        </div>
      </div>

      {/* Actions */}
      <form
        action={async (formData) => {
          const styleString = JSON.stringify(tagStyle)
          console.log('Settings: Saving tag style:', styleString)
          formData.append('tagStyle', styleString)
          
          await start(() => saveTagStylePreference(formData))
          
          // Trigger global event to update all CustomTag components immediately
          if (typeof window !== 'undefined') {
            console.log('Settings: Dispatching tag-style-changed event')
            window.dispatchEvent(new CustomEvent('tag-style-changed', {
              detail: { tagStyle: styleString }
            }))
          }
        }}
        className="flex items-center gap-3"
      >
        <button
          type="button"
          onClick={resetToDefault}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          重置默认
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 items-center rounded-md bg-black px-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "保存中…" : "保存样式"}
        </button>
      </form>
    </div>
  )
}
