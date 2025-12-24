import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';

export const metadata = {
  title: 'Iccho Split App',
  description: 'Split bills with ANA Style',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
