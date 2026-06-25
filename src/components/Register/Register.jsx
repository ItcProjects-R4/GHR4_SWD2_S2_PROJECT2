import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { userContext } from "../../context/UserContext";
import { registerUser } from "../../services/LocalStorage";
import styles from "../Auth/Auth.module.css";

export default function Register() {
  let { setLogin } = useContext(userContext);
  let navigate = useNavigate();
  const [apiError, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  function handleRegister(formsData, actions) {
    try {
      const user = registerUser({
        name: formsData.name,
        email: formsData.email,
        password: formsData.password,
      });

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");

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
    initialValues: { 
      name: "", 
      email: "", 
      password: "", 
      confirmPassword: "" 
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authBrand}>
          <i className={`fas fa-podcast ${styles.authBrandIcon}`}></i>
        </div>
        <h2 className={styles.authTitle}>Create Account</h2>
        <p className={styles.authSubtitle}>Join PodCastt and start exploring</p>

        {apiError && (
          <div className={styles.errorAlert}>
            {apiError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <input
              className={`${styles.formInput} ${formik.touched.name && formik.errors.name ? styles.error : ""}`}
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="Enter your full name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className={styles.errorText}>{formik.errors.name}</div>
            )}
          </div>

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
                placeholder="Create a password"
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

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                className={`${styles.formInput} ${formik.touched.confirmPassword && formik.errors.confirmPassword ? styles.error : ""}`}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fas fa-${showConfirmPassword ? "eye-slash" : "eye"}`}></i>
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className={styles.errorText}>{formik.errors.confirmPassword}</div>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={formik.isSubmitting}
          >
            <i className="fas fa-user-plus"></i> Create Account
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.switchLink}>Login</Link>
        </p>
      </div>
    </div>
  );
}