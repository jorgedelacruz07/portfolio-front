import type { ImgHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type OptimizedImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "fetchPriority"
> & {
  src: string;
  alt: string;
  avifSrc?: string;
  fetchPriority?: "high" | "low" | "auto";
};

export const OptimizedImage = ({
  src,
  alt,
  avifSrc,
  className,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  ...props
}: OptimizedImageProps) => {
  const imageElement = (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchpriority={fetchPriority}
      className={twMerge(clsx(className))}
      {...props}
    />
  );

  if (avifSrc) {
    return (
      <picture className="contents">
        <source srcSet={avifSrc} type="image/avif" />
        {imageElement}
      </picture>
    );
  }

  return imageElement;
};
