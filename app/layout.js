export const metadata = {
  title: "Digital Marketing Form",
  description: "Contact form: Name, Email, Company, Website"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
