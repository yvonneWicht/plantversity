// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: [
        '@vite-pwa/nuxt',
        '@nuxtjs/supabase',
        "@vueuse/nuxt",
        "@nuxt/eslint",
        ...(process.env.NODE_ENV === 'test' ? ["@nuxt/test-utils/module"] : [])
    ],
    runtimeConfig: {
        public: {
            isDevelopment: process.env.NODE_ENV === 'development',
            mockAuthEnabled: process.env.MOCK_AUTH === 'true'
        }
    },
    alias: {
        "@": resolve(__dirname, "/"),
    },
    css: [
        "~/assets/tailwind.css",
        "~/assets/main.scss"
    ],
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Plantversity',
            short_name: 'Plantversity',
            description: 'Track plant diversity in your diet',
            theme_color: '#13572c',
            background_color: '#cedfd5',
            display: 'standalone',
            start_url: '/',
            icons: [
                {
                    src: '/pwa-64x64.png',
                    sizes: '64x64',
                    type: 'image/png',
                },
                {
                    src: '/pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: '/maskable-icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
    },
    meta: {
        link: [
            { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' }
        ]
    }
})
//alias ermöglicht es, alle elmeente mittels @ zu importieren