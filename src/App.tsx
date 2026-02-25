import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryViewPage from "./pages/CategoryViewPage";
import CategoryEditPage from "./pages/CategoryEditPage";
import CategoryCreatePage from "./pages/CategoryCreatePage";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CategoriesProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/categories" replace />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/new" element={<CategoryCreatePage />} />
              <Route path="/categories/:id" element={<CategoryViewPage />} />
              <Route path="/categories/:id/edit" element={<CategoryEditPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </CategoriesProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
