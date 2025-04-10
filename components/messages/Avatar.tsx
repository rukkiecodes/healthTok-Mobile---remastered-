import { ViewProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { Image } from 'expo-image'

export type AvatarProps = ViewProps & {
  user?: string;
  size?: number;
}

const Avatar = ({ user, size }: AvatarProps) => {
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
        width: size || 100,
        height: size || 100,
        borderRadius: 50
      }}
    />
  )
}

export default Avatar