import { useEffect, useState } from "react";

interface IKeyPressed {
    state: boolean;
    target: any;
}

export default function useKeyPress(targetKey: any) {
    const [keyPressed, setKeyPressed] = useState<IKeyPressed>({
        state: false,
        target: null,
    });

    const downHandler = ({ key, target }: any) => {
        if (key === targetKey) {
            setKeyPressed({
                state: true,
                target,
            });
        }
    };

    const upHandler = ({ key }: any) => {
        if (key === targetKey) {
            setKeyPressed({
                state: false,
                target: null,
            });
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, []);

    return keyPressed;
}
