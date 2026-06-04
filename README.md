# SplitKash

SplitKash is an Expo React Native mobile app for managing shared expenses in Kenyan shillings. It helps users organize groups, track bills, make simulated M-Pesa payments, and view transaction history from one simple dashboard.

## Features

- User login and logout flow
- Dashboard with balance summaries and recent activity
- Group management for shared households or friends
- Bill tracking for rent, KPLC, water, WiFi, groceries, and other expenses
- Payment screen with processing, success, failed, and receipt states
- Transaction history with settlement status
- Local data persistence using AsyncStorage
- Bottom tab navigation for Home, Groups, Bills, Pay, and History

## Tech Stack

- Expo SDK 56
- React Native 0.85
- React 19
- TypeScript
- React Navigation
- Zustand
- AsyncStorage

## Getting Started

### Prerequisites

Make sure you have Node.js installed. Expo SDK 56 requires Node.js 22.13.x or newer.

### Install Dependencies

```bash
npm install
```

### Run the App

Start the Expo development server:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

## Project Structure

```text
src/
  features/
    auth/
      screens/
      store/
    bills/
      screens/
      store/
    groups/
      screens/
      store/
    history/
      screens/
      store/
    home/
      screens/
  navigation/
  services/
    storage/
  shared/
    constants/
```

## Main Screens

- **Login**: Authenticates the user with a simulated login flow.
- **Dashboard**: Shows balance summaries and recent activity.
- **Groups**: Displays shared expense groups and allows users to create new groups.
- **Bills**: Lists bills, allows new bills to be added, and opens payment for pending bills.
- **Pay**: Simulates an M-Pesa payment and updates bill/history state.
- **History**: Shows settled and pending transactions.

## Data Storage

The app stores user, group, bill, and history data locally with AsyncStorage. This makes the app usable without a backend during development.

## Scripts

```bash
npm start
npm run android
npm run ios
npm run web
```

## License

This project is licensed under the terms in the `LICENSE` file.
