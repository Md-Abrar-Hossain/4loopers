import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchWatchlist, updateWatchlistMovie, removeWatchlistMovie } from "../api/watchlist";

import UserHeader from "../userdeshbord/UserHeader";
import MovieCard from "../userdeshbord/MovieCard";
import CenteredMessage from "../userdeshbord/CenteredMessage";
import Recommendations from "../userdeshbord/Recommendations";
import Ratings from "../userdeshbord/Ratings";
// import Settings from "../userdeshbord/Settings";
import UserTabsNav from "../userdeshbord/UserTabsNav";

const UserDashboard = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setError(null);
      } else {
        navigate("/login", { replace: true });
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadWatchlist = async () => {
      setDataLoading(true);
      setError(null);

      try {
        const token = await user.getIdToken();
        const watchlistData = await fetchWatchlist(user.uid, token);

        if (!watchlistData || !Array.isArray(watchlistData.movies)) {
          throw new Error("Invalid watchlist format");
        }

        setWatchlist(watchlistData.movies);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setError("Failed to load your watchlist. Please try again later.");
      } finally {
        setDataLoading(false);
      }
    };

    loadWatchlist();
  }, [user]);

  const uniqueWatchlist = useMemo(() => {
    const seenTitles = new Set();
    return watchlist.filter((movie) => {
      const title = (movie.title || "").toLowerCase();
      if (seenTitles.has(title)) return false;
      seenTitles.add(title);
      return true;
    });
  }, [watchlist]);

  const counts = useMemo(() => {
    const c = { all: uniqueWatchlist.length, plan_to_watch: 0, watching: 0, watched: 0 };
    uniqueWatchlist.forEach((m) => {
      c[m.status || "plan_to_watch"] += 1;
    });
    return c;
  }, [uniqueWatchlist]);

  const visibleWatchlist = useMemo(
    () =>
      statusFilter === "all"
        ? uniqueWatchlist
        : uniqueWatchlist.filter((m) => (m.status || "plan_to_watch") === statusFilter),
    [uniqueWatchlist, statusFilter]
  );

  // Optimistic update: change the UI first, roll back if the server rejects it.
  const handleStatusChange = async (movieId, status) => {
    const previous = watchlist;
    setWatchlist((list) => list.map((m) => (m.id === movieId ? { ...m, status } : m)));
    try {
      await updateWatchlistMovie(user.uid, movieId, { status });
    } catch (err) {
      console.error(err);
      setWatchlist(previous);
      alert("Could not update status. Please try again.");
    }
  };

  const handleRemove = async (movieId, title) => {
    if (!window.confirm(`Remove "${title}" from your watchlist?`)) return;
    const previous = watchlist;
    setWatchlist((list) => list.filter((m) => m.id !== movieId));
    try {
      await removeWatchlistMovie(user.uid, movieId);
    } catch (err) {
      console.error(err);
      setWatchlist(previous);
      alert("Could not remove the movie. Please try again.");
    }
  };

  const STATUS_TABS = [
    ["all", "All"],
    ["plan_to_watch", "Plan to watch"],
    ["watching", "Watching"],
    ["watched", "Watched"],
  ];

  if (authLoading)
    return <CenteredMessage message="🔄 Authenticating..." size="lg" />;
  if (dataLoading)
    return <CenteredMessage message="⏳ Loading your watchlist..." size="lg" />;
  if (error)
    return <CenteredMessage message={`⚠️ ${error}`} isError size="lg" />;

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100 pt-28 px-4 sm:px-6 md:px-12 lg:px-16 max-w-screen-xl mx-auto">
      <UserHeader user={user} watchlistCount={uniqueWatchlist.length} />
      <UserTabsNav />

      <Routes>
        <Route
          index
          element={
            uniqueWatchlist.length === 0 ? (
              <section
                aria-live="polite"
                className="flex flex-col items-center justify-center mt-20 space-y-4 text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 014-4v2a4 4 0 004 4h2a4 4 0 01-4 4z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6"
                  />
                </svg>
                <p className="text-xl font-semibold">Your watchlist is empty.</p>
                <button
                  onClick={() => navigate("/movies")}
                  className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition"
                >
                  Explore Movies
                </button>
              </section>
            ) : (
              <>
                <div role="tablist" aria-label="Filter by watch status" className="flex flex-wrap gap-2 mb-4">
                  {STATUS_TABS.map(([value, label]) => (
                    <button
                      key={value}
                      role="tab"
                      aria-selected={statusFilter === value}
                      onClick={() => setStatusFilter(value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                        statusFilter === value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {label} ({counts[value]})
                    </button>
                  ))}
                </div>
                {visibleWatchlist.length === 0 ? (
                  <p className="text-gray-600 mt-8 text-center">Nothing here yet.</p>
                ) : (
                  <section
                    aria-live="polite"
                    aria-label="User watchlist movies"
                    className="grid grid-cols-4 gap-3 sm:gap-4"
                  >
                    {visibleWatchlist.map((movie, index) => (
                      <MovieCard
                        key={movie.id ? `${movie.id}-${index}` : `${movie.title}-${index}`}
                        movie={movie}
                        onStatusChange={handleStatusChange}
                        onRemove={handleRemove}
                      />
                    ))}
                  </section>
                )}
              </>
            )
          }
        />
        <Route path="ratings" element={<Ratings user={user} />} />
        {/* <Route path="settings" element={<Settings user={user} />} /> */}
        <Route path="recommendations" element={<Recommendations />} />
      </Routes>
    </main>
  );
};

export default UserDashboard;
