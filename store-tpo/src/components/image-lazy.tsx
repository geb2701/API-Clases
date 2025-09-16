import React, { useState, useRef, useEffect } from "react";

interface ImageLazyProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const ImageLazy = ({
  src,
  alt,
  className,
  placeholder = "/placeholder.png",
}: ImageLazyProps) => {
  const [imgSrc, setImgSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && !isLoaded) {
      setImgSrc(src);
    }
  }, [isInView, isLoaded, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setImgSrc(placeholder);
    setIsLoaded(true);
  };

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      className={`${className || ""
        } ${!isLoaded ? "opacity-50 blur-sm" : "opacity-100"} transition-all duration-300`}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default ImageLazy;
