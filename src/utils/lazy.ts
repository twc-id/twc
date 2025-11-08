import dynamic from 'next/dynamic'
import React from 'react'

const lazy = (fn: () => Promise<{ default: React.FC<React.SVGProps<SVGSVGElement>> }>) => {
    return dynamic(() => fn().then((module) => ({ default: module.default })), {
        ssr: true
    })
}

export default lazy
