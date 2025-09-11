import React, { useState, useCallback, useRef } from 'react'

interface ImageCropModalProps {
  src: string
  onCropComplete: (croppedBlob: Blob) => void
  onCancel: () => void
  aspectRatio?: number
  cropShape?: 'rect' | 'round'
  isUploading?: boolean
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  src,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  cropShape = 'round',
  isUploading = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  
  const handleImageLoad = () => {
    const img = imageRef.current
    if (!img) return
    
    // Calculate the display size of the image
    const containerWidth = 400
    const containerHeight = 400
    const imageAspectRatio = img.naturalWidth / img.naturalHeight
    
    let displayWidth = containerWidth
    let displayHeight = containerHeight
    
    if (imageAspectRatio > 1) {
      displayHeight = containerWidth / imageAspectRatio
    } else {
      displayWidth = containerHeight * imageAspectRatio
    }
    
    setImageSize({ width: displayWidth, height: displayHeight })
    
    // Center the crop area
    const cropSize = Math.min(displayWidth, displayHeight) * 0.6
    setCrop({
      x: (displayWidth - cropSize) / 2,
      y: (displayHeight - cropSize) / 2,
      width: cropSize,
      height: cropSize
    })
    
    setImageLoaded(true)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - crop.x,
      y: e.clientY - crop.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const newX = Math.max(0, Math.min(imageSize.width - crop.width, e.clientX - dragStart.x))
    const newY = Math.max(0, Math.min(imageSize.height - crop.height, e.clientY - dragStart.y))
    
    setCrop(prev => ({
      ...prev,
      x: newX,
      y: newY
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const startMouseX = e.clientX
    const startMouseY = e.clientY
    const startWidth = crop.width
    const startHeight = crop.height
    
    const handleResizeMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startMouseX
      const deltaY = e.clientY - startMouseY
      const delta = Math.max(deltaX, deltaY)
      
      const newSize = Math.max(50, Math.min(
        Math.min(imageSize.width - crop.x, imageSize.height - crop.y),
        startWidth + delta
      ))
      
      setCrop(prev => ({
        ...prev,
        width: newSize,
        height: newSize
      }))
    }
    
    const handleResizeMouseUp = () => {
      document.removeEventListener('mousemove', handleResizeMouseMove)
      document.removeEventListener('mouseup', handleResizeMouseUp)
    }
    
    document.addEventListener('mousemove', handleResizeMouseMove)
    document.addEventListener('mouseup', handleResizeMouseUp)
  }

  const getCroppedImage = useCallback(async () => {
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!image || !canvas) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Set canvas size for output
    const outputSize = 300
    canvas.width = outputSize
    canvas.height = outputSize

    // Calculate scale factor
    const scaleX = image.naturalWidth / imageSize.width
    const scaleY = image.naturalHeight / imageSize.height

    // Clear canvas
    ctx.clearRect(0, 0, outputSize, outputSize)

    if (cropShape === 'round') {
      // Create circular clipping path
      ctx.beginPath()
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    // Draw cropped image
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    )

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png', 0.9)
    })
  }, [crop, imageSize, cropShape])

  const handleCropSubmit = async () => {
    const croppedBlob = await getCroppedImage()
    if (croppedBlob) {
      onCropComplete(croppedBlob)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Crop Your Logo</h3>
        
        <div className="relative mb-6">
          <div 
            className="relative mx-auto border border-gray-300"
            style={{ width: imageSize.width || 400, height: imageSize.height || 400 }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={src}
              alt="Crop preview"
              className="max-w-full max-h-full"
              onLoad={handleImageLoad}
              style={{ width: imageSize.width, height: imageSize.height }}
              draggable={false}
            />
            
            {imageLoaded && (
              <>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                
                {/* Crop area */}
                <div
                  className={`absolute border-2 border-white cursor-move ${
                    cropShape === 'round' ? 'rounded-full' : ''
                  }`}
                  style={{
                    left: crop.x,
                    top: crop.y,
                    width: crop.width,
                    height: crop.height,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {/* Resize handle */}
                  <div
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border border-gray-400 cursor-se-resize"
                    onMouseDown={handleResizeMouseDown}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Drag to move the crop area, drag the handle to resize
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleCropSubmit}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!imageLoaded || isUploading}
            >
              {isUploading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isUploading ? 'Uploading...' : 'Crop & Upload'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default ImageCropModal