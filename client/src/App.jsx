import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Order from "./pages/Order.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<Order />} />
        {/* Hidden owner-only routes — intentionally not linked anywhere in the UI */}
        <Route path="/owner-login" element={<Admin />} />
        <Route path="/owner-login/menu" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
