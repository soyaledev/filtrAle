import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './ImageUploader.module.css'

const ImageUploader = ({ onImagesUpload, maxFiles = 10 }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Manejar archivos rechazados
    if (rejectedFiles && rejectedFiles.length > 0) {
      const reasons = rejectedFiles.map(f => f.errors.map(e => e.message).join(', ')).join('; ')
      alert(`Algunos archivos no pudieron ser cargados:\n${reasons}`)
    }

    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && 
      (file.type === 'image/jpeg' || file.type === 'image/png')
    )

    if (imageFiles.length === 0) {
      alert('Por favor, sube solo archivos JPG o PNG')
      return
    }

    if (imageFiles.length > maxFiles) {
      alert(`Puedes subir máximo ${maxFiles} imágenes. Has seleccionado ${imageFiles.length}`)
      return
    }

    const imageObjects = imageFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }))

    onImagesUpload(imageObjects)
  }, [onImagesUpload, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  })

  return (
    <div className={styles.imageUploader}>
      <div 
        {...getRootProps()} 
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Área de carga de imágenes"
      >
        <input {...getInputProps()} aria-label="Selector de archivos de imagen" />
        <div className={styles.uploadContent}>
          <div className={styles.uploadIcon} aria-hidden="true">+</div>
          {isDragActive ? (
            <p>Suelta las imágenes aquí...</p>
          ) : (
            <>
              <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
              <p className={styles.uploadHint}>
                Formatos: JPG, PNG | Máximo: {maxFiles} imágenes
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUploader 