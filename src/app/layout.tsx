import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { DieStoreProvider } from "@/stores/die-store-provider"
import { Metadata } from "next/dist/types"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Wafer map",
	description: "",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<DieStoreProvider>{children}</DieStoreProvider>
			</body>
		</html>
	)
}
