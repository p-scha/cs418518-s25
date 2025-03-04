import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();  // Get the reset token from the URL

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const response = await fetch("http://localhost:8080/user/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                newPassword,
            }),
        });

        const data = await response.json();

        if (data.status === 200) {
            setSuccess(true);
        } else {
            setError(data.message);
        }
    };

    return (
        <div>
            <h1>Reset Your Password</h1>
            {success ? (
                <div>
                    <p>Password has been reset successfully!</p>
                    <button onClick={() => navigate("/login")}>Go to Login</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Reset Password</button>
                </form>
            )}
        </div>
    );
}
