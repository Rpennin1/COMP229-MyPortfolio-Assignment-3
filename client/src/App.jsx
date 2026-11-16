
import { HashRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Education from "./pages/Education";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import AdminContacts from "./pages/AdminContacts";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Education />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication pages */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin page */}
          <Route path="/admin/contacts" element={<AdminContacts />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
