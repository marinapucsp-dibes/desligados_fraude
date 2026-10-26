import "./globals.css";

export const metadata = {
  title: "Funcionários Desligados",
  description: "Funcionários desligados por suspeita e/ou fraude",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
