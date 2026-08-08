import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function AppLayout() {
    const { logout } = useAuth()

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <h2>ShopLens</h2>
                    <span>Market Intelligence</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/overview">
                        Overview
                    </NavLink>

                    <NavLink to="/products">
                        Product Research
                    </NavLink>

                    <NavLink to="/shops">
                        Shop Research
                    </NavLink>

                    <NavLink to="/imports">
                        Imports
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={logout}
                    >
                        Log out
                    </button>
                </div>
            </aside>

            <div className="content">
                <header className="topbar">
                    <div>
                        <span className="topbar-label">
                            TikTok Shop Research
                        </span>
                    </div>

                    <div className="topbar-status">
                        <span className="status-dot" />
                        Market data workspace
                    </div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AppLayout