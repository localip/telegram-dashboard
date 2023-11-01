import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '~/components/dialog';
import { useData } from '~/components/providers/data-provider';
import ThemeSwitcher from './theme-switcher';
import Button from '~/components/button';
import Input from '~/components/input';
import { Trash } from 'lucide-react';
import { useState } from 'react';

function Header() {
	const [password, setPassword] = useState('');
	const { clear } = useData();

	return <nav className='sticky top-0 h-18 flex px-[20px] p-[10px] items-center gap-[10px] border-b text-card-foreground shadow-lg bg-background'>
		<div className='container flex h-8 items-center gap-[10px] p-0 md:h-8'>
			<span className='font-bold text-xl'>Telegram Dashboard</span>
			<div className='flex gap-2 ml-auto'>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='outline' size='icon' className='flex basis-auto shrink-0'>
							<Trash width={18} />
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Enter your password</DialogTitle>
							<DialogDescription>
								To clear the feed, you must provide the password you set in the telegram forwarder. <br /> <br />
								If the password you provide is correct, the feed will successfully clear. If not, your request will be ignored.
							</DialogDescription>
						</DialogHeader>
						<div className='flex flex-col mb-2 gap-3'>
							<Input
								placeholder='Password'
								type='password'
								id='password'
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								autoFocus
								className='col-span-3'
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button
									variant='destructive'
									type='submit'
									className='w-full'
									onClick={() => clear(password)}
								>
									Delete
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<ThemeSwitcher className='ml-auto' />
			</div>
		</div>
	</nav >;
}

export default Header;