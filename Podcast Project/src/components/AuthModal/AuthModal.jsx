import { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { userContext } from '../../context/UserContext'
import { useAuthModal } from '../../context/AuthModalContext'
import { loginUser, registerUser } from '../../services/LocalStorage'
import authStyles from '../Auth/Auth.module.css'
import styles from './AuthModal.module.css'

export default function AuthModal() {
  const { setLogin } = useContext(userContext)
  const { isOpen, mode, reason, closeAuthModal, switchAuthMode } = useAuthModal()
  const [apiError, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const isRegister = mode === 'register'

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeAuthModal()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeAuthModal])

  const validationSchema = Yup.object(
    isRegister
      ? {
          name: Yup.string()
            .min(2, 'Name must be at least 2 characters')
            .required('Name is required'),
          email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
        }
      : {
          email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        }
  )

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (formsData, actions) => {
      try {
        const user = isRegister
          ? registerUser({
              name: formsData.name,
              email: formsData.email,
              password: formsData.password,
            })
          : loginUser({
              email: formsData.email,
              password: formsData.password,
            })

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('isLoggedIn', 'true')
        setLogin(user)
        closeAuthModal()
      } catch (error) {
        setError(error.message)
      } finally {
        actions.setSubmitting(false)
      }
    },
  })

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onMouseDown={closeAuthModal}
    >
      <div className={styles.modal} onMouseDown={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closeAuthModal}
          aria-label="Close sign in dialog"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className={authStyles.authBrand}>
          <i className={`fas fa-podcast ${authStyles.authBrandIcon}`}></i>
        </div>
        <h2 id="auth-modal-title" className={authStyles.authTitle}>
          {isRegister ? 'Create your account' : 'Log in to continue'}
        </h2>
        <p className={authStyles.authSubtitle}>
          {reason || 'Save shows, build your library, and keep listening across visits.'}
        </p>

        <div className={styles.segmented} aria-label="Choose authentication mode">
          <button
            type="button"
            className={!isRegister ? styles.activeSegment : ''}
            onClick={() => {
              setError('')
              setShowPassword(false)
              setShowConfirmPassword(false)
              switchAuthMode('login')
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={isRegister ? styles.activeSegment : ''}
            onClick={() => {
              setError('')
              setShowPassword(false)
              setShowConfirmPassword(false)
              switchAuthMode('register')
            }}
          >
            Sign Up
          </button>
        </div>

        {apiError && <div className={authStyles.errorAlert}>{apiError}</div>}

        <form onSubmit={formik.handleSubmit}>
          {isRegister && (
            <div className={authStyles.formGroup}>
              <label className={authStyles.formLabel}>Full Name</label>
              <input
                className={`${authStyles.formInput} ${
                  formik.touched.name && formik.errors.name ? authStyles.error : ''
                }`}
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="Enter your full name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className={authStyles.errorText}>{formik.errors.name}</div>
              )}
            </div>
          )}

          <div className={authStyles.formGroup}>
            <label className={authStyles.formLabel}>Email</label>
            <input
              className={`${authStyles.formInput} ${
                formik.touched.email && formik.errors.email ? authStyles.error : ''
              }`}
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className={authStyles.errorText}>{formik.errors.email}</div>
            )}
          </div>

          <div className={authStyles.formGroup}>
            <label className={authStyles.formLabel}>Password</label>
            <div className={authStyles.passwordWrapper}>
              <input
                className={`${authStyles.formInput} ${
                  formik.touched.password && formik.errors.password ? authStyles.error : ''
                }`}
                name="password"
                type={showPassword ? 'text' : 'password'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder={isRegister ? 'Create a password' : 'Enter your password'}
              />
              <button
                type="button"
                className={authStyles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className={authStyles.errorText}>{formik.errors.password}</div>
            )}
          </div>

          {isRegister && (
            <div className={authStyles.formGroup}>
              <label className={authStyles.formLabel}>Confirm Password</label>
              <div className={authStyles.passwordWrapper}>
                <input
                  className={`${authStyles.formInput} ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? authStyles.error
                      : ''
                  }`}
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className={authStyles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className={authStyles.errorText}>{formik.errors.confirmPassword}</div>
              )}
            </div>
          )}

          <button
            type="submit"
            className={authStyles.submitBtn}
            disabled={formik.isSubmitting}
          >
            <i className={`fas fa-${isRegister ? 'user-plus' : 'sign-in-alt'}`}></i>
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
