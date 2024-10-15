import { useState } from 'react';
import axios from 'axios';
import './PatientForm.css';
const PatientForm = () => {
  const [formData, setFormData] = useState({
    family: '',
    given: '',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientData = {
      resourceType: "Patient",
      name: [
        {
          use: "official",
          family: formData.family,
          given: [formData.given]
        }
      ],
      gender: formData.gender,
      birthDate: formData.birthDate,
      telecom: [
        {
          system: "phone",
          value: formData.phone,
          use: "home"
        },
        {
          system: "email",
          value: formData.email
        }
      ],
      address: [
        {
          use: "home",
          line: [formData.address],
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }
      ]
    };

    try {
      const response = await axios.post('http://localhost:5826/fhir/r5/Patient', patientData);
      console.log(response.data);
      alert('Paciente registrado con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al registrar el paciente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Apellido:</label>
        <input type="text" name="family" value={formData.family} onChange={handleChange} required />
      </div>
      <div>
        <label>Nombre:</label>
        <input type="text" name="given" value={formData.given} onChange={handleChange} required />
      </div>
      <div>
        <label>Género:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Seleccione</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
          <option value="unknown">Desconocido</option>
        </select>
      </div>
      <div>
        <label>Fecha de Nacimiento:</label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Dirección:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </div>
      <div>
        <label>Ciudad:</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </div>
      <div>
        <label>Estado:</label>
        <input type="text" name="state" value={formData.state} onChange={handleChange} required />
      </div>
      <div>
        <label>Código Postal:</label>
        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
      </div>
      <div>
        <label>País:</label>
        <input type="text" name="country" value={formData.country} onChange={handleChange} required />
      </div>
      <button type="submit">Registrar Paciente</button>
    </form>
  );
};

export default PatientForm;
