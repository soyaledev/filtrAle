import { useState, useEffect } from 'react'
import { applyGradientEffect } from '../utils/imageEffects'

const ImageProcessor = ({ images, gradientIntensity, gradientColor, logoPosition, onImageProcessed, onProcessingStart }) => {
  const [processedImageIds] = useState(new Set())

  useEffect(() => {
    // Solo procesar si hay imágenes
    if (images.length > 0) {
      processedImageIds.clear()

      const processImages = async () => {
        // Convertir color hex a RGB
        const rgb = hexToRgb(gradientColor)
        
        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          
          // Evitar procesar la misma imagen con los mismos parámetros
          const imageKey = `${image.id}-${gradientIntensity}-${gradientColor}-${logoPosition}`
          if (processedImageIds.has(imageKey)) {
            continue
          }

          try {
            // Notificar que se está procesando
            if (onProcessingStart) {
              onProcessingStart(image.id)
            }

            const processedImageData = await applyGradientEffect(
              image.file, 
              gradientIntensity, 
              rgb,
              logoPosition
            )
            onImageProcessed(image, processedImageData)
            processedImageIds.add(imageKey)
          } catch (error) {
            console.error('Error procesando imagen:', error)
          }
        }
      }

      processImages()
    }
  }, [images, gradientIntensity, gradientColor, logoPosition, onImageProcessed, onProcessingStart])

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  // No renderizar nada, el procesamiento es silencioso
  return null
}

export default ImageProcessor 