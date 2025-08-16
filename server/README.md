# EMS Server

- Copy `.env.example` to `.env` and set values.
- Install deps: `npm install`
- Run dev: `npm run dev`

API base: `/api`
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Companies: `/api/companies`
- Users: `/api/users`
- Attendance: `/api/attendance/check-in`, `/api/attendance/report`, `/api/attendance/check-out`
- Leaves: `/api/leaves`, `/api/leaves/:id/approve`, `/api/leaves/:id/reject`
- Tasks: `/api/tasks`, `/api/tasks/:id/update`
- Documents: `/api/documents`
- Salaries: `/api/salaries`
- Notifications: `/api/notifications/subscribe`