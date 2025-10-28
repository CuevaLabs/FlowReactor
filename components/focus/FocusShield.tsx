'use client';

import { useEffect, useRef, useState } from 'react';
import { getSession } from '@/lib/focus-session';

const BLOCKED_HOSTS = [
	'discord.com',
	'discord.gg',
	'slack.com',
	'x.com',
	'twitter.com',
	'instagram.com',
	'facebook.com',
	'messenger.com',
	'telegram.org',
	't.me',
	'reddit.com',
	'youtube.com',
	'tiktok.com',
];

export default function FocusShield() {
	const [active, setActive] = useState<boolean>(false);
	const [toast, setToast] = useState<string | null>(null);
	const timeoutRef = useRef<number | null>(null);

	useEffect(() => {
		const update = () => setActive(!!getSession());
		update();
		const onStorage = (event: StorageEvent) => {
			if (!event.key || event.key === 'focusSession') update();
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, []);

	useEffect(() => {
		if (!active) return;

		const onClick = (event: MouseEvent) => {
			const el = (event.target as HTMLElement)?.closest?.('a') as HTMLAnchorElement | null;
			if (!el) return;

			const href = el.getAttribute('href') || '';
			if (!href || href.startsWith('#')) return;

			try {
				const url = new URL(href, window.location.href);
				const host = url.hostname.toLowerCase();
				const isBlocked =
					BLOCKED_HOSTS.some((blocked) => host.endsWith(blocked)) ||
					el.dataset.distraction === 'true';

				if (isBlocked) {
					event.preventDefault();
					event.stopPropagation();
					show('Locked-In mode is active. Save that scroll for your cooldown.');
				}
			} catch {
				// ignore invalid links
			}
		};

		document.addEventListener('click', onClick, true);
		return () => document.removeEventListener('click', onClick, true);
	}, [active]);

	const show = (message: string) => {
		setToast(message);
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = window.setTimeout(() => setToast(null), 2200);
	};

	return toast ? (
		<div className="fixed bottom-24 right-6 z-[1001]">
			<div className="rounded-2xl border border-cyan-400/40 bg-slate-950/90 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-lg shadow-black/40 backdrop-blur">
				{toast}
			</div>
		</div>
	) : null;
}
