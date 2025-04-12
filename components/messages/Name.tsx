import { ViewProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'

export type NameProps = ViewProps & {
  user?: string;
  variant?: string;
}

const Name = ({ user }: NameProps) => {
  const [name, setname] = useState<string | ''>('')

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', String(user)),
      doc => setname(doc?.data()?.name))
    return unsub
  }, [])

  return <ThemedText type='default' font={'Poppins-Bold'}>{name}</ThemedText>
}

export default Name