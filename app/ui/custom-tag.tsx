'use client'

import { useEffect, useState } from 'react'
import { Tag as TagIcon } from 'lucide-react'

interface CustomTagProps {
  children: React.ReactNode
  className?: string
  showIcon?: boolean
}

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

export default function CustomTag({ children, className = '', showIcon = true }: CustomTagProps) {
  const [tagStyle, setTagStyle] = useState<TagStyle>(defaultTagStyle)

  useEffect(() => {
    // Function to get tag style from cookie
    const getCookieValue = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }

    // Function to update tag style
    const updateTagStyle = () => {
      const styleCookie = getCookieValue('preferred_tag_style')
      console.log('CustomTag: Found cookie:', styleCookie) // Debug log
      
      if (styleCookie && styleCookie !== 'default') {
        try {
          // Decode URL-encoded cookie value first
          const decodedCookie = decodeURIComponent(styleCookie)
          console.log('CustomTag: Decoded cookie:', decodedCookie) // Debug log
          
          const parsed = JSON.parse(decodedCookie)
          console.log('CustomTag: Parsed style:', parsed) // Debug log
          setTagStyle(parsed)
        } catch (error) {
          console.error('CustomTag: Failed to parse style:', error) // Debug log
          console.log('CustomTag: Raw cookie value was:', styleCookie) // Debug log
          // Keep default if parsing fails
        }
      } else {
        console.log('CustomTag: Using default style') // Debug log
      }
    }

    // Initial load
    updateTagStyle()

    // Listen for storage events (when cookie changes)
    const handleStorageChange = () => {
      updateTagStyle()
    }

    // Listen for custom event when tag style is saved
    const handleTagStyleChange = (e: CustomEvent) => {
      console.log('CustomTag: Received style change event:', e.detail)
      if (e.detail && e.detail.tagStyle) {
        try {
          // Event data should already be decoded, but let's be safe
          const parsed = JSON.parse(e.detail.tagStyle)
          console.log('CustomTag: Event style applied:', parsed)
          setTagStyle(parsed)
        } catch (error) {
          console.error('CustomTag: Failed to parse event style:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('tag-style-changed', handleTagStyleChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('tag-style-changed', handleTagStyleChange as EventListener)
    }
  }, [])

  const style = {
    backgroundColor: tagStyle.backgroundColor,
    color: tagStyle.textColor,
    border: `1px solid ${tagStyle.borderColor}`,
    borderRadius: tagStyle.borderRadius,
    padding: tagStyle.padding,
  }

  // Only override for "未分类" tags, not for user custom styles
  const finalStyle = className.includes('bg-gray-100') && !className.includes('custom-style') ? {
    backgroundColor: '#f3f4f6', // bg-gray-100
    color: '#4b5563', // text-gray-600
    border: '1px solid #e5e7eb', // border-gray-200
    borderRadius: '9999px',
    padding: '0.25rem 0.5rem'
  } : style

  return (
    
    <span 
      style={finalStyle} 
      className={`inline-flex items-center gap-1 text-xs ${className}`}
    >
      {showIcon && <TagIcon className="h-3 w-3" />}
      {children}
    </span>
  )
}
