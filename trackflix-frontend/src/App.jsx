import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
//import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex-grow flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header isLoggedIn={!!user} user={user} />

      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-32 text-gray-300">Loading...</div>
          }
        >
          <Outlet context={{ user }} />
        </Suspense>
      </main>

      <Footer />

      
     
    </div>
  );
}

export default App;
