import { useEffect, useRef } from 'react'
import { applyGradientEffect } from '../utils/imageEffects'

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

const ImageProcessor = ({
  images,
  gradientIntensity,
  gradientColor,
  logoPosition,
  onImageProcessed,
  onProcessingStart,
}) => {
  const processedKeysRef = useRef(new Set())

  useEffect(() => {
    if (images.length === 0) return

    processedKeysRef.current = new Set()

    const processImages = async () => {
      const rgb = hexToRgb(gradientColor)

      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const imageKey = `${image.id}-${gradientIntensity}-${gradientColor}-${logoPosition}`

        if (processedKeysRef.current.has(imageKey)) continue

        try {
          onProcessingStart?.(image.id)

          const processedImageData = await applyGradientEffect(
            image.file,
            gradientIntensity,
            rgb,
            logoPosition
          )
          onImageProcessed(image, processedImageData)
          processedKeysRef.current.add(imageKey)
        } catch (error) {
          console.error('Error procesando imagen:', error)
        }
      }
    }

    processImages()
  }, [
    images,
    gradientIntensity,
    gradientColor,
    logoPosition,
    onImageProcessed,
    onProcessingStart,
  ])

  return null
}

export default ImageProcessor
