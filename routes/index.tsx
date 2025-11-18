import Counter from '@/islands/Counter.tsx'

import { PageProps } from 'fresh'
import { Head } from 'fresh/runtime'
import { define, State } from '@/utils.ts'
import { JSX, RenderableProps } from 'preact'
import { Signal, useSignal } from '@preact/signals'

export default define.page(function Home(_ctx: RenderableProps<PageProps<never, State>, unknown>): JSX.Element {
	const count: Signal<number> = useSignal(0)

	return (
		<div class='px-4 py-8 mx-auto fresh-gradient min-h-screen'>
			<Head>
				<title>Lemonade | Non-Violable Liberty Layers</title>
			</Head>
			<div class='max-w-3xl mx-auto flex flex-col items-center justify-center'>
				<img class='my-6' src='/logo.svg' width='128' height='128' alt='the Fresh logo: a sliced lemon dripping with juice' />
				<h1 class='text-4xl font-bold'>Welcome to Lemonade (Fresh)</h1>
				<p class='my-4'>
					Try updating this message in the <code class='mx-2'>@/routes/index.tsx</code> file, and refresh.
				</p>
				<Counter count={count} />
			</div>
		</div>
	)
})
