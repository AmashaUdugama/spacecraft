import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-mark" />
          <span>SpaceCraft</span>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="footer-meta">
          &copy; {new Date().getFullYear()} SpaceCraft
        </div>
      </div>
    </footer>
  );
}