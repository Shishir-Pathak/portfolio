// frontend/src/App.jsx
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AboutManagement from "./pages/admin/AboutManagement.jsx";
import ContactMessages from "./pages/admin/ContactMessages.jsx";
import ContactDetail from "./pages/admin/ContactDetail.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import ExperienceManagement from "./pages/admin/ExperienceManagement.jsx";
import ExperienceForm from "./pages/admin/ExperienceForm.jsx";
import SocialLinksManagement from "./pages/admin/SocialLinksManagement.jsx";

import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));

      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollHandler />

      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/products"
          element={
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />

        <Route
          path="/courses"
          element={
            <MainLayout>
              <Courses />
            </MainLayout>
          }
        />

        <Route
          path="/courses/:slug"
          element={
            <MainLayout>
              <CourseDetail />
            </MainLayout>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="about" element={<AboutManagement />} />

            <Route path="contacts" element={<ContactMessages />} />
            <Route path="contacts/:id" element={<ContactDetail />} />

            <Route path="products" element={<ProductManagement />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />

            <Route path="experience" element={<ExperienceManagement />} />
            <Route path="experience/new" element={<ExperienceForm />} />
            <Route path="experience/:id/edit" element={<ExperienceForm />} />

            <Route path="social-links" element={<SocialLinksManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}