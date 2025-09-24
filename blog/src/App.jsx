import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import Navbar from './components/Navbar';
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-900">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 bg-dark-800 rounded-lg shadow-lg my-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs/:id" element={<BlogDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-blog" element={<CreateBlogPage />} />
            <Route path="/edit-blog/:id" element={<EditBlogPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
