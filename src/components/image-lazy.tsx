import React, { useState, useEffect } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface ImageLazyProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const ImageLazy = ({
  src,
  alt,
  className,
  placeholder = "/placeholder.png",
  onError,
}: ImageLazyProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('ImageLazy: Error loading image', {
      src,
      placeholder,
      error: e.type
    });
    setImgSrc(placeholder);
    if (onError) {
      onError(e);
    }
  };

  useEffect(() => {
    if (src && src.trim() !== '') {
      console.log('ImageLazy: Setting image src to:', src);
    } else {
      console.warn('ImageLazy: Empty or invalid src provided:', src);
    }
  }, [src]);

  if (!src || src.trim() === '') {
    console.warn('ImageLazy: Rendering placeholder because src is empty');
    return (
      <img
        src={placeholder}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <LazyLoadImage
      src={imgSrc}
      alt={alt}
      effect="blur"
      placeholderSrc={placeholder}
      className={className}
      threshold={300}
      delayTime={300}
      onError={handleError}
    />
  );
};

export default ImageLazy;
