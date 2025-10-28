'use client';

import { useEffect, useState } from 'react';
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

    useEffect(() => {
        const update = () => setActive(!!getSession());
        update();
        const onStorage = (e: StorageEvent) => {
            if (!e.key || e.key === 'focusSession') update();
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    useEffect(() => {
        if (!active) return;

        const onClick = (e: MouseEvent) => {
            const el = (e.target as HTMLElement)?.closest?.('a') as HTMLAnchorElement | null;
            if (!el) return;

            const href = el.getAttribute('href') || '';
            if (!href || href.startsWith('#')) return;

            try {
                const url = new URL(href, window.location.href);
                const host = url.hostname.toLowerCase();
                const isBlocked =
                    BLOCKED_HOSTS.some((b) => host.endsWith(b)) ||
                    el.dataset.distraction === 'true';

                if (isBlocked) {
                    e.preventDefault();
                    e.stopPropagation();
                    show('Focus mode is on. Chat links are locked for this sprint.');
                }
            } catch {
                // ignore parse errors
            }
        };

        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, [active]);

    const show = (msg: string) => {
        setToast(msg);
        // @ts-ignore
        window.clearTimeout(show._t);
        // @ts-ignore
        show._t = window.setTimeout(() => setToast(null), 2000);
    };

    return toast ? (
        <div className="fixed bottom-20 right-4 z-[1001]">
            <div className="bg-gray-900/95 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                {toast}
            </div>
        </div>
    ) : null;
}


