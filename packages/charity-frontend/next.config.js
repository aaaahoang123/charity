/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            process.env.NEXT_PUBLIC_STORAGE_DOMAIN,
            'img.vietqr.io',
        ]
    },
    output: 'standalone',
    experimental: {
        esmExternals: 'loose',
    }
}

module.exports = nextConfig
