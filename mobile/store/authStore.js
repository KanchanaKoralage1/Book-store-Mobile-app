import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      // http://192.168.8.186:3000/api/auth/register
      //http://localhost:3000/api/auth/register

      const response = await fetch(
        "http://192.168.8.186:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save user data and token to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      // Update the store with user data and token
      set({ user: data.user, token: data.token, isLoading: false });

      return {
        success: true,
        message: "Registration successful",
      };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message || "Registration failed" };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ user, token });
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://192.168.8.186:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      // Save user data and token to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      // Update the store with user data and token
      set({ user: data.user, token: data.token, isLoading: false });
      return {
        success: true,
        message: "Login successful",
      };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message || "Login failed" };
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));
