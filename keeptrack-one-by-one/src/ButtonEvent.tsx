import React from 'react';

function handleClick(event: React.MouseEvent<HTMLElement>) {
    console.log(event.target);
    console.log(event.currentTarget);
};

function ButtonEvent() {
    return <button onClick={handleClick}>Click Me!</button>
}

export default ButtonEvent;
