/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config')

const nextConfig = {
    eslint: {
        dirs: ['src']
    },
    i18n,

    reactStrictMode: true,
    swcMinify: true,

    // Uncomment to add domain whitelist
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'store.thewatchcollections.com'
            },
            {
                protocol: 'https',
                hostname: 'img.jakpost.net'
            },
            {
                protocol: 'https',
                hostname: 'scontent-sin6-4.cdninstagram.com'
            },
            {
                protocol: 'https',
                hostname: '*.cdninstagram.com'
            },
            {
                protocol: 'https',
                hostname: 'placehold.co'
            }
        ]
    },

    // SVGR
    // webpack(config) {
    //     config.module.rules.push({
    //         test: /\.svg$/i,
    //         issuer: /\.[jt]sx?$/,
    //         use: [
    //             {
    //                 loader: '@svgr/webpack',
    //                 options: {
    //                     typescript: true,
    //                     icon: true
    //                 }
    //             }
    //         ]
    //     })

    //     return config
    // }
    webpack: (config, { defaultLoaders }) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                defaultLoaders.babel,
                {
                    loader: '@svgr/webpack',
                    options: {
                        babel: false,
                        svgoConfig: {
                            plugins: [
                                {
                                    name: 'preset-default',
                                    params: {
                                        overrides: {
                                            removeViewBox: false,
                                            removeUselessStrokeAndFill: false,
                                            cleanupIds: false
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        })

        return config
    }
}

module.exports = nextConfig
