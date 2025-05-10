import { db } from '@/utils/fb'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '../ThemedText'
import { accent } from '@/utils/colors'
import { formatNumberWithCommas } from '@/libraries/formatNumberWithCommas'

export default function CountReviews ({ item }: any) {
  const [reviewsCount, setReviewsCount] = useState('')

  useEffect(() => {
    (async () => {
      const q: any = await getDocs(collection(db, 'doctors', item?.id, 'reviews'))
      setReviewsCount(formatNumberWithCommas(q.docs.length))
    })()
  }, [item])

  return (
    <ThemedText type='body' font='Poppins-Bold' lightColor={accent}>{reviewsCount}</ThemedText>
  )
}