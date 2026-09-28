type Props = {
  className?: string;
  /** výška lístku v px */
  size?: number;
  color?: string;
};

/** Lístek z loga Pauzeo (stejný jako na krabici). */
export function Leaf({ size = 22, color = "currentColor", className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 22c-4.6-2.6-7-6.3-7-10.4C5 7.9 7.6 4.6 12 2c4.4 2.6 7 5.9 7 9.6 0 4.1-2.4 7.8-7 10.4Z" />
      <path d="M12 21.5V6.5" />
      <path d="M12 11.2 8.9 8.8M12 11.2l3.1-2.4M12 15.6l-3.7-2.9M12 15.6l3.7-2.9" />
    </svg>
  );
}

/** Logo Pauzeo: lístek + název verzálkami s prostrkáním, jako na krabici. */
export function Logo({ size = 22, color, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} style={color ? { color } : undefined}>
      <Leaf size={size} />
      <span
        className="font-display font-normal uppercase leading-none tracking-[0.16em]"
        style={{ fontSize: size * 0.95, fontVariationSettings: '"SOFT" 0, "WONK" 0, "opsz" 72' }}
      >
        Pauzeo
      </span>
    </span>
  );
}
