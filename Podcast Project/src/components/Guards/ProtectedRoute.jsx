import { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../../context/UserContext";
import { useAuthModal } from "../../context/AuthModalContext";

export default function ProtectedRoute({ children }) {
  let { isLogin } = useContext(userContext);
  const { openAuthModal } = useAuthModal();

  if (!isLogin) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        textAlign: 'center',
      }}>
        <div style={{
          width: 'min(100%, 520px)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2.5rem',
        }}>
          <i className="fas fa-lock" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
          <h1 style={{ color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.75rem' }}>Login required</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Your library is private. Log in or create an account to view saved podcasts.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login', 'Log in to view and manage your saved podcasts.')}
            style={{
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              color: 'white',
              fontWeight: 700,
              padding: '0.9rem 1.35rem',
              cursor: 'pointer',
              marginRight: '0.75rem',
            }}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
          <Link to="/categories" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Browse podcasts
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
