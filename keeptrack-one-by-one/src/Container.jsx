import React from 'react';


function ID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

class Item {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

const initialItems = [
    new Item(ID(), 'First Item'),
    new Item(ID(), 'Second Item'),
    new Item(ID(), 'Third Item'),
];

function ListItem({ item, onEdit, onRemove }) {
    return (
        <p>
            <span>{item.name}</span>
            <button onClick={() => onEdit(item)}>Edit</button>
            <button onClick={() => onRemove(item)}>Remove</button>
        </p>
    );
}

function List({ items, onRemove, onUpdate }) {
    const [editingItem, setEditingItem] = React.useState(null);

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleCancel = () => {
        setEditingItem(null);
    };

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>
                    {item === editingItem ? (
                        <Form item={item} onSubmit={onUpdate} onCancel={handleCancel} />
                    ) : (
                        <ListItem item={item} onEdit={handleEdit} onRemove={onRemove} />
                    )}
                </li>
            ))}
        </ul>
    );
}

function Form({ item, onSubmit, onCancel, buttonValue }) {
    const [inputValue, setInputValue] = React.useState(item.name || '');

    const handleChange = (event) => {
        event.preventDefault();
        setInputValue(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const submittedItem = {
            id: item ? item.id : ID(),
            name: inputValue,
        };

        onSubmit(submittedItem);
        setInputValue('');
    };

    const handleCancel = (event) => {
        event.preventDefault();
        onCancel();
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <input value={inputValue} onChange={handleChange} />
            <button>{buttonValue || 'Save'}</button>
            {onCancel && (
                <a href="#" onClick={handleCancel}>
                    cancel
                </a>
            )}
        </form>
    );
}

export default function Container() {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => setItems(initialItems), []);

    const addItem = (item) => {
        setItems([...items, item]);
    };

    const updateItem = (updatedItem) => {
        let updatedItems = items.map((item) => {
            return item.id === updatedItem.id
                ? Object.assign({}, item, updatedItem)
                : item;
        });
        return setItems(updatedItems);
    };

    const removeItem = (removeThisItem) => {
        const filteredItems = items.filter((item) => item.id != removeThisItem.id);
        setItems(filteredItems);
    };

    return (
        <React.Fragment>
            <Form item="" onSubmit={addItem} buttonValue="Add" />
            <List items={items} onRemove={removeItem} onUpdate={updateItem} />
        </React.Fragment>
    );
}
