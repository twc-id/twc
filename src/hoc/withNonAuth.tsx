import useAuth from '@hooks/useAuth'
import { getAuth } from '@utils/auth'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const withNonAuthSSR =
    (getServerSidePropsFunc: GetServerSideProps) => async (context: GetServerSidePropsContext) => {
        const auth = getAuth({ req: context.req })

        if (auth.isLoggedIn) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        return getServerSidePropsFunc(context)
    }

// eslint-disable-next-line react/function-component-definition
export const withNonAuthClient = (WrappedComponent: React.ComponentType) => () => {
    const router = useRouter()
    const { auth } = useAuth()

    const redirect = router.query.redirect && String(router.query.redirect)

    useEffect(() => {
        if (router.isReady && redirect) {
            router.prefetch(redirect)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, redirect])

    useEffect(() => {
        if (router.isReady && auth.isLoggedIn) {
            if (redirect) {
                router.push(redirect)
                return
            }

            router.push(`/`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.isLoggedIn, router])

    return <WrappedComponent />
}
