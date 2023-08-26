import Header from '~/components/header';
import { useData } from '~/components/providers/data-provider';
import Separator from '~/components/separator';
import List from 'react-list';
import { useEffect, useRef } from 'react';

export const path = '/';
export const element = Home;

export interface Listener {
	users?: string[];
	name: string;
	group: string;
	forum: boolean;
	webhook?: string;
	channels?: {
		name?: string;
		main?: boolean;
		webhook: string;
	}[];
}

export interface Message {
	listener: Listener;
	time: Number;
	reply?: {
		id: string;
		text: string;
		author: {
			username: string;
			id: string;
		};
	};
	text: string;
	author: {
		username: string;
		id: string;
	};
	id: string;
	channel: {
		name: string;
		id: string;
		forum: boolean;
	};
}

function Home() {
	const { messages, isLoading } = useData();
	const bottomRef = useRef<HTMLDivElement>();

	const scrollToBottom = () => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const content = Object.values(messages).flat(Infinity) as unknown as Message[];
	// @ts-ignore
	const sorted = content.sort((a, b) => a.time - b.time);


	return <div>
		<Header />
		<div className='whitespace-pre p-5'>
			{!isLoading && !sorted.length && <div>
				No messages.
			</div>}
			{sorted.map((message) => <div key={message.id} className='p-2 bg-secondary my-2 rounded-md'>
				{message.text}
			</div>)}
			<div ref={(_) => bottomRef.current = _!} className='list-bottom' />
			{isLoading && <div>
				Loading messages...
			</div>}
			{/* <Separator className='my-5 mx-60 w-auto' /> */}
		</div>
	</div>;
}