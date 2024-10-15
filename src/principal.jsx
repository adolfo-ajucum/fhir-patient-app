import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import InsertPatient from "./InsertPatient";
import ListPatients from "./ListPatients";

function Principal() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/insert">Insertar Paciente</Link></li>
            <li><Link to="/list">Listar Pacientes</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/insert" element={<InsertPatient/>} />
          <Route path="/list" element={<ListPatients />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Principal;