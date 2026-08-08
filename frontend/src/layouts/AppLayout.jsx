import { useEffect, useState } from 'react'
import {
    NavLink,
    Outlet,
    useNavigate,
} from 'react-router-dom'

import GlobalSearch from '../components/GlobalSearch'
import { getProducts } from '../api/products'
import { useAuth } from '../context/useAuth'
import useGlobalSearch from '../hooks/useGlobalSearch'

function AppLayout() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const [products, setProducts] = useState([])

    const {
        query,
        results,
        isOpen,
        openSearch,
        closeSearch,
        handleQueryChange,
    } = useGlobalSearch(products)

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch {
                setProducts([])
            }
        }

        loadProducts()
    }, [])

    useEffect(() => {
        function handleKeyDown(event) {
            const isSearchShortcut =
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'

            if (isSearchShortcut) {
                event.preventDefault()

                if (isOpen) {
                    closeSearch()
                } else {
                    openSearch()
                }
            }

            if (event.key === 'Escape' && isOpen) {
                closeSearch()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [
        isOpen,
        openSearch,
        closeSearch,
    ])

    function handleSelectProduct() {
        closeSearch()
        navigate('/products')
    }

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

                    <button
                        type="button"
                        className="global-search-trigger"
                        onClick={openSearch}
                    >
                        <span>Search ShopLens</span>

                        <kbd>⌘K</kbd>
                    </button>

                    <div className="topbar-status">
                        <span className="status-dot" />
                        Market data workspace
                    </div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>

            <GlobalSearch
                query={query}
                results={results}
                isOpen={isOpen}
                onQueryChange={handleQueryChange}
                onClose={closeSearch}
                onSelectProduct={handleSelectProduct}
            />
        </div>
    )
}

export default AppLayout