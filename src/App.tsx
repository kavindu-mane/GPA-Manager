import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Register } from "./pages";

function App() {
  return (
    <main>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
