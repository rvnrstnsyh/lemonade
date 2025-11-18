import { define } from '@/utils.ts'
import { FunctionComponent, JSX } from 'preact'

export default define.page(function App({ Component }: { Component: FunctionComponent }): JSX.Element {
	return (
		<html>
			<head>
				<meta charset='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Lemonade | Non-Violable Liberty Layers</title>
			</head>
			<body>
				<Component />
			</body>
		</html>
	)
})
