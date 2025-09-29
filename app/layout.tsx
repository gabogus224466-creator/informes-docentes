export const metadata = {
  title: 'Informes Docentes',
  description: 'Descarga segura de informes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, Arial, sans-serif', background: '#f7f7f7' }}>
        {children}
      </body>
    </html>
  );
}
