import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConnectPage from "./pages/ConnectPage";
import SelectPage from "./pages/SelectPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConnectPage />} />
        <Route path="/select" element={<SelectPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
