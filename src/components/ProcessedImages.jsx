import { useState, useCallback, useEffect } from 'react'
import styles from './ProcessedImages.module.css'

const ProcessedImages = ({
  processedImages,
  processingImages,
  onNotify,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)

  const handleDownload = useCallback(
    async (imageData, index) => {
      const filename = `filtro-foto-${index + 1}.png`
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

      const response = await fetch(imageData.processed)
      const blob = await response.blob()
      const img = new Image()
      img.crossOrigin = 'anonymous'
      const blobUrl = URL.createObjectURL(blob)

      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)

            const triggerDownload = (url, revokeBlobUrl = true) => {
              const link = document.createElement('a')
              link.href = url
              link.download = filename
              document.body.appendChild(link)
              link.click()
              setTimeout(() => {
                document.body.removeChild(link)
                if (revokeBlobUrl) URL.revokeObjectURL(blobUrl)
                resolve()
              }, 100)
            }

            if (isIOS) {
              try {
                const dataUrl = canvas.toDataURL('image/png', 1.0)
                triggerDownload(dataUrl)
              } catch {
                canvas.toBlob(
                  (canvasBlob) => {
                    if (canvasBlob) {
                      const url = URL.createObjectURL(canvasBlob)
                      triggerDownload(url)
                      URL.revokeObjectURL(url)
                    } else reject(new Error('Error generando blob'))
                  },
                  'image/png',
                  1.0
                )
              }
            } else if (isMobile) {
              canvas.toBlob(
                (canvasBlob) => {
                  if (canvasBlob) {
                    const url = URL.createObjectURL(canvasBlob)
                    triggerDownload(url)
                    URL.revokeObjectURL(url)
                  } else reject(new Error('Error generando blob'))
                },
                'image/png',
                1.0
              )
            } else {
              canvas.toBlob(
                (canvasBlob) => {
                  if (canvasBlob) {
                    const url = URL.createObjectURL(canvasBlob)
                    triggerDownload(url)
                    URL.revokeObjectURL(url)
                  } else reject(new Error('Error generando blob'))
                },
                'image/png',
                1.0
              )
            }
          } catch (error) {
            URL.revokeObjectURL(blobUrl)
            reject(error)
          }
        }
        img.onerror = () => {
          URL.revokeObjectURL(blobUrl)
          reject(new Error('Error cargando imagen'))
        }
        img.src = blobUrl
      })
    },
    []
  )

  const notifyError = useCallback(
    (msg) => {
      onNotify ? onNotify(msg, 'error') : alert(msg)
    },
    [onNotify]
  )

  const openModal = useCallback((imageData, index) => {
    setSelectedImage({ ...imageData, index })
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setSelectedImage(null)
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    if (modalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
      }
    }
  }, [modalOpen, closeModal])

  const handleModalDownload = useCallback(async () => {
    if (!selectedImage) return
    try {
      await handleDownload(selectedImage, selectedImage.index)
    } catch {
      notifyError('Error al descargar. Intenta de nuevo.')
    }
  }, [selectedImage, handleDownload, notifyError])

  const handleDownloadAll = useCallback(async () => {
    setIsDownloadingAll(true)
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const delay = isMobile ? 1000 : 300

      for (let i = 0; i < processedImages.length; i++) {
        await handleDownload(processedImages[i], i)
        if (i < processedImages.length - 1) {
          await new Promise((r) => setTimeout(r, delay))
        }
      }
    } catch {
      notifyError(
        'Error al descargar. Intenta descargarlas una por una.'
      )
    } finally {
      setIsDownloadingAll(false)
    }
  }, [processedImages, handleDownload, notifyError])

  const isProcessing = useCallback(
    (imageId) => processingImages?.has(imageId) ?? false,
    [processingImages]
  )

  return (
    <div className={styles.processedImages}>
      <div className={styles.imagesHeader}>
        <h3>
          Imágenes procesadas ({processedImages.length})
        </h3>
        <button
          type="button"
          className={`${styles.downloadAllBtn} ${isDownloadingAll ? styles.downloading : ''}`}
          onClick={handleDownloadAll}
          disabled={isDownloadingAll}
          aria-busy={isDownloadingAll}
          aria-label={isDownloadingAll ? 'Descargando imágenes…' : 'Descargar todas las imágenes'}
        >
          {isDownloadingAll ? 'Descargando…' : 'Descargar Todas'}
        </button>
      </div>

      <div className={styles.imagesGrid} role="list">
        {processedImages.map((imageData, index) => {
          const processing = isProcessing(imageData.original.id)
          return (
            <div
              key={imageData.original.id}
              className={`${styles.imageItem} ${processing ? styles.processing : ''}`}
              role="listitem"
            >
              <button
                type="button"
                className={styles.imageContainer}
                onClick={() => {
                  if (!processing) openModal(imageData, index)
                }}
                disabled={processing}
                aria-label={
                  processing
                    ? `Imagen ${index + 1} procesando…`
                    : `Ver imagen ${index + 1}: ${imageData.original.name}`
                }
              >
                {processing ? (
                  <span className={styles.loadingOverlay}>
                    <span className={styles.spinner} aria-hidden="true" />
                    <span role="status" aria-live="polite">
                      Procesando…
                    </span>
                  </span>
                ) : (
                  <img
                    src={imageData.processed}
                    alt={`Imagen procesada ${index + 1}: ${imageData.original.name}`}
                    className={styles.processedImage}
                    loading="lazy"
                  />
                )}
              </button>
              <p className={styles.imageName}>{imageData.original.name}</p>
            </div>
          )
        })}
      </div>

      {modalOpen && selectedImage ? (
        <div
          className={styles.modalOverlay}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeBtn}
              onClick={closeModal}
              aria-label="Cerrar vista previa"
            >
              ×
            </button>
            <h2 id="modal-title" className="visually-hidden">
              Vista previa imagen {selectedImage.index + 1}
            </h2>
            <div className={styles.modalImageContainer}>
              <img
                src={selectedImage.processed}
                alt={`Vista previa ${selectedImage.index + 1}`}
                className={styles.modalImage}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalDownloadBtn}
                onClick={handleModalDownload}
              >
                Descargar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ProcessedImages
