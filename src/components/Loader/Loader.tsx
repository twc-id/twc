/* eslint-disable react/default-props-match-prop-types */
import * as React from 'react'

import loaderTypeComponents from './components'

const defaultType = 'Oval'

interface LoadersProps extends LoaderProps {
    type?: 'ThreeDots' | 'Oval'
}

const Loader: React.FC<LoadersProps> = ({ type = defaultType, width, height, color, label, radius }: LoadersProps) => {
    const LoaderTypeComponent = loaderTypeComponents[type]

    return (
        <>
            {React.createElement(LoaderTypeComponent, {
                width,
                height,
                color,
                label,
                radius
            })}
        </>
    )
}

Loader.defaultProps = {
    width: 80,
    height: 80,
    color: '#010101',
    label: 'Loading',
    type: defaultType
}

export default Loader
