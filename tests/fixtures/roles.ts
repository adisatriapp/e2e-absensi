import { test as base, Page } from '@playwright/test';
import { AspekPage } from '../pages/aspekPage';
import { KaryawanPage } from '../pages/karyawanPage';

export const test = base.extend<{
    _createAuth: undefined;
    admin: admin; 
}>({
    // small helper to create an authenticated page from a storage state file
    _createAuth: [async ({ browser }, use) => {
        // placeholder fixture, not exposed — used below via browser param
        await use(undefined);
    }, { auto: true }],

    admin: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: './tests/auth/admin.json' });
        const page = await context.newPage();

        const combined = createadmin(page);
        await use(combined);
        await context.close();
    }
});

// --- Typed combinator helpers ---
type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

function combinePages<T extends readonly object[]>(...targets: T): UnionToIntersection<T[number]> {
    const first = targets[0] as object;
    const handler: ProxyHandler<object> = {
        get(_target, prop, _receiver) {
            for (const obj of targets) {
                if (prop in obj) {
                    const value = (obj as any)[prop as keyof typeof obj];
                    return typeof value === 'function' ? (value as Function).bind(obj) : value;
                }
            }
            return undefined;
        },
        set(_target, prop, value) {
            for (const obj of targets) {
                if (prop in obj) {
                    (obj as any)[prop as keyof typeof obj] = value;
                    return true;
                }
            }
            (first as any)[prop as keyof typeof first] = value;
            return true;
        },
        has(_target, prop) {
            return targets.some(obj => prop in obj);
        }
    };
    return new Proxy(first, handler) as unknown as UnionToIntersection<T[number]>;
}

function createadmin(page: Page) {
    const aspek = new AspekPage(page);
    const karyawan = new KaryawanPage(page);
    return combinePages(aspek, karyawan);
}

type admin = ReturnType<typeof createadmin>;
