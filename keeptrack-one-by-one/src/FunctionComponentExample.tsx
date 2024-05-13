import { useState } from "react";

interface ButtonProps {
    onClickFunction: () => void;
}
export function Button({ onClickFunction }: ButtonProps): JSX.Element {
    return <button onClick={onClickFunction}>+1</button>
}

interface ResultProps {
    value: number;
}

const Result: React.FC<ResultProps> = ({ value }) => {
    return <div>Result: {value}</div>;
}

export default function FunctionComponentExample(): JSX.Element {
    const [counter, setCounter] = useState<number>(0);

    const incrementCounter = (): void => {
        setCounter((p) => p + 1);
    };

    return (
        <div>
            <Button onClickFunction={incrementCounter} />
            <Result value={counter} />
        </div>
    )
}
