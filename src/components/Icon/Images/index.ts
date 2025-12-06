import dynamic from 'next/dynamic'
import React from 'react'

const lazy = (fn: () => Promise<{ default: React.FC<React.SVGProps<SVGSVGElement>> }>) => {
    if (typeof window === 'undefined') {
        return React.lazy(fn)
    }

    return dynamic(() => fn().then((module) => ({ default: module.default })), {
        ssr: false
    })
}

const IconComponents = {
    AlertFill: lazy(() => import('./AlertFill')),
    AlertTriangleFilled: lazy(() => import('./AlertTriangleFilled')),
    ArrowDownFilled: lazy(() => import('./ArrowDownFilled')),
    ArrowLeft: lazy(() => import('./ArrowLeft')),
    ArrowUp: lazy(() => import('./ArrowUp')),
    AudUsd: lazy(() => import('./AudUsd')),
    Bank: lazy(() => import('./Bank')),
    Bell: lazy(() => import('./Bell')),
    Camera: lazy(() => import('./Camera')),
    Chat: lazy(() => import('./Chat')),
    ChartGreen: lazy(() => import('./ChartGreen')),
    Checklist: lazy(() => import('./Checklist')),
    ChecklistCircle: lazy(() => import('./ChecklistCircle')),
    ChevronUp: lazy(() => import('./ChevronUp')),
    ChevronDown: lazy(() => import('./ChevronDown')),
    ChevronRight: lazy(() => import('./ChevronRight')),
    ChevronLeft: lazy(() => import('./ChevronLeft')),
    ChevronVertical: lazy(() => import('./ChevronVertical')),
    Copy: lazy(() => import('./Copy')),
    Diamond: lazy(() => import('./Diamond')),
    DoubleChevron: lazy(() => import('./DoubleChevron')),
    Dollar: lazy(() => import('./Dollar')),
    Download: lazy(() => import('./Download')),
    DownloadFilled: lazy(() => import('./DownloadFilled')),
    EmailIllustration: lazy(() => import('./EmailIllustration')),
    EurGbp: lazy(() => import('./EurGbp')),
    EurUsd: lazy(() => import('./EurUsd')),
    EyeHide: lazy(() => import('./EyeHide')),
    EyeShow: lazy(() => import('./EyeShow')),
    GbpUsd: lazy(() => import('./GbpUsd')),
    Gold: lazy(() => import('./Gold')),
    Home: lazy(() => import('./Home')),
    HomeFilled: lazy(() => import('./HomeFilled')),
    Hamburger: lazy(() => import('./Hamburger')),
    Interuption: lazy(() => import('./Interuption')),
    Instagram: lazy(() => import('./Instagram')),
    KeyIllustration: lazy(() => import('./KeyIllustration')),
    LinkedIn: lazy(() => import('./LinkedIn')),
    LogoBlack: lazy(() => import('./LogoBlack')),
    LogoWhite: lazy(() => import('./LogoWhite')),
    Logout: lazy(() => import('./Logout')),
    Mail: lazy(() => import('./Mail')),
    MinusCircle: lazy(() => import('./MinusCircle')),
    Menu: lazy(() => import('./Menu')),
    MoneyWithdraw: lazy(() => import('./MoneyWithdraw')),
    Oil: lazy(() => import('./Oil')),
    Pencil: lazy(() => import('./Pencil')),
    Phone: lazy(() => import('./Phone')),
    PlusCircle: lazy(() => import('./PlusCircle')),
    Question: lazy(() => import('./Question')),
    Repeat: lazy(() => import('./Repeat')),
    Search: lazy(() => import('./Search')),
    Stack: lazy(() => import('./Stack')),
    Sort: lazy(() => import('./Sort')),
    StackFilled: lazy(() => import('./StackFilled')),
    SquareFilled: lazy(() => import('./SquareFilled')),
    Square: lazy(() => import('./Square')),
    TouchHand: lazy(() => import('./TouchHand')),
    Tiktok: lazy(() => import('./Tiktok')),
    Trash: lazy(() => import('./Trash')),
    Upload: lazy(() => import('./Upload')),
    User: lazy(() => import('./User')),
    UserCircle: lazy(() => import('./UserCircle')),
    UserFilled: lazy(() => import('./UserFilled')),
    UsdCad: lazy(() => import('./UsdCad')),
    Wallet: lazy(() => import('./Wallet')),
    WalletFilled: lazy(() => import('./WalletFilled')),
    XCircle: lazy(() => import('./XCircle')),
    XCloseSmall: lazy(() => import('./XCloseSmall')),
    XClose: lazy(() => import('./XClose')),
    Youtube: lazy(() => import('./Youtube'))
}

export default IconComponents
