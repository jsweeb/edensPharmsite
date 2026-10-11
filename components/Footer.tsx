import React from 'react';

/**
 * Site footer with social icons, the FDA supplement disclaimer and
 * copyright.
 *
 * Social icons render only once a real profile URL is filled in below,
 * so the live site never shows dead '#' links. Uses FontAwesome icons
 * loaded globally in the layout head. Accessible names are provided via
 * aria-label attributes.
 */
const socialLinks: { label: string; icon: string; href: string }[] = [
  { label: 'Facebook', icon: 'fab fa-facebook-f', href: '' },
  { label: 'Instagram', icon: 'fab fa-instagram', href: '' },
  { label: 'Twitter', icon: 'fab fa-twitter', href: '' },
  { label: 'WhatsApp', icon: 'fab fa-whatsapp', href: '' },
  { label: 'Telegram', icon: 'fab fa-telegram-plane', href: '' },
  { label: 'YouTube', icon: 'fab fa-youtube', href: '' },
  { label: 'TikTok', icon: 'fab fa-tiktok', href: '' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const activeLinks = socialLinks.filter((link) => link.href);
  return (
    <footer className="bg-earth border-t border-highlight text-sand">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {activeLinks.length > 0 && (
            <div className="flex space-x-4 order-2 md:order-1">
              {activeLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-sand"
                >
                  <i className={link.icon} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          )}
          <p className="order-1 md:order-2 text-center md:text-right md:ml-auto">
            &copy; {year} Eden&apos;s Pharm. All Rights Reserved.
          </p>
        </div>
        <p className="text-xs text-center opacity-80">
          *These statements have not been evaluated by the Food and Drug
          Administration. These products are not intended to diagnose, treat,
          cure, or prevent any disease.
        </p>
      </div>
    </footer>
  );
}
