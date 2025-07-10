import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import {Image} from "expo-image";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit this screen.</Text>

      <Link href="/(auth)/signup">Signup page</Link>
      <Link href="/(auth)">Login page</Link>
    </View>
  );
}

const styles = StyleSheet.create({

  container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
  },
  title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
  },
})