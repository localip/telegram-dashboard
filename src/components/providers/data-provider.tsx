import React, { createContext, useContext, useEffect, useState } from 'react';

type DataProviderProps = {
	children: React.ReactNode;
};

type DataProviderState = {
	messages: Record<string, string>;
	isLoading: boolean;
	setMessages: (messages: DataProviderState['messages']) => void;
};

const initial = {
	messages: {},
	isLoading: true,
	setMessages: () => null
};

const DataProviderContext = createContext<DataProviderState>(initial);

function DataProvider({ children, ...props }: DataProviderProps) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [messages, setMessages] = useState({});

	useEffect(() => {
		console.log('hi');
		const ws = new WebSocket('ws://localhost:8098');

		ws.addEventListener('open', () => {
			console.info('Socket opened');
			setIsLoading(false);
		});

		ws.addEventListener('message', (event) => {
			try {
				const parsed = JSON.parse(event.data);
				setMessages(parsed);
			} catch (e) {
				console.error('!!! Failed parsing WebSocket message !!!');
			}
		});

		return () => ws.close();
	}, []);

	useEffect(() => {

		// updateLocale();
	}, [messages]);

	const ctx = {
		messages,
		isLoading,
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