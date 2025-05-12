import "dotenv/config";

export default {
  expo: {
    name: "healthTok",
    slug: "healthTok",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.rukkiecodes.healthTok",
      googleServicesFile: "./google-services.json",
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "INTERNET",
        "WAKE_LOCK",
        "FOREGROUND_SERVICE",
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "MODIFY_AUDIO_SETTINGS",
        "VIBRATE",
        "POST_NOTIFICATIONS",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.EXPO_PUBLIC_REVERSED_CLIENT_ID,
          reservedClientId: process.env.EXPO_PUBLIC_REVERSED_CLIENT_ID,
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow HealthTok to use your location.",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "$rootDir/../../../node_modules/@notifee/react-native/android/libs",
            ],
          },
        },
      ],
      "@stream-io/video-react-native-sdk",
      [
        "@config-plugins/react-native-webrtc",
        {
          // add your explanations for camera and microphone
          cameraPermission:
            "$(PRODUCT_NAME) requires camera access in order to capture and transmit video",
          microphonePermission:
            "$(PRODUCT_NAME) requires microphone access in order to capture and transmit audio",
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
      "expo-video",
      [
        "expo-audio",
        {
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "b475ed64-6eee-4860-b269-1ce6449591a8",
      },
      expoPublic: {
        apiKey: process.env.EXPO_PUBLIC_apiKey,
        authDomain: process.env.EXPO_PUBLIC_authDomain,
        projectId: process.env.EXPO_PUBLIC_projectId,
        storageBucket: process.env.EXPO_PUBLIC_storageBucket,
        messagingSenderId: process.env.EXPO_PUBLIC_messagingSenderId,
        appId: process.env.EXPO_PUBLIC_appId,
        measurementId: process.env.EXPO_PUBLIC_measurementId,
        measurementId: process.env.EXPO_PUBLIC_measurementId,

        iosUrlScheme: process.env.EXPO_PUBLIC_REVERSED_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_webClientId,
        iosClientId: process.env.EXPO_PUBLIC_iosClientId,
      },
    },
  },
};
