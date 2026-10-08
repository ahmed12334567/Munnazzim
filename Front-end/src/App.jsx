
import Login from './components/login.jsx';
import SignUp from './components/signin.jsx';
import Home from './components/home.jsx';
import UserTasksPage from './components/user/user_tasks_page.jsx';
import UserSettingsPage from './components/user/user_setting_page.jsx';
import UserTeamPage from './components/user/user_team_page.jsx';
import AdminSettingsPage from './components/admin/admin_setting_page.jsx';
import AdminAddTasksPage from './components/admin/admin_add_tasks_page.jsx';
import AdminTeamPage from './components/admin/admin_team_page.jsx';
import { Routes, Route } from 'react-router-dom';


function App() {

  return (

    <>
        
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/user/tasks" element={<UserTasksPage />} />
        <Route path="/user/settings" element={<UserSettingsPage />} />
        <Route path="/user/team" element={<UserTeamPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/add-tasks" element={<AdminAddTasksPage />} />
        <Route path="/admin/team" element={<AdminTeamPage />} />
      </Routes>
    </>
  )
}

export default App;