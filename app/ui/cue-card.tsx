'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Tag, User } from 'lucide-react'

interface Category {
    id: string
    name: string
}

interface User {
    id: string
    email: string
    full_name?: string
}

interface CueCardProps {
    id: string
    question: string
    answer: string
    category?: Category
    private: boolean
    user: User
    isOwnCard: boolean

    onDelete?: (id: string) => void
    onEdit?: (id: string) => void
}

export default function CueCard({
    id,
    question,
    answer,
    category,
    private: isPrivate,
    user,
    isOwnCard,
    onDelete,
    onEdit,
}: CueCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    return (
        <div className="group perspective-1000">
            <div
                className={`relative h-72 w-full cursor-pointer transition-all duration-500 transform-style-preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={handleFlip}
            >
                {/* 正面 */}

                <div className="absolute inset-0 backface-hidden">
                    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                {isPrivate ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span>{isPrivate ? '私密' : '公开'}</span>
                            </div>
                            {category && (
                                <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    <Tag className="h-3 w-3" />
                                    
                                    {category.name}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-4">
                                {question}
                            </h3>
                        </div>

                        {/* 用户信息 */}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                            {isOwnCard ? (
                                <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    我
                                </span>
                            ) : (
                                <Link
                                    href={`/user/${user.id}`}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <User className="h-3 w-3" />
                                    {user.full_name || user.email}
                                </Link>
                            )}
                            <span>点击查看答案</span>
                        </div>
                    </div>
                </div>

                {/* 背面 */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                {isPrivate ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span>{isPrivate ? '私密' : '公开'}</span>
                            </div>
                            {category && (
                                <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    <Tag className="h-3 w-3" />
                                    {category.name}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex items-center justify-center text-center">
                            <p className="text-base  text-gray-700 line-clamp-6">{answer}</p>
                        </div>

                        {/* 用户信息 */}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                            {isOwnCard ? (
                                <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    我
                                </span>
                            ) : (
                                <Link
                                    href={`/user/${user.id}`}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <User className="h-3 w-3" />
                                    {user.full_name || user.email}
                                </Link>
                            )}
                            <span>点击返回问题</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
