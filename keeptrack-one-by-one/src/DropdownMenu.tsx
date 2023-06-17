import { useState } from 'react';

function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen((currentIsOpen) => !currentIsOpen);
    };

    return (
        <div >
            <button onClick={handleClick}>Actions</button>
            {isOpen &&
                (
                    <ul>
                        <li>Edit</li>
                        <li>Remove</li>
                        <li>Archive</li>
                    </ul>
                )}
        </div>
    );
}

export default DropdownMenu;
