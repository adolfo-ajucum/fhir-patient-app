import { useEffect, useState } from "react";
import axios from "axios";

const ListPatients = () => {
  const [patients, setPatients] = useState([]);
  const base_url = 'http://localhost:5826/fhir/r5';

  useEffect(() => {
    axios.get(`${base_url}/Patient`)
      .then(response => {
        setPatients(response.data.entry || []);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los pacientes", error);
      });
  }, []);

  return (
    <div>
      <h2>Lista de Pacientes</h2>
      <ul>
        {patients.map((entry, index) => (
          <li key={index}>
            {entry.resource.name?.[0]?.given?.[0]} {entry.resource.name?.[0]?.family} - {entry.resource.birthDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPatients;
