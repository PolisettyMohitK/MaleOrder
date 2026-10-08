"use client";

import { useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Contact form. There is no backend behind this demo, so instead of silently
 * swallowing what somebody types, submitting composes a WhatsApp message
 * with their details already filled in. It works, and it lands in the same
 * inbox as every order.
 */
export function ContactForm({ storeName }: { storeName: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const canSend = name.trim().length > 1 && message.trim().length > 4;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;

    const text = [
      `Hi ${storeName},`,
      "",
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim() || "not given"}`,
      "",
      message.trim(),
    ].join("\n");

    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  const field =
    "w-full border-b border-silver-500/35 bg-transparent py-3.5 text-base text-ink outline-none transition-colors duration-500 placeholder:text-neutral-400 focus:border-ink";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate={false}>
      <div>
        <label htmlFor="cf-name" className="label text-muted">
          Your name
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="What should we call you?"
          className={`${field} mt-2`}
        />
      </div>

      <div>
        <label htmlFor="cf-phone" className="label text-muted">
          Phone <span className="normal-case">(optional)</span>
        </label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+91"
          className={`${field} mt-2`}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="label text-muted">
          How can we help?
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask about a size, a fabric, delivery, or a visit."
          className={`${field} mt-2 resize-none`}
        />
      </div>

      <button type="submit" disabled={!canSend} className="btn btn-ink w-full disabled:cursor-not-allowed disabled:opacity-45">
        <WhatsAppIcon width={16} height={16} />
        Send on WhatsApp
      </button>

      <p className="t-body text-neutral-600">
        This opens WhatsApp with your message ready to send. Nothing is stored
        on this site and there is no account to create.
      </p>
    </form>
  );
}