'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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
      <div className="cursor-not-allowed">Log in</div>
    </nav>
  );
};

export default AppBar;
