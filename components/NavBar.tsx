"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Navigation bar component.
 *
 * Renders a responsive navigation bar with links to the primary site pages.
 * On small screens the links collapse behind a menu button. The About
 * submenu is a disclosure button so it works with keyboard and touch as
 * well as mouse. Both menus close on navigation, Escape or outside click.
 */
const aboutLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/mission-values', label: 'Mission & Values' },
  { href: '/research-references', label: 'Research References' },
];

const linkClass =
  'relative block py-2 md:py-0 hover:text-sand transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-sand after:transition-transform after:duration-300 hover:after:scale-x-100';

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const aboutRef = useRef<HTMLLIElement>(null);

  // Close both menus after navigating to a new page.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setAboutOpen(false);
  }

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAboutOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [aboutOpen]);

  return (
    <nav
      className="sticky top-0 z-40 bg-earth/85 backdrop-blur-md border-b border-highlight/60 text-accent"
      aria-label="Main"
    >
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <Link href="/" className="font-cursive text-3xl text-accent">
          Eden&apos;s Pharm
        </Link>
        <button
          type="button"
          className="md:hidden p-2"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`} aria-hidden="true"></i>
        </button>
        <ul
          id="main-menu"
          className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col pt-2 md:pt-0 md:flex md:w-auto md:flex-row md:items-center md:space-x-6`}
        >
          <li>
            <Link href="/products" className={linkClass}>
              Products
            </Link>
          </li>
          <li className="relative" ref={aboutRef}>
            <button
              type="button"
              className="py-2 md:py-0 hover:text-sand"
              aria-expanded={aboutOpen}
              aria-controls="about-menu"
              onClick={() => setAboutOpen((open) => !open)}
            >
              About <i className="fas fa-chevron-down text-xs" aria-hidden="true"></i>
            </button>
            <ul
              id="about-menu"
              className={`${aboutOpen ? 'flex' : 'hidden'} flex-col space-y-1 bg-earth md:absolute md:left-0 md:top-full md:mt-2 md:z-20 md:w-56 md:border md:border-highlight md:p-2 pl-4 md:pl-2`}
            >
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block px-3 py-1 hover:bg-highlight hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link href="/blog" className={linkClass}>
              Blog
            </Link>
          </li>
          <li>
            <Link href="/gallery" className={linkClass}>
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/contact" className={linkClass}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/checkout" className={linkClass} aria-label="View cart">
              <i className="fas fa-shopping-cart" aria-hidden="true"></i>
              <span className="md:hidden ml-2">Cart</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
