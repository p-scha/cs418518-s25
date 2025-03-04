import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Login.css"; // Reuse the same styles

export default function Register() {
    const [enteredFirstName, setEnteredFirstName] = useState("");
    const [enteredLastName, setEnteredLastName] = useState("");
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    function handleInputChange(identifier, value) {
        if (identifier === "firstName") {
            setEnteredFirstName(value);
        } else if (identifier === "lastName") {
            setEnteredLastName(value);
        } else if (identifier === "email") {
            setEnteredEmail(value);
        } else {
            setEnteredPassword(value);
        }
    }

    // Fetch API for registering an account
    const handleRegister = async () => {
        setSubmitted(true);

        // Body formatted the same way as login.jsx
        const formBody = JSON.stringify({
            FirstName: enteredFirstName,
            LastName: enteredLastName,
            Email: enteredEmail,
            Password: enteredPassword,
            IsAdmin: false,
            IsVerified: false,
        });

        const response = await fetch('http://localhost:8080/user/register', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            alert("Registration successful! Please check your email to verify your account.");
            navigate('/login'); // Redirect to login after successful registration
        } else {
            const errorData = await response.json();
            console.error("Registration Failed: ", errorData.message);
        }
    };

    // Validation
    const firstNameNotValid = submitted && enteredFirstName.trim().length < 2;
    const lastNameNotValid = submitted && enteredLastName.trim().length < 2;
    const emailNotValid = submitted && !enteredEmail.includes("@");
    const passwordNotValid = submitted && enteredPassword.trim().length < 8;

    return (
        <div id="register">
            <div className="controls">
                <p>
                    <label>First Name</label>
                    <input
                        type="text"
                        className={firstNameNotValid ? "invalid" : undefined}
                        onChange={(event) => handleInputChange("firstName", event.target.value)}
                    />
                </p>
                <p>
                    <label>Last Name</label>
                    <input
                        type="text"
                        className={lastNameNotValid ? "invalid" : undefined}
                        onChange={(event) => handleInputChange("lastName", event.target.value)}
                    />
                </p>
                <p>
                    <label>Email</label>
                    <input
                        type="email"
                        className={emailNotValid ? "invalid" : undefined}
                        onChange={(event) => handleInputChange("email", event.target.value)}
                    />
                </p>
                <p>
                    <label>Password</label>
                    <input
                        type="password"
                        className={passwordNotValid ? "invalid" : undefined}
                        onChange={(event) => handleInputChange("password", event.target.value)}
                    />
                </p>
            </div>
            <div className="actions">
                <button className="button" onClick={handleRegister}>
                    Sign Up
                </button>
                <button className="button" onClick={() => navigate('/login')}>
                    Back to Login
                </button>
            </div>
        </div>
    );

    
}
