import { useData } from '~/components/providers/data-provider';
import ErrorBoundary from '~/components/error-boundary';
import { useEffect, useRef } from 'react';
import Header from '~/components/header';
import Markdown from 'react-markdown';
import config from '~/../config.json';
import gfm from 'remark-gfm';

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
	const sorted = content.slice(0, 250).sort((a, b) => a.time - b.time);


	return <div>
		<Header />
		<div className='whitespace-pre p-5'>
			{!isLoading && !sorted.length && <div>
				No messages.
			</div>}
			{sorted.map((message) => {
				return <ErrorBoundary key={message.id} fallback={() => <div className='whitespace-break-spaces p-2 bg-secondary my-1 rounded-md'>
					{message.text}
				</div>}>
					<Markdown
						remarkPlugins={[gfm]}
						key={message.id}
						className='whitespace-break-spaces p-2 bg-secondary my-1 rounded-md'
						linkTarget='_blank'
						components={{
							a: (props: React.HTMLProps<HTMLAnchorElement>) => {
								if (props.href === '') {
									if (config.ignoredTags.some(t => String(props.children).toLowerCase().includes(t.toLowerCase()))) {
										return props.children;
									}

									return <a {...props} href={undefined} className='hashtag' />;
								}

								return <a {...props} />;
							}
						}}
					>
						{message.text.replaceAll(/#(\w+)/g, '[#$1]()')}
					</Markdown>
				</ErrorBoundary>;
			})}
			<div ref={(_) => bottomRef.current = _!} className='list-bottom' />
			{isLoading && <div>
				Loading messages...
			</div>}
		</div>
	</div >;
}