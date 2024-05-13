import React from 'react';
import Child from './Child';

export default function Parent(): JSX.Element {
    const [words, setWords] = React.useState('');
    const [show, setShow] = React.useState(false);
    const handleClick = () => {
        setShow((s) => !s);
        setWords(show ? 'Did you do your homework?':'');
    }
    const handleRequest = (request:String) => {
        if (request.includes('car')) {
            alert('no');
        }
    };

    return (
        <div>
            <h1>Parent</h1>
            <Child onRequest={handleRequest} />
        </div>
    );
}
