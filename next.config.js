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
    // images: {
    //   domains: [
    //     'res.cloudinary.com',
    //   ],
    // },

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
