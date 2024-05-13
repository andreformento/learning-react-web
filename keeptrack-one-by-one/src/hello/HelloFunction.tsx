export interface Props {
    name: string;
    level?: number;
}

function HelloFunction({ name, level = 1 }: Props) {
    if (level <= 0) {
        throw new Error("Should be a positive level");
    }
    return (
        <div className="hello">
            <div className="greeting">
                Function hello, {name + getExclamationMarks(level)}
            </div>
        </div>
    )
}

export default HelloFunction;

// helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join("!");
}
