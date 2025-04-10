// app/(app)/_layout.tsx
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function AppLayout () {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}
