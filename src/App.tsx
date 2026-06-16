import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import BookConsultation from './pages/BookConsultation';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import { ContentProvider } from './content/ContentContext';
import { ProductsProvider } from './content/ProductsContext';

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
          <Route path="/admin" element={<Admin />} />
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
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ProductsProvider>
    </ContentProvider>
  );
}

export default App;
