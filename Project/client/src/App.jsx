import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboad';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';


function App() {
  // const [count, setCount] = useState(0)
  // const [email, setEmail] =useState("");

  return (
    <>

<Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        {/* Default route */}
        <Route path="/" element={<Login />} /> 
      </Routes>
    </Router>

    {/* <Login></Login> */}
    {/* <Courses title="CS418" description="Web Programming">
      <h3>React Class - Project Setup</h3>
      <p>Testing children props</p>

    </Courses>

    
    <Courses title="CS471" description="Operating System"></Courses>
    
    <Courses title="CS432" description="Web Science"></Courses>
     <Images></Images>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
