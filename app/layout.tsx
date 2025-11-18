// FIX: Import React to make types like React.ReactNode available. This resolves both reported errors.
import React from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '../context/AuthContext';
import AppWrapper from './AppWrapper';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900']
});

export const metadata: Metadata = {
  title: 'CITYRIDE - Taxi Booking Service',
  description: 'A modern and professional taxi booking web application, designed to revolutionize the cab logistics industry. Book your ride from anywhere, today!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Script src="https://cdn.tailwindcss.com" />
        <Script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js" strategy="beforeInteractive" />
      </head>
      <body className={poppins.className}>
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
