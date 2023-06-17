import React from "react";

export default function SigninForm() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(username, password);
    };

    return (
        <div>
            <h5>Signin form</h5>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit">Sign in</button>
            </form>
        </div>
    );
}
