'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { Search } from 'lucide-react'

export function HeaderSearch() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (expanded) inputRef.current?.focus()
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setExpanded(false)
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [expanded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
    else router.push('/search')
    setExpanded(false)
    setValue('')
  }

  return (
    <div ref={containerRef} className="flex justify-center min-w-0 flex-1">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:ring-gray-400 transition-colors"
          aria-label="展开搜索"
        >
          <Search className="h-4 w-4" />
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xs items-center gap-1 rounded-md border-0 py-1.5 pl-3 pr-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:text-sm"
        >
          <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="搜索问题或答案"
            className="block w-full min-w-0 border-0 bg-transparent p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:leading-6"
            aria-label="搜索卡片"
          />
          <button
            type="submit"
            className="shrink-0 rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="搜索"
          >
            搜索
          </button>
        </form>
      )}
    </div>
  )
}
