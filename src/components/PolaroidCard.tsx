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

interface StickerItem {
  src: string;
  className: string;
}

const getStickers = (id?: number): StickerItem[] => {
  if (!id) return [];
  const mod = id % 5;
  if (mod === 1) {
    return [
      {
        src: "/assets/hibiscus_flower/leaf_2.svg",
        className: "absolute -top-6 -right-6 w-20 h-auto rotate-45 z-20 pointer-events-none",
      },
      {
        src: "/assets/hibiscus_flower/flower_medium_3.svg",
        className: "absolute -top-10 right-4 w-14 h-auto -rotate-12 z-20 pointer-events-none",
      },
      {
        src: "/assets/hibiscus_flower/petal_2.svg",
        className: "absolute bottom-3 right-3 w-9 h-auto rotate-45 z-20 pointer-events-none",
      }
    ];
  }
  if (mod === 2) {
    return [
      {
        src: "/assets/hibiscus_flower/leaf_3.svg",
        className: "absolute -bottom-4 -left-10 w-16 h-auto rotate-45 z-10 pointer-events-none",
      },
      {
        src: "/assets/hibiscus_flower/flower_medium_3.svg",
        className: "absolute -bottom-8 -left-6 w-20 h-auto -rotate-12 z-20 pointer-events-none",
      },
      {
        src: "/assets/hibiscus_flower/petal_5.svg",
        className: "absolute bottom-6 left-2 w-9 h-auto -rotate-12 z-20 pointer-events-none",
      }
    ];
  }
  if (mod === 3) {
    return [
      {
        src: "/assets/hibiscus_flower/petal_3.svg",
        className: "absolute -top-5 -left-5 w-16 h-auto rotate-12 z-20 pointer-events-none",
      },
      {
        src: "/assets/hibiscus_flower/petal_1.svg",
        className: "absolute -top-8 left-5 w-12 h-auto -rotate-45 z-20 pointer-events-none",
      },
      {
        src: "/assets/hibiscus_flower/petal_4.svg",
        className: "absolute bottom-3 right-4 w-8 h-auto rotate-45 z-20 pointer-events-none",
      }
    ];
  }
  if (mod === 4) {
    return [
      {
        src: "/assets/hibiscus_flower/leaf_3.svg",
        className: "absolute -bottom-5 -right-5 w-18 h-auto -rotate-45 z-20 pointer-events-none",
      },
      {
        src: "/assets/hibiscus_flower/flower_medium_1.svg",
        className: "absolute -bottom-10 right-5 w-16 h-auto rotate-12 z-20 pointer-events-none",
      },
      {
        src: "/assets/hibiscus_flower/petal_5.svg",
        className: "absolute bottom-6 left-2 w-9 h-auto -rotate-12 z-20 pointer-events-none",
      }
    ];
  }
  return [
    {
      src: "/assets/hibiscus_flower/leaf_1.svg",
      className: "absolute -top-10 right-4 w-16 h-auto -rotate-12 z-10 pointer-events-none",
    },
    {
      src: "/assets/hibiscus_flower/flower_medium_2.svg",
      className: "absolute -top-6 -right-6 w-20 h-auto rotate-[30deg] z-20 pointer-events-none",
    },
    {
      src: "/assets/hibiscus_flower/petal_2.svg",
      className: "absolute bottom-3 right-3 w-9 h-auto rotate-45 z-20 pointer-events-none",
    }
  ];
};

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
    const cardClasses = `polaroid-card relative bg-surface border border-accent/20 flex flex-col justify-between h-fit transition-spring duration-500 shadow-elevation-2 rounded-[2px] ${
      onClick ? "focus-ring cursor-pointer" : ""
    } ${paddingClass} ${className}`;

    // Handler keyboard untuk aksesibilitas (R8.3)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    };

    const stickers = getStickers(id);

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
        {/* Stiker bunga/daun hiasan (dekoratif, pointer-events-none) */}
        {!isHero && stickers.map((sticker, index) => (
          <img
            key={index}
            src={sticker.src}
            alt=""
            className={sticker.className}
            aria-hidden="true"
          />
        ))}
        {/* Gambar Polaroid (sudut siku tajam khas polaroid) */}
        <div className={`relative ${aspectRatioClass} w-full overflow-hidden bg-background rounded-none mb-4 border border-accent/15`}>
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
