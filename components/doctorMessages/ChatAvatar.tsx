import React, { useEffect, useState } from 'react'
import { auth, db } from '@/utils/fb'
import { doc, getDoc } from 'firebase/firestore'
import CustomImage from '../CustomImage'

export default function ChatAvatar ({ user, size }: any) {
  const [avatar, setAvatar] = useState<string | ''>('')

  useEffect(() => {
    (async () => {
      const targetCollection = user == auth.currentUser?.uid ? 'doctors' : 'patient'

      const usersDoc: any = (await getDoc(doc(db, String(targetCollection), String(user)))).data()
      setAvatar(usersDoc?.displayImage ? usersDoc?.displayImage?.image : usersDoc?.profilePicture)
    })()
  }, [user])

  return (
    <CustomImage
      source={avatar}
      placeholder={require('@/assets/images/imgs/johnDoe.png')}
      placeholderContentFit='cover'
      contentFit='cover'
      transition={1000}
      size={size || 0.1}
      style={{
        borderRadius: 50
      }}
    />
  )
}