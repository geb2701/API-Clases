import React, { useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <LazyLoadImage
      src={imgSrc}
      alt={alt}
      effect="blur"
      placeholderSrc={placeholder}
      className={className}
      threshold={300}
      delayTime={300}
      onError={() => setImgSrc(placeholder)}
    />
  );
};

export default ImageLazy;
