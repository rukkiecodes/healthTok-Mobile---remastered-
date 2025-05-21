import React, { useEffect, useState } from 'react';
import { ThemedText } from '../ThemedText';
import { getAddressFromCoords } from '@/libraries/getAddress';

export default function Address ({ item }: any) {
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      const resolvedAddress = await getAddressFromCoords(
        Number(item?.coords?.latitude),
        Number(item?.coords?.longitude)
      );
      if (resolvedAddress) {
        setAddress(resolvedAddress);
      }
    })();
  }, [item]);

  return (
    <ThemedText type="body" font="Poppins-Medium" numberOfLines={2}>
      {address}
    </ThemedText>
  );
}
