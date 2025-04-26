import "../src/index.css"

export const metadata = {
  title: "FIFO Travel Ticket Generator",
  description: "Generate travel tickets for FIFO workers",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
