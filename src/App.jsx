import { useState, useCallback } from 'react'
import ImageUploader from './components/ImageUploader'
import ImageProcessor from './components/ImageProcessor'
import ProcessedImages from './components/ProcessedImages'
import { Toast } from './components/Toast'
import { ConfirmModal } from './components/ConfirmModal'
import { cleanupImageUrl } from './utils/imageEffects'
import './App.css'

function App() {
  const [images, setImages] = useState([])
  const [processedImages, setProcessedImages] = useState([])
  const [gradientIntensity, setGradientIntensity] = useState(0.5)
  const [gradientColor, setGradientColor] = useState('#000000')
  const [logoPosition, setLogoPosition] = useState('bottom')
  const [processingImages, setProcessingImages] = useState(() => new Set())
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [toast, setToast] = useState({ message: null, type: 'info' })

  const notify = useCallback((message, type = 'info') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: null }))
  }, [])

  const handleImagesUpload = useCallback((uploadedImages) => {
    setImages((prev) => [...prev, ...uploadedImages])
    setProcessingImages(new Set())
  }, [])

  const handleProcessingStart = useCallback((imageId) => {
    setProcessingImages((prev) => new Set(prev).add(imageId))
  }, [])

  const handleImageProcessed = useCallback((originalImage, processedImageData) => {
    setProcessedImages((prev) => {
      const existingItem = prev.find((item) => item.original.id === originalImage.id)
      if (existingItem) {
        cleanupImageUrl(existingItem.processed)
      }
      const exists = prev.some((item) => item.original.id === originalImage.id)
      if (exists) {
        return prev.map((item) =>
          item.original.id === originalImage.id
            ? { original: originalImage, processed: processedImageData }
            : item
        )
      }
      return [...prev, { original: originalImage, processed: processedImageData }]
    })
    setProcessingImages((prev) => {
      const next = new Set(prev)
      next.delete(originalImage.id)
      return next
    })
  }, [])

  const handleClearAll = useCallback(() => {
    processedImages.forEach((item) => {
      cleanupImageUrl(item.processed)
    })
    setImages([])
    setProcessedImages([])
    setShowClearConfirm(false)
    notify('Imágenes eliminadas', 'info')
  }, [processedImages, notify])

  const requestClearAll = useCallback(() => {
    setShowClearConfirm(true)
  }, [])

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <img
              src="/logo-filtrale.webp"
              alt="Filtrale Logo"
              className="logo-image"
              width={280}
              height={50}
            />
          </div>
        </div>
      </header>

      <main id="main-content" className="app-main" tabIndex={-1}>
        <div className="desktop-layout">
          <div className="main-content">
            <section className="upload-section" aria-labelledby="upload-heading">
              <h2 id="upload-heading" className="visually-hidden">
                Subir imágenes
              </h2>
              <ImageUploader
                onImagesUpload={handleImagesUpload}
                maxFiles={10}
                onNotify={notify}
              />
            </section>

            {processedImages.length > 0 ? (
              <section className="results-section" aria-labelledby="results-heading">
                <h2 id="results-heading" className="visually-hidden">
                  Imágenes procesadas
                </h2>
                <ProcessedImages
                  processedImages={processedImages}
                  processingImages={processingImages}
                  onNotify={notify}
                />
              </section>
            ) : null}
          </div>

          {images.length > 0 ? (
            <aside className="controls-sidebar" aria-labelledby="controls-heading">
              <div className="controls">
                <h3 id="controls-heading" className="controls-title">
                  Personalización
                </h3>

                <div className="intensity-control">
                  <label htmlFor="intensity">Intensidad del degradado</label>
                  <input
                    id="intensity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={gradientIntensity}
                    onChange={(e) => setGradientIntensity(parseFloat(e.target.value))}
                    aria-label={`Intensidad del degradado: ${Math.round(gradientIntensity * 100)}%`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(gradientIntensity * 100)}
                  />
                  <span role="status" aria-live="polite" className="intensity-value">
                    {Math.round(gradientIntensity * 100)}%
                  </span>
                </div>

                <div className="color-control">
                  <label htmlFor="gradientColor">Color del degradado</label>
                  <div className="color-input-wrapper">
                    <input
                      id="gradientColor"
                      type="color"
                      value={gradientColor}
                      onChange={(e) => setGradientColor(e.target.value)}
                      className="color-picker"
                      aria-label={`Color del degradado: ${gradientColor}`}
                    />
                    <span className="color-label" role="status" aria-live="polite">
                      {gradientColor}
                    </span>
                  </div>
                </div>

                <div className="logo-position-control">
                  <label htmlFor="logoPosition">Posición de los logos</label>
                  <select
                    id="logoPosition"
                    value={logoPosition}
                    onChange={(e) => setLogoPosition(e.target.value)}
                    className="logo-select"
                    aria-label="Posición de los logos en la imagen"
                  >
                    <option value="bottom">Abajo</option>
                    <option value="top">Arriba</option>
                    <option value="middle">Centro</option>
                  </select>
                </div>

                <div className="actions-buttons">
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={requestClearAll}
                    title="Limpiar todas las imágenes"
                    aria-label="Limpiar todas las imágenes"
                  >
                    Limpiar Todo
                  </button>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </main>

      <ImageProcessor
        images={images}
        gradientIntensity={gradientIntensity}
        gradientColor={gradientColor}
        logoPosition={logoPosition}
        onImageProcessed={handleImageProcessed}
        onProcessingStart={handleProcessingStart}
      />

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Limpiar todo"
        message="Se eliminarán todas las imágenes subidas y procesadas. Esta acción no se puede deshacer."
        confirmLabel="Limpiar todo"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
      />

      {toast.message ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
        />
      ) : null}

      <footer className="app-footer">
        <p>
          Página creada por{' '}
          <a
            href="https://alekey.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Alekey Desarrollo Web
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
