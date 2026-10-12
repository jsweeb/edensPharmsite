import React from 'react';

/**
 * Re-mounts on every navigation, so each page fades in as it arrives.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
