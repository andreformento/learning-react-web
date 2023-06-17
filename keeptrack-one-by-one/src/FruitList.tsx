import React, { Component } from 'react';

export interface Fruit {
    id: number;
    name: string;
}

interface FruitListItemProps {
    fruit: Fruit;
    onRemove: (id: number) => void;
}

class FruitListItem extends Component<FruitListItemProps> {
    handleClick = () => {
        console.log(`removed c ${this.props.fruit.id}`);
        this.props.onRemove(this.props.fruit.id);
    };

    render() {
        return (
            <li onClick={this.handleClick}>
                {this.props.fruit.name}
            </li>
        );
    }
};

interface FruitListProps {
    fruits: Fruit[];
}

interface FruitListState {
    fruits: Fruit[];
}

class FruitList extends Component<FruitListProps, FruitListState> {
    constructor(props: FruitListProps) {
        super(props);
        this.state = {
            fruits: props.fruits,
        }
    }
    handleRemove = (id: number) => {
        // const updatedFruits = this.state.fruits.filter((fruit) => fruit.id != id);
        const updatedFruits = this.props.fruits.filter((fruit) => fruit.id !== id);
        this.setState({ fruits: updatedFruits });
    }

    render() {
        const fruitListItems = this.state.fruits.map((fruit) => (
            <FruitListItem key={fruit.id} fruit={fruit} onRemove={this.handleRemove} />
        ));
        return <ul>{fruitListItems}</ul>
    }
}

export default FruitList;
