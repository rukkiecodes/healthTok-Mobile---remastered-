import React, { useEffect, useState } from 'react'
import { getOtherParticipant } from '@/libraries/extractUID'
import { auth, db } from '@/utils/fb'
import { Profile } from '@/store/types/profile'
import { doc, getDoc } from 'firebase/firestore'
import { Image } from 'expo-image'

export default function Avatar ({ participants, size }: any) {
  const paticipantId = getOtherParticipant([...participants], String(auth.currentUser?.uid))

  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    (async () => {
      const data: any = (await getDoc(doc(db, 'users', String(paticipantId)))).data()
      setProfile(data)
    })()
  }, [participants])

  return (
    <Image
      source={profile?.displayImage ? profile?.displayImage?.image : profile?.profilePicture}
      placeholder={require('@/assets/images/images/avatar.png')}
      contentFit='cover'
      placeholderContentFit='cover'
      transition={300}
      style={{
        width: size || 60,
        height: size || 60,
        borderRadius: 50
      }}
    />
  )
}