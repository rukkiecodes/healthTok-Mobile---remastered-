// app/(auth)/_layout.tsx
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function AuthLayout () {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/home" />;
  }

  return <Stack />;
}
