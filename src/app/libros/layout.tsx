export default function LibrosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-900 w-full">
      {children}
    </div>
  );
}
