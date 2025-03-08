import '../assets/styles.css'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html translate="no">
			<head>
				<script src="/__ENV.js" />
			</head>
			<body>{children}</body>
		</html>
	)
}