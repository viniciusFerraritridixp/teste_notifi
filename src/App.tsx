import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from '@/contexts/UserProvider';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import ChoosePlace from "./pages/ChoosePlace";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import BiparComanda from "./pages/BiparComanda";
import TotemOrders from "./pages/TotemOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/inicio" element={<Landing />} />
          <Route path="/cardapio" element={<Index />} />
          <Route path="/bipar-comanda" element={<BiparComanda />} />
          <Route path="/totem-orders" element={<TotemOrders />} />
          <Route path="/choose-place" element={<ChoosePlace />} />
          <Route path="/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
