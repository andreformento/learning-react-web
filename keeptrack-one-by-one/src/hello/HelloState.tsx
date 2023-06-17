import React from "react";

export interface Props {
    name: String;
    level?: number;
}

interface State {
    currentLevel: number;
}

class HelloState extends React.Component<Props, State> {
    state = { currentLevel: this.props.level || 1 }
    onIncrement = () => {
        this.updateLevel(1);
    };
    onDecrement = () => {
        this.updateLevel(-1);
    };

    render() {
        const { name } = this.props;

        if (this.state.currentLevel <= 0) {
            throw new Error("Level cannot be negative")
        }

        return (
            <div className="hello">
                <div className="greeting">
                    State hello, {name + getExclamationMarks(this.state.currentLevel)}
                    <button onClick={this.onDecrement}>-</button>
                    <button onClick={this.onIncrement}>+</button>
                </div>
            </div>
        )
    }

    updateLevel(change: number) {
        this.setState((currentState) => {
            return { currentLevel: currentState.currentLevel + change }
        });
    };
}
export default HelloState;

// helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join("!");
}
