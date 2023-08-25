import Header from '~/components/header';
import { useData } from '~/components/providers/data-provider';
import Separator from '~/components/separator';

export const path = '/';
export const element = Home;

function Home() {
	const { messages } = useData();

	const content = Object.values(messages).flat(Infinity);

	return <div>
		<Header />
		<div className='min-h-[100vh] whitespace-pre p-5'>
			{content.map((message, idx) => <>
				<div className='py-1'>
					{message.text}
				</div>
				{idx !== content.length - 1 && <Separator />}
			</>)}
			{/* <Separator className='my-5 mx-60 w-auto' /> */}
		</div>
	</div>;
}