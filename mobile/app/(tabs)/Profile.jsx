import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { formatPublishDate } from "../../lib/utils";
import COLORS from "../../constants/color";
import editStyles from "../../assets/styles/edit.styles";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBookData, setEditBookData] = useState({
    _id: "",
    title: "",
    caption: "",
    rating: 1,
    image: "",
  });

  const router = useRouter();
  const { token } = useAuthStore();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/api/books/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }
      console.log("Fetched data:", data);
      setBooks(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", error.message || "Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      // Refresh the book list after deletion
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      Alert.alert("Success", "Book deleted successfully");
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.alert("Error", "Failed to delete book");
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete the book item ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteBook(bookId),
          style: "destructive",
        },
      ]
    );
  };

  const handleUpdateBook = async () => {
    try {
      const { _id, title, caption, rating, image } = editBookData;

      const response = await fetch(`${API_URL}/api/books/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, caption, rating, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      setBooks((prev) => prev.map((book) => (book._id === _id ? data : book)));

      setEditModalVisible(false);
      Alert.alert("Success", "Book updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message);
    }
  };

  //const handleUpdateBook = async () => {}

  const openEditForm = (book) => {
    setEditBookData(book);
    setEditModalVisible(true);
  };

  const renderBookItems = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.ratingContainer}>
          Rating {renderRatingStars(item.rating)}
        </Text>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>
          Published on: {formatPublishDate(item.createdAt)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => openEditForm(item)}
      >
        <Ionicons name="create-outline" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={20}
          color={i <= rating ? "#f4b814ff" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <Text style={styles.bookTitle}>Your Current Book Recommendations</Text>
      <Text style={styles.booksCount}>{books.length} Books</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={renderBookItems}
        contentContainerStyle={styles.booksList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No books found</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>Add a Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {/*  Edit Book Modal */}
      <Modal visible={editModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={editStyles.container}>
          <View style={editStyles.card}>
            <Text style={editStyles.title}>Edit Book</Text>

            <View style={editStyles.formGroup}>
              <Text style={editStyles.label}>Title</Text>
              <View style={editStyles.inputContainer}>
                <TextInput
                  style={editStyles.input}
                  value={editBookData.title}
                  onChangeText={(text) =>
                    setEditBookData({ ...editBookData, title: text })
                  }
                />
              </View>
            </View>

            <View style={editStyles.formGroup}>
              <Text style={editStyles.label}>Caption</Text>
              <TextInput
                style={editStyles.textArea}
                multiline
                value={editBookData.caption}
                onChangeText={(text) =>
                  setEditBookData({ ...editBookData, caption: text })
                }
              />
            </View>

            <View style={editStyles.formGroup}>
              <Text style={editStyles.label}>Rating</Text>
              <View style={editStyles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() =>
                      setEditBookData({ ...editBookData, rating: i })
                    }
                    style={editStyles.starButton}
                  >
                    <Ionicons
                      name={i <= editBookData.rating ? "star" : "star-outline"}
                      size={20}
                      color="#f4b814ff"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={editStyles.formGroup}>
              <Text style={editStyles.label}>Image</Text>
              <TouchableOpacity
                style={editStyles.imagePicker}
                onPress={async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.5,
                    base64: true,
                  });

                  if (!result.canceled) {
                    const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
                    setEditBookData({ ...editBookData, image: base64Img });
                  }
                }}
              >
                {editBookData.image ? (
                  <Image
                    source={editBookData.image}
                    style={editStyles.previewImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={editStyles.placeholderContainer}>
                    <Text style={editStyles.placeholderText}>
                      Tap to select image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={editStyles.button}
              onPress={handleUpdateBook}
            >
              <Text style={editStyles.buttonText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={editStyles.buttonCancel}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={editStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
