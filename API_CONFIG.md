# API Configuration Guide

## Development vs Release Builds

The app uses different API endpoints based on the build type:

### Development Build (`__DEV__ = true`)
- **Android Emulator**: `http://10.0.2.2:3000`
- **iOS Simulator**: `http://localhost:3000`

These URLs work automatically in emulators/simulators.

### Release Build (`__DEV__ = false`)
- **All Platforms**: Uses `PRODUCTION_API_URL` from `src/api/endpoints.ts`

## Configuring for Release APK

### Option 1: Update PRODUCTION_API_URL (Recommended)

1. Open `src/api/endpoints.ts`
2. Find the `PRODUCTION_API_URL` constant
3. Update it with your server's IP address:
   ```typescript
   const PRODUCTION_API_URL = 'http://192.168.1.100:3000'; // Your machine's IP
   ```

### Option 2: Use Your Machine's IP Address

To find your machine's IP address:

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Look for your local network IP (usually starts with `192.168.x.x` or `10.x.x.x`).

### Option 3: Use a Remote Server

If you're deploying the mock server to a remote server:
```typescript
const PRODUCTION_API_URL = 'https://your-api-server.com';
```

## Testing Release Build

1. **Build Release APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Install on Device:**
   ```bash
   adb install app/build/outputs/apk/release/app-release.apk
   ```

3. **Start Mock Server:**
   ```bash
   npm run mock-server
   ```

4. **Ensure Device and Server are on Same Network:**
   - Both your device and development machine must be on the same Wi-Fi network
   - Update `PRODUCTION_API_URL` with your machine's IP address

## Important Notes

- **HTTP vs HTTPS**: The mock server uses HTTP. For production, consider HTTPS.
- **Network Security**: Android requires `usesCleartextTraffic=true` in `gradle.properties` for HTTP (already configured).
- **Firewall**: Ensure your firewall allows connections on port 3000.
- **Same Network**: Device and server must be on the same network for local IP addresses to work.

## Troubleshooting

### API calls fail in release APK
1. Verify `PRODUCTION_API_URL` is set correctly
2. Check that device and server are on the same network
3. Verify mock server is running: `npm run mock-server`
4. Test connection from device browser: `http://YOUR_IP:3000/events`

### Connection refused
- Check firewall settings
- Verify port 3000 is not blocked
- Ensure mock server is running

### Network error
- Double-check IP address is correct
- Verify both devices are on same Wi-Fi network
- Try pinging the server IP from your device
