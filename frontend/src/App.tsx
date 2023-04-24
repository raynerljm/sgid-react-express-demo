import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CallbackPage from "./pages/CallbackPage";
import ProtectedPage from "./pages/ProtectedPage";
import WhoAmIPage from "./pages/WhoAmIPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="callback" element={<CallbackPage />} />
        <Route path="protected" element={<ProtectedPage />} />
        <Route path="whoami" element={<WhoAmIPage />} />
      </Route>
    </Routes>
  );
}

export default App;
