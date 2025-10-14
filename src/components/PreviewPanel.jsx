import { useState, useEffect } from 'react'
import { applyGradientEffect } from '../utils/imageEffects'
import styles from './PreviewPanel.module.css'

const PreviewPanel = ({ image, gradientIntensity, gradientColor, logoPosition }) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!image) return

    const generatePreview = async () => {
      setIsLoading(true)
      try {
        // Convertir color hex a RGB para el degradado
        const rgb = hexToRgb(gradientColor)
        const url = await applyGradientEffect(
          image.file, 
          gradientIntensity, 
          rgb,
          logoPosition
        )
        
        // Limpiar URL anterior
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
        
        setPreviewUrl(url)
      } catch (error) {
        console.error('Error generando previsualización:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce para evitar demasiadas actualizaciones
    const timeoutId = setTimeout(generatePreview, 300)
    return () => clearTimeout(timeoutId)
  }, [image, gradientIntensity, gradientColor, logoPosition])

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  if (!image) return null

  return (
    <section className={styles.previewSection}>
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <h3>👁️ Vista Previa</h3>
          <span className={styles.previewBadge}>En tiempo real</span>
        </div>
        
        <div className={styles.previewContent}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Generando previsualización...</p>
            </div>
          ) : previewUrl ? (
            <div className={styles.previewImageWrapper}>
              <img 
                src={previewUrl} 
                alt="Vista previa" 
                className={styles.previewImage}
              />
              <div className={styles.previewOverlay}>
                <span className={styles.previewLabel}>Vista previa del efecto</span>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Selecciona una imagen para ver la previsualización</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PreviewPanel

