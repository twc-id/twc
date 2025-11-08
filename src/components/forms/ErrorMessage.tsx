import classNames from '@lib/classnames'
import { get, useFormState } from 'react-hook-form'

type ErrorMessageProps = {
    id: string
} & React.ComponentPropsWithoutRef<'p'>

export default function ErrorMessage({ id, className, ...rest }: ErrorMessageProps) {
    const { errors } = useFormState()
    const error = get(errors, id)

    return (
        <p className={classNames('text-sm text-red-500', className)} {...rest}>
            {error.message?.toString()}
        </p>
    )
}
