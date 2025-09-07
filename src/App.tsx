import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store'
import { fetchAllAppData } from './store/slices/appDataSlice'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Homepage from './pages/public/Homepage'
import Tournaments from './pages/public/Tournaments'
import Courts from './pages/public/Courts'
import Ranking from './pages/public/Ranking'
import States from './pages/public/States'
import Rules from './pages/public/Rules'
import RegisterSelect from './pages/public/RegisterSelect'
import PlayerRegister from './pages/public/register/PlayerRegister'
import CoachRegister from './pages/public/register/CoachRegister'
import ClubRegister from './pages/public/register/ClubRegister'
import PartnerRegister from './pages/public/register/PartnerRegister'
import StateRegister from './pages/public/register/StateRegister'
import Login from './pages/public/Login'
import Dashboard from './pages/private/Dashboard'
import AdminDashboard from './pages/admin/dashboard'
import PlayerDashboard from './pages/player/dashboard'
import CoachDashboard from './pages/coach/dashboard'
import ClubDashboard from './pages/club/dashboard'
import PartnerDashboard from './pages/partner/dashboard'
import StateDashboard from './pages/state/dashboard'

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchAllAppData())
  }, [dispatch])

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/player/dashboard" element={<PlayerDashboard />} />
        <Route path="/coach/dashboard" element={<CoachDashboard />} />
        <Route path="/club/dashboard" element={<ClubDashboard />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/state/dashboard" element={<StateDashboard />} />
        {/* Additional routes will be added here */}
        <Route path="/register" element={<RegisterSelect />} />
        <Route path="/register/player" element={<PlayerRegister />} />
        <Route path="/register/coach" element={<CoachRegister />} />
        <Route path="/register/club" element={<ClubRegister />} />
        <Route path="/register/partner" element={<PartnerRegister />} />
        <Route path="/register/state" element={<StateRegister />} />
        <Route path="/info/:userType" element={<div className="min-h-screen flex items-center justify-center pt-16"><div className="text-center"><h2 className="text-2xl font-bold text-gray-800 mb-4">Information</h2><p className="text-gray-600">Coming Soon</p></div></div>} />
        <Route path="/states" element={<States />} />
        <Route path="/states/:stateId" element={<div className="min-h-screen flex items-center justify-center pt-16"><div className="text-center"><h2 className="text-2xl font-bold text-gray-800 mb-4">State Details</h2><p className="text-gray-600">Coming Soon</p></div></div>} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:tournamentId" element={<div className="min-h-screen flex items-center justify-center pt-16"><div className="text-center"><h2 className="text-2xl font-bold text-gray-800 mb-4">Tournament Details</h2><p className="text-gray-600">Coming Soon</p></div></div>} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/courts" element={<Courts />} />
        <Route path="/rules" element={<Rules />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App