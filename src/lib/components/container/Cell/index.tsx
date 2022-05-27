import { KeyboardEvent, MouseEvent } from "react";

interface ICellContainerProps {
    id: string;
    children: any;
    isEdit: boolean;
    style?: any;
    dataset?: any;
    toggleEdit(): void;
}

export default function CellContainer(props: ICellContainerProps) {
    const { id, children, isEdit, toggleEdit, dataset, ...rest } = props;

    function getDatasetValue(direction: string) {
        const dataset = rest as any;

        switch (direction) {
            case "ArrowDown":
                return dataset["data-arrow-down"];
            case "ArrowUp":
                return dataset["data-arrow-up"];
            case "ArrowLeft":
                return dataset["data-arrow-left"];
            case "ArrowRight":
                return dataset["data-arrow-right"];
            default:
                break;
        }
    }

    function handleNavigation(direction: string) {
        const keyNavigation = getDatasetValue(direction);

        const elementId = document.getElementById(keyNavigation);
        if (elementId) {
            if (isEdit) {
                toggleEdit();
            }
            elementId.click();
        }
    }

    function handleCleanState(state: string) {
        const listState = document.querySelectorAll(`[data-state="${state}"]`);
        Array.from(listState).forEach((item: any) => {
            item.dataset.state = item.dataset.stateDefault;
        });
    }

    function getTarget(target: HTMLElement): HTMLElement {
        if (
            target.tagName.toLocaleLowerCase() === "input" &&
            target.parentElement
        ) {
            return getTarget(target.parentElement as HTMLElement);
        } else {
            return target;
        }
    }

    function getCellActive(): HTMLElement | null {
        const listState = document.querySelectorAll(
            '[data-state="active"]'
        )[0] as HTMLElement;
        if (listState) {
            return listState;
        }
        return null;
    }

    function handleClick(event: MouseEvent<HTMLLabelElement>) {
        const newTarget = getTarget(event.target as HTMLElement);

        if (event.altKey || event.ctrlKey) {
            newTarget.dataset.state = "selected";
        } else if (event.shiftKey) {
            const listState = getCellActive();

            if (listState) {
                const {
                    frontrow: lastFrontRow = 0,
                    frontcol: lastFrontCol = 0,
                } = listState.dataset;
                const {
                    frontrow: actualFrontRow = 0,
                    frontcol: actualFrontCol = 0,
                    frontfield,
                } = newTarget.dataset;

                if (+actualFrontCol >= +lastFrontCol) {
                    for (
                        let indexRow = +lastFrontCol;
                        indexRow <= +actualFrontCol;
                        indexRow++
                    ) {
                        for (
                            let indexCol = +lastFrontRow;
                            indexCol <= +actualFrontRow;
                            indexCol++
                        ) {
                            const elementId = document.getElementById(
                                `${frontfield}.${indexCol}.${indexRow}`
                            ) as HTMLElement;

                            elementId.dataset.state = "selected";
                        }
                    }

                    listState.dataset.state = "active";
                }
            }
        } else {
            handleCleanState("selected");
            handleCleanState("active");

            newTarget.dataset.state = "active";
        }
    }

    function handleKeyDown(event: KeyboardEvent<HTMLLabelElement>) {
        switch (event.code) {
            case "ArrowUp":
                handleNavigation("ArrowUp");
                break;
            case "ArrowDown":
                handleNavigation("ArrowDown");
                break;
            case "ArrowLeft":
                handleNavigation("ArrowLeft");
                break;
            case "ArrowRight":
                handleNavigation("ArrowRight");
                break;
            case "Escape":
                toggleEdit();
            case "Enter":
                toggleEdit();
            default:
                break;
        }
    }

    let datasetCell = {};

    dataset &&
        Object.keys(dataset).forEach((keyData) => {
            datasetCell = {
                ...datasetCell,
                [`data-${keyData.toLowerCase()}`]: dataset[keyData],
            };
            if (keyData === "state") {
                datasetCell = {
                    ...datasetCell,
                    [`data-state-default`]: dataset[keyData],
                };
            }
        });

    return (
        <label
            id={id}
            className="allims-lib-cellcontainer"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            {...datasetCell}
            {...rest}
        >
            {children}
        </label>
    );
}
