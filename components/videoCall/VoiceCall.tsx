import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { PaperProvider, Avatar, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Call, StreamCall, useStreamVideoClient, CallContent } from '@stream-io/video-react-native-sdk';
import { ThemedView } from '@/components/ThemedView';
import CustomCallControls from './CustomCallControls'; // Reuse for mute/hangup etc.

export function VoiceCall ({ chatId }: any) {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    if (!client || call) return;

    const joinVoiceCall = async () => {
      const call = client.call('default', chatId);

      await call.join({
        create: true,
        audio: true,
        video: false, // <-- important
      });

      setCall(call);
    };

    joinVoiceCall();
  }, [client]);

  if (!call) return null;

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <StreamCall call={call}>
          <View style={styles.content}>
            {/* Placeholder for user info */}
            <Avatar.Icon size={100} icon="account" />
            <Text variant="titleLarge" style={{ marginTop: 16 }}>Voice Call</Text>
          </View>

          <CallContent
            onHangupCallHandler={router.back}
            CallControls={() => <CustomCallControls call={call} />}
            // No FloatingParticipantView for voice
            showLocalVideo={false}
            showRemoteVideo={false}
          />
        </StreamCall>
      </ThemedView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
