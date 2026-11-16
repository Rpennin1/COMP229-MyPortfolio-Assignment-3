
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, signout } = useAuth();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <nav>
      <div className="logo">BP</div>

      <div className="navigation-links">
        <Link to="/">Home</Link>
        <Link to="/about">About Me</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/education">Education</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>

        {user?.role === "admin" && (
          <Link to="/admin/contacts">Admin Contacts</Link>
        )}

        {!user ? (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
