import { Gift } from 'lucide-react';
import { useState } from 'react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function ProductImage({ src, alt, className = '', fallbackClassName = '' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--wedding-beige)] text-center text-[var(--wedding-text-light)] ${fallbackClassName}`}
        role="img"
        aria-label={alt}
      >
        <Gift className="h-10 w-10 text-[var(--wedding-gold)]" />
        <span className="px-4 text-sm">Presente simbolico</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
}
