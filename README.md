# 🎄 Festive Secret Santa App

A beautiful React Native app for organizing Secret Santa gift exchanges with Amazon wishlist integration.

## ✨ Features

- 🎅 Create and manage Secret Santa groups
- 🎁 Search Amazon products and add to wishlists
- ⭐ Group-specific wishlists
- 🔔 Push notifications
- ❄️ Festive UI with snowflakes and animations
- 🎄 Firebase authentication and Firestore database

## 🚀 Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy your Firebase config to `firebase.config.js`

### 3. Amazon Affiliate Setup

1. Sign up for Amazon Associates at https://affiliate-program.amazon.com
2. Get your Associate Tag
3. Update the tag in `services/amazonAPI.js`

### 4. Run the App

\`\`\`bash
# Start Expo
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
\`\`\`

## 📱 Screens

- **Onboarding** - 3 intro screens
- **Login/Signup** - Authentication
- **Groups** - View and create Secret Santa groups
- **Search** - Find Amazon products
- **Wishlist** - Manage group-specific wishlists
- **Person Wishlist** - View assigned person's wishlist

## 🔧 Tech Stack

- React Native + Expo
- NativeWind (Tailwind CSS)
- Firebase (Auth + Firestore)
- Expo Router
- Amazon Product API

## 📝 License

MIT

---

Made with 🎅 and ❤️