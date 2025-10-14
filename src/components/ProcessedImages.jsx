import { useState } from 'react'
import styles from './ProcessedImages.module.css'

const ProcessedImages = ({ processedImages, onDownloadAll, isDownloading, processingImages }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleDownload = (imageData, index) => {
    const link = document.createElement('a')
    link.download = `filtro-foto-${index + 1}.png`
    link.href = imageData.processed

    // Agregar al DOM temporalmente para mejor compatibilidad
    document.body.appendChild(link)
    link.click()

    // Remover del DOM
    document.body.removeChild(link)
  }

  const openModal = (imageData, index) => {
    setSelectedImage({ ...imageData, index })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
  }

  const handleModalDownload = () => {
    if (selectedImage) {
      handleDownload(selectedImage, selectedImage.index)
    }
  }

  const isProcessing = (imageId) => {
    return processingImages && processingImages.has(imageId)
  }

  return (
    <div className={styles.processedImages}>
      <div className={styles.imagesHeader}>
        <h3>Imágenes Procesadas ({processedImages.length})</h3>
        <button 
          className={`${styles.downloadAllBtn} ${isDownloading ? styles.downloading : ''}`} 
          onClick={onDownloadAll}
          disabled={isDownloading}
        >
          {isDownloading ? 'Descargando...' : 'Descargar Todas'}
        </button>
      </div>
      
      <div className={styles.imagesGrid}>
        {processedImages.map((imageData, index) => {
          const processing = isProcessing(imageData.original.id)
          return (
            <div key={index} className={`${styles.imageItem} ${processing ? styles.processing : ''}`}>
              <div 
                className={styles.imageContainer}
                onClick={() => {
                  if (!processing) {
                    openModal(imageData, index)
                  }
                }}
                style={{ cursor: processing ? 'default' : 'pointer' }}
              >
                {processing ? (
                  <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Procesando...</p>
                  </div>
                ) : (
                  <img
                    src={imageData.processed}
                    alt={`Imagen procesada ${index + 1}`}
                    className={styles.processedImage}
                  />
                )}
              </div>
              <p className={styles.imageName}>{imageData.original.name}</p>
            </div>
          )
        })}
      </div>

      {/* Modal de vista previa */}
      {modalOpen && selectedImage && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>×</button>
            <div className={styles.modalImageContainer}>
              <img
                src={selectedImage.processed}
                alt={`Vista previa ${selectedImage.index + 1}`}
                className={styles.modalImage}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalDownloadBtn}
                onClick={handleModalDownload}
              >
                Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessedImages 