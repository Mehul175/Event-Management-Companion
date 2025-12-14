# Mock Server

This directory contains a mock backend server using [json-server](https://github.com/typicode/json-server) for development and testing of the Event Management Companion app.

## Overview

The mock server provides a RESTful API that simulates a backend service, allowing you to develop and test the app without a real server. It uses `db.json` as the database file and automatically creates REST endpoints for all resources.

## Getting Started

### Prerequisites

- Node.js (>=20)
- npm or yarn

### Running the Server

From the project root directory:

```bash
npm run mock-server
```

Or manually:

```bash
npx json-server --watch mock-server/db.json --port 3000
```

The server will start on `http://localhost:3000` and watch for changes to `db.json`.

## Available Endpoints

The server automatically creates REST endpoints based on the resources in `db.json`:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users?email=:email` - Search users by email (used for login)

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create a new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `GET /events?organizerId=:id` - Filter events by organizer

### Attendees
- `GET /attendees` - Get all attendees
- `GET /attendees/:id` - Get attendee by ID
- `POST /attendees` - Create a new attendee
- `PUT /attendees/:id` - Update attendee
- `DELETE /attendees/:id` - Delete attendee
- `GET /attendees?eventId=:id` - Filter attendees by event

### Check-ins
- `GET /checkins` - Get all check-ins
- `GET /checkins/:id` - Get check-in by ID
- `POST /checkins` - Create a new check-in
- `PUT /checkins/:id` - Update check-in
- `DELETE /checkins/:id` - Delete check-in
- `GET /checkins?eventId=:id` - Filter check-ins by event
- `GET /checkins?attendeeId=:id` - Filter check-ins by attendee

## Test Credentials

The following test users are available in the database:

### Admin User
- **Email:** `admin@eventcompanion.com`
- **Password:** `admin123`
- **Role:** `admin`

### Organizer User
- **Email:** `organizer@eventcompanion.com`
- **Password:** `organizer123`
- **Role:** `organizer`

### Regular User
- **Email:** `user@eventcompanion.com`
- **Password:** `user123`
- **Role:** `user`

## Data Structure

### Users
```json
{
  "id": number,
  "email": string,
  "password": string,
  "name": string,
  "role": "admin" | "organizer" | "user",
  "image": string (URL)
}
```

### Events
```json
{
  "id": number,
  "title": string,
  "description": string,
  "date": string (ISO 8601),
  "location": string,
  "organizerId": number,
  "image": string (URL)
}
```

### Attendees
```json
{
  "id": number,
  "eventId": number,
  "name": string,
  "email": string,
  "checkedIn": boolean,
  "checkedInAt": string | null (ISO 8601),
  "image": string (URL)
}
```

### Check-ins
```json
{
  "id": number,
  "attendeeId": number,
  "eventId": number,
  "timestamp": string (ISO 8601),
  "synced": boolean
}
```

## Features

- **Auto-generated REST API** - json-server automatically creates REST endpoints
- **File watching** - Changes to `db.json` are automatically reflected
- **Query support** - Filter and search using query parameters
- **Relationships** - Access related resources using nested routes (e.g., `/events/1/attendees`)

## Notes

- The server runs on port `3000` by default
- All data is stored in `db.json` and persists between server restarts
- Changes made through API calls are automatically saved to `db.json`
- The app uses this server for development; it never imports JSON directly
- For production, replace the API base URL in `src/api/endpoints.ts`

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:

```bash
npx json-server --watch mock-server/db.json --port 3001
```

Then update `API_BASE_URL` in `src/api/endpoints.ts` accordingly.

### Data Not Persisting
Ensure the `db.json` file is writable and not locked by another process.

### CORS Issues
json-server handles CORS automatically, but if you encounter issues, you can add custom middleware or use a proxy.

## Additional Resources

- [json-server Documentation](https://github.com/typicode/json-server)
- [json-server GitHub](https://github.com/typicode/json-server)
