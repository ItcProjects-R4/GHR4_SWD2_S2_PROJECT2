import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import AuthModal from '../AuthModal/AuthModal'

export default function Layout() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: '1 0 auto', width: '100%' }}>
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  )
}
