import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { AppLayout } from '@/components/layout/AppLayout';
import { Home } from '@/pages/Home';
import { Businesses } from '@/pages/Businesses';
import { BusinessProfile } from '@/pages/BusinessProfile';
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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Auth route without AppLayout usually, but let's say it has its own layout or uses AppLayout. 
          For consistency with an app feel, let's keep it clean. */}
      <Route path="/login" component={Login} />

      <Route path="/">
        <AppLayout><Home /></AppLayout>
      </Route>
      
      <Route path="/businesses">
        <AppLayout><Businesses /></AppLayout>
      </Route>
      <Route path="/businesses/:id">
        <AppLayout><BusinessProfile /></AppLayout>
      </Route>

      <Route path="/products">
        <AppLayout><Products /></AppLayout>
      </Route>
      <Route path="/products/:id">
        <AppLayout><ProductDetail /></AppLayout>
      </Route>

      <Route path="/offers">
        <AppLayout><Offers /></AppLayout>
      </Route>

      <Route path="/loyalty">
        <AppLayout><Loyalty /></AppLayout>
      </Route>

      <Route path="/gift-cards">
        <AppLayout><GiftCards /></AppLayout>
      </Route>

      <Route path="/blog">
        <AppLayout><Blog /></AppLayout>
      </Route>
      <Route path="/blog/:id">
        <AppLayout><BlogPostDetail /></AppLayout>
      </Route>

      <Route path="/cart">
        <AppLayout><Cart /></AppLayout>
      </Route>

      <Route path="/orders">
        <AppLayout><Orders /></AppLayout>
      </Route>

      <Route path="/favorites">
        <AppLayout><Favorites /></AppLayout>
      </Route>

      <Route path="/profile">
        <AppLayout><Profile /></AppLayout>
      </Route>

      <Route path="/ai">
        <AppLayout><AIAssistant /></AppLayout>
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
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
