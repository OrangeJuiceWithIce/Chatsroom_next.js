import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/router';

export const trpc = createTRPCNext<AppRouter>({
    config() {
        return {
            links: [
                httpBatchLink({
                    url: 'http://localhost:3000/api/trpc',
                }),
            ],
        };
    },
    ssr: false, // 根据需要配置 SSR
});
