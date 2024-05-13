import React, { SyntheticEvent } from "react";

export interface Props {
    name: String;
    level?: number;
}

interface State {
    currentLevel: number;
}

class HelloEvent extends React.Component<Props, State> {
    state = { currentLevel: this.props.level || 1 }
    onIncrement = (event: SyntheticEvent) => {
        console.log(event);
        this.updateLevel(1);
    };
    onDecrement = (event: SyntheticEvent) => {
        console.log(event.target);
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
                    Event hello, {name + getExclamationMarks(this.state.currentLevel)}
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
export default HelloEvent;

// helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join("!");
}
