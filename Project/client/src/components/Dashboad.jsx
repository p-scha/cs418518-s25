import { useNavigate } from 'react-router-dom'; // useNavigate hook for redirection



export default function Dashboard() {
    const navigate = useNavigate();
    return (<>
    <h3>Welcome to your Homepage</h3>
    <button type="button" className="button" onClick={() => navigate('/changepassword')}>
        Change Password
    </button>
    <button type="button" className="button" onClick={() => navigate('/login')}>
        Update Information
    </button>

    </>)
}