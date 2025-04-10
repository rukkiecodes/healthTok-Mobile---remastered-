import { ViewProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { Image } from 'expo-image'

export type AvatarProps = ViewProps & {
  user?: string
}

const Avatar = ({ user }: AvatarProps) => {
  const [avatar, setAvatar] = useState<string | ''>('')

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', String(user)),
      doc => setAvatar(doc?.data()?.photoURL))
    return unsub
  }, [])

  return (
    <Image
      source={avatar}
      placeholder={require('@/assets/images/imgs/johnDoe.png')}
      placeholderContentFit='cover'
      contentFit='cover'
      transition={1000}
      style={{
        width: 60,
        height: 60,
        borderRadius: 50
      }}
    />
  )
}

export default Avatar