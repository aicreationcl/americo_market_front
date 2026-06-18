import { Helmet } from 'react-helmet-async'
import { AppRouter } from './router/AppRouter'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/cart/CartDrawer'

function App() {
  return (
    <>
      <Helmet
        defaultTitle="AMERICO Minimarket"
        titleTemplate="%s | AMERICO Minimarket"
      >
        <meta property="og:site_name" content="AMERICO Minimarket" />
        <meta name="theme-color" content="#d97706" />
      </Helmet>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <AppRouter />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </>
  )
}

export default App
