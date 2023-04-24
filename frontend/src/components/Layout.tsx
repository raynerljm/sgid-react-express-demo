import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  const handleSignOut = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
  };

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/protected">Protected message</Link>
        <Link to="/whoami">User info</Link>
        <button onClick={handleSignOut}>Log out</button>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
