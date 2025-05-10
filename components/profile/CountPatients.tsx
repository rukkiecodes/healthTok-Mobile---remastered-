import React, { useEffect, useState } from 'react'
import { ThemedText } from '../ThemedText'
import { accent } from '@/utils/colors'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/utils/fb'

export default function CountPatients ({ item }: any) {
  const [patientsCount, setPatientsCount] = useState('')

  useEffect(() => {
    (async () => {
      const q: any = await getDocs(collection(db, 'doctors', item?.id, 'patients'))
      setPatientsCount(q.docs.length > 20 ? `${q.docs.length}+` : q.docs.length)
    })()
  }, [item])

  return (
    <ThemedText type='body' font='Poppins-Bold' lightColor={accent}>{patientsCount}</ThemedText>
  )
}