import { ViewProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'
import getFirstWord from '@/libraries/getFirstName'

export type NameProps = ViewProps & {
  user?: string;
  font?: string;
  variant?: string;
}

const Name = ({ user, font }: NameProps) => {
  const [name, setname] = useState<string | ''>('')

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', String(user)),
      doc => setname(doc?.data()?.fullName))
    return unsub
  }, [])

  return <ThemedText type='subtitle' font={font || 'Poppins-Bold'}>{getFirstWord(name)}</ThemedText>
}

export default Name