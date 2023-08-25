import ThemeSwitcher from './theme-switcher';

function Header() {
	return <nav className='sticky h-18 flex items-center gap-[10px] border-b text-card-foreground shadow-lg bg-background'>
		<div className='container flex h-14 items-center gap-[10px] p-0 md:h-14'>
			<span className='font-bold'>Telegram Dashboard</span>
			<ThemeSwitcher className='ml-auto' />
		</div>
	</nav>;
}

export default Header;