import { forwardRef } from "react";

interface PolaroidCardProps {
  id?: number;
  localUrl: string;
  fallbackUrl?: string;
  caption: string;
  date: string;
  className?: string;
  aspectRatioClass?: string; // e.g., "aspect-4/3" or "aspect-[8.9/12.7]"
  onClick?: () => void;
  style?: React.CSSProperties;
  variant?: "gallery" | "hero";
}

const PolaroidCard = forwardRef<HTMLDivElement, PolaroidCardProps>(
  (
    {
      id,
      localUrl,
      fallbackUrl,
      caption,
      date,
      className = "",
      aspectRatioClass = "aspect-4/3",
      onClick,
      style,
      variant = "gallery",
    },
    ref
  ) => {
    const isHero = variant === "hero";
    const paddingClass = isHero ? "p-4 pb-8" : "p-4 pb-6";

    // Gabungkan kelas dasar polaroid card (sudut tajam/rounded-sm khas polaroid fisik)
    const cardClasses = `polaroid-card bg-surface border border-accent/20 flex flex-col justify-between h-fit transition-spring duration-500 shadow-elevation-2 rounded-[2px] ${
      onClick ? "focus-ring cursor-pointer" : ""
    } ${paddingClass} ${className}`;

    // Handler keyboard untuk aksesibilitas (R8.3)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        ref={ref}
        className={cardClasses}
        style={style}
        onClick={onClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? "button" : undefined}
        aria-label={onClick ? `Buka foto: ${caption}` : undefined}
      >
        {/* Gambar Polaroid (sudut siku tajam khas polaroid) */}
        <div className={`relative ${aspectRatioClass} w-full overflow-hidden bg-background rounded-none mb-4 border border-accent/15`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={localUrl}
            alt={caption}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-500 filter-[grayscale(10%)] hover:filter-[grayscale(0%)]"
            onError={(e) => {
              const img = e.currentTarget;
              if (fallbackUrl && img.src !== fallbackUrl) {
                img.src = fallbackUrl;
              }
            }}
          />
        </div>

        {/* Footer Polaroid */}
        {isHero ? (
          <div className="text-center px-1">
            <p className="font-cursive text-2xl text-foreground/90 leading-tight">
              {caption}
            </p>
            <span className="font-mono text-[9px] text-foreground/40 uppercase tracking-widest block mt-3">
              {date}
            </span>
          </div>
        ) : (
          <div className="px-1 flex flex-col gap-2">
            <p className="font-cursive text-2xl text-foreground/90 leading-tight">
              {caption}
            </p>
            <div className="flex justify-between items-center border-t border-accent/20 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/60">
                {date}
              </span>
              <span className="font-mono text-[9px] text-foreground/40 uppercase tracking-widest">
                {id ? `No. 00${id}` : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PolaroidCard.displayName = "PolaroidCard";

export default PolaroidCard;
