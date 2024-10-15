import { useState } from "react";
import axios from "axios";

const InsertPatient = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const base_url = 'http://localhost:5826/fhir/r5';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const patientData = {
      resourceType: "Patient",
      name: [{
        use: "official",
        family: surname,
        given: [name]
      }],
      telecom: [{
        system: "phone",
        value: phone,
        use: "home"
      }],
      birthDate: birthDate
    };

    axios.post(`${base_url}/Patient`, patientData)
      .then(response => {
        
        alert("Paciente insertado con éxito!");
      })
      .catch(error => {
        console.error("Hubo un error al insertar el paciente", error);
      });
  };

  return (
    <div>
      <h2>Insertar Paciente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre: </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Apellido: </label>
          <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
        </div>
        <div>
          <label>Fecha de Nacimiento: </label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </div>
        <div>
          <label>Teléfono: </label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <button type="submit">Insertar</button>
      </form>
    </div>
  );
};

export default InsertPatient;
