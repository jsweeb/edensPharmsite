"use client";

import React, { useState } from 'react';

interface Props {
  email: string;
}

/**
 * Contact form. There is no mail backend yet, so submitting opens the
 * visitor's email app with the message pre-filled and addressed to the
 * team. Swap handleSubmit for a POST to a form service when one is set up.
 */
export default function ContactForm({ email }: Props) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const from = String(data.get('email') ?? '');
    const message = String(data.get('message') ?? '');
    const subject = `Website inquiry from ${name}`;
    const body = `${message}\n\n— ${name} (${from})`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block mb-1 font-semibold">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          className="w-full bg-earth border border-highlight p-2 rounded text-sand"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-1 font-semibold">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          className="w-full bg-earth border border-highlight p-2 rounded text-sand"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block mb-1 font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full bg-earth border border-highlight p-2 rounded text-sand"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-accent text-earth rounded hover:bg-highlight hover:text-white"
      >
        Send Message
      </button>
      <p role="status" className="text-sm">
        {sent && (
          <>
            Your email app should open with your message ready to send. If it
            didn&apos;t, email us directly at{' '}
            <a href={`mailto:${email}`} className="underline text-accent">
              {email}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}
