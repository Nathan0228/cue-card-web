'use client';

import { Button } from '@/app/ui/button';
import { createCard } from '../cue-cards/actions';
import { useTransition } from 'react';

// 定义分类对象的类型，以便在 props 中使用
interface Category {
  id: string;
  name:string;
}

// 更新组件的 props 定义，以接收一个分类列表
interface CreateCardFormProps {
  createAction: (formData: FormData) => Promise<void>;
  categories: Category[];
}

export function CreateCardForm({ createAction, categories }: CreateCardFormProps) {
  const [isPending,startTransition] = useTransition();

  return (
    // 使用 space-y-* 来控制子元素之间的垂直间距
    <form
      action={(FormData) => {
        startTransition(async () => {
          await createAction(FormData)
        })
      }}
      className="space-y-6 rounded-lg bg-white p-6 shadow-md sm:p-8"
    >
      {/* 1. 问题输入框 */}
      <div>
        <label htmlFor="question" className="block text-sm font-medium leading-6 text-gray-900">
          Question ❓
        </label>
        <div className="mt-2">
          <input
            id="question"
            name="question"
            type="text"
            required
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="例如：Next.js 中什么是 Server Action？"
          />
        </div>
      </div>

      {/* 2. 答案文本域 */}
      <div>
        <label htmlFor="answer" className="block text-sm font-medium leading-6 text-gray-900">
          Answer 💡
        </label>
        <div className="mt-2">
          <textarea
            id="answer"
            name="answer"
            rows={4}
            required
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="它是一种在服务器上异步运行的函数，可以直接从客户端组件调用..."
          />
        </div>
      </div>

      {/* 3. 分类选择 */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium leading-6 text-gray-900">
          分类 📂
        </label>
        <div className="mt-2">
          <select
            id="categoryId"
            name="categoryId"
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

      {/* 4. 新建分类 */}
      <div>
        <label htmlFor="newCategoryName" className="block text-sm font-medium leading-6 text-gray-900">
          或新建分类 ➕
        </label>
        <div className="mt-2">
          <input
            id="newCategoryName"
            name="newCategoryName"
            type="text"
            placeholder="输入新分类名称"
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>


      {/* 5. 提交按钮 */}
      <div className="mt-8 flex justify-end">
      <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Card'}
        </Button>
      </div>
    </form>
  );
}