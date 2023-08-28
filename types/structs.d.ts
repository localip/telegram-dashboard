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
