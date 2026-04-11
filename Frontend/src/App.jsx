import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AdminLayout from "./components/layout/AdminLayout";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import SurveyList from "./pages/SurveyList";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar */}
        <Route path="/" element={<><Navbar /><div className="min-h-screen bg-slate-50"><Home /></div></>} />
        <Route path="/home" element={<><Navbar /><div className="min-h-screen bg-slate-50"><Home /></div></>} />
        <Route path="/survey" element={<><Navbar /><Survey /></>} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes with Sidebar */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/stats/:serviceId" element={<Stats />} />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;