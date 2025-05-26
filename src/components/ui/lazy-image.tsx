import React, { useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string;
  fallbackSrc?: string;
}

export function LazyImage({
  src,
  alt,
  className,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  fallbackSrc,
  ...props
}: LazyImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(ref, { rootMargin: '200px' });
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  const imageSrc = error && fallbackSrc ? fallbackSrc : (isVisible ? src : placeholderSrc);

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}