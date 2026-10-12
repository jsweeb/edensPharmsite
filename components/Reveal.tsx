"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * Fades and lifts its children into view the first time they scroll on
 * screen. Styling lives in app/globals.css (`.reveal`); without JavaScript,
 * or with reduced motion turned on, the content is simply shown.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  /** Milliseconds to wait before animating, for staggering a row of items. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Very old browsers: just show the content.
      el.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return React.createElement(
    Tag,
    {
      ref,
      className: `reveal ${visible ? 'is-visible' : ''} ${className}`,
      style: { '--reveal-delay': `${delay}ms` } as React.CSSProperties,
    },
    children,
  );
}
