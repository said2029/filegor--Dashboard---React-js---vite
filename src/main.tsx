import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home.tsx";
import Sidbar from "./components/sidbar.tsx";
import webfont from "webfontloader";
import Application from "./pages/Application.tsx";
import Category from "./pages/Category.tsx";
import { ToastContainer } from "react-toastify";
import SubCategory from "./pages/SubCategory.tsx";
import AuthProvider from "./provider/AuthProvider.tsx";
import Verificatin_email from "./pages/Verificatin-email.tsx";
import Reset_password from "./pages/Reset-password.tsx";

webfont.load({
  google: { families: ["Vazirmatn"] },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Sidbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/applications" element={<Application />} />
          <Route path="/category" element={<Category />} />
          <Route path="/subcategory" element={<SubCategory />} />
          <Route path="/verificatin-email/:id/:token" element={<Verificatin_email />} />
          <Route path="/reset-password/:id/:token" element={<Reset_password />} />
        </Routes>
      </AuthProvider>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  </StrictMode>,
);
