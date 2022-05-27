import { useController, useFormContext } from "react-hook-form";

interface IRules {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
    pattern?: any;
}

interface IInputProps {
    id?: string;
    field: string;
    rules?: IRules;
    disabled?: boolean;
    readOnly?: boolean;
    style?: any;
}

export default function Input(props: IInputProps) {
    const { control } = useFormContext();

    const {
        field: { name, onBlur, onChange, ref, value },
    } = useController({ name: props.field, control, rules: props.rules });

    return (
        <input
            id={props.id}
            className="allims-lib-base-input"
            ref={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            disabled={props?.disabled}
            readOnly={props?.readOnly}
            style={props?.style}
        />
    );
}
