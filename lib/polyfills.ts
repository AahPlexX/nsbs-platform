// Global polyfills for server-side rendering
/* eslint-disable */
// @ts-nocheck

// Immediate polyfill injection
(globalThis as any).self = globalThis;
(global as any).self = globalThis;

// Also set on the 'global' object for backwards compatibility
if (typeof globalThis !== 'undefined') {
    // Polyfill for 'self' in server environment
    if (typeof globalThis.self === 'undefined') {
        globalThis.self = globalThis;
    }

    // Polyfill for 'window' in server environment
    if (typeof globalThis.window === 'undefined') {
        globalThis.window = globalThis;
    }

    // Polyfill for 'document' in server environment (basic)
    if (typeof globalThis.document === 'undefined') {
        globalThis.document = {
            createElement: () => ({}),
            addEventListener: () => { },
            removeEventListener: () => { },
        };
    }
}
