import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const Home = lazy(() => import('@/shop/pages/Home'))
const Catalog = lazy(() => import('@/shop/pages/Catalog'))
const CategoryPage = lazy(() => import('@/shop/pages/CategoryPage'))
const ProductPage = lazy(() => import('@/shop/pages/ProductPage'))
const CartPage = lazy(() => import('@/shop/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/shop/pages/CheckoutPage'))
const OrderConfirmation = lazy(() => import('@/shop/pages/OrderConfirmation'))
const OrderTracking = lazy(() => import('@/shop/pages/OrderTracking'))
const LoginPage = lazy(() => import('@/shop/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/shop/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/shop/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/shop/pages/ResetPasswordPage'))
const TermsPage = lazy(() => import('@/shop/pages/TermsPage'))
const PrivacyPage = lazy(() => import('@/shop/pages/PrivacyPage'))
const ShippingPolicyPage = lazy(() => import('@/shop/pages/ShippingPolicyPage'))
const NotFound = lazy(() => import('@/shop/pages/NotFound'))
const PaymentResult = lazy(() => import('@/shop/pages/PaymentResult'))

const AccountPage = lazy(() => import('@/shop/pages/AccountPage'))
const AccountProfile = lazy(() => import('@/shop/pages/account/AccountProfile'))
const AccountOrders = lazy(() => import('@/shop/pages/account/AccountOrders'))
const AccountAddresses = lazy(() => import('@/shop/pages/account/AccountAddresses'))

const AdminLayout = lazy(() => import('@/admin/components/layout/AdminLayout'))
const AdminDashboard = lazy(() => import('@/admin/pages/AdminDashboard'))
const AdminProducts = lazy(() => import('@/admin/pages/AdminProducts'))
const AdminOrders = lazy(() => import('@/admin/pages/AdminOrders'))
const AdminUsers = lazy(() => import('@/admin/pages/AdminUsers'))
const AdminProfile = lazy(() => import('@/shop/pages/account/AccountProfile'))

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/catalogo/:categorySlug" element={<CategoryPage />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido/confirmacion/:id" element={<OrderConfirmation />} />
        <Route path="/pedido/:orderNumber" element={<OrderTracking />} />
        <Route path="/pago/resultado" element={<PaymentResult />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
        <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/politica-envios" element={<ShippingPolicyPage />} />

        {/* Mi Cuenta — rutas anidadas */}
        <Route
          path="/mi-cuenta"
          element={
            <AuthGuard>
              <AccountPage />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/mi-cuenta/perfil" replace />} />
          <Route path="perfil" element={<AccountProfile />} />
          <Route path="pedidos" element={<AccountOrders />} />
          <Route path="direcciones" element={<AccountAddresses />} />
        </Route>

        {/* Panel Admin — rutas anidadas */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="perfil" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
