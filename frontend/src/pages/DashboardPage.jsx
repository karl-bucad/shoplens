import { useAuth } from '../context/useAuth'

function DashboardPage() {
  const { logout } = useAuth()

  return (
    <main>
      <section>
        <h1>ShopLens Dashboard</h1>
        <p>Your analytics dashboard is connected and protected.</p>

        <button type="button" onClick={logout}>
          Log out
        </button>
      </section>
    </main>
  )
}

export default DashboardPage