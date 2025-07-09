
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DiscoverCollaborators from "./pages/DiscoverCollaborators";
import SavedCollaborators from "./pages/SavedCollaborators";
import Collaboration from "./pages/Collaboration";
import Chat from "./pages/Chat";
import DataCenter from "./pages/DataCenter";
import Shipment from "./pages/Shipment";
import Quotation from "./pages/Quotation";
import Equipment from "./pages/Equipment";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discover-collaborators" element={<DiscoverCollaborators />} />
          <Route path="/saved-collaborators" element={<SavedCollaborators />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/data-center" element={<DataCenter />} />
          <Route path="/shipment" element={<Shipment />} />
          <Route path="/quotation" element={<Quotation />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
