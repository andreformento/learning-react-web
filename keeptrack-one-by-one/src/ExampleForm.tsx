import React from "react";

export default function ExampleForm() {
    const [value, setValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (inputRef.current) {
            setValue(inputRef.current.value);
        }
    };

    return (
        <div>
            <h5>Example form</h5>
            <form onSubmit={handleSubmit}>
                <input type="text" defaultValue="initial value" ref={inputRef} />
                <pre>{value}</pre>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}
