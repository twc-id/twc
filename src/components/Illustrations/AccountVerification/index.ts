import lazy from '@utils/lazy'

const AccountVerification = {
    VerificationCompleted: lazy(() => import('./VerificationCompleted')),
    Bell: lazy(() => import('./Bell'))
}

export default AccountVerification
