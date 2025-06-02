import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateProfile from './pages/CreateProfile';
import ViewProfile from './pages/ViewProfile';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="bg-dark">
      <Navbar />

      <div className="pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas (asumiendo que revisas token/rol dentro del componente) */}
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;