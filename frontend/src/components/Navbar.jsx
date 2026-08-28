// // import { Link, useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";

// // export default function Navbar() {
// //   const { token, user, logout } = useAuth();
// //   const navigate = useNavigate();

// //   function handleLogout() {
// //     logout();
// //     navigate("/login");
// //   }

// //   return (
// //     <nav className="navbar">
// //       <Link to="/" className="navbar-brand">SpaceCraft</Link>
// //       <div className="navbar-links">
// //         {token ? (
// //           <>
// //             <Link to="/upload">Upload</Link>
// //             <Link to="/history">History</Link>
// //             <span className="navbar-user">{user?.full_name || user?.email}</span>
// //             <button onClick={handleLogout} className="btn-link">Logout</button>
// //           </>
// //         ) : (
// //           <>
// //             <Link to="/login">Login</Link>
// //             <Link to="/register">Register</Link>
// //           </>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // }
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { token, user, logout } = useAuth();
//   const navigate = useNavigate();

//   function handleLogout() {
//     logout();
//     navigate("/login");
//   }

//   return (
//     <nav className="navbar">
//       <Link to="/" className="navbar-brand">SpaceCraft</Link>
//       <div className="navbar-links">
//         {token ? (
//           <>
//             <NavLink to="/upload" className={({ isActive }) => (isActive ? "nav-active" : "")}>Upload</NavLink>
//             <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-active" : "")}>Dashboard</NavLink>
//             <NavLink to="/history" className={({ isActive }) => (isActive ? "nav-active" : "")}>History</NavLink>
//             <span className="navbar-user">{user?.full_name || user?.email}</span>
//             <button onClick={handleLogout} className="btn-link">Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/register">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">SpaceCraft</Link>
      <div className="navbar-links">
        {token ? (
          <>
            <NavLink to="/upload" className={({ isActive }) => (isActive ? "nav-active" : "")}>Upload</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-active" : "")}>Dashboard</NavLink>
            <NavLink to="/history" className={({ isActive }) => (isActive ? "nav-active" : "")}>History</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-active" : "")}>About</NavLink>
            <span className="navbar-user">{user?.full_name || user?.email}</span>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-active" : "")}>About</NavLink>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}