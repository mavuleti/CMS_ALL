import './globals.css';
import BrowserErrorTracker from '@/components/BrowserErrorTracker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BrowserErrorTracker />
        {children}
      </body>
    </html>
  );
}
