interface ChildProps {
    onRequest: (request: string) => void;
}

export default function Child(props: ChildProps): JSX.Element {
    const handleClick = (): void => {
        props.onRequest('Can I have the car?');
    };

    return (
        <div>
            <h2>Child</h2>
            <button onClick={handleClick}>Ask for the car</button>
        </div>
    );
}
