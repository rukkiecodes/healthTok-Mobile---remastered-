import React, { useEffect, useState } from 'react'
import { ThemedText } from '../ThemedText'
import { getAverageRating } from '@/libraries/calculateRating'

export default function Rating ({ item }: any) {
  const [rating, setRating] = useState(0)

  useEffect(() => {
    (async () => {
      const rating = await getAverageRating(item.id);
      setRating(rating)
    })()
  }, [item])

  return (
    <ThemedText type='body' style={{ marginTop: 5 }}>{rating}</ThemedText>
  )
}