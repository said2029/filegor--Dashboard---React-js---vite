export default function Icon({
  name,
  className,
  size = 30,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  return (
    <div>
      <img  width={size} className={className} src={`/assets/icons/${name}.svg`} />
    </div>
  );
}
