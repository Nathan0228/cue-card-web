'use client'
// 实现卡片上下切换功能
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

export default function SquareGridClient({ cards, currentUser }: { cards: Card[]; currentUser: CurrentUser }) {
  const ids = cards.map((c) => c.id)

  function openCardByIndex(index: number) {
    if (index < 0 || index >= ids.length) return
    const id = ids[index]
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cuecard-open', { detail: { id } }))
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => {
        const isOwnCard = currentUser ? card.user_id === currentUser.id : false
        
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
              full_name: isOwnCard
                ? currentUser?.full_name || '我'
                : '其他用户',
            }}
            isOwnCard={isOwnCard}
            onPrev={() => openCardByIndex(idx - 1)}
            onNext={() => openCardByIndex(idx + 1)}
          />
        )
      })}
    </div>
  )
}