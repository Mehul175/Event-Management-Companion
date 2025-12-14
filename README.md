# EventCompanion

Offline-first React Native (CLI) app for event management with authentication, event browsing, attendee check-ins, and sync queueing.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.x
- **npm** or **yarn**
- **React Native CLI** (install globally: `npm install -g react-native-cli`)
- **Xcode** (for iOS development on macOS)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS: `sudo gem install cocoapods`)
- **Java JDK** (for Android development)

---

## 🚀 Setup Instructions

Follow these steps in order to set up and run the project:

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Event-Management-Companion
```

### Step 2: Install Dependencies

Install all npm dependencies:

```bash
npm install
```

### Step 3: Install iOS Dependencies (iOS only)

If you're developing for iOS, install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

**Note:** You can also use the npm script:
```bash
npm run pod
```

### Step 4: Start the Mock Server (IMPORTANT - Do this first!)

**⚠️ The mock server MUST be running before you start the app, otherwise API calls will fail.**

Start the mock JSON server in a separate terminal:

```bash
npm run mock-server
```

Or manually:

```bash
cd mock-server
npx json-server --watch db.json --port 3000
```

The server will start on `http://localhost:3000` and watch for changes in `db.json`.

**Keep this terminal window open** - the app requires the server to be running.

### Step 5: Verify Mock Server

You can verify the mock server is running by visiting:
- `http://localhost:3000/events` - Should return a list of events
- `http://localhost:3000/users` - Should return a list of users
- `http://localhost:3000/attendees` - Should return a list of attendees

### Step 6: Start Metro Bundler (Optional but Recommended)

In a separate terminal, start the React Native Metro bundler:

```bash
npm start
```

This is optional as running the app commands will start Metro automatically, but running it separately gives you more control and better error messages.

### Step 7: Run the App

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

### Step 8: Login Credentials

Use these credentials from `mock-server/db.json` to log in:

| Email | Password | Role |
|-------|----------|------|
| `admin@eventcompanion.com` | `admin123` | Admin |
| `organizer@eventcompanion.com` | `organizer123` | Organizer |
| `user@eventcompanion.com` | `user1234` | User |

You can view all available users in `mock-server/db.json` under the `users` array.

---

## 🔧 Development Configuration

### API Endpoints

The app automatically uses different endpoints based on the environment:

- **Development (Emulator/Simulator):**
  - Android Emulator: `http://10.0.2.2:3000`
  - iOS Simulator: `http://localhost:3000`

- **Production/Release Build:**
  - Configure in `src/api/endpoints.ts` - Update `PRODUCTION_API_URL`

For detailed API configuration, see [API_CONFIG.md](./API_CONFIG.md).

### Running on Physical Device

1. Ensure your device and development machine are on the same Wi-Fi network
2. Find your machine's IP address:
   - **macOS/Linux:** `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows:** `ipconfig`
3. Update `PRODUCTION_API_URL` in `src/api/endpoints.ts` with your IP address
4. Build and install the release APK (see [API_CONFIG.md](./API_CONFIG.md) for details)

---

## 🏗️ Architecture

### State Management
- **Redux Toolkit** with **redux-persist** for state persistence
- Feature-based slices: `auth`, `events`, `attendees`, `network`
- Persistent storage using AsyncStorage
- Offline-first approach with cached state

### API Layer
- Single **Axios** instance with centralized configuration
- Request/response interceptors for token management and error handling
- Automatic retry and network error handling
- Type-safe API calls with TypeScript

### Navigation
- **React Navigation Stack Navigator**
- Protected routes with authentication flow
- Type-safe navigation with TypeScript

### UI Components
- Custom components: `EText`, `ESafeAreaWrapper`, `ETextInput`, `ESearchInput`
- **FlashList** for high-performance list rendering
- Skeleton loading states for better UX
- Toast notifications for user feedback
- Reusable components following design system principles

### Styling
- **react-native-size-matters** for responsive sizing (no hardcoded spacing/fonts)
- Shared spacing utilities from `src/styles` (padding, margin, gap, flex)
- Typography system from `src/typography`
- Theme context for colors and theming
- Consistent design system across the app

### Offline Strategy
- **NetInfo** for network state monitoring
- Events and attendees cached in persisted Redux state
- Check-ins queued locally when offline
- Automatic sync queue with retry mechanism on network reconnect
- Toast feedback for offline operations and sync completion

---

## 📁 Project Structure

```
src/
├── api/              # Axios instance, interceptors, endpoints, types
├── services/         # Business logic: auth, events, attendees, sync, notifications
├── features/         # Redux Toolkit slices: auth, events, attendees
├── navigation/       # Stack navigator and navigation types
├── components/       # Reusable UI components
│   ├── common/       # EText, ESafeAreaWrapper, ETextInput, ESearchInput, Skeleton, Toast
│   ├── event/        # Event-specific components
│   └── attendee/     # Attendee-specific components
├── screens/          # Screen components
│   ├── auth/         # Login, authentication screens
│   ├── events/       # Events list, event detail screens
│   └── attendees/    # Attendees list screen
├── styles/           # Shared styling utilities (padding, margin, gap, flex)
├── typography/       # Typography definitions and utilities
├── theme/            # Theme context and color definitions
└── redux/            # Store configuration and root reducer

