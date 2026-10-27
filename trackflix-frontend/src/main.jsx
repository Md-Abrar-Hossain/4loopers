import React, { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { installAuthInterceptor } from "./api/attachAuth";

installAuthInterceptor();

// Pages and Components
import App from "./App.jsx";
import Home from "./pages/Home";
const Movies = lazy(() => import("./pages/Movies"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const LiveDetails = lazy(() => import("./pages/LiveDetails"));
const Search = lazy(() => import("./pages/Search"));
const LogIn = lazy(() => import("./components/LogIn"));
const SignIn = lazy(() => import("./components/SignIn"));
const LiveShow = lazy(() => import("./pages/LiveShow"));
const NewToMovies = lazy(() => import("./components/FooterExtra/NewToMovies"));
const FTMoreRecommendations = lazy(() => import("./RecommendationPage/FTMoreRecommendations"));
const MostPCMoreRecommendations = lazy(() => import("./RecommendationPage/MostPCMoreRecommendations.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const About = lazy(() => import("./components/FooterExtra/About"));
const Contact = lazy(() => import("./components/FooterExtra/Contact"));
const Privacy = lazy(() => import("./components/FooterExtra/Privacy"));
const Terms = lazy(() => import("./components/FooterExtra/Terms"));
const MeetTeam = lazy(() => import("./pages/MeetTeam.jsx"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProSubscriptionPage = lazy(() => import("./ProVersion/ProSubscriptionPage.jsx"));
const TheaterPage = lazy(() => import("./ProVersion/TheaterPage.jsx"));

// ----------- Protected route wrappers ------------

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
};

// Simplified ProUserRoute to protect pro-only routes
const ProUserRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  // Direct check for pro status on user object
  return user.pro ? <Outlet /> : <Navigate to="/subscription" />;
};

// ------------ Router setup ------------------

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/movies", element: <Movies /> },
      { path: "/movies/:id", element: <MovieDetails /> },
      { path: "/TvshowDetails/:id", element: <LiveDetails /> },
      { path: "/search", element: <Search /> },
      { path: "/login", element: <LogIn /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/Tvshow", element: <LiveShow /> },
      { path: "/new-to-movies", element: <NewToMovies /> },

      { path: "/recommendations", element: <FTMoreRecommendations /> },
      { path: "/recommendations2", element: <MostPCMoreRecommendations /> },

      // Nested routes under dashboard
      {
        element: <PrivateRoute />,
        children: [{ path: "/dashboard/*", element: <UserDashboard /> }],
      },

      {
        element: <AdminRoute />,
        children: [{ path: "/admin", element: <AdminPage /> }],
      },

      // Pro Subscription page - open to all logged-in users
      { path: "/subscription", element: <ProSubscriptionPage /> },

      // Protected Theater page - only for logged-in Pro users
      {
        element: <ProUserRoute />,
        children: [{ path: "/theater", element: <TheaterPage /> }],
      },

      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "/teams", element: <MeetTeam /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

// ------------- Render -------------------

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
