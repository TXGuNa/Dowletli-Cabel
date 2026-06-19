import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import BookConsultation from './pages/BookConsultation';
import Gallery from './pages/Gallery';
// Admin is heavy and admin-only — load it on demand so public visitors
// don't download it (smaller first paint, less initial white screen).
const Admin = lazy(() => import('./pages/Admin'));
import { ContentProvider } from './content/ContentContext';
import { ProductsProvider } from './content/ProductsContext';
import { GalleryProvider } from './content/GalleryContext';
import { SettingsProvider } from './content/SettingsContext';

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text font-sans selection:bg-brand-primary/15 selection:text-brand-ink">
      {!isAdmin && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<BookConsultation />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
                <Admin />
              </Suspense>
            }
          />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ContentProvider>
      <ProductsProvider>
        <GalleryProvider>
          <SettingsProvider>
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </SettingsProvider>
        </GalleryProvider>
      </ProductsProvider>
    </ContentProvider>
  );
}

export default App;
