import "dotenv/config";

export default {
  expo: {
    name: "healthTok",
    slug: "healthTok",
    version: "0.0.1",
    appVersion: 1,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "healthTok",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      versionCode: 1,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
      ],
      package: "com.rukkiecodes.healthTok",
      googleServicesFile: "./google-services.json",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-camera",
        {
          cameraPermission: "Allow healthTok to access your camera",
          microphonePermission: "Allow healthTok to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      "expo-font",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.EXPO_PUBLIC_REVERSED_CLIENT_ID,
          reservedClientId: process.env.EXPO_PUBLIC_REVERSED_CLIENT_ID,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
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
