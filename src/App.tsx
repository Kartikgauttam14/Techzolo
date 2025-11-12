import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import RootLayout from './components/RootLayout'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import DomainSearchPage from './pages/DomainSearchPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/domain-search" element={<DomainSearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </Suspense>
      </RootLayout>
    </BrowserRouter>
  )
}

export default App

