import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import config from '~/../config.json';

type DataProviderProps = {
	children: React.ReactNode;
};

type DataProviderState = {
	messages: Record<string, string>;
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
		const socket = new WebSocket(config.socket);
		// @ts-ignore
		ws.current = socket;

		socket.addEventListener('close', console.log);

		socket.addEventListener('open', () => {
			console.info('Socket opened');
			setIsLoading(false);
		});

		socket.addEventListener('message', (event) => {
			try {
				const parsed = JSON.parse(event.data);
				setMessages(parsed);
			} catch (e) {
				console.error('!!! Failed parsing WebSocket message !!!');
			}
		});

		return () => socket.close();
	}, []);

	useEffect(() => {

		// updateLocale();
	}, [messages]);

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