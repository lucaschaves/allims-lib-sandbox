import { useEffect, useRef, useState } from "react";
import putData from "../../../hooks/api/putData";
import Input from "../../base/Input";
import CellContainer from "../../container/Cell";

interface IGInputTextProps {
    id: string;
    field: string;
    pivot: boolean;
    typeCell: string;
    indexRow: number;
    indexCol: number;
    fixedLeft: number;
    style?: any;
    dataset?: any;
}

export default function GInputText(props: IGInputTextProps) {
    const {
        id,
        field,
        pivot,
        typeCell,
        indexRow,
        indexCol,
        fixedLeft,
        style,
        ...rest
    } = props;

    const inputTextRef = useRef<any>(null);

    const [isModeEdit, setModeEdit] = useState(false);

    function toggleEdit() {
        inputTextRef.current = "true";
        setModeEdit(!isModeEdit);
    }

    async function handleValidCell(): Promise<boolean> {
        const cellDataset = document.getElementById(id) as HTMLElement;

        const cellBody = {
            colId: cellDataset.dataset?.colid,
            rowId: cellDataset.dataset?.rowid,
            cellId: cellDataset.dataset?.cellid,
            value: (cellDataset.lastElementChild as HTMLInputElement)?.value,
        };

        console.log("cellBody", cellBody);
        const { data, success, message } = await putData({
            url: "/api/safe/data/cells?field=entradaDeDadosLista&action=edit",
            body: [cellBody],
        });

        console.log("message", message);
        console.log("data", data);

        if (success) {
            if (data[0]) {
                cellDataset.dataset.error = String(!!data[0]?.error) || "false";
                cellDataset.dataset.errorMessage = data[0]?.error || "";
            }

            return true;
        }
        cellDataset.dataset.error = "true";
        cellDataset.dataset.errorMessage = message;

        return false;
    }

    async function getCellFocus() {
        if (isModeEdit) {
            const elementId = document.getElementById(`${id}Value`);
            elementId && elementId.focus();
        } else {
            if (await handleValidCell()) {
                const elementId = document.getElementById(`${id}Content`);
                elementId && elementId.focus();
            } else {
                console.log("invalid");
            }
        }
    }

    useEffect(() => {
        if (inputTextRef.current) {
            getCellFocus();
        }
    }, [isModeEdit]);

    useEffect(() => {
        return () => {
            inputTextRef.current = null;
        };
    }, []);

    return (
        <CellContainer
            id={id}
            data-edit={isModeEdit}
            isEdit={isModeEdit}
            toggleEdit={toggleEdit}
            style={{
                ...style,
                top:
                    !pivot && ["table", "row"].includes(typeCell)
                        ? (indexCol + 1) * 25 - 25
                        : 0,
                left: pivot ? fixedLeft : 0,
                position: fixedLeft >= 0 ? "sticky" : "",
                zIndex: fixedLeft >= 0 ? 2 : 1,
            }}
            {...rest}
        >
            <Input
                id={`${id}Content`}
                field={`${field}Content`}
                readOnly
                style={{ display: isModeEdit ? "none" : "flex" }}
            />
            <Input
                id={`${id}Value`}
                field={field}
                style={{ display: isModeEdit ? "flex" : "none" }}
            />
        </CellContainer>
    );
}
