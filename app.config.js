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
