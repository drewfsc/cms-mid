'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, ZoomIn, ChevronLeft, ChevronRight, RotateCcw, Download } from 'lucide-react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils, useParallaxScroll } from '@/lib/section-styling';

interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

interface DynamicGallerySectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, any>) => void;
}

const DynamicGallerySection: React.FC<DynamicGallerySectionProps> = ({ section, isEditMode = false, onUpdate }) => {
  const { fields, styling } = section;
  const images = (fields.images as GalleryImage[]) || [];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  // Debug lightbox state
  useEffect(() => {
    console.log('Lightbox state changed:', { lightboxOpen, enableLightbox: fields.enableLightbox, imagesLength: images.length });
  }, [lightboxOpen, fields.enableLightbox, images.length]);
  
  // Provide fallback styling if not defined
  const fallbackStyling = {
    backgroundColor: 'gray-50',
    textColor: 'auto' as const,
    padding: 'large' as const
  };
  
  const sectionStyling = styling || fallbackStyling;
  const scrollY = useParallaxScroll(sectionStyling.enableParallax || false);
  const { containerStyle, containerClass, backgroundImageStyle } = SectionStylingUtils.getSectionStyles(sectionStyling);

  const handleFieldChange = (fieldName: string, value: any) => {
    if (onUpdate) {
      onUpdate({ ...fields, [fieldName]: value });
    }
  };

  const handleImageChange = (index: number, field: string, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    handleFieldChange('images', newImages);
  };

  const addImage = () => {
    const newImage: GalleryImage = {
      url: '',
      alt: '',
      caption: ''
    };
    handleFieldChange('images', [...images, newImage]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    handleFieldChange('images', newImages);
  };

  const getGridColumns = () => {
    switch (fields.columns) {
      case '2':
        return 'grid-cols-1 md:grid-cols-2';
      case '4':
        return 'grid-cols-2 md:grid-cols-4';
      case '5':
        return 'grid-cols-2 md:grid-cols-5';
      default:
        return 'grid-cols-1 md:grid-cols-3';
    }
  };

  // Lightbox and Carousel Functions
  const openLightbox = (index: number) => {
    console.log('Opening lightbox:', { enableLightbox: fields.enableLightbox, isEditMode, imagesLength: images.length, index });
    if (fields.enableLightbox !== false && !isEditMode && images.length > 0) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
      setImageScale(1);
      setImageRotation(0);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setImageScale(1);
    setImageRotation(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setImageScale(1);
    setImageRotation(0);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageScale(1);
    setImageRotation(0);
  };

  const resetImageTransform = () => {
    setImageScale(1);
    setImageRotation(0);
  };

  const downloadImage = () => {
    const currentImage = images[currentImageIndex];
    if (currentImage?.url) {
      const link = document.createElement('a');
      link.href = currentImage.url;
      link.download = currentImage.alt || `gallery-image-${currentImageIndex + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'r':
        case 'R':
          resetImageTransform();
          break;
        case 'd':
        case 'D':
          downloadImage();
          break;
        case '+':
        case '=':
          setImageScale(prev => Math.min(prev + 0.2, 3));
          break;
        case '-':
          setImageScale(prev => Math.max(prev - 0.2, 0.5));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  return (
    <section 
      id={section.id}
      className={`relative ${containerClass}`}
      style={containerStyle}
    >
      {/* Background Image with Parallax */}
      {backgroundImageStyle && (
        <div
          className="absolute inset-0"
          style={{
            ...backgroundImageStyle,
            transform: sectionStyling.enableParallax 
              ? SectionStylingUtils.getParallaxTransform(scrollY, true)
              : undefined
          }}
        />
      )}
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(fields.title || fields.description || isEditMode) && (
          <div className="text-center mb-12">
            {(fields.title || isEditMode) && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {isEditMode ? (
                  <input
                    type="text"
                    value={fields.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-blue-400"
                    placeholder="Gallery title"
                  />
                ) : (
                  fields.title
                )}
              </h2>
            )}

            {(fields.description || isEditMode) && (
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {isEditMode ? (
                  <textarea
                    value={fields.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-600 dark:text-gray-400 outline-none focus:border-blue-400"
                    placeholder="Gallery description"
                    rows={3}
                  />
                ) : (
                  fields.description
                )}
              </p>
            )}
          </div>
        )}

        {/* Gallery Carousel */}
        <div className="relative">
          {/* Main Carousel Container */}
          <div className="relative overflow-hidden rounded-lg shadow-neumorphic">
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
              {images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 relative group">
                  {isEditMode && (
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-4 right-4 z-20 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="relative">
                    {image.url ? (
                      <>
                        <img
                          src={image.url}
                          alt={image.alt || 'Gallery image'}
                          className="w-full h-96 md:h-[500px] object-cover cursor-pointer"
                          onClick={() => {
                            console.log('Image clicked:', index);
                            openLightbox(index);
                          }}
                        />
                        {fields.enableLightbox !== false && !isEditMode && (
                          <div 
                            className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                            onClick={() => {
                              console.log('Overlay clicked:', index);
                              openLightbox(index);
                            }}
                          >
                            <ZoomIn className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </>
                    ) : isEditMode ? (
                      <div className="w-full h-96 md:h-[500px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No image</p>
                      </div>
                    ) : null}

                    {image.caption && (fields.showCaptions !== false || isEditMode) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <p className="text-white text-lg font-medium">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={image.caption}
                              onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                              className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                              placeholder="Image caption"
                            />
                          ) : (
                            image.caption
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Navigation Arrows */}
            {images.length > 1 && !isEditMode && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Carousel Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Edit Mode Image Controls */}
          {isEditMode && (
            <div className="mt-6 space-y-4">
              {images.map((image, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Image {index + 1}
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white text-sm"
                      placeholder="Image URL"
                    />
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white text-sm"
                      placeholder="Alt text"
                    />
                  </div>
                </div>
              ))}

              {/* Add Image Button */}
              <button
                onClick={addImage}
                className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-neumorphic hover:shadow-neumorphic-hover rounded-lg flex flex-col items-center justify-center transition-all duration-300 border-0"
              >
                <Plus className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-2" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Add Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Columns per Row
                </label>
                <select
                  value={fields.columns || '3'}
                  onChange={(e) => handleFieldChange('columns', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
                >
                  <option value="2">2 Columns</option>
                  <option value="3">3 Columns</option>
                  <option value="4">4 Columns</option>
                  <option value="5">5 Columns</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={fields.enableLightbox !== false}
                    onChange={(e) => handleFieldChange('enableLightbox', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Lightbox
                  </span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={fields.showCaptions !== false}
                    onChange={(e) => handleFieldChange('showCaptions', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Captions
                  </span>
                </label>
              </div>
            </div>

            {/* Gallery Features Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Gallery Features</h4>
              <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <div>• <strong>Lightbox:</strong> Click images to view full-size with zoom, navigation, and download</div>
                <div>• <strong>Keyboard Controls:</strong> Arrow keys to navigate, +/- to zoom, R to reset, D to download</div>
                <div>• <strong>Thumbnail Strip:</strong> Quick navigation between images</div>
                <div>• <strong>Mouse Controls:</strong> Scroll to zoom, double-click to toggle zoom</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug indicator */}
      {lightboxOpen && (
        <div className="fixed top-4 left-4 bg-red-500 text-white p-2 rounded z-[10000]">
          Lightbox should be open!
        </div>
      )}

      {/* Enhanced Lightbox with Carousel */}
      {lightboxOpen && fields.enableLightbox !== false && images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={closeLightbox}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image Container */}
            <div 
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentImageIndex]?.url}
                alt={images[currentImageIndex]?.alt || 'Gallery image'}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{
                  transform: `scale(${imageScale}) rotate(${imageRotation}deg)`
                }}
                onWheel={(e) => {
                  e.preventDefault();
                  const delta = e.deltaY > 0 ? -0.1 : 0.1;
                  setImageScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
                }}
                onDoubleClick={() => {
                  setImageScale(imageScale === 1 ? 2 : 1);
                }}
              />
            </div>

            {/* Image Info and Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center space-x-4">
                {/* Image Counter */}
                <div className="text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Image Caption */}
                {images[currentImageIndex]?.caption && (
                  <div className="text-sm max-w-md">
                    {images[currentImageIndex].caption}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetImageTransform();
                    }}
                    className="p-2 hover:bg-white/20 rounded transition-colors"
                    title="Reset zoom/rotation (R)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage();
                    }}
                    className="p-2 hover:bg-white/20 rounded transition-colors"
                    title="Download image (D)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto p-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                      setImageScale(1);
                      setImageRotation(0);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-white' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard Shortcuts Help */}
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
              <div className="space-y-1">
                <div><kbd className="bg-white/20 px-1 rounded">←</kbd> <kbd className="bg-white/20 px-1 rounded">→</kbd> Navigate</div>
                <div><kbd className="bg-white/20 px-1 rounded">+</kbd> <kbd className="bg-white/20 px-1 rounded">-</kbd> Zoom</div>
                <div><kbd className="bg-white/20 px-1 rounded">R</kbd> Reset</div>
                <div><kbd className="bg-white/20 px-1 rounded">D</kbd> Download</div>
                <div><kbd className="bg-white/20 px-1 rounded">Esc</kbd> Close</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DynamicGallerySection;
