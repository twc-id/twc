import BaseDialog from '@components/dialog/BaseDialog'
import Footer from '@components/Footer'
import Header from '@components/Header/Header'
import { inter } from '@helpers/font'
import useDialogStore from '@store/useDialogStore'
import * as React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    //#region  //*=========== Store ===========
    const open = useDialogStore.useOpen()
    const state = useDialogStore.useState()
    const handleClose = useDialogStore.useHandleClose()
    const handleSubmit = useDialogStore.useHandleSubmit()
    //#endregion  //*======== Store ===========

    return (
        <div className={inter.className}>
            <Header />
            {children}
            <BaseDialog onClose={handleClose} onSubmit={handleSubmit} open={open} options={state} />
            <Footer />
        </div>
    )
}
