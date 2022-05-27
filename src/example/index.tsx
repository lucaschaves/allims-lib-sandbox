import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { FormProvider, useForm } from "react-hook-form";
import { GridEdit } from "../lib/components/secondary/GridEdit";
import getData from "../lib/hooks/api/getData";
import "../lib/styles/index.scss";

const arrayEntrada = Array.from({ length: 10 }).map((_, indexRow) => {
    return Array.from({ length: 4 }).map((_, indexCol) => ({
        field: `Name ${indexRow} ${indexCol}`,
        value: `Value ${indexRow} ${indexCol}`,
        valueContent:
            indexCol % 2
                ? `Content ${indexRow} ${indexCol}`
                : `Content ${indexRow} ${indexCol}`,
        type: "input",
        state: "empty",
    }));
});

function FormExample() {
    const [isLoading, setLoading] = useState(true);

    const methods = useForm({
        defaultValues: {
            // entradaDeDados: arrayEntrada,
        },
    });

    const onSubmit = (data: any) => console.log("submit", data);

    async function getValues() {
        const { data, success, message } = await getData({
            url: "/api/safe/data/grid?field=entradaDeDadosLista",
        });
        if (success) {
            methods.reset({
                entradaDeDados: data,
            });
        }

        setLoading(false);
    }

    useEffect(() => {
        getValues();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="allims-lib-form"
            >
                <GridEdit field="entradaDeDados" />
            </form>
        </FormProvider>
    );
}
function App() {
    return <FormExample />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
