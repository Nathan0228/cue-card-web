'use client'

import CustomTag from '@/app/ui/custom-tag'

interface Category {
  id: string
  name: string
}

interface CategoriesProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export default function Categories({ categories, selectedCategory, onCategorySelect }: CategoriesProps) {
  return (
    
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <CustomTag showIcon={false} className="text-gray-500">
          分类筛选
        </CustomTag>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
            selectedCategory === null
              ? 'bg-blue-100 border-blue-300 text-blue-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
