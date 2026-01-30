'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Eye, EyeOff, User, Maximize2, Minimize2, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import CustomTag from './custom-tag'
import { ConfirmDialog } from './confirm-dialog'

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
    category?: Category | null
    private: boolean
    user: User
    isOwnCard: boolean

    onDelete?: (id: string) => void
    onEdit?: (id: string) => void
    onPrev?: () => void
    onNext?: () => void
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
    onPrev,
    onNext,
}: CueCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isEnlarged, setIsEnlarged] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

    const openDeleteConfirm = (cardId: string) => {
        setPendingDeleteId(cardId)
        setShowDeleteConfirm(true)
    }
    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false)
        setPendingDeleteId(null)
    }
    const handleConfirmDelete = () => {
        if (pendingDeleteId) onDelete?.(pendingDeleteId)
        closeDeleteConfirm()
    }
    const touchStartRef = useRef<{ x: number; y: number } | null>(null)
    const lastDeltaRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const isSwipeRef = useRef(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isEnlarged) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsEnlarged(false)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isEnlarged])

    // 跨卡片打开/切换：监听全局事件
    useEffect(() => {
        function onOpen(e: Event) {
            const detail = (e as CustomEvent).detail as { id?: string } | undefined
            const targetId = detail?.id
            setIsFlipped(false)
            setIsEnlarged(targetId === id)
        }
        window.addEventListener('cuecard-open', onOpen as EventListener)
        return () => window.removeEventListener('cuecard-open', onOpen as EventListener)
    }, [id])

    const handleFlip = () => {
        if (isSwipeRef.current) return
        setIsFlipped(!isFlipped)
    }

    return (
        <div className="group perspective-1000">
            {/* 放大视图遮罩 */}
            {isMounted && isEnlarged && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-md"
                    onClick={() => setIsEnlarged(false)}
                >
                    <div
                        className="relative w-[70vw] h-[70vh] max-w-[70vw] max-h-[70vh]"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={(e) => {
                            const t = e.touches[0]
                            touchStartRef.current = { x: t.clientX, y: t.clientY }
                            lastDeltaRef.current = { x: 0, y: 0 }
                            isSwipeRef.current = false
                        }}
                        onTouchMove={(e) => {
                            if (!touchStartRef.current) return
                            const t = e.touches[0]
                            const dx = t.clientX - touchStartRef.current.x
                            const dy = t.clientY - touchStartRef.current.y
                            lastDeltaRef.current = { x: dx, y: dy }
                            if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
                                isSwipeRef.current = true
                                // 防止页面在移动端滚动
                                e.preventDefault()
                            }
                        }}
                        onTouchEnd={() => {
                            const start = touchStartRef.current
                            if (!start) return
                            const { x: dx, y: dy } = lastDeltaRef.current
                            const SWIPE_THRESHOLD = 40
                            const isVertical = Math.abs(dy) > Math.abs(dx)
                            if (isVertical && Math.abs(dy) > SWIPE_THRESHOLD) {
                                if (dy > 0) {
                                    // 向下滑：下一张
                                    onNext?.()
                                } else {
                                    // 向上滑：上一张
                                    onPrev?.()
                                }
                            }
                            touchStartRef.current = null
                            lastDeltaRef.current = { x: 0, y: 0 }
                            // 轻微延迟，避免触发点击翻转
                            setTimeout(() => { isSwipeRef.current = false }, 100)
                        }}
                    >
                        {/* 左右切换按钮 */}
                        <button
                            type="button"
                            aria-label="上一张"
                            onClick={(e) => { e.stopPropagation(); onPrev?.() }}
                            disabled={!onPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white shadow disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <button
                            type="button"
                            aria-label="下一张"
                            onClick={(e) => { e.stopPropagation(); onNext?.() }}
                            disabled={!onNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white shadow disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-700" />
                        </button>
                        {/* 放大容器内重用卡片内容 */}
                        <div
                            className={`relative h-full w-full cursor-pointer transition-all duration-500 transform-style-preserve-3d ${
                                isFlipped ? 'rotate-y-180' : ''
                            }`}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* 正面 */}
                            <div className="absolute inset-0 backface-hidden">
                                <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            {isPrivate ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                            <span>{isPrivate ? '私密' : '公开'}</span>
                                        </div>
                                        {category ? (
                                            <CustomTag>
                                                {category.name}
                                            </CustomTag>
                                        ) : (
                                            <CustomTag className="bg-gray-100 text-gray-600">
                                                未分类
                                            </CustomTag>
                                        )}
                                    </div>
                                    <div className="flex-1 flex items-center justify-center text-center">
                                        <h3 className="text-2xl font-semibold text-gray-900 whitespace-pre-wrap">
                                            {question}
                                        </h3>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                                        {isOwnCard ? (
                                            <Link
                                                href={`/user/${user.id}`}
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <User className="h-4 w-4" />
                                                {user.full_name || '我'}
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/user/${user.id}`}
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <User className="h-4 w-4" />
                                                {user.full_name || user.email}
                                            </Link>
                                        )}
                                        <div className="flex items-center gap-3">
                                            {isOwnCard && (
                                                <>
                                                    <Link
                                                        href={`/cue-cards/edit/${id}`}
                                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Pencil className="h-4 w-4" /> 编辑
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                                                        onClick={(e) => { e.stopPropagation(); openDeleteConfirm(id) }}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> 删除
                                                    </button>
                                                </>
                                            )}
                                            <span>点击查看答案</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 背面 */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180">
                                <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-gray-50 p-8 shadow-lg">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            {isPrivate ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                            <span>{isPrivate ? '私密' : '公开'}</span>
                                        </div>
                                        {category ? (
                                            <CustomTag>
                                                {category.name}
                                            </CustomTag>
                                        ) : (
                                            <CustomTag className="bg-gray-100 text-gray-600">
                                                未分类
                                            </CustomTag>
                                        )}
                                    </div>
                                    <div className="flex-1 flex items-center justify-center text-center">
                                        <p className="text-lg text-gray-700 whitespace-pre-wrap">{answer}</p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                                        {isOwnCard ? (
                                            <Link
                                                href={`/user/${user.id}`}
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <User className="h-4 w-4" />
                                                {user.full_name || '我'}
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/user/${user.id}`}
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <User className="h-4 w-4" />
                                                {user.full_name || user.email}
                                            </Link>
                                        )}
                                        <div className="flex items-center gap-3">
                                            {isOwnCard && (
                                                <>
                                                    <Link
                                                        href={`/cue-cards/edit/${id}`}
                                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Pencil className="h-4 w-4" /> 编辑
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                                                        onClick={(e) => { e.stopPropagation(); openDeleteConfirm(id) }}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> 删除
                                                    </button>
                                                </>
                                            )}
                                            <span>点击返回问题</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 关闭/缩小按钮 */}
                        <button
                            type="button"
                            onClick={() => setIsEnlarged(false)}
                            className="absolute top-3 right-3 z-20 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
                            aria-label="缩小"
                        >
                            <Minimize2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>, document.body)
            }
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
                            {category ? (
                                <CustomTag>
                                    {category.name}
                                </CustomTag>
                            ):(
                                <CustomTag className="bg-gray-100 text-gray-600">
                                    未分类
                                </CustomTag>    
                            )}
                        </div>
                        <div className="flex-1 flex items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-4">
                                {question}
                            </h3>
                        </div>

                        {/* 用户信息与操作 */}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                            {isOwnCard ? (
                                <Link
                                    href={`/user/${user.id}`}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <User className="h-3 w-3" />
                                    {user.full_name || '我'}
                                </Link>
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
                            <div className="flex items-center gap-3">
                                {isOwnCard && (
                                    <>
                                        <Link
                                            href={`/cue-cards/edit/${id}`}
                                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                                            onClick={(e) => e.stopPropagation()}
                                            title="编辑"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            编辑
                                        </Link>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                                            onClick={(e) => { e.stopPropagation(); openDeleteConfirm(id) }}
                                            title="删除"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            删除
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 text-black-600 hover:text-black-700"
                                    onClick={(e) => { e.stopPropagation(); setIsEnlarged((v) => !v) }}
                                >
                                    {isEnlarged ? (
                                        <Minimize2 className="h-4 w-4" />
                                    ) : (
                                        <Maximize2 className="h-4 w-4" />
                                    )}
                                </button>
                                <span>点击查看答案</span>
                            </div>
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
                            {category ? (
                                <CustomTag>
                                    {category.name}
                                </CustomTag>
                            ):(
                                <CustomTag className="bg-gray-100 text-gray-600">
                                    未分类
                                </CustomTag>    
                            )}
                        </div>

                        <div className="flex-1 flex items-center justify-center text-center">
                            <p className="text-base  text-gray-700 line-clamp-6">{answer}</p>
                        </div>

                        {/* 用户信息与操作 */}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                            {isOwnCard ? (
                                <Link
                                    href={`/user/${user.id}`}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <User className="h-3 w-3" />
                                    {user.full_name || '我'}
                                </Link>
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
                            <div className="flex items-center gap-3">
                                {isOwnCard && (
                                    <>
                                        <Link
                                            href={`/cue-cards/edit/${id}`}
                                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                                            onClick={(e) => e.stopPropagation()}
                                            title="编辑"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            编辑
                                        </Link>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                                            onClick={(e) => { e.stopPropagation(); openDeleteConfirm(id) }}
                                            title="删除"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            删除
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 text-black-600 hover:text-black-700"
                                    onClick={(e) => { e.stopPropagation(); setIsEnlarged((v) => !v) }}
                                >
                                    {isEnlarged ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </button>
                                <span>点击返回问题</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                title="删除卡片"
                message="确定要删除这张卡片吗？删除后无法恢复。"
                confirmLabel="删除"
                cancelLabel="取消"
                variant="destructive"
                onConfirm={handleConfirmDelete}
                onCancel={closeDeleteConfirm}
            />
        </div>
    )
}
