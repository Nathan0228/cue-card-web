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
}

type CurrentUser = { id: string; email: string; full_name?: string }

type Props = {
  cards: Card[]
  currentUser: CurrentUser
  deleteAction?: (cardId: string) => Promise<void>
}

export default function CueCardGridClient({ cards, currentUser, deleteAction }: Props) {
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
      {cards.map((card, idx) => (
        <CueCard
          key={card.id}
          id={card.id}
          question={card.question}
          answer={card.answer}
          category={card.category}
          private={card.private}
          user={currentUser}
          isOwnCard={true}
          onDelete={deleteAction ? handleDelete : undefined}
          onPrev={() => openCardByIndex(idx - 1)}
          onNext={() => openCardByIndex(idx + 1)}
        />
      ))}
    </div>
  )
}


