/**
 * WhatsApp Templates for TWC
 * Based on TWC WA Template.md
 */

const WHATSAPP_PHONE_NUMBER = '628121396688'

export const WhatsAppTemplates = {
    // 🏠 Home Page – Timepiece Service
    timepieceService:
        'Hello TWC Team, I would like to inquire about your timepiece services. Could you please provide more information? Thank you.',

    // 💰 Sell Page
    howToSell:
        'Hello TWC Team, I would like to know more about how to sell my watch through The Watch Collections. Thank you.',
    howToConsign:
        "Hello TWC Team, I'm interested in consigning my watch with The Watch Collections. Could you please share the process and requirements?",
    sellMain:
        'Hello TWC Team, I would like to discuss selling or consigning my watch. Could you please assist me? Thank you.',

    // 📦 Reserve Page
    howToPreOrder:
        'Hello TWC Team, I would like to know more about the pre-order process at The Watch Collections. Thank you.',
    howToReserve:
        'Hello TWC Team, I would like to know more about the reserve process at The Watch Collections. Thank you.',
    reserveMain:
        "Hello TWC Team, I'm interested in reserving a watch and would like more information. Could you please assist me?",

    // 🏢 About Us – CTA
    aboutUs: 'Hello TWC Team, I would like to know more about The Watch Collections and your services. Thank you.',

    // 📋 List Product Page – CTA
    listProduct:
        "Hello TWC Team, I'm interested in one of your watches listed on the website. Could you please assist me with more details? Thank you.",

    // ⌚ Detail Product Page – CTA (with product details)
    detailProduct: (productName: string, productUrl: string) =>
        `Hello TWC Team, I'm interested in this watch:\n${productName}\nLink: ${productUrl}\nCould you please assist me with more information? Thank you.`,

    // 💲 Detail Product Page – Ask for Price
    askPrice: (productName: string, productUrl: string) =>
        `Hello TWC Team, I'm interested in this watch:\n${productName}\nLink: ${productUrl}\nCould you please assist me with more information? Thank you.`,

    // 📰 List Article Page – CTA
    listArticle:
        "Hello TWC Team, I've been reading your articles and would like to inquire further about your watches and services. Thank you.",

    // 📰 Detail Article Page – CTA
    detailArticle: (articleTitle: string) =>
        `Hello TWC Team, I just read your article on ${articleTitle} and would like to learn more about the watches mentioned. Could you please assist me? Thank you.`,

    // 🧭 Navigation Bar – CTA (Empty State / General Contact)
    navigation:
        'Hello TWC Team, I would like to get in touch and learn more about your watches and services. Thank you.',

    // 📅 Footer – Book an Appointment
    bookAppointment:
        'Hello TWC Team, I would like to book an appointment to visit and discuss your watch collections. Could you please help me arrange a schedule? Thank you.'
}

/**
 * Generate WhatsApp link with template message
 */
export const getWhatsAppLink = (message: string): string => {
    const encodedMessage = encodeURIComponent(message)
    return `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE_NUMBER}&text=${encodedMessage}&type=phone_number&app_absent=0`
}

/**
 * Generate WhatsApp link for specific template
 */
export const getWhatsAppLinkFromTemplate = (templateKey: keyof typeof WhatsAppTemplates, ...args: any[]): string => {
    const template = WhatsAppTemplates[templateKey] as any
    const message = typeof template === 'function' ? template(...args) : template
    return getWhatsAppLink(message)
}
