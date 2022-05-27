import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import GInputText from "../../grid/GInputText";

interface IGridEditProps {
    field: string;
}

interface IScrollPX {
    widthRow: any;
    widthScroll: number;
    heightScroll: number;
}

const heightRow = 25;

interface ICellRowProps {
    filRow: any;
    indexRow: number;
    field: string;
    width: any;
    pivot: boolean;
}

function CellRow(props: ICellRowProps) {
    const { filRow, indexRow, field, width, pivot } = props;

    return (
        <>
            {Object.keys(filRow).map((filCol: any, indexCol: number) => {
                return (
                    <GInputText
                        key={`${indexRow}-${indexCol}`}
                        id={`${field}.${indexRow}.${indexCol}`}
                        field={`${field}.${indexRow}.${indexCol}.value`}
                        data-arrow-down={`${field}.${
                            pivot ? indexRow + 1 : indexRow
                        }.${pivot ? indexCol : indexCol + 1}`}
                        data-arrow-up={`${field}.${
                            pivot ? indexRow - 1 : indexRow
                        }.${pivot ? indexCol : indexCol - 1}`}
                        data-arrow-left={`${field}.${
                            pivot ? indexRow : indexRow - 1
                        }.${pivot ? indexCol - 1 : indexCol}`}
                        data-arrow-right={`${field}.${
                            pivot ? indexRow : indexRow + 1
                        }.${pivot ? indexCol + 1 : indexCol}`}
                        data-frontrow={indexRow}
                        data-frontcol={indexCol}
                        data-frontfield={field}
                        data-type={filRow[indexCol]?.type}
                        style={{
                            width: width?.[indexCol],
                        }}
                        dataset={filRow[indexCol]?.data}
                        indexRow={indexRow}
                        indexCol={indexCol}
                        typeCell={filRow[indexCol]?.type}
                        fixedLeft={
                            ["row", "table"].includes(filRow[indexCol]?.type)
                                ? width[indexCol - 1] || 0
                                : -1
                        }
                        pivot={pivot}
                    />
                );
            })}
        </>
    );
}

export function GridEdit(props: IGridEditProps) {
    const [isLoading, setLoading] = useState(true);
    const [pivot, setPivot] = useState(true);
    const [scrollPX, setScrollPX] = useState<IScrollPX>({
        widthRow: {},
        widthScroll: 0,
        heightScroll: 0,
    });

    const { field } = props;

    const { control } = useFormContext();

    const { fields } = useFieldArray({
        control,
        name: field,
    });

    function getWidthHeight() {
        let widthRow = {} as any;
        const rowOne = fields[0] as any;

        let widthScroll = 0;

        const heightScroll = pivot
            ? fields.length * heightRow
            : Object.keys(rowOne).length * heightRow - heightRow;

        const newWidth =
            rowOne[0]?.styles?.maxWidth ||
            rowOne[0]?.styles?.width ||
            rowOne[0]?.styles?.minWidth ||
            100;

        Array.from({ length: fields.length }).forEach(() => {
            widthScroll += newWidth;
        });
        Object.keys(rowOne).forEach((_, index: number) => {
            widthRow = {
                ...widthRow,
                [index]: newWidth,
            };
        });
        widthScroll -= newWidth;

        if (pivot) {
            widthScroll = -60;
            widthRow = {};
            Object.keys(rowOne).forEach((key: any, index: number) => {
                const newWidthP =
                    rowOne[key]?.styles?.width ||
                    rowOne[key]?.styles?.maxWidth ||
                    rowOne[key]?.styles?.minWidth ||
                    100;

                widthScroll += newWidthP;
                widthRow = {
                    ...widthRow,
                    [index]: newWidthP,
                };
            });
        }

        setLoading(false);

        setScrollPX({
            widthRow,
            widthScroll,
            heightScroll,
        });
    }

    useEffect(() => {
        getWidthHeight();
    }, [field, pivot]);

    if (isLoading) {
        return <p>Loading Grid ...</p>;
    }

    return (
        <>
            <div>
                <button type="button" onClick={() => setPivot(!pivot)}>
                    Pivot
                </button>
            </div>
            <div className="allims-lib-secondary-grid-edit">
                <div
                    className={
                        pivot
                            ? "allims-lib-secondary-grid-edit-pivot"
                            : "allims-lib-secondary-grid-edit-not-pivot"
                    }
                    style={{
                        width: scrollPX.widthScroll,
                        height: scrollPX.heightScroll,
                    }}
                >
                    {fields
                        .map((filRow: any) => {
                            let newKey = {};
                            Object.keys(filRow).forEach((k: any) => {
                                if (typeof filRow[k] !== "string") {
                                    newKey = {
                                        ...newKey,
                                        [k]: filRow[k],
                                    };
                                }
                            });

                            return newKey;
                        })
                        .map((filRow: any, indexRow: number) => (
                            <CellRow
                                key={`${indexRow}`}
                                filRow={filRow}
                                indexRow={indexRow}
                                field={field}
                                width={scrollPX.widthRow}
                                pivot={pivot}
                            />
                        ))}
                </div>
                <footer></footer>
            </div>
        </>
    );
}
