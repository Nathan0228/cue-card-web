'use client'

import { useRouter } from 'next/navigation'
import CueCard from '@/app/ui/cue-card'

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

type Props = {
  cards: Card[]
  currentUser: CurrentUser
  authorNames?: Record<string, string>
  deleteAction?: (cardId: string) => Promise<void>
}

export default function SquareGridClient({ cards, currentUser, authorNames = {}, deleteAction }: Props) {
  const router = useRouter()
  const ids = cards.map((c) => c.id)

  function openCardByIndex(index: number) {
    if (index < 0 || index >= ids.length) return
    const id = ids[index]
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cuecard-open', { detail: { id } }))
    }
  }

  async function handleDelete(id: string) {
    if (!deleteAction) return
    await deleteAction(id)
    router.refresh()
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => {
        const isOwnCard = currentUser ? card.user_id === currentUser.id : false
        const displayName = isOwnCard ? '我' : (authorNames[card.user_id] ?? '匿名用户')

        return (
          <CueCard
            key={card.id}
            id={card.id}
            question={card.question}
            answer={card.answer}
            category={card.category}
            private={card.private}
            user={{
              id: card.user_id,
              email: '',
              full_name: displayName,
            }}
            isOwnCard={isOwnCard}
            onDelete={deleteAction ? handleDelete : undefined}
            onPrev={() => openCardByIndex(idx - 1)}
            onNext={() => openCardByIndex(idx + 1)}
          />
        )
      })}
    </div>
  )
}