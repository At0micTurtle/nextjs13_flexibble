import Link from 'next/link';
import Image from 'next/image';
import AuthProviders from './AuthProviders';
import { NavLinks } from '@/constants';
import { getCurrentUser } from '@/lib/session';

export default async function Navbar() {
  const session = await getCurrentUser();

  return (
    <nav className='flexBetween navbar'>
      <div className='flex-1 flexStart gap-10'>
        <Link href='/'>
          <Image src='/logo.svg' alt='Flexibble' width={115} height={43} />
        </Link>
        
        <ul className='xl:flex hidden text-small gap-7'>
          {NavLinks.map((link) => (
            <Link href={link.href} key={link.key}>
              {link.text}
            </Link>
          ))}
        </ul>
      </div>
      
      <div className='flexCenter gap-4'>
        {session?.user ? (
          <>
            {session?.user?.image && (<Image src={session.user.image} alt={session.user.name} width={40} height={40} className='rounded-full' />)}

            <Link href='/create-project'>
              Share Work
            </Link>
          </>
        ) : (
          <AuthProviders />
        )}
      </div>
    </nav>
  )
};
