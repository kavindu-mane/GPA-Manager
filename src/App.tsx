import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, Login, NotFound, Register } from "./pages";
import axios from "axios";
import { AuthMiddleware } from "./middleware";
import { Toaster } from "./components/ui/toaster";

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  return (
    <main>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<AuthMiddleware />}>
            <Route index element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </main>
  );
}

export default App;
