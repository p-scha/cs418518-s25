import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
    const { token } = useParams();
    const [message, setMessage] = useState("Verifying...");
    const navigate = useNavigate();

    useEffect(() => {
        async function verify() {
            const response = await fetch(`http://localhost:8080/user/verify/${token}`);
            const result = await response.json();

            if (response.ok) {
                setMessage("Email verified!");
            } else {
                setMessage(result.message);
            }
        }
        verify();
    }, [token, navigate]);

    return <div>{message}</div>;
}
