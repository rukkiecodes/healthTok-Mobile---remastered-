import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { useCallContext } from '@/context/CallContext';

export const HandleIncomingCall = () => {
  const { ringingCall } = useCallContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (ringingCall) {
      console.log('Ringing')
      // navigation.navigate('-call'); // route must exist in your app
    }
  }, [ringingCall]);

  return null;
};
