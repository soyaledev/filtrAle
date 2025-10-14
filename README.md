# 🎨 FiltroFoto - Aplicador de Filtros para Imágenes

Una aplicación web moderna y elegante para aplicar filtros de degradado y logos a tus imágenes de manera rápida y sencilla.

## ✨ Características Principales

### 🎯 Funcionalidades Core

- **Subida múltiple de imágenes**: Procesa hasta 10 imágenes a la vez
- **Vista previa en tiempo real**: Visualiza el efecto antes de procesar
- **Procesamiento automático**: Las imágenes se procesan automáticamente al subirlas
- **Descarga individual o masiva**: Descarga imágenes una por una o todas a la vez

### 🎨 Personalización Avanzada

- **Intensidad del degradado**: Ajusta la opacidad del degradado (0-100%)
- **Color personalizable**: Elige cualquier color para el degradado
- **Posición de logos**: Coloca los logos en la parte superior, centro o inferior
- **Efectos en tiempo real**: Los cambios se reflejan instantáneamente en la vista previa

### 💎 Mejoras Implementadas

#### 1. **Vista Previa en Tiempo Real** 👁️

- Panel de previsualización que muestra el efecto antes de procesar
- Actualización automática al cambiar cualquier parámetro
- Indicador visual de "En tiempo real"

#### 2. **Personalización Avanzada** 🎨

- Selector de color para el degradado
- Control de intensidad del degradado (0-100%)
- Selector de posición para los logos (arriba, centro, abajo)
- Botón para limpiar todas las imágenes

#### 3. **Mejor Gestión de Memoria** 🧹

- Limpieza automática de URLs de objetos blob
- Prevención de memory leaks
- Optimización del rendimiento

#### 4. **UI/UX Mejorada** ✨

- Diseño moderno con gradientes y animaciones suaves
- Responsive design optimizado para móviles y tablets
- Efectos hover y transiciones elegantes
- Feedback visual mejorado

#### 5. **Manejo de Errores Robusto** 🛡️

- Validación de archivos
- Mensajes de error claros
- Fallbacks para logos no disponibles
- Try-catch en operaciones críticas

## 🚀 Tecnologías Utilizadas

- **React 19**: Framework principal
- **Vite**: Build tool y dev server
- **Canvas API**: Procesamiento de imágenes
- **React Dropzone**: Subida de archivos
- **CSS Modules**: Estilos modulares
- **Google Fonts**: Tipografías (Poppins, Inter)

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de la build
npm run preview
```

## 🎯 Uso

1. **Subir imágenes**: Arrastra y suelta o haz clic para seleccionar imágenes (JPG/PNG)
2. **Personalizar**: Ajusta la intensidad, color y posición de los logos
3. **Vista previa**: Observa el resultado en tiempo real
4. **Procesar**: Las imágenes se procesan automáticamente
5. **Descargar**: Descarga las imágenes procesadas individual o masivamente

## 🎨 Personalización

### Colores del Tema

Los colores están definidos en `src/index.css`:

```css
--primary: #6366f1;
--secondary: #ec4899;
--dark: #0f172a;
--darker: #020617;
```

### Posiciones de Logos

- `top`: Logos en la parte superior
- `middle`: Logos en el centro
- `bottom`: Logos en la parte inferior (predeterminado)

## 📱 Responsive Design

La aplicación está completamente optimizada para:

- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🔧 Estructura del Proyecto

```
src/
├── components/
│   ├── ImageProcessor.jsx      # Componente de procesamiento
│   ├── ImageUploader.jsx       # Componente de subida
│   ├── ProcessedImages.jsx     # Componente de resultados
│   └── PreviewPanel.jsx        # Componente de vista previa
├── utils/
│   └── imageEffects.js         # Funciones de efectos
├── App.jsx                     # Componente principal
└── index.css                   # Estilos globales
```

## 🌟 Características Técnicas

### Optimizaciones

- **Debounce en previsualización**: Evita procesamiento excesivo
- **Limpieza de memoria**: Revocación de URLs de blob
- **Procesamiento asíncrono**: No bloquea la UI
- **Lazy loading**: Carga bajo demanda

### Accesibilidad

- Etiquetas ARIA apropiadas
- Navegación por teclado
- Contraste de colores adecuado
- Textos alternativos en imágenes

## 🐛 Solución de Problemas

### Las imágenes no se procesan

- Verifica que los archivos sean JPG o PNG
- Comprueba la consola del navegador para errores
- Asegúrate de que los logos SVG estén en `/public`

### Problemas de memoria

- La aplicación limpia automáticamente las URLs
- Si persiste, recarga la página

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado por **Alekey Desarrollo Web**

- 🌐 [aleke.com.ar](https://aleke.com.ar)

## 🙏 Agradecimientos

- React Team por el excelente framework
- Comunidad open source
- Todos los contribuidores

---

**Versión**: 2.0.0  
**Última actualización**: 2024
