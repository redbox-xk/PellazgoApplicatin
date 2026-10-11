import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation, Redirect } from 'wouter';

import { AuthProvider, useAuth } from '@/lib/auth';
import { I18nProvider } from '@/lib/i18n';
import { AppLayout } from '@/components/layout/AppLayout';

import { Home } from '@/pages/Home';
import { Products } from '@/pages/Products';
import { ProductDetail } from '@/pages/ProductDetail';
import { Offers } from '@/pages/Offers';
import { Loyalty } from '@/pages/Loyalty';
import { GiftCards } from '@/pages/GiftCards';
import { Blog } from '@/pages/Blog';
import { BlogPostDetail } from '@/pages/BlogPostDetail';
import { Cart } from '@/pages/Cart';
import { Orders } from '@/pages/Orders';
import { Favorites } from '@/pages/Favorites';
import { Profile } from '@/pages/Profile';
import { AIAssistant } from '@/pages/AIAssistant';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { BusinessDashboard } from '@/pages/BusinessDashboard';
import { About } from '@/pages/About';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } }
});

// Guard: redirects to /login if not authenticated
function ProtectedRoute({ children, businessOnly = false }: { children: React.ReactNode; businessOnly?: boolean }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (businessOnly && user?.role !== 'business' && user?.role !== 'admin') return <Redirect to="/" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public full-screen pages */}
      <Route path="/login" component={Login} />

      {/* Public pages — no auth required */}
      <Route path="/">
        <AppLayout><Home /></AppLayout>
      </Route>

      <Route path="/shop">
        <AppLayout><Products /></AppLayout>
      </Route>
      <Route path="/shop/:id">
        <AppLayout><ProductDetail /></AppLayout>
      </Route>
      {/* legacy alias */}
      <Route path="/products">
        <AppLayout><Products /></AppLayout>
      </Route>
      <Route path="/products/:id">
        <AppLayout><ProductDetail /></AppLayout>
      </Route>

      <Route path="/offers">
        <AppLayout><Offers /></AppLayout>
      </Route>

      <Route path="/blog">
        <AppLayout><Blog /></AppLayout>
      </Route>
      <Route path="/blog/:id">
        <AppLayout><BlogPostDetail /></AppLayout>
      </Route>

      <Route path="/about">
        <AppLayout><About /></AppLayout>
      </Route>

      {/* AI — public */}
      <Route path="/ai">
        <AppLayout><AIAssistant /></AppLayout>
      </Route>

      {/* Protected — requires login */}
      <Route path="/cart">
        <AppLayout>
          <ProtectedRoute><Cart /></ProtectedRoute>
        </AppLayout>
      </Route>

      <Route path="/orders">
        <AppLayout>
          <ProtectedRoute><Orders /></ProtectedRoute>
        </AppLayout>
      </Route>

      <Route path="/loyalty">
        <AppLayout>
          <ProtectedRoute><Loyalty /></ProtectedRoute>
        </AppLayout>
      </Route>

      <Route path="/gift-cards">
        <AppLayout>
          <ProtectedRoute><GiftCards /></ProtectedRoute>
        </AppLayout>
      </Route>

      <Route path="/favorites">
        <AppLayout>
          <ProtectedRoute><Favorites /></ProtectedRoute>
        </AppLayout>
      </Route>

      <Route path="/profile">
        <AppLayout>
          <ProtectedRoute><Profile /></ProtectedRoute>
        </AppLayout>
      </Route>

      <Route path="/dashboard">
        <AppLayout>
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        </AppLayout>
      </Route>

      {/* Business only */}
      <Route path="/business">
        <AppLayout>
          <ProtectedRoute businessOnly><BusinessDashboard /></ProtectedRoute>
        </AppLayout>
      </Route>

      <Route>
        <AppLayout><NotFound /></AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
