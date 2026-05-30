# BookInn — Hotel Management UI

React + TypeScript + RTK Query frontend for the Hotel Management System Spring Boot API.

## Stack
- React 18 + TypeScript
- Redux Toolkit + RTK Query
- React Router v6
- Tailwind CSS
- Recharts (admin dashboard charts)
- React Hot Toast

## Setup

```bash
npm install
npm run dev
```

The app proxies `/api` to `http://localhost:8080` via Vite config. Make sure your Spring Boot backend is running on port 8080.

## Portals

| URL | Role | Description |
|-----|------|-------------|
| `/` | Guest | Landing page, browse rooms |
| `/rooms` | Guest | Room listing with filters |
| `/rooms/:id` | Guest | Room detail + booking |
| `/my-bookings` | Guest | View & cancel bookings |
| `/admin` | ADMIN | Dashboard with stats & charts |
| `/admin/rooms` | ADMIN | Create, edit, delete rooms |
| `/admin/bookings` | ADMIN | View all bookings |
| `/admin/users` | ADMIN | Manage users, roles, activate/deactivate |
| `/frontdesk` | FRONT_DESK/ADMIN | Process check-in by booking code |
| `/frontdesk/checkout` | FRONT_DESK/ADMIN | Process check-out by booking code |
| `/frontdesk/lookup` | FRONT_DESK/ADMIN | Lookup any booking |

## Auth Flow
- Login → JWT decoded for role → redirect to correct portal
- `ProtectedRoute` guards all protected pages by `UserType`
- Token stored in `localStorage`

## Notes
- Front Desk users are promoted from GUEST accounts by an ADMIN
- Bootstrap admin: `POST /api/auth/bootstrap-admin` (only works once)
# hotelUI
