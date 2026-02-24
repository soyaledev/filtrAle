import { useEffect } from 'react'
import styles from './Toast.module.css'

/**
 * Toast de notificación con aria-live para accesibilidad.
 * Reemplaza alert() para feedback no bloqueante.
 */
export function Toast({ message, type = 'info', onDismiss, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0 && onDismiss) {
      const t = setTimeout(onDismiss, duration)
      return () => clearTimeout(t)
    }
  }, [duration, onDismiss])

  if (!message) return null

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={styles.message}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onDismiss}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      )}
    </div>
  )
}
