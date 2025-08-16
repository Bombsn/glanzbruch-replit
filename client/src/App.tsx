import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Courses from "@/pages/courses";
import Gallery from "@/pages/gallery";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import ProductPage from "@/pages/product";
import CourseDetailPage from "@/pages/course-detail";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminGallery from "@/pages/admin-gallery";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ShoppingCart from "@/components/shopping-cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/kurse" component={Courses} />
      <Route path="/kurs/:id" component={CourseDetailPage} />
      <Route path="/galerie" component={Gallery} />
      <Route path="/ueber-mich" component={About} />
      <Route path="/kontakt" component={Contact} />
      <Route path="/produkt/:id" component={ProductPage} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/gallery" component={AdminGallery} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Add scroll-to-top behavior on route changes
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-cream text-charcoal">
          <Switch>
            <Route path="/admin">
              {/* Admin routes without header/footer */}
              <Router />
            </Route>
            <Route path="/admin/dashboard">
              <Router />
            </Route>
            <Route path="/admin/gallery">
              <Router />
            </Route>
            <Route>
              {/* Regular routes with header/footer */}
              <Header />
              <main>
                <Router />
              </main>
              <Footer />
              <ShoppingCart />
            </Route>
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
