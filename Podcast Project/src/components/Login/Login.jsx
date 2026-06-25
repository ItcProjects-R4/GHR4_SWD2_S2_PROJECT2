import { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { userContext } from "../../context/UserContext";
import { loginUser } from "../../services/LocalStorage";
import styles from "../Auth/Auth.module.css";

export default function Login() {
  let { setLogin } = useContext(userContext);
  let navigate = useNavigate();
  const [apiError, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    // Check if remember me was previously checked
    return localStorage.getItem("rememberMe") === "true";
  });

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail && rememberMe) {
      formik.setFieldValue("email", savedEmail);
    }
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  function handleLogin(formsData, actions) {
    try {
      const user = loginUser(formsData);

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", formsData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }

      setLogin(user);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      if (actions && actions.setSubmitting) {
        actions.setSubmitting(false);
      }
    }
  }

  let formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authBrand}>
          <i className={`fas fa-podcast ${styles.authBrandIcon}`}></i>
        </div>
        <h2 className={styles.authTitle}>Welcome Back</h2>
        <p className={styles.authSubtitle}>Sign in to continue to PodCastt</p>

        {apiError && (
          <div className={styles.errorAlert}>
            {apiError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              className={`${styles.formInput} ${formik.touched.email && formik.errors.email ? styles.error : ""}`}
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className={styles.errorText}>{formik.errors.email}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                className={`${styles.formInput} ${formik.touched.password && formik.errors.password ? styles.error : ""}`}
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas fa-${showPassword ? "eye-slash" : "eye"}`}></i>
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className={styles.errorText}>{formik.errors.password}</div>
            )}
          </div>

          <div className={styles.rememberMe}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={formik.isSubmitting}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.switchLink}>Register Now</Link>
        </p>
      </div>
    </div>
  );
}