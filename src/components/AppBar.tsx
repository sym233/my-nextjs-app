'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';

import { useSessionStore } from '@/store';

interface NavLink {
  name: string,
  link: string;
}

const navLinks: NavLink[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Blog',
    link: '/blog',
  },
  {
    name: 'About',
    link: '/about',
  },
];

interface NavItemProps {
  navLink: NavLink;
}
const NavItem: FC<NavItemProps> = ({ navLink }) => {
  const { name, link } = navLink;
  const pathname = usePathname();
  const navActive = pathname.startsWith(link);
  const cls = navActive ? 'text-gray-950' : 'text-gray-500';
  return (
    <li className={`flex underline hover:font-semibold ${cls}`}>
      <Link className="self-end" href={link}>{name}</Link>
    </li>
  );
}

const DropDown = () => {
  const logout = useSessionStore(state => state.logout);
  return (<>
    <ul className="absolute h-0 hidden overflow-hidden p-2 border-black border-solid group-hover:h-fit group-hover:border group-hover:block">
      <li className="cursor-not-allowed">Profile</li>
      <li className="cursor-pointer" onClick={logout}>Log Out</li>
    </ul>
  </>)
}

const UserMenu = () => {
  const { username } = useSessionStore(useShallow(({ username }) => ({ username })));
  return (
    <div className="w-20">
      {username ? 
        (<div className="group">
          <span>{username}</span>
          <DropDown />
        </div>) :
        (<span><Link href="/login">Log in</Link></span>)
      }
    </div>
    
  )
}

const AppBar = () => {
  return (
    <nav className="flex space-x-2 border-solid border-b px-4 py-3">
      <h3 className="font-bold text-2xl mr-4">
        <Link href="/">Sym233&#39;s Home Page</Link>
      </h3>
      <div className="flex flex-1 text-lg">
        <ul className="flex space-x-4">
          {navLinks.map(navLink => <NavItem key={navLink.name} navLink={navLink} />)}
        </ul>
      </div>
      <div>
        <UserMenu/>
      </div>
    </nav>
  );
};

export default AppBar;
