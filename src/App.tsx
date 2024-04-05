import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, Login, NotFound, Register } from "./pages";
import axios from "axios";
import { AuthMiddleware } from "./middleware";

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  return (
    <main>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/" element={<AuthMiddleware />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </main>
  );
}

export default App;
