import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PaymentPage from "./components/PaymentPage";

function App() {
  const [activeModule, setActiveModule] = useState("Inventarios");

  return (
    <div className="app-layout">
      <Sidebar onSelect={setActiveModule} activeModule={activeModule} />
      <div className="main-container">
        <Header />
        <main className="content-area">
          {activeModule === "Cobros (Stripe)" ? (
            <PaymentPage />
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
