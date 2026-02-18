import Button from '@components/buttons/Button'
import Input from '@components/forms/Input'
import { useNewsletterSubscription } from '@hooks/useNewsletterSubscription'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Form, { Field } from 'rc-field-form'
import React from 'react'

const ArticleCTA = () => {
    const { t } = useTranslation('articles')
    const router = useRouter()
    const [form] = Form.useForm()
    const { subscribe, loading } = useNewsletterSubscription()

    const articlePath = router.pathname.startsWith('/articles/')
    const pageTitle = typeof window !== 'undefined' ? document.title : router.pathname

    const handleSubscribe = async (values: { email: string }) => {
        const { email } = values
        const result = await subscribe(email)

        if (result.success) {
            if (articlePath) {
                trackEvent(GA_EVENTS.SUBSCRIBE_NEWSLETTER, {
                    'Page title': pageTitle
                })
            } else {
                trackEvent(GA_EVENTS.SUBSCRIBE_NEWSLETTER)
            }
            form.resetFields()
        }
    }

    return (
        <div className='pt-4 xl:pt-[76px]'>
            <div className='bg-grey-black relative flex h-full w-full flex-col items-center gap-12 overflow-hidden xl:flex-row'>
                <div className='flex min-w-[380px] flex-col items-start gap-5 px-5 pt-8 xl:gap-6 xl:pl-20 xl:pr-0'>
                    <h2 className='text-heading-2-desktop text-grey-white'>{t('cta.title')}</h2>
                    <p className='text-paragraph-6-desktop text-grey-100'>{t('cta.description')}</p>

                    <Form form={form} onFinish={handleSubscribe} className='flex w-full flex-row items-center gap-2'>
                        <Field
                            name='email'
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email address' }
                            ]}
                        >
                            <Input
                                size='md'
                                placeholder={t('cta.placeholder')}
                                className='!border-grey-200 w-[200px] !rounded-none bg-transparent'
                                inputClassName='text-left xl:text-button-3-desktop text-button-3-mobile placeholder:text-gray-200 text-grey-200 !px-0'
                                autoComplete='email'
                                disabled={loading}
                            />
                        </Field>

                        <Button
                            type='submit'
                            variant='secondary'
                            className='!bg-grey-white !text-button-3-desktop !rounded-none'
                            loading={loading}
                            disabled={loading || form.getFieldValue('email')?.length === 0}
                        >
                            {t('cta.button')}
                        </Button>
                    </Form>
                </div>

                <div
                    style={{
                        background: 'linear-gradient(270deg, rgba(1, 1, 1, 0) 52.44%, #010101 100%)'
                    }}
                    className='hidden h-[595px] xl:block'
                >
                    <Image
                        src='/images/article/cta.webp'
                        alt='Article CTA'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-auto w-auto'
                    />
                </div>
                <div
                    style={{
                        background: `linear-gradient(270deg, rgba(1, 1, 1, 0) 58.4%, #010101 100%), 
linear-gradient(180deg, rgba(1, 1, 1, 0) 59.44%, #010101 99.87%), 
linear-gradient(0deg, rgba(1, 1, 1, 0) 56.25%, #010101 91.3%), 
linear-gradient(90deg, rgba(1, 1, 1, 0) 66.6%, #010101 99.98%)`
                    }}
                    className='block h-[248px] xl:hidden'
                >
                    <Image
                        src='/images/article/cta-mobile.webp'
                        alt='Article CTA'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-full w-auto'
                    />
                </div>
            </div>
        </div>
    )
}

export default ArticleCTA
