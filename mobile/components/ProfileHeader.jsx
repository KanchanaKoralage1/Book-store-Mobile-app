import { View, Text,TouchableOpacity, Alert, Platform} from 'react-native'
import { useAuthStore } from '../store/authStore';
import { formatMemberSince } from '../lib/utils';
import styles from '../assets/styles/profile.styles';
import { Image } from 'expo-image';
import { API_URL } from '../constants/api';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

export default function ProfileHeader() {

  const { user, token, setUser } = useAuthStore();
    const [uploading, setUploading] = useState(false);

    
    if (!user) {
        return null; 
    }

    const pickAndUploadImage = async () => {
        try {
            // Ask for permission
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission required", "Camera roll permission is required!");
                    return;
                }
            }
            // Pick image
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (result.canceled) return;

            setUploading(true);

            const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;

            // Upload to backend
            const response = await fetch(`${API_URL}/api/auth/profile-image`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ image: base64Img }),
            });

            const data = await response.json();
            setUploading(false);

            if (!response.ok) {
                Alert.alert("Upload failed", data.message || "Try again later");
                return;
            }

            // Update user in store
            setUser(data.user);
            Alert.alert("Success", "Profile image updated!");
        } catch (err) {
            setUploading(false);
            Alert.alert("Error", err.message || "Something went wrong");
        }
    };
    
  return (
    <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickAndUploadImage} disabled={uploading}>
                <Image
                    source={{ uri: user.profileImage || undefined }}
                    style={styles.profileImage}
                />
                <Text style={{ textAlign: "center", fontSize: 12, color: "#888" }}>
                    {uploading ? "Uploading..." : "Change"}
                </Text>
            </TouchableOpacity>
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>Joined Date {formatMemberSince(user.createdAt)}</Text>
      </View>
    </View>
  )
}