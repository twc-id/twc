import { lazy } from 'react'

const ErrorStateIllustration = {
    NoInternet: lazy(() => import('./NoInternet')),
    Maintenance: lazy(() => import('./Maintenance')),
    Suspend: lazy(() => import('./Suspend')),
    Notfound: lazy(() => import('./Notfound'))
}

export default ErrorStateIllustration
