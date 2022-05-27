import { useController, useFormContext } from "react-hook-form";

interface IRules {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
    pattern?: any;
}

interface ISelectProps {
    field: string;
    isOpen: boolean;
    handleOpen(): void;
    rules?: IRules;
}

export default function Select(props: ISelectProps) {
    const { control } = useFormContext();

    const {
        field: { name, onBlur, onChange, ref, value },
        fieldState: { isDirty, isTouched, error },
    } = useController({ name: props.field, control, rules: props.rules });

    return (
        <>
            <div>
                <input
                    ref={ref}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                />

                <button onClick={props.handleOpen}>Open</button>
            </div>

            {props.isOpen && (
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <span style={{ height: 25 }}>Teste</span>
                    <span style={{ height: 25 }}>Teste 2</span>
                    <span style={{ height: 25 }}>Teste 3</span>
                </div>
            )}
        </>
    );
}
