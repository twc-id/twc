export const baseText = {
    xs: ['10px', '16px'],
    sm: ['12px', '18px'],
    md: ['14px', '20px'],
    lg: ['16px', '24px']
}

const fontSize = {
    ...baseText,

    // ==============================
    // HEADINGS
    // ==============================

    // Desktop
    'heading-1-desktop': [
        '52px',
        { lineHeight: '110%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Unbounded' }
    ],
    'heading-2-desktop': ['32px', { lineHeight: '110%', letterSpacing: '35%', fontWeight: 500, fontFamily: 'Manrope' }],
    'heading-3-desktop': [
        '32px',
        { lineHeight: '110%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Unbounded' }
    ],
    'heading-4-desktop': ['28px', { lineHeight: '110%', letterSpacing: '5%', fontWeight: 600, fontFamily: 'Manrope' }],

    // Mobile
    'heading-1-mobile': ['32px', { lineHeight: '110%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Unbounded' }],
    'heading-2-mobile': ['22px', { lineHeight: '110%', letterSpacing: '35%', fontWeight: 500, fontFamily: 'Manrope' }],
    'heading-3-mobile': ['22px', { lineHeight: '110%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Unbounded' }],
    'heading-4-mobile': ['22px', { lineHeight: '110%', letterSpacing: '5%', fontWeight: 600, fontFamily: 'Manrope' }],

    // ==============================
    // SUB HEADINGS
    // ==============================

    // Desktop
    'subheading-1-desktop': [
        '68px',
        {
            lineHeight: '110%',
            letterSpacing: '0%',
            fontWeight: 300,
            fontStyle: 'italic',
            fontFamily: 'Noto Serif Display SemiCondensed'
        }
    ],
    'subheading-2-desktop': [
        '56px',
        { lineHeight: '110%', letterSpacing: '0%', fontWeight: 300, fontFamily: 'Manrope' }
    ],
    'subheading-3-desktop': [
        '50px',
        { lineHeight: '110%', letterSpacing: '0%', fontWeight: 400, fontFamily: 'Unbounded' }
    ],
    'subheading-4-desktop': [
        '40px',
        {
            lineHeight: '110%',
            letterSpacing: '0%',
            fontWeight: 300,
            fontStyle: 'italic',
            fontFamily: 'Noto Serif Display SemiCondensed'
        }
    ],
    'subheading-5-desktop': [
        '36px',
        { lineHeight: '110%', letterSpacing: '0%', fontWeight: 300, fontFamily: 'Manrope' }
    ],
    'subheading-6-desktop': [
        '36px',
        { lineHeight: '110%', letterSpacing: '5%', fontWeight: 400, fontFamily: 'Unbounded' }
    ],
    'subheading-7-desktop': [
        '14px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 700, fontFamily: 'Manrope' }
    ],
    'subheading-8-desktop': [
        '12px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 700, fontFamily: 'Manrope' }
    ],

    // Mobile
    'subheading-1-mobile': [
        '32px',
        {
            lineHeight: '110%',
            letterSpacing: '0%',
            fontWeight: 300,
            fontStyle: 'italic',
            fontFamily: 'Noto Serif Display SemiCondensed'
        }
    ],
    'subheading-2-mobile': [
        '32px',
        { lineHeight: '110%', letterSpacing: '0%', fontWeight: 300, fontFamily: 'Manrope' }
    ],
    'subheading-3-mobile': [
        '24px',
        { lineHeight: '110%', letterSpacing: '0%', fontWeight: 400, fontFamily: 'Unbounded' }
    ],
    'subheading-4-mobile': [
        '24px',
        {
            lineHeight: '110%',
            letterSpacing: '0%',
            fontWeight: 300,
            fontStyle: 'italic',
            fontFamily: 'Noto Serif Display SemiCondensed'
        }
    ],
    'subheading-5-mobile': [
        '24px',
        { lineHeight: '110%', letterSpacing: '0%', fontWeight: 300, fontFamily: 'Manrope' }
    ],
    'subheading-6-mobile': [
        '24px',
        { lineHeight: '110%', letterSpacing: '5%', fontWeight: 400, fontFamily: 'Unbounded' }
    ],
    'subheading-7-mobile': [
        '13px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 700, fontFamily: 'Manrope' }
    ],
    'subheading-8-mobile': [
        '11px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 700, fontFamily: 'Manrope' }
    ],

    // ==============================
    // PARAGRAPHS
    // ==============================

    // Desktop
    'paragraph-1-desktop': [
        '28px',
        { lineHeight: '110%', letterSpacing: '5%', fontWeight: 200, fontFamily: 'Manrope' }
    ],
    'paragraph-2-desktop': [
        '24px',
        { lineHeight: '130%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Manrope' }
    ],
    'paragraph-3-desktop': [
        '20px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 700, fontFamily: 'Manrope' }
    ],
    'paragraph-4-desktop': [
        '18px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 800, fontFamily: 'Manrope' }
    ],
    'paragraph-5-desktop': [
        '18px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 600, fontFamily: 'Manrope' }
    ],
    'paragraph-6-desktop': [
        '18px',
        { lineHeight: '130%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Manrope' }
    ],
    'paragraph-7-desktop': [
        '18px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 400, fontFamily: 'Unbounded' }
    ],
    'paragraph-8-desktop': [
        '14px',
        { lineHeight: '130%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Manrope' }
    ],
    'paragraph-9-desktop': [
        '12px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 500, fontFamily: 'Manrope' }
    ],
    'paragraph-10-desktop': [
        '12px',
        { lineHeight: '130%', letterSpacing: '5%', fontWeight: 300, fontFamily: 'Manrope' }
    ],

    // Mobile
    'paragraph-1-mobile': ['22px', { lineHeight: '110%', letterSpacing: '5%', fontWeight: 200, fontFamily: 'Manrope' }],
    'paragraph-2-mobile': ['18px', { lineHeight: '130%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Manrope' }],
    'paragraph-3-mobile': ['16px', { lineHeight: '130%', letterSpacing: '0%', fontWeight: 700, fontFamily: 'Manrope' }],
    'paragraph-4-mobile': ['15px', { lineHeight: '130%', letterSpacing: '0%', fontWeight: 800, fontFamily: 'Manrope' }],
    'paragraph-5-mobile': ['15px', { lineHeight: '130%', letterSpacing: '0%', fontWeight: 600, fontFamily: 'Manrope' }],
    'paragraph-6-mobile': ['15px', { lineHeight: '130%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Manrope' }],
    'paragraph-7-mobile': [
        '15px',
        { lineHeight: '130%', letterSpacing: '0%', fontWeight: 400, fontFamily: 'Unbounded' }
    ],
    'paragraph-8-mobile': ['13px', { lineHeight: '130%', letterSpacing: '5%', fontWeight: 500, fontFamily: 'Manrope' }],
    'paragraph-9-mobile': ['11px', { lineHeight: '130%', letterSpacing: '0%', fontWeight: 500, fontFamily: 'Manrope' }],
    'paragraph-10-mobile': ['11px', { lineHeight: '130%', letterSpacing: '5%', fontWeight: 300, fontFamily: 'Manrope' }]
}

export default fontSize
