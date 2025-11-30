export const baseText = {
    xs: ['10px', '16px'],
    sm: ['12px', '18px'],
    md: ['14px', '20px'],
    lg: ['16px', '24px']
}

const fontSize = {
    ...baseText,

    // ==============================
    // BUTTONS
    // ==============================

    // Desktop
    'button-1-desktop': ['28px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 400, fontFamily: 'Inter' }],
    'button-2-desktop': ['16px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 500, fontFamily: 'Inter' }],
    'button-3-desktop': ['16px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 400, fontFamily: 'Inter' }],
    'button-4-desktop': ['14px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 600, fontFamily: 'Inter' }],
    'button-5-desktop': ['14px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 500, fontFamily: 'Inter' }],

    // Mobile
    'button-1-mobile': ['22px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 400, fontFamily: 'Inter' }],
    'button-2-mobile': ['14px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 500, fontFamily: 'Inter' }],
    'button-3-mobile': ['14px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 400, fontFamily: 'Inter' }],
    'button-4-mobile': ['13px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 600, fontFamily: 'Inter' }],
    'button-5-mobile': ['13px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 500, fontFamily: 'Inter' }],

    // ==============================
    // HEADINGS
    // ==============================

    // Desktop
    'heading-1-desktop': ['88px', { lineHeight: '110%', letterSpacing: '-5%', fontWeight: 400, fontFamily: 'Inter' }],
    'heading-1-2-desktop': ['80px', { lineHeight: '100%', letterSpacing: '-5%', fontWeight: 400, fontFamily: 'Inter' }],
    'heading-1-3-desktop': ['64px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],
    'heading-2-desktop': ['52px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],
    'heading-3-desktop': ['36px', { lineHeight: '130%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],

    // Mobile
    'heading-1-mobile': ['48px', { lineHeight: '110%', letterSpacing: '-5%', fontWeight: 400, fontFamily: 'Inter' }],
    'heading-1-2-mobile': ['48px', { lineHeight: '100%', letterSpacing: '-5%', fontWeight: 400, fontFamily: 'Inter' }],
    'heading-1-3-mobile': ['36px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],
    'heading-2-mobile': ['28px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],
    'heading-3-mobile': ['24px', { lineHeight: '130%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],

    // ==============================
    // SUB HEADINGS
    // ==============================

    // Desktop
    'subheading-1-desktop': [
        '32px',
        { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }
    ],
    'subheading-2-desktop': [
        '20px',
        { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }
    ],
    'subheading-3-desktop': [
        '20px',
        { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 400, fontFamily: 'Inter' }
    ],
    'subheading-4-desktop': [
        '18px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 500, fontFamily: 'Inter' }
    ],
    'subheading-5-desktop': [
        '16px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 500, fontFamily: 'Inter' }
    ],
    'subheading-6-desktop': [
        '14px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 600, fontFamily: 'Inter' }
    ],
    'subheading-7-desktop': ['12px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 400, fontFamily: 'Inter' }],

    // Mobile
    'subheading-1-mobile': ['22px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],
    'subheading-2-mobile': ['16px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],
    'subheading-3-mobile': ['16px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 400, fontFamily: 'Inter' }],
    'subheading-4-mobile': ['15px', { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 500, fontFamily: 'Inter' }],
    'subheading-5-mobile': ['14px', { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 500, fontFamily: 'Inter' }],
    'subheading-6-mobile': ['13px', { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 600, fontFamily: 'Inter' }],
    'subheading-7-mobile': ['11px', { lineHeight: '130%', letterSpacing: '2%', fontWeight: 400, fontFamily: 'Inter' }],

    // ==============================
    // PARAGRAPHS
    // ==============================

    // Desktop
    'paragraph-1-desktop': ['40px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 400, fontFamily: 'Inter' }],
    'paragraph-2-desktop': ['36px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 400, fontFamily: 'Inter' }],
    'paragraph-3-desktop': ['24px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],
    'paragraph-4-desktop': [
        '18px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 600, fontFamily: 'Overpass' }
    ],
    'paragraph-5-desktop': [
        '18px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 400, fontFamily: 'Overpass' }
    ],
    'paragraph-6-desktop': [
        '16px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 400, fontFamily: 'Overpass' }
    ],
    'paragraph-7-desktop': [
        '14px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 400, fontFamily: 'Overpass' }
    ],
    'paragraph-8-desktop': [
        '12px',
        { lineHeight: '130%', letterSpacing: '2%', fontWeight: 500, fontFamily: 'Overpass' }
    ],
    'paragraph-9-desktop': [
        '12px',
        { lineHeight: '130%', letterSpacing: '2%', fontWeight: 400, fontFamily: 'Overpass' }
    ],
    'paragraph-10-desktop': [
        '12px',
        { lineHeight: '130%', letterSpacing: '2%', fontWeight: 300, fontFamily: 'Overpass' }
    ],
    'paragraph-11-desktop': [
        '12px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 300, fontFamily: 'Overpass' }
    ],

    // Mobile
    'paragraph-1-mobile': ['24px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 400, fontFamily: 'Inter' }],
    'paragraph-2-mobile': ['24px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 400, fontFamily: 'Inter' }],
    'paragraph-3-mobile': ['18px', { lineHeight: '110%', letterSpacing: '-4%', fontWeight: 500, fontFamily: 'Inter' }],
    'paragraph-4-mobile': [
        '15px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 600, fontFamily: 'Overpass' }
    ],
    'paragraph-5-mobile': [
        '15px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 400, fontFamily: 'Overpass' }
    ],
    'paragraph-6-mobile': [
        '14px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 400, fontFamily: 'Overpass' }
    ],
    'paragraph-7-mobile': [
        '13px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 400, fontFamily: 'Overpass' }
    ],
    'paragraph-8-mobile': [
        '11px',
        { lineHeight: '130%', letterSpacing: '2%', fontWeight: 500, fontFamily: 'Overpass' }
    ],
    'paragraph-9-mobile': [
        '11px',
        { lineHeight: '130%', letterSpacing: '2%', fontWeight: 400, fontFamily: 'Overpass' }
    ],
    'paragraph-10-mobile': [
        '11px',
        { lineHeight: '130%', letterSpacing: '2%', fontWeight: 300, fontFamily: 'Overpass' }
    ],
    'paragraph-11-mobile': [
        '11px',
        { lineHeight: '130%', letterSpacing: '-2%', fontWeight: 300, fontFamily: 'Overpass' }
    ]
}

export default fontSize
