import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './ImageUploader.module.css'

const ImageUploader = ({ onImagesUpload, maxFiles = 10, onNotify }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length > 0) {
      const reasons = rejectedFiles
        .map((f) => f.errors.map((e) => e.message).join(', '))
        .join('; ')
      const msg = `Algunos archivos no pudieron cargarse: ${reasons}`
      onNotify ? onNotify(msg, 'error') : alert(msg)
    }

    const imageFiles = acceptedFiles.filter(
      (file) =>
        file.type.startsWith('image/') &&
        (file.type === 'image/jpeg' || file.type === 'image/png')
    )

    if (imageFiles.length === 0) {
      const msg = 'Sube solo archivos JPG o PNG'
      onNotify ? onNotify(msg, 'error') : alert(msg)
      return
    }

    if (imageFiles.length > maxFiles) {
      const msg = `Máximo ${maxFiles} imágenes. Seleccionaste ${imageFiles.length}`
      onNotify ? onNotify(msg, 'error') : alert(msg)
      return
    }

    const imageObjects = imageFiles.map((file) => ({
      file,
      id: Math.random().toString(36).slice(2, 11),
      name: file.name,
      size: file.size,
      type: file.type,
    }))

    onImagesUpload(imageObjects)
  }, [onImagesUpload, maxFiles, onNotify])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  })

  return (
    <div className={styles.imageUploader}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
        aria-label="Área de carga de imágenes. Arrastra o haz clic para seleccionar"
      >
        <input {...getInputProps()} aria-label="Selector de archivos de imagen" />
        <div className={styles.uploadContent}>
          <span className={styles.uploadIcon} aria-hidden="true">
            +
          </span>
          {isDragActive ? (
            <p>Suelta las imágenes aquí…</p>
          ) : (
            <>
              <p>Arrastra y suelta imágenes aquí o haz clic para seleccionar</p>
              <p className={styles.uploadHint}>
                JPG, PNG · Máx. {maxFiles} imágenes
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUploader
