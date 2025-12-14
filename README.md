## EventCompanion

Offline-first React Native (CLI) app for event management with authentication, event browsing, attendee check-ins, and sync queueing.

### Setup
1) Install dependencies
```bash
npm install
```
2) iOS pods (first time)
```bash
cd ios && pod install && cd ..
```
3) Run app
```bash
npm run android
# or
npm run ios
```

### Mock backend (json-server)
```bash
cd mock-server
npx json-server --watch db.json --port 3000
```
The app consumes data only via Axios services; it never imports JSON directly.

### Architecture
- **State**: Redux Toolkit + redux-persist (auth, events, attendees, network)
- **API**: Single Axios instance with token/error interceptors
- **Navigation**: React Navigation stack (auth flow, main flow)
- **UI**: EText/ESafeAreaWrapper/ETextInput/ESearchInput, FlashList, Skeleton
- **Styling**: react-native-size-matters (no hardcoded spacing/fonts), shared spacing utilities
- **Offline**: NetInfo, cached slices, pending check-in queue with auto-sync
- **Notifications (mock)**: Toast-based event start + sync complete

### Offline strategy
- Cache events/attendees in persisted Redux state.
- NetInfo-driven network slice.
- Check-ins queue locally when offline; auto-sync on reconnect via `syncService`.
- Toast feedback for offline check-ins and sync completion.

### Folder map (key)
- `src/api`: axios instance, interceptors, endpoints, types
- `src/services`: auth/event/attendee services, sync + notification services
- `src/features`: RTK slices for auth/events/attendees
- `src/navigation`: stack navigator + types
- `src/components/common`: shared UI (EText, ESafeAreaWrapper, ETextInput, ESearchInput, Skeleton, Toast)
- `src/styles` / `src/typography` / `src/theme`: spacing, typography, theming
- `src/screens`: auth, events, attendees
- `mock-server/db.json`: mock data

### Trade-offs
- Uses in-app toasts for mock notifications instead of platform push.
- Simple theme toggle hook (light by default); dark palette defined.
- Login against json-server via user query (no JWT refresh).

### Future improvements
- Add push notifications integration.
- Expand offline conflict resolution (e.g., last-write wins prompts).
- Add unit/e2e coverage for slices and screens.
