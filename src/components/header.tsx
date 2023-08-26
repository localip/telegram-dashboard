import { useData } from '~/components/providers/data-provider';
import ThemeSwitcher from './theme-switcher';
import Button from '~/components/button';
import { Trash } from 'lucide-react';

function Header() {
	const { clear } = useData();

	return <nav className='sticky top-0 h-18 flex px-[20px] p-[10px] items-center gap-[10px] border-b text-card-foreground shadow-lg bg-background'>
		<div className='container flex h-8 items-center gap-[10px] p-0 md:h-8'>
			<span className='font-bold text-xl'>Telegram Dashboard</span>
			<div className='flex gap-2 ml-auto'>
				<Button variant='outline' size='icon' className='flex basis-auto shrink-0' onClick={clear}>
					<Trash width={18} />
				</Button>
				<ThemeSwitcher className='ml-auto' />
			</div>
		</div>
	</nav >;
}

export default Header;