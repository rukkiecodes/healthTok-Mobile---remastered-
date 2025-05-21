import { ViewProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import CustomImage from '../CustomImage'

export type AvatarProps = ViewProps & {
  user?: string;
  size?: number;
}

const Avatar = ({ user, size }: AvatarProps) => {
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

export default Avatar