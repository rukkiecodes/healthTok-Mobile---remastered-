import React, { useEffect, useState } from 'react'
import { ThemedText } from '../ThemedText'
import { getAddressFromCoords } from '@/libraries/getAddress'

export default function Address ({ item }: any) {
  const [address, setAddress] = useState('')

  useEffect(() => {
    (async () => {
      const address: any = await getAddressFromCoords(Number(item?.coords?.latitude), Number(item?.coords?.longitude))
      setAddress(address)
    })()
  }, [item])

  return (
    <ThemedText type='body' font='Poppins-Medium'>{address}</ThemedText>
  )
}