import React from "react";

export interface Props {
    name: string;
    level?: number;
}

class HelloComponent extends React.Component<Props> {
    render() {
        const { name, level = 1 } = this.props;

        if (level <= 0) {
            throw new Error("Level need to be positive")
        }

        return (
            <div className="hello">
                <div>
                    Component hello, {name + getExclamationMarks(level)}
                </div>
            </div>
        )
    }
}

export default HelloComponent;

// helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join("!");
}
