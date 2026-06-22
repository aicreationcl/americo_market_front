import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AppRouter } from './router/AppRouter'
import { Header } from '@/shop/components/layout/Header'
import { Footer } from '@/shop/components/layout/Footer'
import { CartDrawer } from '@/shop/components/cart/CartDrawer'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function ShopShell() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <AppRouter />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AppRouter />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Helmet
        defaultTitle="AMERICO Minimarket"
        titleTemplate="%s | AMERICO Minimarket"
      >
        <meta property="og:site_name" content="AMERICO Minimarket" />
        <meta name="theme-color" content="#d97706" />
      </Helmet>
      <ShopShell />
    </ErrorBoundary>
  )
}

export default App
