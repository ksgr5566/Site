import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";

import Navbar from "./components/Navbar";

export default function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="login" element={<Login />} />
          <Route exact path="register" element={<Register />} />
          <Route path="portfolio/:id" element={<Portfolio />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}