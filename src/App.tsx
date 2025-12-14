
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import PublicCard from "./pages/PublicCard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import YooKassaSetup from "./pages/YooKassaSetup";
import NotFound from "./pages/NotFound";
import InstallPrompt from "./components/InstallPrompt";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InstallPrompt />
        <BrowserRouter future={future}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/card/:id" element={<PublicCard />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/error" element={<PaymentError />} />
            <Route path="/yookassa-setup" element={<YooKassaSetup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;