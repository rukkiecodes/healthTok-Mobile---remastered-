import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme'
import { appDark, light } from '@/utils/colors'
import { Appbar, PaperProvider } from 'react-native-paper'

export default function profile () {
  const theme  = useColorScheme()
  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: theme == 'dark' ? appDark : light }}>
        <ThemedText></ThemedText>
      </Appbar.Header>

      <ThemedView style={{ flex: 1 }}>
        <ThemedText>Profile</ThemedText>
      </ThemedView>
    </PaperProvider>
  )
}