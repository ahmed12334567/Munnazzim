
import Login from './components/login.jsx';
import SignUp from './components/signin.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (

    <>
        
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App;