import React, { useRef, useState, useCallback, useEffect } from 'react'

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface InteractiveCropUploadProps {
  onFileSelect: (cloudinaryUrl: string | null) => void
  error?: string
  maxSize?: number // in MB
}

const InteractiveCropUpload: React.FC<InteractiveCropUploadProps> = ({
  onFileSelect,
  error,
  maxSize = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [cropMode, setCropMode] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string>('')
  
  const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0 })
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 50,
    y: 50,
    width: 200,
    height: 200
  })

  const uploadToBackend = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/profile-photo`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.cloudinaryUrl
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setPreviewUrl(imageUrl)
      setCropMode(true)
    }
    reader.readAsDataURL(file)
  }

  const updateImageSize = useCallback(() => {
    if (imageRef.current && cropMode) {
      const { naturalWidth, naturalHeight, clientWidth, clientHeight } = imageRef.current
      setImageDisplaySize({ width: clientWidth, height: clientHeight })
      
      // Set initial crop area to center of image
      const size = Math.min(clientWidth, clientHeight) * 0.6
      setCropArea({
        x: (clientWidth - size) / 2,
        y: (clientHeight - size) / 2,
        width: size,
        height: size
      })
    }
  }, [cropMode])

  useEffect(() => {
    updateImageSize()
    window.addEventListener('resize', updateImageSize)
    return () => window.removeEventListener('resize', updateImageSize)
  }, [updateImageSize])

  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (action === 'drag') {
      setIsDragging(true)
    } else if (action === 'resize') {
      setIsResizing(true)
      setResizeHandle(handle || '')
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = moveEvent.clientX - rect.left
      const y = moveEvent.clientY - rect.top

      if (action === 'drag') {
        setCropArea(prev => ({
          ...prev,
          x: Math.max(0, Math.min(x - prev.width / 2, imageDisplaySize.width - prev.width)),
          y: Math.max(0, Math.min(y - prev.height / 2, imageDisplaySize.height - prev.height))
        }))
      } else if (action === 'resize') {
        setCropArea(prev => {
          let newArea = { ...prev }
          
          if (handle?.includes('right')) {
            newArea.width = Math.max(50, Math.min(x - prev.x, imageDisplaySize.width - prev.x))
          }
          if (handle?.includes('left')) {
            const newWidth = Math.max(50, prev.x + prev.width - x)
            newArea.x = Math.max(0, prev.x + prev.width - newWidth)
            newArea.width = newWidth
          }
          if (handle?.includes('bottom')) {
            newArea.height = Math.max(50, Math.min(y - prev.y, imageDisplaySize.height - prev.y))
          }
          if (handle?.includes('top')) {
            const newHeight = Math.max(50, prev.y + prev.height - y)
            newArea.y = Math.max(0, prev.y + prev.height - newHeight)
            newArea.height = newHeight
          }
          
          // Keep square aspect ratio
          const size = Math.min(newArea.width, newArea.height)
          newArea.width = size
          newArea.height = size
          
          return newArea
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle('')
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const cropAndUpload = useCallback(async () => {
    if (!selectedFile || !imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    const scaleX = img.naturalWidth / img.clientWidth
    const scaleY = img.naturalHeight / img.clientHeight

    const outputSize = 300
    canvas.width = outputSize
    canvas.height = outputSize

    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    )

    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          setIsUploading(true)
          
          const croppedFile = new File([blob], selectedFile.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          
          const cloudinaryUrl = await uploadToBackend(croppedFile)
          onFileSelect(cloudinaryUrl)
          setCropMode(false)
          
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('Failed to upload image. Please try again.')
        } finally {
          setIsUploading(false)
        }
      }
    }, 'image/jpeg', 0.9)
  }, [selectedFile, cropArea, onFileSelect])

  const cancelCrop = () => {
    setCropMode(false)
    setPreviewUrl('')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removePhoto = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setCropMode(false)
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <canvas ref={canvasRef} className="hidden" />

      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-32 h-32 mx-auto border-2 border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            error ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <svg className={`w-4 h-4 ${error ? 'text-red-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className={`text-xs text-center ${error ? 'text-red-600' : 'text-gray-600'}`}>
            Add Photo
          </span>
        </div>
      ) : (
        <div className="text-center">
          {cropMode ? (
            <div className="space-y-4">
              <div 
                ref={containerRef}
                className="relative inline-block max-w-full"
                style={{ userSelect: 'none' }}
              >
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-80 block"
                  onLoad={updateImageSize}
                  draggable={false}
                />
                
                {/* Crop Overlay */}
                {imageDisplaySize.width > 0 && (
                  <>
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50" />
                    
                    {/* Crop area */}
                    <div
                      className="absolute border-2 border-white bg-transparent cursor-move"
                      style={{
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.width,
                        height: cropArea.height,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'drag')}
                    >
                      {/* Resize handles */}
                      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((handle) => (
                        <div
                          key={handle}
                          className={`absolute w-3 h-3 bg-white border border-gray-400 cursor-${
                            handle.includes('top') ? (handle.includes('left') ? 'nw' : 'ne') : 
                            handle.includes('left') ? 'sw' : 'se'
                          }-resize`}
                          style={{
                            top: handle.includes('top') ? -6 : undefined,
                            bottom: handle.includes('bottom') ? -6 : undefined,
                            left: handle.includes('left') ? -6 : undefined,
                            right: handle.includes('right') ? -6 : undefined,
                          }}
                          onMouseDown={(e) => handleMouseDown(e, 'resize', handle)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={cropAndUpload}
                  disabled={isUploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Crop & Save'}
                </button>
                <button
                  type="button"
                  onClick={cancelCrop}
                  disabled={isUploading}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Drag to reposition • Drag corners to resize
              </p>
            </div>
          ) : (
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-2 border-gray-200">
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
    </div>
  )
}

export default InteractiveCropUpload