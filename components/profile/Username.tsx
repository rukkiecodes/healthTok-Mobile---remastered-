import React, { useEffect, useState } from 'react'
import { db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'
import { doc, getDoc } from 'firebase/firestore'

const Username = ({ userId }: { userId?: string }) => {
  const [username, setUsername] = useState<string>('')

  const getUsername = async () => {
    const name = (await getDoc(doc(db, 'users', String(userId)))).data()
    setUsername(name?.fullName)
  }

  useEffect(() => {
    getUsername()
  }, [db])

  return <ThemedText>{username}</ThemedText>
}

export default Username