import React from 'react'
import { useNavigate } from 'react-router-dom'
import LandingHero from '../../components/homepage/LandingHero'
import AboutFederation from '../../components/homepage/AboutFederation'
import KeyFeatures from '../../components/homepage/KeyFeatures'
import CallToAction from '../../components/homepage/CallToAction'

const Homepage: React.FC = () => {
  const navigate = useNavigate()

  const handleRegisterClick = () => {
    navigate('/register')
  }

  const handleExploreClick = (page: string) => {
    navigate(`/${page}`)
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <LandingHero onRegisterClick={handleRegisterClick} onExploreClick={handleExploreClick} />
      <AboutFederation />
      <KeyFeatures onExploreClick={handleExploreClick} />
      <CallToAction onRegisterClick={handleRegisterClick} />
    </div>
  )
}

export default Homepage