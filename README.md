# UserApp

**Expo + RTK Query + TypeScript**

A simple cross-platform application that displays a list of users from [JSONPlaceholder](https://jsonplaceholder.typicode.com/users ), with the ability to search and navigate to the detail screen.  
The application works both on mobile devices and in the browser via the 'expo start --web'.

---

## 🎯 Functionality

- **List of users**: Name and Email
- **Name Search**
- **Detailed User screen**: Name, Email, Phone, Company
- **"Refresh" button**: Manual data update
- **State processing**: Loading, Error, Empty result
- **Animations**: Animated appearance of list items (FadeInDown)
- **Caching**: Data is saved in `localStorage` for Web

---

## 🧰 Technologies used

- **Expo SDK 53+**
- **TypeScript**
- **Redux Toolkit + RTK Query**
- **React Native (including Web support)**
- **react-native-reanimated** (for animations)
- **expo-linear-gradient** (for button styling)
- **FlatList**, **Navigation** (screens)

---

## 📁 Project structure
UserApp/
├── expo # **bash: npx expo start --web**
├── app/
│ ├── index.tsx # Main screen
│ └── details/
│ └── [id].tsx # User details
│ └── navigation/
│ └── AppNavigator.tsx
│ └── screens/
│ └── UserListScreen.tsx # User list
│ └── _layout.tsx
│ └── +html.tsx
│ └── +not-found.tsx
│ └── RootLayoutNav.tsx
│
├── src/
│ ├── store.ts # Redux Store
│ └── services/
│ └── userApi.ts # RTK Query API
│
├── assets/ # Fonts, images
├── components/ # Reusable components
├── package.json
├── tsconfig.json
└── app.json
