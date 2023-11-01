import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Message } from '../../../types/structs';
import config from '~/../config.json';
import { useToast } from '~/hooks';
import { sleep } from '~/utils';

type DataProviderProps = {
	children: React.ReactNode;
};

type DataProviderState = {
	messages: Message[];
	isLoading: boolean;
	setMessages: (messages: Message[]) => void;
	clear: (password: string) => void;
};

const initial = {
	messages: [],
	isLoading: true,
	setMessages: () => null,
	clear: () => null
};

const DataProviderContext = createContext<DataProviderState>(initial);

function DataProvider({ children, ...props }: DataProviderProps) {
	const [messages, setMessages] = useState<{ messages: Message[]; }>({ messages: [] });
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const ws = useRef<InstanceType<typeof WebSocket>>(null);
	const { toast } = useToast();

	useEffect(() => {
		function onUnload() {
			ws.current?.close();
		}

		function createSocket() {
			if (ws.current) return;

			const socket = new WebSocket(config.socket);
			// @ts-ignore
			ws.current = socket;

			socket.addEventListener('close', async () => {
				// @ts-ignore
				ws.current = null;

				console.log('Socket closed, waiting 1000ms then retrying...');
				await sleep(1000);

				createSocket();
			});

			socket.addEventListener('open', () => {
				console.info('Socket opened');
			});

			socket.addEventListener('message', (event) => {
				try {
					const payload = JSON.parse(event.data);
					console.log(payload);

					switch (payload.type) {
						case 'DELETE_SUCCESS':
							setMessages({ messages: [] });
							toast({ title: 'Feed cleared', description: 'The feed has been successfully cleared.' });
							break;
						case 'DELETE_FAILED':
							toast({ variant: 'destructive', title: 'Feed not cleared', description: 'The password you provided is invalid.' });
							break;
						case 'MESSAGES_UPDATE':
							if (isLoading) setIsLoading(false);
							setMessages({ messages: payload.data });
							break;
					}
				} catch (e) {
					console.error('!!! Failed parsing WebSocket message !!!');
				}
			});
		}

		createSocket();
		document.addEventListener('beforeunload', onUnload);

		return () => {
			document.removeEventListener('beforeunload', onUnload);
			ws.current!.close();
		};
	}, []);

	const ctx = {
		messages: messages.messages,
		isLoading,
		clear: (password: string) => {
			ws.current!.send(JSON.stringify({ type: 'DELETE', password }));
		},
		setMessages: (messages: Message[]) => {
			setMessages({ messages });
		}
	};

	return (
		<DataProviderContext.Provider key={Object.keys(messages).length} {...props} value={ctx}>
			{children}
		</DataProviderContext.Provider>
	);
}

export function useData() {
	const context = useContext(DataProviderContext);

	if (context === undefined) {
		throw new Error('useData must be used within an DataProvider');
	}

	return context;
};

export default DataProvider;