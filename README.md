# Wearthly Backend

Wearthly's Express/MongoDB API.

## Local development

```powershell
npm ci
npm start
```

Create `.env` from `.env.example` and provide the database, Cloudinary, JWT,
and frontend origin values.

## Render deployment

Create a Render Web Service from this repository:

- Build command: `npm ci`
- Start command: `npm start`
- Add the variables listed in `.env.example` in Render's Environment settings.

The service listens on Render's `PORT` value and allows requests from the
configured `FRONTEND_URL`.
