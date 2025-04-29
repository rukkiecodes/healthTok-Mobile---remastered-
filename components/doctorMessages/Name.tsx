import { ViewProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'

export type NameProps = ViewProps & {
  user?: string;
  variant?: string;
}

const Name = ({ user, ...res }: NameProps | any) => {
  const [name, setname] = useState<string | ''>('')

  useEffect(() => {
    (async () => { 
      const data = await (await getDoc(doc(db, 'users', String(user)))).data()
      setname(data?.name)
    })()
  }, [])

  return <ThemedText type='default' font={'Poppins-Bold'} {...res}>{name}</ThemedText>
}

export default Name