/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AUTH_GOOGLE_ENABLED: string
    readonly VITE_AUTH_MICROSOFT_ENABLED: string
    readonly VITE_AUTH_APPLE_ENABLED: string
    readonly VITE_AUTH_GITHUB_ENABLED: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}