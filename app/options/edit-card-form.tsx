'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/app/ui/button'
import { useTransition } from 'react'

interface Category {
  id: string
  name: string
}

interface EditCardFormProps {
  cardId: string
  initialQuestion: string
  initialAnswer: string
  initialCategoryId: string
  initialVisibility: 'public' | 'private'
  categories: Category[]
  updateAction: (formData: FormData) => Promise<void>
}

export function EditCardForm({
  cardId,
  initialQuestion,
  initialAnswer,
  initialCategoryId,
  initialVisibility,
  categories,
  updateAction,
}: EditCardFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <form
      action={(formData: FormData) => {
        formData.set('cardId', cardId)
        startTransition(async () => {
          try {
            await updateAction(formData)
            router.push('/cue-cards/create')
            router.refresh()
          } catch {
            // 错误由 updateAction 抛出，可在此处做 toast 等
          }
        })
      }}
      className="space-y-6 rounded-lg bg-white p-6 shadow-md sm:p-8"
    >
      <div>
        <label htmlFor="question" className="block text-sm font-medium leading-6 text-gray-900">
          问题 ❓
        </label>
        <div className="mt-2">
          <input
            id="question"
            name="question"
            type="text"
            required
            defaultValue={initialQuestion}
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="例如：Next.js 中什么是 Server Action？"
          />
        </div>
      </div>

      <div>
        <label htmlFor="answer" className="block text-sm font-medium leading-6 text-gray-900">
          答案 💡
        </label>
        <div className="mt-2">
          <textarea
            id="answer"
            name="answer"
            rows={4}
            required
            defaultValue={initialAnswer}
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="请输入答案..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium leading-6 text-gray-900">
          分类 📂
        </label>
        <div className="mt-2">
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={initialCategoryId || ''}
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">未分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="newCategoryName" className="block text-sm font-medium leading-6 text-gray-900">
          或新建分类 ➕
        </label>
        <div className="mt-2">
          <input
            id="newCategoryName"
            name="newCategoryName"
            type="text"
            placeholder="输入新分类名称（留空则使用上面所选分类）"
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium leading-6 text-gray-900">可见性 🔒</span>
        <div className="mt-2 flex items-center gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="visibility"
              value="public"
              defaultChecked={initialVisibility === 'public'}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
            />
            公开
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="visibility"
              value="private"
              defaultChecked={initialVisibility === 'private'}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
            />
            私密
          </label>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? '保存中...' : '保存修改'}
        </Button>
      </div>
    </form>
  )
}
