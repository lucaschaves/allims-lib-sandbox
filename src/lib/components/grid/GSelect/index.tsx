import { useState } from "react";
import Select from "../../base/Select";
import CellContainer from "../../container/Cell";

interface IGSelectProps {
    id: string;
    field: string;
    handleKeyDown(event: any): void;
}

export default function GSelect(props: IGSelectProps) {
    const { id, field, handleKeyDown } = props;

    const [isOpen, setOpen] = useState(false);

    function handleOpen() {
        setOpen(!isOpen);
    }

    return (
        <CellContainer id={id} handleKeyDown={handleKeyDown}>
            <Select field={field} handleOpen={handleOpen} isOpen={isOpen} />
        </CellContainer>
    );
}
