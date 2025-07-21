import { Stack, useSegments,useRouter} from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";


export default function RootLayout() {

  const router=useRouter();
  const segments=useSegments();

  const{checkAuth,user,token}=useAuthStore();

  useEffect(() => {
    checkAuth();
  },[]);

  
  useEffect(() => {
  const timeout = setTimeout(() => {
    const isAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isAuthScreen && !isSignedIn) {
      router.replace("/(auth)");
    } else if (isAuthScreen && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, 0); //  Wait until next tick

  return () => clearTimeout(timeout);
}, [segments, user, token]);


  return (
    <SafeAreaProvider>
      <SafeScreen>
       
        <Stack
          screenOptions={{ headerShown: false, headerTitleAlign: "center" }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark"/>
    </SafeAreaProvider>
  );
}
