/**
 * Reads an image file and returns a JPEG data URL no larger than `maxSize` px
 * on its longest side. Phone photos (5–10 MB) become ~200–400 KB, which keeps
 * uploads to WordPress fast and well under server upload limits.
 */
export function resizeImageFile(file, maxSize = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const original = reader.result
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load image'))
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(img.width * scale))
          canvas.height = Math.max(1, Math.round(img.height * scale))
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#ffffff' // transparent PNGs get a white background
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch {
          resolve(original) // fall back to the original file
        }
      }
      img.src = original
    }
    reader.readAsDataURL(file)
  })
}
