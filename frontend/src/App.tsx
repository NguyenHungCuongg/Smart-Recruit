import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Landing } from "./pages/Landing";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
