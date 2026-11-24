import Auth from "./Pages/Auth";
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import LoadingScreen from "./Pages/LoadingScreen";
import AuthProvider from "./Context/AuthProvider";
import ProtectedRoute from "./Context/ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoadingScreen />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
  /* return (
  <Dashboard />
 ) */
}

export default App;
