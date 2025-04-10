import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { Image } from 'expo-image'
import { db } from '@/utils/fb'

const Avatar = ({ userId }: { userId?: string }) => {
  const [avatar, setAvatar] = useState<string>('')

  const getAvatar = async () => {
    const image = (await getDoc(doc(db, 'users', String(userId)))).data()
    setAvatar(image?.photoURL)
  }

  useEffect(() => {
    getAvatar()
  }, [db])

  return (
    <Image
      source={avatar}
      placeholder={require('@/assets/images/imgs/johnDoe.png')}
      transition={1000}
      placeholderContentFit='cover'
      contentFit='cover'
      style={{
        width: 50,
        height: 50,
        borderRadius: 50
      }}
    />
  )
}

export default Avatar