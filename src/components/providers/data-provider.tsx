import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import config from '~/../config.json';
import { sleep } from '~/utils';

type DataProviderProps = {
	children: React.ReactNode;
};

type DataProviderState = {
	messages: Message[];
	isLoading: boolean;
	setMessages: (messages: DataProviderState['messages']) => void;
	clear: () => void;
};

const initial = {
	messages: {},
	isLoading: true,
	setMessages: () => null,
	clear: () => null
};

const DataProviderContext = createContext<DataProviderState>(initial);

function DataProvider({ children, ...props }: DataProviderProps) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const ws = useRef<InstanceType<typeof WebSocket>>(null);
	const [messages, setMessages] = useState({});

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
				if (isLoading) setIsLoading(false);

				try {
					const parsed = JSON.parse(event.data);
					setMessages(parsed);
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
		messages,
		isLoading,
		clear: () => {
			ws.current!.send('DELETE');
			setMessages({});
		},
		setMessages: (messages: DataProviderState['messages']) => {
			setMessages(messages);
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