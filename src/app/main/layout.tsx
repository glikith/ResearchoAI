export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="text-gray-200">{children}</div>;
}