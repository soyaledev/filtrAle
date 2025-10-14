// Función para aplicar el efecto de degradado y logos
export const applyGradientEffect = async (imageFile, gradientIntensity, gradientColor = { r: 0, g: 0, b: 0 }, logoPosition = 'bottom') => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Configurar el canvas con las dimensiones de la imagen
      canvas.width = img.width
      canvas.height = img.height

      // Dibujar la imagen original
      ctx.drawImage(img, 0, 0)

      // Crear el degradado con el color especificado
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height * 0.4)
      gradient.addColorStop(0, `rgba(${gradientColor.r}, ${gradientColor.g}, ${gradientColor.b}, ${gradientIntensity})`)
      gradient.addColorStop(1, `rgba(${gradientColor.r}, ${gradientColor.g}, ${gradientColor.b}, 0)`)

      // Aplicar el degradado
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Agregar los logos en la posición especificada
      addLogo(ctx, canvas.width, canvas.height, logoPosition).then(() => {
        // Convertir el canvas a blob
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          resolve(url)
        }, 'image/png', 1.0)
      })
    }

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'))
    }

    img.src = URL.createObjectURL(imageFile)
  })
}

// Función para agregar los dos logos con posiciones configurables
const addLogo = (ctx, canvasWidth, canvasHeight, position = 'bottom') => {
  return new Promise((resolve) => {
    let logosLoaded = 0
    const totalLogos = 2
    
    const checkAllLogosLoaded = () => {
      logosLoaded++
      if (logosLoaded === totalLogos) {
        resolve()
      }
    }
    
    // Calcular posición Y según la configuración
    let yPosition = 0
    const margin = canvasHeight * 0.05 // Reducido de 0.1 a 0.05 (de 10% a 5%)
    
    switch(position) {
      case 'top':
        yPosition = margin
        break
      case 'middle':
        yPosition = (canvasHeight / 2) - (Math.min(canvasWidth, canvasHeight) * 0.12)
        break
      case 'bottom':
      default:
        yPosition = canvasHeight - margin - (Math.min(canvasWidth, canvasHeight) * 0.12)
        break
    }
    
    // Logo 1: fes.svg - Esquina izquierda
    const logoLeft = new Image()
    logoLeft.onload = () => {
      // Tamaño relativo al tamaño de la imagen (para que se vea consistente)
      const logoSize = Math.min(canvasWidth, canvasHeight) * 0.24
      const logoAspectRatio = logoLeft.width / logoLeft.height
      const logoWidth = logoSize
      const logoHeight = logoSize / logoAspectRatio
      
      // Posición relativa: 10% desde la izquierda
      const marginLeft = canvasWidth * 0.1
      const x = marginLeft
      const y = yPosition
      
      // Dibujar logo izquierdo (sin fondo)
      ctx.drawImage(logoLeft, x, y, logoWidth, logoHeight)
      
      checkAllLogosLoaded()
    }
    
    logoLeft.onerror = () => {
      // Fallback para logo izquierdo
      const logoText = 'FES'
      const logoSize = Math.min(canvasWidth, canvasHeight) * 0.07
      
      ctx.font = `bold ${logoSize}px Arial`
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.lineWidth = 2
      
      const marginLeft = canvasWidth * 0.1
      const x = marginLeft
      const y = yPosition + logoSize
      
      ctx.strokeText(logoText, x, y)
      ctx.fillText(logoText, x, y)
      
      checkAllLogosLoaded()
    }
    
    // Logo 2: www.svg - Esquina derecha
    const logoRight = new Image()
    logoRight.onload = () => {
      // Tamaño relativo al tamaño de la imagen (para que se vea consistente)
      const logoSize = Math.min(canvasWidth, canvasHeight) * 0.19
      const logoAspectRatio = logoRight.width / logoRight.height
      const logoWidth = logoSize
      const logoHeight = logoSize / logoAspectRatio
      
      // Posición relativa: 10% desde la derecha
      const marginRight = canvasWidth * 0.1
      const x = canvasWidth - marginRight - logoWidth
      const y = yPosition
      
      // Dibujar logo derecho (sin fondo)
      ctx.drawImage(logoRight, x, y, logoWidth, logoHeight)
      
      checkAllLogosLoaded()
    }
    
    logoRight.onerror = () => {
      // Fallback para logo derecho
      const logoText = 'WWW'
      const logoSize = Math.min(canvasWidth, canvasHeight) * 0.19
      
      ctx.font = `bold ${logoSize}px Arial`
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.lineWidth = 2
      
      const marginRight = canvasWidth * 0.1
      const textWidth = ctx.measureText(logoText).width
      const x = canvasWidth - marginRight - textWidth
      const y = yPosition + logoSize
      
      ctx.strokeText(logoText, x, y)
      ctx.fillText(logoText, x, y)
      
      checkAllLogosLoaded()
    }
    
    // Cargar ambos logos
    logoLeft.src = '/fes.svg'     // Logo FES en la izquierda
    logoRight.src = '/www.svg'    // Logo WWW en la derecha
  })
}

// Función para limpiar URLs de objetos creados
export const cleanupImageUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
} 