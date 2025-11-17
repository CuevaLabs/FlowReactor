const memoryCache = new Map<string, unknown>();

const isBrowser = () => typeof window !== 'undefined';

export function readJSON<T>(key: string): T | null {
	if (!isBrowser()) {
		return (memoryCache.get(key) as T) ?? null;
	}
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) {
			memoryCache.delete(key);
			return null;
		}
		const parsed = JSON.parse(raw) as T;
		memoryCache.set(key, parsed);
		return parsed;
	} catch (error) {
		console.warn(`[safe-storage] clearing corrupted data for "${key}"`, error);
		try {
			window.localStorage.removeItem(key);
		} catch {
			// ignore secondary failures
		}
		return (memoryCache.get(key) as T) ?? null;
	}
}

export function writeJSON<T>(key: string, value: T | null) {
	if (!isBrowser()) {
		if (value === null) memoryCache.delete(key);
		else memoryCache.set(key, value);
		return;
	}
	try {
		if (value === null) {
			window.localStorage.removeItem(key);
			memoryCache.delete(key);
		} else {
			window.localStorage.setItem(key, JSON.stringify(value));
			memoryCache.set(key, value);
		}
	} catch (error) {
		console.warn(`[safe-storage] failed to persist "${key}"`, error);
		if (value === null) memoryCache.delete(key);
		else memoryCache.set(key, value);
	}
}

export function readString(key: string): string | null {
	if (!isBrowser()) {
		const cached = memoryCache.get(key);
		return typeof cached === 'string' ? cached : null;
	}
	try {
		const raw = window.localStorage.getItem(key);
		if (raw === null) {
			memoryCache.delete(key);
			return null;
		}
		memoryCache.set(key, raw);
		return raw;
	} catch (error) {
		console.warn(`[safe-storage] clearing corrupted string for "${key}"`, error);
		try {
			window.localStorage.removeItem(key);
		} catch {
			// ignore
		}
		return null;
	}
}

export function writeString(key: string, value: string | null) {
	if (!isBrowser()) {
		if (value === null) memoryCache.delete(key);
		else memoryCache.set(key, value);
		return;
	}
	try {
		if (value === null) {
			window.localStorage.removeItem(key);
			memoryCache.delete(key);
		} else {
			window.localStorage.setItem(key, value);
			memoryCache.set(key, value);
		}
	} catch (error) {
		console.warn(`[safe-storage] failed to persist string for "${key}"`, error);
		if (value === null) memoryCache.delete(key);
		else memoryCache.set(key, value);
	}
}

