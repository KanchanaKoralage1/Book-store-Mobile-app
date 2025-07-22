import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/home.styles";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { API_URL } from "../../constants/api";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { formatPublishDate } from "../../lib/utils";

export default function Home() {
  const { logout, token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchBooks = async (pageNum = 1, refresh = false, loadMore = false) => {
    const isInitial = !refresh && !loadMore;

    if (!token) {
      console.log("No token available, skipping fetchBooks");
      if (isInitial) setLoading(false);
      if (refresh) setRefreshing(false);
      if (loadMore) setLoadingMore(false);
      return;
    }

    try {
      console.log(
        "Fetching books: page=",
        pageNum,
        "refresh=",
        refresh,
        "loadMore=",
        loadMore
      );

      if (refresh) {
        setRefreshing(true);
        setHasMore(true);
      } else if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        `${API_URL}/api/books?page=${pageNum}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Fetch failed");

      const newBooks = data.books || [];

      setBooks((prevBooks) => {
        const combinedBooks =
          refresh || pageNum === 1 ? newBooks : [...prevBooks, ...newBooks];

        const deduplicated = Array.from(
          new Set(combinedBooks.map((b) => b._id))
        ).map((id) => combinedBooks.find((b) => b._id === id));

        return deduplicated;
      });
      setHasMore(pageNum < data.totalPages && newBooks.length > 0);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      console.log("fetchBooks complete:", {
        loading,
        refreshing,
        loadingMore,
      });
    }
  };

  // Use useFocusEffect to refetch books when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (token) {
        console.log("Screen focused, fetching page 1");
        fetchBooks(1, true); // Refresh books on focus
      }
    }, [token])
  );

  const handleLoadMore = () => {
    if (hasMore && !loading && !loadingMore && !refreshing) {
      console.log("Loading more books...");
      fetchBooks(page + 1, false, true);
    } else {
      console.log(
        `handleLoadMore not triggered: hasMore=${hasMore}, loading=${loading}, loadingMore=${loadingMore}, refreshing=${refreshing}`
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image
          source={item.image}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        <Text style={styles.date}>
          Shared On {formatPublishDate(item.createdAt)}
        </Text>
      </View>
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
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Book Store</Text>
            <Text style={styles.headerSubtitle}>
              Discover Your Great Readings Here
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No Books Recommendations Yet</Text>
            <Text style={styles.emptySubtext}>Please check back later</Text>
          </View>
        }
      />
    </View>
  );
}
