# 📖 Book Store Mobile App

A full-stack Book Store application with a React Native (Expo) mobile frontend and a Node.js/Express/MongoDB backend. Users can register, log in, share book recommendations (with images and ratings), and manage their profile.

## 🎥 Demo Video

## ✨ Features

- User authentication (register, login, logout)
- Share book recommendations with title, caption, image, and rating
- View all users' book recommendations (paginated)
- Edit and delete your own book recommendations
- Update user profile image
- Responsive mobile UI built with Expo and React Native
- Image uploads handled via Cloudinary


## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB database
- Cloudinary account (for image uploads)
- Expo CLI (`npm install -g expo-cli`)

---

### Backend Setup

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**

   Create a `.env` file in the `backend` folder with the following:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Start the backend server:**

   ```bash
   npm run dev
   ```

### Mobile App Setup

1. **Install dependencies:**

   ```bash
   cd mobile
   npm install
   ```

2. **Start the Expo app:**

   ```bash
   npx expo start
   ```
 ## Dependencies

 "dependencies": {<br/><br/>
    &nbsp; "@expo/vector-icons": "^14.1.0",<br/>
    &nbsp; "@react-native-async-storage/async-storage": "^2.2.0",  <br/>
    &nbsp; "@react-navigation/bottom-tabs": "^7.3.10",  <br/>
    &nbsp;"@react-navigation/elements": "^2.3.8",  <br/>
    &nbsp;"@react-navigation/native": "^7.1.6",  <br/>
    &nbsp;"expo": "~53.0.17",  <br/>
    &nbsp;"expo-blur": "~14.1.5",  <br/>
    &nbsp;"expo-constants": "~17.1.7",  <br/>
    &nbsp;"expo-font": "~13.3.2",  <br/>
    &nbsp;"expo-haptics": "~14.1.4",  <br/>
    &nbsp;"expo-image": "~2.3.2",  <br/>
    &nbsp;"expo-linking": "~7.1.7",  <br/>
    &nbsp;"expo-router": "~5.1.3",  <br/>
    &nbsp;"expo-splash-screen": "~0.30.10",  <br/>
    &nbsp;"expo-status-bar": "~2.2.3",  <br/>
    &nbsp;"expo-symbols": "~0.4.5",  <br/>
    &nbsp;"expo-system-ui": "~5.0.10",  <br/>
    &nbsp;"expo-web-browser": "~14.2.0",  <br/>
    &nbsp;"react": "19.0.0",  <br/>
    &nbsp;"react-dom": "19.0.0",  <br/>
    &nbsp;"react-native": "0.79.5",  <br/>
    &nbsp;"react-native-gesture-handler": "~2.24.0",  <br/>
    &nbsp;"react-native-reanimated": "~3.17.4",  <br/>
    &nbsp;"react-native-safe-area-context": "5.4.0",  <br/>
    &nbsp;"react-native-screens": "~4.11.1",  <br/>
    &nbsp;"react-native-web": "~0.20.0",  <br/>
    &nbsp;"react-native-webview": "13.13.5",  <br/>
    &nbsp;"zustand": "^5.0.6",  <br/>
    &nbsp;"expo-image-picker": "~16.1.4"  <br/><br/>
  }

  ## Usage

- Register a new account or log in.
- Add book recommendations with images and ratings.
- View all recommendations on the home screen.
- Edit or delete your own recommendations from your profile.
- Update your profile image.
- 
## 🧰 Tech Stack

- **Frontend:** React Native, Expo, Zustand, Expo Router
- **Backend:** Node.js
- **Database:** MongoDB

## 👤 Author

- [Kanchana Koralage](https://github.com/KanchanaKoralage1)

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
