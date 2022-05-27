import Input from "../../base/Input";
import FieldContainer from "../../container/Field";

interface IFInputTextProps {
    field: string;
}

export default function FInputText(props: IFInputTextProps) {
    return (
        <FieldContainer>
            <Input {...props} />
        </FieldContainer>
    );
}
