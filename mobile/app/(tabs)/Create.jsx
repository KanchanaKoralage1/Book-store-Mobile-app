import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../assets/styles/create.styles";
import COLORS from "../../constants/color";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-image-picker";

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(3);

  const router = useRouter();

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("status", status);
        if (status !== "granted") {
          Alert.alert("Permission to access camera roll is required!");
          return;
        }
      }

      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true, // Get base64 string
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          setImageBase64(base64);
        }
      } else {
        Alert.alert("No image selected");
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error picking image", "Please try again later.");
    }
  };

  const handleSubmit = async () => {};

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={20}
            color={i <= rating ? "#f4b814ff" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        styles={styles.scrollViewContainer}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recomendation</Text>
            <Text style={styles.subtitle}>
              Share your favourite books with others
            </Text>
          </View>
          <View style={styles.form}>
            {/* book title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                />
              </View>
            </View>

            {/* rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>

            {/* image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>select the image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/* caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>

              <TextInput
                style={styles.textArea}
                multiline
                value={caption}
                onChangeText={setCaption}
                placeholder="Enter caption"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>

            {/* submit button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
            >
                {isLoading ?(
                    <ActivityIndicator color={COLORS.white}/>
                ) : (
                    <>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={COLORS.white}
                style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Submit</Text>
                </>
                )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
