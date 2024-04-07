import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Login,
  NotFound,
  Register,
  DashboardMain,
  Results,
  Manage,
} from "./pages";
import axios from "axios";
import { AuthMiddleware } from "./middleware";
import { Toaster } from "./components/ui/toaster";
import { privateRouteType } from "./types";

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  const dashboardElement: privateRouteType = {
    "/": <DashboardMain />,
    "/results": <Results />,
    "/manage": <Manage />,
  };

  return (
    <main>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<AuthMiddleware />}>
            {Object.keys(dashboardElement).map((key) => (
              <Route
                key={key}
                path={key}
                element={<Dashboard>{dashboardElement[key]}</Dashboard>}
              />
            ))}
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </main>
  );
}

export default App;
