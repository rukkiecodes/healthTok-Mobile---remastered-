import React, { useEffect, useState } from 'react'
import { getOtherParticipant } from '@/libraries/extractUID'
import { auth, db } from '@/utils/fb'
import { Profile } from '@/store/types/profile'
import { doc, getDoc } from 'firebase/firestore'
import { ThemedText } from '../ThemedText'

export default function HeadName ({ participants, ...rest }: any) {
  const paticipantId = getOtherParticipant([...participants], String(auth.currentUser?.uid))

  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    (async () => {
      const data: any = (await getDoc(doc(db, 'users', String(paticipantId)))).data()
      setProfile(data)
    })()
  }, [participants])

  return (
    <ThemedText type='subtitle' font='Poppins-Bold' {...rest}>{profile?.name}</ThemedText>
  )
}