import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import TapRemote from './pages/TapRemote.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tap" element={<TapRemote />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
