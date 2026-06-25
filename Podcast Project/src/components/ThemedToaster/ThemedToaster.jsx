import toast, { Toaster, ToastBar } from 'react-hot-toast'
import styles from './ThemedToaster.module.css'

export default function ThemedToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerClassName={styles.container}
      toastOptions={{
        duration: 3000,
        className: styles.toast,
        success: {
          className: `${styles.toast} ${styles.success}`,
          iconTheme: {
            primary: 'var(--primary)',
            secondary: '#FFFFFF',
          },
        },
        error: {
          className: `${styles.toast} ${styles.error}`,
          iconTheme: {
            primary: 'var(--accent-red)',
            secondary: '#FFFFFF',
          },
        },
      }}
    >
      {(toastItem) => (
        <ToastBar toast={toastItem}>
          {({ icon, message }) => (
            <div className={styles.content}>
              <span className={styles.icon}>{icon}</span>
              <span className={styles.message}>{message}</span>
              {toastItem.type !== 'loading' && (
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => toast.dismiss(toastItem.id)}
                  aria-label="Dismiss notification"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}
