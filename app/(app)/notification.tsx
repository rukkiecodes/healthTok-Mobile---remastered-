import { FlatList } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import Rows from '@/components/notification/Rows'
import { useDataContext } from '@/context/DataContext'
import { Appbar, PaperProvider } from 'react-native-paper'
import { appDark, light } from '@/utils/colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import BackButton from '@/components/BackButton'

const NotificationScreen = () => {
  const colorSheme = useColorScheme()
  const { notificationData } = useDataContext()

  return (
    <PaperProvider>
      <Appbar.Header style={{ paddingHorizontal: 20, backgroundColor: colorSheme == 'dark' ? appDark : light }}>
        <BackButton />
      </Appbar.Header>

      <ThemedView style={{ flex: 1, paddingTop: 20 }}>
        <FlatList
          data={notificationData}
          keyExtractor={(item: any, index: any) => String(item + index)}
          renderItem={({ item }) => <Rows item={item} />}
        />
      </ThemedView>
    </PaperProvider>
  )
}

export default NotificationScreen