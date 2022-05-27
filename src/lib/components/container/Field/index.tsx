interface IFieldContainerProps {
    children: any;
}

export default function FieldContainer(props: IFieldContainerProps) {
    const { children } = props;

    return <div>{children}</div>;
}
