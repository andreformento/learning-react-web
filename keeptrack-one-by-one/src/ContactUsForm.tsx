import React from "react";

export default function ContactUsForm() {
    const [department, setDepartment] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [agreedToTerms, setAgreedToTerms] = React.useState(false);

    const [departmentError, setDepartmentError] = React.useState('');
    const [messageError, setMessageError] = React.useState('');
    const [agreedToTermsError, setAgreedToTermsError] = React.useState('');

    const [departmentTouched, setDepartmentTouched] = React.useState(false);
    const [messageTouched, setMessageTouched] = React.useState(false);
    const [agreedToTermsTouched, setAgreedToTermsTouched] = React.useState(false);

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const isValid = !departmentError && !messageError && !agreedToTermsError;
        if (!isValid) {
            return;
        }

        console.log('submitting', { department, message, agreedToTerms });
    };

    React.useEffect(() => {
        validate();
    }, [department, message, agreedToTerms]);

    function validate() {
        setDepartmentError('');
        setMessageError('');
        setAgreedToTermsError('');

        if (department === '') {
            setDepartmentError('Department is required.');
        }
        if (message === '') {
            setMessageError('Message is required.');
        }
        if (agreedToTerms === false) {
            setAgreedToTermsError('You must agree to the terms and conditions.');
        }
    }

    function stateToString() {
        return JSON.stringify(
            {
                values: { department, message, agreedToTerms },
                errors: { departmentError, messageError, agreedToTermsError },
                touched: { departmentTouched, messageTouched, agreedToTermsTouched },
            },
            null,
            ' '
        );
    }

    return (
        <div>
            <h5>Contact us form</h5>
            <form onSubmit={handleSubmit}>
                <select
                    name="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    onBlur={(e) => setDepartmentTouched(true)}
                >
                    <option value="">Select...</option>
                    <option value="hr">Human Resources</option>
                    <option value="pr">Public Relations</option>
                    <option selected value="support">Support</option>
                </select>
                {departmentError && departmentTouched && (
                    <p className="alert">{departmentError}</p>
                )}<br />
                <textarea
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={(e) => setMessageTouched(true)}
                    cols={30}
                    rows={3}
                />
                {messageError && messageTouched && (
                    <p className="alert">{messageError}</p>
                )}<br />
                <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    onBlur={(e) => setAgreedToTermsTouched(true)}
                />
                I agree...
                {agreedToTermsError && agreedToTermsTouched && (
                    <p className="alert">{agreedToTermsError}</p>
                )}<br />

                <button type="submit">Sign in</button>
            </form>
        </div>
    );
}
