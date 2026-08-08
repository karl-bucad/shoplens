import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { Toaster } from 'sonner'

import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ImportsPage from './pages/ImportsPage'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import ShopResearchPage from './pages/ShopResearchPage'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3500}
        toastOptions={{
          style: {
            borderRadius: '12px',
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/overview"
              element={<DashboardPage />}
            />

            <Route
              path="/products"
              element={<ProductsPage />}
            />

            <Route
              path="/shops"
              element={<ShopResearchPage />}
            />

            <Route
              path="/imports"
              element={<ImportsPage />}
            />
          </Route>
        </Route>

        <Route
          path="/"
          element={<Navigate to="/overview" replace />}
        />

        <Route
          path="/dashboard"
          element={<Navigate to="/overview" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/overview" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App