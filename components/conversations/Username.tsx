import { ViewProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'

export type FullNameProps = ViewProps & {
  user?: string
}

const Username = ({ user }: FullNameProps) => {
  const [fullName, setFullName] = useState<string | ''>('')

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', String(user)),
      doc => setFullName(doc?.data()?.fullName))
    return unsub
  }, [])

  return (
    <ThemedText type='body'>{fullName}</ThemedText>
  )
}

export default Username