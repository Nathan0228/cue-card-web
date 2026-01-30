'use client'

import { useState } from 'react'
import Categories from './categories'
import SquareGridClient from './grid-client-square'

type Category = { id: string; name: string }
type Card = {
  id: string
  question: string
  answer: string
  private: boolean
  category: Category | null
  user_id: string
}

type CurrentUser = { id: string; email: string; full_name?: string } | null

export default function SquareWrapper({ 
  categories, 
  cards, 
  currentUser,
  authorNames = {},
  deleteAction,
}: { 
  categories: Category[]
  cards: Card[]
  currentUser: CurrentUser
  authorNames?: Record<string, string>
  deleteAction?: (cardId: string) => Promise<void>
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCards = selectedCategory 
    ? cards.filter(card => card.category?.id === selectedCategory)
    : cards

  return (
    <>
      <Categories 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onCategorySelect={setSelectedCategory} 
      />

      <SquareGridClient 
        cards={filteredCards} 
        currentUser={currentUser} 
        authorNames={authorNames} 
        deleteAction={deleteAction}
      />
    </>
  )
}
