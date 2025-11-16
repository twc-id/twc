interface Props {
    condition: boolean
    wrapper: (children: JSX.Element) => JSX.Element
    children: JSX.Element
}

const ConditionalWrapper: React.FC<Props> = ({ condition, wrapper, children }) =>
    condition ? wrapper(children) : children

export default ConditionalWrapper
