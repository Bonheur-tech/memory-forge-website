import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Tracks from "./pages/Tracks.tsx";
import Timeline from "./pages/Timeline.tsx";
import Submit from "./pages/Submit.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import Admin from "./pages/Admin.tsx";
import JudgeDashboard from "./pages/JudgeDashboard.tsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Full-screen pages — no public layout */}
            <Route path="/login"       element={<Login />} />
            <Route path="/admin"       element={<Admin />} />
            <Route path="/judge"       element={<JudgeDashboard />} />
            <Route path="/coordinator" element={<CoordinatorDashboard />} />

            {/* Public website — wrapped in Layout */}
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/"        element={<Index />} />
                    <Route path="/about"   element={<About />} />
                    <Route path="/tracks"  element={<Tracks />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/submit"  element={<Submit />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*"        element={<NotFound />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
