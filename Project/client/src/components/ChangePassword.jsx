import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // to navigate after successful password change
import "./Login.css"; // Add your CSS styles

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    function handleChangePassword() {
        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        const payload = {
            currentPassword,
            newPassword
        };

        fetch("http://localhost:8080/user/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            credentials: "same-origin"
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    setSuccessMessage("Password changed successfully.");
                } else {
                    setError(data.message || "An error occurred.");
                }
            })
            .catch((err) => setError("An error occurred: " + err.message));
    }

    return (
        <div id="change-password">
            <div className="controls">
                <p>
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </p>
                <p>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </p>
                <p>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </p>
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
            </div>
            <div className="actions">
                <button className="button" onClick={handleChangePassword}>
                    Change Password
                </button>
            </div>
        </div>
    );
}
