# Munnazzim frontend

## Run locally

Start the backend on port `3000`, then run the frontend:

```sh
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:3000` by default. Set
`VITE_BACKEND_ORIGIN` in the frontend environment to change the development
proxy target. Set `VITE_API_BASE_URL` when the frontend should call a
same-origin API prefix other than `/api/v1`; production deployments must route
that prefix to the backend through their web server or reverse proxy.

## Backend integration

The frontend uses the existing `POST /api/v1/auth/register`,
`POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`,
`POST /api/v1/auth/logout`, and authenticated `POST /api/v1/project`
operations. Access tokens remain in memory; account display data is kept in
`sessionStorage`, and the refresh-token cookie is sent with requests using
`credentials: "include"`. The frontend obtains a fresh access token after a
page reload through the existing refresh operation.

The current backend has no user search, team, project listing, task, or
invitation endpoints. Team invitations, received invitations, accept/reject
actions, and task management therefore remain unavailable in the UI rather
than being simulated with browser-only data.
