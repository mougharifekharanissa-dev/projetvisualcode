import { Routes, Route, Link } from 'react-router-dom';
import ConsultationPage from './pages/ConsultationPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu simple */}
      <nav className="bg-white shadow p-4">
        <div className="flex space-x-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Accueil
          </Link>
          <Link 
            to="/consultation" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nouvelle Consultation
          </Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
            <p>Bienvenue dans le cabinet psychiatrique</p>
          </div>
        } />
        <Route path="/consultation" element={<ConsultationPage />} />
      </Routes>
    </div>
  );
}

export default App;