mock-server/
└── db.json           # Mock data for json-server

android/              # Android-specific configuration
ios/                  # iOS-specific configuration
```

---

## 🎯 Technical Decisions

### 1. Redux Toolkit + redux-persist
**Decision:** Use Redux Toolkit for state management with persistence layer.

**Rationale:**
- Provides predictable state management for complex app state
- Built-in dev tools and middleware support
- Persistence ensures offline-first capabilities
- Reduces boilerplate compared to plain Redux

### 2. Offline-First Architecture
**Decision:** Implement offline-first strategy with local caching and sync queue.

**Rationale:**
- Critical for mobile apps with unreliable network connectivity
- Better user experience - app works without internet
- Check-ins can be performed offline and synced later
- Reduces dependency on network availability

### 3. Single Axios Instance with Interceptors
**Decision:** Use a single Axios instance with request/response interceptors.

**Rationale:**
- Centralized API configuration
- Automatic token injection for authenticated requests
- Consistent error handling across all API calls
- Easier to maintain and update API logic

### 4. FlashList for List Rendering
**Decision:** Use Shopify's FlashList instead of FlatList.

**Rationale:**
- Better performance with large lists
- Lower memory footprint
- Drop-in replacement for FlatList
- Critical for events and attendees lists

### 5. react-native-size-matters
**Decision:** Use size-matters for responsive sizing instead of hardcoded values.

**Rationale:**
- Consistent sizing across different screen sizes
- Better adaptation to various device dimensions
- Follows user rules for no hardcoded spacing/fonts
- Maintains design consistency

### 6. Custom Component Library (EText, ETextInput, etc.)
**Decision:** Build custom wrappers around React Native components.

**Rationale:**
- Consistent styling and behavior across the app
- Easy to maintain and update design system
- Type-safe props with TypeScript
- Centralized typography and theming integration

### 7. TypeScript
**Decision:** Use TypeScript for type safety.

**Rationale:**
- Catch errors at compile time
- Better IDE support and autocomplete
- Improved code maintainability
- Self-documenting code with types

### 8. JSON Server for Mock Backend
**Decision:** Use json-server for API mocking during development.

**Rationale:**
- Quick setup without backend infrastructure
- RESTful API simulation
- Easy to modify data via db.json
- Supports all CRUD operations

---

## ⚖️ Trade-offs

### 1. Authentication System
**Trade-off:** Simple user query-based authentication instead of JWT with refresh tokens.

**Why:**
- Faster development for MVP
- Sufficient for demo/mock server setup
- Can be upgraded to proper JWT system in production

**Impact:**
- No token refresh mechanism
- Less secure for production use
- Simpler implementation for development

### 2. Mock Notifications
**Trade-off:** Toast-based notifications instead of native push notifications.

**Why:**
- Faster implementation
- No need for Firebase/push notification setup during development
- Easier to test and demonstrate

**Impact:**
- No background notifications
- Requires app to be open
- Less engaging user experience

### 3. Theme System
**Trade-off:** Simple theme toggle hook with light mode as default.

**Why:**
- Dark mode palette is defined but not fully implemented
- Light mode prioritized for initial release
- Can be enhanced later

**Impact:**
- Limited theme customization
- Dark mode partially implemented
- Less personalization options

### 4. Offline Conflict Resolution
**Trade-off:** Simple sync queue without advanced conflict resolution.

**Why:**
- Basic sync sufficient for MVP
- Last-write-wins strategy keeps it simple
- Can be enhanced with timestamp-based conflict resolution

**Impact:**
- Potential data conflicts in edge cases
- May lose some check-in data if conflicts occur
- Simpler but less robust

### 5. No Unit/E2E Tests
**Trade-off:** Manual testing instead of automated test suite.

**Why:**
- Faster development timeline
- Focus on core features first
- Tests can be added incrementally

**Impact:**
- Risk of regressions
- Manual testing required for each change
- Less confidence in refactoring

### 6. HTTP vs HTTPS
**Trade-off:** HTTP for mock server instead of HTTPS.

**Why:**
- Simpler setup for development
- No certificate configuration needed
- Sufficient for local development

**Impact:**
- Not secure for production
- Android requires cleartext traffic configuration
- Must switch to HTTPS for production

---

## 🔮 Future Improvements

With more time and resources, the following improvements could be implemented:

### Enhanced Features

1. **Firebase Push Notifications**
   - Native push notification support
   - Background notifications for event reminders
   - Real-time updates for check-ins and event changes
   - Rich notifications with images and actions

2. **Enhanced UI/UX**
   - Complete dark mode implementation
   - More animations and transitions
   - Better loading states and error handling
   - Improved accessibility (screen readers, VoiceOver)
   - Custom illustrations and empty states
   - Pull-to-refresh functionality
   - Advanced filtering and sorting options
   - Event calendar view
   - Map integration for event locations

3. **Advanced Data Flow & Architecture**
   - Detailed data flow diagrams and documentation
   - GraphQL integration for efficient data fetching
   - Real-time subscriptions for live updates
   - More granular state management with normalized data
   - Better separation of concerns
   - Repository pattern for data access

4. **Enhanced Offline Capabilities**
   - Advanced conflict resolution strategies
   - Optimistic updates with rollback
   - Background sync scheduling
   - Data compression for storage
   - Incremental sync for large datasets

5. **Security Enhancements**
   - JWT token refresh mechanism
   - Biometric authentication (Face ID, Touch ID, Fingerprint)
   - Secure storage for sensitive data
   - Certificate pinning for HTTPS
   - OAuth2 integration

6. **Testing & Quality**
   - Unit tests for Redux slices and services
   - Integration tests for API calls
   - E2E tests with Detox or Appium
   - Component tests with React Native Testing Library
   - Performance benchmarking

7. **Performance Optimizations**
   - Image optimization and caching
   - Code splitting and lazy loading
   - Bundle size optimization
   - Memory leak detection and fixes
   - Performance monitoring with Flipper

8. **Additional Features**
   - QR code scanning for check-ins
   - Event search with full-text search
   - User profiles and preferences
   - Event favorites/bookmarks
   - Social sharing capabilities
   - In-app messaging between attendees
   - Event analytics and reporting
   - Export functionality (CSV, PDF)
   - Multi-language support (i18n)

9. **DevOps & Deployment**
   - CI/CD pipeline setup
   - Automated testing in CI
   - Code quality checks (SonarQube, ESLint)
   - Automated versioning and releases
   - App Store and Play Store deployment automation
   - Beta testing distribution (TestFlight, Firebase App Distribution)

10. **Documentation**
    - API documentation with Swagger/OpenAPI
    - Component Storybook
    - Architecture decision records (ADRs)
    - Contributor guidelines
    - User documentation

---

## 🐛 Troubleshooting

### Mock Server Not Starting
- Ensure port 3000 is not already in use
- Check that `mock-server/db.json` exists and is valid JSON
- Try killing any process using port 3000: `lsof -ti:3000 | xargs kill -9`

### iOS Build Issues
- Clean build folder: `cd ios && xcodebuild clean && cd ..`
- Reinstall pods: `cd ios && rm -rf Pods Podfile.lock && pod install && cd ..`
- Clear Metro cache: `npm start -- --reset-cache`

### Android Build Issues
- Clean Gradle: `cd android && ./gradlew clean && cd ..`
- Clear Metro cache: `npm start -- --reset-cache`
- Invalidate caches in Android Studio

### API Calls Failing
- Verify mock server is running on port 3000
- Check API endpoints in `src/api/endpoints.ts`
- For physical devices, ensure same Wi-Fi network
- Check Android manifest for cleartext traffic permission (HTTP)

### Network Errors
- Verify device and server are on same network
- Check firewall settings
- Try accessing API in browser: `http://localhost:3000/events`

---

## 📝 Scripts Reference

```bash
npm start              # Start Metro bundler
npm run android        # Run Android app
npm run ios            # Run iOS app
npm run pod            # Install iOS pods
npm run mock-server    # Start mock JSON server
npm run lint           # Run ESLint
```
