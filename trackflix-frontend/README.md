<div align="center">

#   TrackFlix Frontend

**The React user interface for TrackFlix, a movie and TV show discovery platform.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-4loopers--newest.vercel.app-000000?logo=vercel&logoColor=white)](https://4loopers-newest.vercel.app/)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?logo=firebase&logoColor=black)

[Live Demo](https://4loopers-newest.vercel.app/) · [Features](#-features) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Deployment](#-deployment)

![TrackFlix preview](../public/images/screenshot8.png)

</div>

---

##   Features

**  Discover**
-   **Top 10** movies of the week
-   **Upcoming movies** preview
-   **Fan favorites** collection
-   **Top celebrities** section
-   Browse **movies and TV shows**, filter by genre, with pagination
-   **Search** across the catalog
-   **New to Movies** guide for newcomers

**  Personalize**
-   **Sign up and log in** with Firebase Authentication
-   **Watchlist**: add and remove titles from any card
-   **Recommendation quiz**: answer a few questions and get a movie suggestion
-   **Trailers** in a modal player
-   **Movie chatbot** on the home page

**  Experience**
-   Responsive layout for mobile and desktop
-   Smooth animations and transitions with Framer Motion
-   Modular component structure

##   Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,firebase,vercel,js,html,css&perline=8" alt="Tech stack icons" />
</p>

| Area | Technology |
|------|------------|
|   Framework | [React 19](https://react.dev/) with [Vite 6](https://vitejs.dev/) |
|   Routing | [React Router 7](https://reactrouter.com/) |
|   Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
|   Animation | [Framer Motion](https://www.framer.com/motion/), react-confetti, react-tsparticles |
|   Authentication | [Firebase Auth](https://firebase.google.com/docs/auth) |
|   HTTP | [Axios](https://axios-http.com/) |
|   Icons | React Icons, Lucide React |
|   Notifications | React Toastify |

##  Getting Started

###  Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- The **TrackFlix backend** running (see the [main README](../README.md#-getting-started))
- A [Firebase](https://console.firebase.google.com/) project with **Email/Password** sign-in enabled

###  Installation

```bash
# 1. Clone the full repository
git clone https://github.com/RoBiul-Hasan-Jisan/4loopers.git

# 2. Go to the frontend
cd 4loopers/trackflix-frontend

# 3. Install dependencies
npm install

# 4. Create your environment file
cp .env.example .env
```

###  Environment variables

Open `.env` and fill in your values:

```env
# Firebase web app settings (Firebase console → Project settings → Your apps)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Backend API address
VITE_API_BASE_URL=http://localhost:5000/api
```

> If `VITE_API_BASE_URL` is not set, the app falls back to the hosted backend at `https://fourloopers-9.onrender.com/api`. The address is defined once in [`src/config.js`](src/config.js).

###  Run

```bash
npm run dev
```

The app opens at **http://localhost:5173**.

###  Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with ESLint |

###  Troubleshooting

| Problem | Fix |
|---------|-----|
| Errors after pulling new changes | Delete `node_modules` and `package-lock.json`, then run `npm install` again |
| Data does not load | Make sure the backend is running and `VITE_API_BASE_URL` points to it |
| Login does not work | Check the `VITE_FIREBASE_*` values and that Email/Password sign-in is enabled in Firebase |
| Build or install errors | Use Node.js 18 or newer |

##  Project Structure

```
trackflix-frontend/
├── public/                  # Static images and trailer videos
├── src/
│   ├── animations/          # Framer Motion animation presets
│   ├── api/                 # Axios client and API modules
│   ├── chatbot/             # Movie chatbot
│   ├── components/
│   │   ├── AdminTabs/       # Admin dashboard tabs
│   │   ├── Extraadmin/      # Admin forms and lists
│   │   ├── common/          # Shared components (e.g. TrailerModal)
│   │   ├── sections/        # Home page sections
│   │   └── ...
│   ├── constants/           # Constant values
│   ├── context/             # Auth context
│   ├── data/                # Static data
│   ├── firebase/            # Firebase configuration
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Route pages
│   ├── ProVersion/          # Mock Pro subscription and theater
│   ├── RecommendationPage/  # Recommendation pages
│   ├── userdeshbord/        # User dashboard
│   ├── config.js            # API base URL
│   ├── App.jsx
│   └── main.jsx             # Router and app entry
├── .env.example
├── index.html
├── tailwind.config.js
├── vercel.json              # SPA rewrite for deployment
└── vite.config.js
```

##  Main Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/movies`, `/movies/:id` | Movie list and details | Public |
| `/Tvshow`, `/TvshowDetails/:id` | TV shows and details | Public |
| `/search` | Search | Public |
| `/recommendations`, `/recommendations2` | Recommendations | Public |
| `/new-to-movies` | New to Movies guide | Public |
| `/login`, `/signin` | Log in and sign up | Public |
| `/dashboard/*` | User dashboard (watchlist, ratings, settings) | Logged in |
| `/subscription` | Pro subscription (mock payment) | Public |
| `/theater` | Pro theater | Pro users |
| `/admin` | Admin dashboard | Admins |
| `/about`, `/contact`, `/privacy`, `/terms`, `/teams` | Info pages | Public |

##  Deployment

The frontend is deployed on **Vercel**: **[4loopers-newest.vercel.app](https://4loopers-newest.vercel.app/)**

To deploy your own copy:

1. Import the repository in Vercel and set the **root directory** to `trackflix-frontend`.
2. Use the **Vite** framework preset (build command `npm run build`, output directory `dist`).
3. Add the environment variables from the section above.

`vercel.json` already rewrites every route to `index.html`, so page refreshes and direct links work with React Router.

##  Related

- [Main project README](../README.md): full project overview, backend setup and API reference

##  License

Distributed under the MIT License. See [`LICENSE`](../LICENSE) for details.
