export default function ImageDivider() {
  return (
    <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920&q=80"
        alt="UK Wedding Rings"
        className="w-full h-full object-cover"
        id="divider-img"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/30 via-transparent to-ivory/80 pointer-events-none"></div>
    </div>
  );
}
