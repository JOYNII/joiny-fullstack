import './globals.css';
import ConditionalLayout from '../components/ConditionalLayout';
import Providers from '../components/Providers';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Myparty App</title>
      </head>
      <body className="flex flex-col h-screen">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
          integrity="sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG2Pkp/2FjSGevr4PJU110"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}