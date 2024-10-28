import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import InsertPatient from "./Patient/InsertPatient";
import ListPatients from "./Patient/ListPatients";
import SnomedSearch from "./Snomed/SearchSnomedCT";

function Principal() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/insert">Insertar Paciente</Link></li>
            <li><Link to="/list">Listar Pacientes</Link></li>
            <li><Link to= "/snomed">Busqueda snomed CT</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/insert" element={<InsertPatient/>} />
          <Route path="/list" element={<ListPatients />} />
          <Route path="/snomed" element={<SnomedSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Principal;