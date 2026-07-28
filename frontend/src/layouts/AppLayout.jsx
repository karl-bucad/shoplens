import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function AppLayout() {
  const { logout } = useAuth()

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>ShopLens</h2>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/imports">Imports</NavLink>
        </nav>
      </aside>

      <div className="content">
        <header className="topbar">
          <button onClick={logout}>
            Log out
          </button>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout