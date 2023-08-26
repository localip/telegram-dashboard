import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '~/components/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/tooltip';
import { useTheme } from '~/components/providers/theme-provider';
import { Button } from '~/components/button';
import { Moon, Sun } from 'lucide-react';


export default function ModeToggle(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild {...props}>
				<Button variant='outline' size='icon' className='flex basis-auto shrink-0'>
					<Sun width={18} className=' rotate-0 scale-100 transition-transform delay-100 dark:-rotate-90 dark:scale-0' />
					<Moon height={18} className='absolute rotate-90 scale-0 transition-transform delay-100 dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Appearance</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>Appearance</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem
					checked={theme === 'light'}
					onClick={() => setTheme('light')}
				>
					Light
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === 'dark'}
					onClick={() => setTheme('dark')}
				>
					Dark
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === 'system'}
					onClick={() => setTheme('system')}
				>
					System
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
