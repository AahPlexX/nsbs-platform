// Global polyfills for server-side rendering
/* eslint-disable */
// @ts-nocheck

// Immediate polyfill injection
if (typeof globalThis !== 'undefined') {
    // Polyfill for 'self' in server environment
    if (typeof globalThis.self === 'undefined') {
        Object.defineProperty(globalThis, 'self', {
            value: globalThis,
            writable: false,
            enumerable: true,
            configurable: false
        });
    }

    // Polyfill for 'window' in server environment
    if (typeof globalThis.window === 'undefined') {
        globalThis.window = {
            ...globalThis,
            location: {
                href: '',
                origin: '',
                protocol: 'https:',
                host: '',
                hostname: '',
                port: '',
                pathname: '/',
                search: '',
                hash: '',
            },
            matchMedia: () => ({
                matches: false,
                media: '',
                addEventListener: () => { },
                removeEventListener: () => { },
            }),
            innerWidth: 1024,
            innerHeight: 768,
        };
    }

    // Polyfill for 'document' in server environment (basic)
    if (typeof globalThis.document === 'undefined') {
        globalThis.document = {
            createElement: () => ({}),
            addEventListener: () => { },
            removeEventListener: () => { },
            querySelector: () => null,
            querySelectorAll: () => [],
            getElementById: () => null,
            getElementsByClassName: () => [],
            getElementsByTagName: () => [],
            body: {},
            head: {},
            documentElement: {},
        };
    }
}

// Also set on the 'global' object for backwards compatibility
if (typeof global !== 'undefined') {
    if (typeof global.self === 'undefined') {
        global.self = global;
    }
}
