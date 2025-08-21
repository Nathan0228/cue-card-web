//import { CreateCardForm } from './options/createcardform';
//import { createCard } from '@/app/cue-cards/actions';
import { Suspense } from 'react'
import CueCardList from '@/app/cue-cards/list'

export default async function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">My Cue Cards</h1>
      {/* <CreateCardForm createAction={createCard} /> */}
      <div className="mt-6">
        <Suspense fallback={<div className="space-y-3"><div className="h-16 w-full animate-pulse rounded-lg bg-gray-100" /><div className="h-16 w-full animate-pulse rounded-lg bg-gray-100" /></div>}>
          <CueCardList />
        </Suspense>
      </div>
    </div>
  );
}