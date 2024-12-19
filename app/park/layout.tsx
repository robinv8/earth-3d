export default function ParkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="park-layout">
      {children}
    </div>
  );
}
