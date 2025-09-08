import React from 'react'
import { User } from '../../../types'

interface AdminDashboardHeaderProps {
  user: User
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({ user }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome back, {user.username}. Manage the entire federation platform.</p>
    </div>
  )
}

export default AdminDashboardHeader