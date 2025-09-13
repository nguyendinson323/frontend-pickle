import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './routes'
import { GlobalLoader } from './components/common/GlobalLoader'
import ToastNotification from './components/common/ToastNotification'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import routes from './Routelist'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <GlobalLoader />
      <ToastNotification />
      <Header />
      
      <main className="flex-1">
        <Routes>
          {routes.map((route) => (
            <Route 
              key={route.key}
              path={route.path} 
              element={
                route.public ? (
                  route.element
                ) : (
                  <ProtectedRoute allowedRoles={route.requiredRoles}>
                    {route.element}
                  </ProtectedRoute>
                )
              } 
            />
          ))}
          
          {/* Redirect old registration paths */}
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/register-player" element={<Navigate to="/register/player" replace />} />
          <Route path="/register-coach" element={<Navigate to="/register/coach" replace />} />
          <Route path="/register-club" element={<Navigate to="/register/club" replace />} />
          <Route path="/register-partner" element={<Navigate to="/register/partner" replace />} />
          <Route path="/register-state" element={<Navigate to="/register/state" replace />} />

          {/* Role-based root redirects */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/player" element={<Navigate to="/player/dashboard" replace />} />
          <Route path="/coach" element={<Navigate to="/coach/dashboard" replace />} />
          <Route path="/club" element={<Navigate to="/club/dashboard" replace />} />
          <Route path="/partner" element={<Navigate to="/partner/dashboard" replace />} />
          <Route path="/state" element={<Navigate to="/state/dashboard" replace />} />

          {/* Common alternative paths */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/sign-in" element={<Navigate to="/login" replace />} />

          {/* 404 route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App