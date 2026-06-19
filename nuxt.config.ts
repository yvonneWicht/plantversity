// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
import tailwindcss from "@tailwindcss/vite";

const isTest = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST)

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: [
        ...(isTest ? [] : ['@vite-pwa/nuxt']),
        '@nuxtjs/supabase',
        "@vueuse/nuxt",
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/icon"
    ],
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
    },
    fonts: {
        defaults: {
            weights: [400],
            styles: ['normal', 'italic'],
            subsets: [
                'cyrillic-ext',
                'cyrillic',
                'greek-ext',
                'greek',
                'vietnamese',
                'latin-ext',
                'latin',
            ]
        },
        families: [
            { name: 'Commissioner', provider: 'google' },
        ]
        }
})
//alias ermöglicht es, alle elmeente mittels @ zu importieren