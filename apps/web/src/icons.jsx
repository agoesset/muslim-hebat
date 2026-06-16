import React from "react";
// Minimal stroke icons used across the site. Single line, friendly weight.
export const Icon = {
  Arrow: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  ArrowUR: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9"/>
    </svg>
  ),
  Heart: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-7-4.35-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 8.5 21.5 12c-2.5 4.65-9.5 9-9.5 9z"/>
    </svg>
  ),
  Bookmark: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v17l-6-4-6 4z"/>
    </svg>
  ),
  Clock: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  Pin: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  Cal: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>
    </svg>
  ),
  Mail: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
    </svg>
  ),
  Bell: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM9 18a3 3 0 0 0 6 0"/>
    </svg>
  ),
  Moon: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>
    </svg>
  ),
  Sun: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ),
  Star: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2 2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-4-6.3 4 1.7-7L2 9.5l7.1-.6z"/>
    </svg>
  ),
  Check: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 13 4 4L19 7"/>
    </svg>
  ),
  Play: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4v16l14-8z"/>
    </svg>
  ),
  Download: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v13M6 11l6 6 6-6M5 21h14"/>
    </svg>
  ),
  Search: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  Smile: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
    </svg>
  ),
  Sparkle: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c1 5 3 7 8 8-5 1-7 3-8 8-1-5-3-7-8-8 5-1 7-3 8-8z"/>
    </svg>
  ),
  Mosque: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V11c0-3 3-3 3-6 0 3 3 3 3 6m6 0c0-3 3-3 3-6 0 3 3 3 3 6v10"/>
      <path d="M9 21V11c1.5-1.5 4.5-1.5 6 0v10"/>
      <path d="M12 8v3"/>
    </svg>
  ),
  ExternalLink: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Lock: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  LogOut: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Instagram: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="6"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Youtube: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.8 8.1a2.5 2.5 0 0 0-1.77-1.78C18.73 6 12 6 12 6s-6.73 0-8.03.32A2.5 2.5 0 0 0 2.2 8.1 25.9 25.9 0 0 0 2 12a25.9 25.9 0 0 0 .2 3.9 2.5 2.5 0 0 0 1.77 1.78C5.27 18 12 18 12 18s6.73 0 8.03-.32a2.5 2.5 0 0 0 1.77-1.78A25.9 25.9 0 0 0 22 12a25.9 25.9 0 0 0-.2-3.9zM10 15V9l5.33 3L10 15z"/>
    </svg>
  ),
  Spotify: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.6 14.4c-.2.3-.5.4-.8.2-2.2-1.3-5-1.6-8.3-.9-.3.1-.6-.1-.7-.4 0-.3.1-.6.4-.7 3.6-.8 6.7-.5 9.2 1 .3.1.4.5.2.8zm1.2-2.7c-.2.4-.7.5-1.1.3-2.5-1.5-6.3-2-9.3-1.1-.4.1-.8-.1-.9-.5s.1-.8.5-.9c3.4-1 7.6-.5 10.5 1.3.4.2.5.7.3 1zm.1-2.8c-3-1.8-8-2-10.9-1.1-.5.2-1-.1-1.1-.5-.2-.5.1-1 .6-1.1 3.3-1 8.8-.8 12.3 1.3.5.3.6.9.3 1.3-.2.5-.8.6-1.2.3z"/>
    </svg>
  ),
  TikTok: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.6 6.7c-1.4 0-2.6-.6-3.4-1.5V16c0 4.4-3.6 8-8 8S0 20.4 0 16s3.6-8 8-8c.6 0 1.1.1 1.7.2v4.1c-.5-.2-1.1-.3-1.7-.3-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4V0h4c0 3.3 2.7 6 6 6v.7z"/>
    </svg>
  ),
  Telegram: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 12.5l18.6-8.2c.7-.3 1.4.2 1.1 1.1L18.3 19c-.3 1-1 1.3-2 1.2l-4.7-3.5-2.3 2.3c-.3.3-.6.3-.9 0l.3-4.7 8.8-8c.4-.4-.1-.6-.6-.2l-11 7L2 13.3c-.4.1-.4-.6 0-.8z"/>
    </svg>
  ),
};
