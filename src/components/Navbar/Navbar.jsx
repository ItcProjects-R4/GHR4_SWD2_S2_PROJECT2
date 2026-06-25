import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import SearchBar from "./SearchBar/SearchBar";
import { useSearch } from "../../hooks/useSearch";
import { logoutUser } from "../../services/LocalStorage";
import { userContext } from "../../context/UserContext";
import { useAuthModal } from "../../context/AuthModalContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLogin, setLogin } = useContext(userContext);
  const { openAuthModal } = useAuthModal();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useSearch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  function logOut() {
    logoutUser();
    setLogin(null);
    navigate("/");
    closeMenu();
  }

  function requestFavorites() {
    if (isLogin) {
      navigate("/favorites");
    } else {
      openAuthModal("login", "Log in to save and revisit your favorite podcasts.");
    }
    closeMenu();
  }

  function openAuth(mode) {
    openAuthModal(mode);
    closeMenu();
  }

  const renderBrowseLinks = () => (
    <>
      <li className={styles.navItem}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
          onClick={closeMenu}
        >
          <i className="fas fa-home"></i> Home
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to="/categories"
          className={({ isActive }) => (isActive ? styles.active : "")}
          onClick={closeMenu}
        >
          <i className="fas fa-list"></i> Categories
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to="/trending"
          className={({ isActive }) => (isActive ? styles.active : "")}
          onClick={closeMenu}
        >
          <i className="fas fa-fire"></i> Trending
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <button className={styles.navButton} onClick={requestFavorites}>
          <i className="fas fa-heart"></i> Favorites
        </button>
      </li>
    </>
  );

  const renderAccountLinks = () =>
    isLogin ? (
      <>
        <li className={styles.navItem}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={closeMenu}
          >
            <i className="fas fa-chart-line"></i> Dashboard
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <button className={styles.logoutBtn} onClick={logOut}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </li>
      </>
    ) : (
      <>
        <li className={styles.navItem}>
          <button
            className={`${styles.navButton} ${styles.loginBtn}`}
            onClick={() => openAuth("login")}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        </li>
        <li className={styles.navItem}>
          <button
            className={`${styles.navButton} ${styles.registerBtn}`}
            onClick={() => openAuth("register")}
          >
            <i className="fas fa-user-plus"></i> Sign Up
          </button>
        </li>
      </>
    );

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <NavLink to="/" className={styles.brand} onClick={closeMenu}>
          <i className={`fas fa-podcast ${styles.brandIcon}`}></i>
          <span className={styles.brandText}>PodCastt</span>
        </NavLink>

        <SearchBar />

        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`${styles.navMenu} ${styles.desktopMenu}`}>
          {renderBrowseLinks()}
          <li className={styles.navItem}>
            <button
              className={styles.darkModeBtn}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <i className={`fas fa-${darkMode ? "sun" : "moon"} ${styles.darkModeIcon}`}></i>
            </button>
          </li>
          {renderAccountLinks()}
        </ul>

        <ul className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ""}`}>
          {renderBrowseLinks()}
          <li className={styles.navItem}>
            <button
              className={styles.darkModeBtn}
              onClick={() => {
                toggleDarkMode();
                closeMenu();
              }}
              aria-label="Toggle dark mode"
            >
              <i className={`fas fa-${darkMode ? "sun" : "moon"}`}></i>{" "}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </li>
          {renderAccountLinks()}
        </ul>
      </div>
    </nav>
  );
}
