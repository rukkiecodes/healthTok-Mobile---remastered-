// context/CallContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useCalls, Call } from '@stream-io/video-react-native-sdk';

const CallContext = createContext<{ ringingCall: Call | null }>({ ringingCall: null });

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const calls = useCalls();
  const [ringingCall, setRingingCall] = useState<Call | null>(null);

  useEffect(() => {
    const ringing = calls.find((c) => c.ringing);
    setRingingCall(ringing || null);
  }, [calls]);

  return (
    <CallContext.Provider value={{ ringingCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => useContext(CallContext);
