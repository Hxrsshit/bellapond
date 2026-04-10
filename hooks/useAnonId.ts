'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'bella_anon_id'

export function useAnonId(): string | null {
  const [anonId, setAnonId] = useState<string | null>(null)

  useEffect(() => {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
      // Generate a random UUID-like ID
      id = 'anon_' + crypto.randomUUID()
      localStorage.setItem(STORAGE_KEY, id)
    }
    setAnonId(id)
  }, [])

  return anonId
}

export function clearAnonId() {
  localStorage.removeItem(STORAGE_KEY)
}
