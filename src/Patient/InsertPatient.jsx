import { useState } from "react";
import axios from "axios";

const InsertPatient = () => {
  // Definición de estados para cada campo
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [thirdName, setThirdName] = useState("");
  const [secondSurname, setSecondSurname] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [DPI, setDPI] = useState("");
  const [NIT, setNIT] = useState("");
  const [historiaClinicaFisica, setHistoriaClinicaFisica] = useState("");
  const [seguroSocial, setSeguroSocial] = useState("");
  const [religion, setReligion] = useState(""); // Nuevo estado para religión
  const [address, setAddress] = useState(""); // Nuevo estado para dirección
  const [contactName, setContactName] = useState(""); // Nuevo estado para el nombre del encargado
  const [contactSecondName, setContactSecondName] = useState(""); // Nuevo estado para el segundo nombre del encargado
  const [contactSurname, setContactSurname] = useState(""); // Nuevo estado para el primer apellido del encargado
  const [contactSecondSurname, setContactSecondSurname] = useState(""); // Nuevo estado para el segundo apellido del encargado
  const [contactPhone, setContactPhone] = useState(""); // Nuevo estado para el teléfono del encargado
  const [showThirdName, setShowThirdName] = useState(false); // Estado para mostrar/ocultar el tercer nombre

  const base_url = 'http://localhost:5826/fhir/r5';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construcción del objeto del paciente para FHIR
    const patientData = {
      resourceType: "Patient",
      identifier: [
        {
          use: "official",
          type: { text: "DPI" },
          value: DPI
        },
        {
          use: "official",
          type: { text: "NIT" },
          value: NIT
        },
        {
          use: "official",
          type: { text: "Historia Clínica Física" },
          value: historiaClinicaFisica
        },
        {
          use: "official",
          type: { text: "Seguro Social" },
          value: seguroSocial
        }
      ],
      name: [
        {
          use: "official",
          family: surname,
          given: [name, secondName, thirdName].filter(Boolean), // Filtrar nombres vacíos
          extension: [
            {
              url: "https://example.org/fhir/StructureDefinition/SegundoApellido",
              valueString: secondSurname
            }
          ]
        }
      ],
      telecom: [
        {
          system: "phone",
          value: phone,
          use: "home"
        }
      ],
      birthDate: birthDate,
      address: [
        {
          use: "home",
          line: [address] // Dirección del paciente
        }
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/patient-religion", // Extensión para la religión
          valueString: religion
        }
      ],
      contact: [
        {
          name: {
            family: contactSurname,
            given: [contactName, contactSecondName].filter(Boolean),
            extension: [
              {
                url: "https://hl7chile.cl/fhir/ig/clcore/StructureDefinition/SegundoApellido",
                valueString: contactSecondSurname
              }
            ]
          },
          telecom: [
            {
              system: "phone",
              value: contactPhone,
              use: "mobile"
            }
          ]
        }
      ]
    };

    // Envío de datos al servidor FHIR
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
          <label>Segundo Nombre: </label>
          <input type="text" value={secondName} onChange={(e) => setSecondName(e.target.value)} />
        </div>
        <div>
          <label>
            <input type="checkbox" checked={showThirdName} onChange={(e) => setShowThirdName(e.target.checked)} />
            Insertar Tercer Nombre
          </label>
        </div>
        {showThirdName && (
          <div>
            <label>Tercer Nombre: </label>
            <input type="text" value={thirdName} onChange={(e) => setThirdName(e.target.value)} />
          </div>
        )}
        <div>
          <label>Primer Apellido: </label>
          <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
        </div>
        <div>
          <label>Segundo Apellido: </label>
          <input type="text" value={secondSurname} onChange={(e) => setSecondSurname(e.target.value)} required />
        </div>
        <div>
          <label>Fecha de Nacimiento: </label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </div>
        <div>
          <label>Teléfono: </label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>DPI: </label>
          <input type="text" value={DPI} onChange={(e) => setDPI(e.target.value)} required />
        </div>
        <div>
          <label>NIT: </label>
          <input type="text" value={NIT} onChange={(e) => setNIT(e.target.value)} />
        </div>
        <div>
          <label>Historia Clínica Física: </label>
          <input type="text" value={historiaClinicaFisica} onChange={(e) => setHistoriaClinicaFisica(e.target.value)} />
        </div>
        <div>
          <label>Seguro Social: </label>
          <input type="text" value={seguroSocial} onChange={(e) => setSeguroSocial(e.target.value)} />
        </div>
        <div>
          <label>Religión: </label>
          <input type="text" value={religion} onChange={(e) => setReligion(e.target.value)} />
        </div>
        <div>
          <label>Dirección: </label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <h3>Encargado</h3>
          <label>Nombre del Encargado: </label>
          <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} />
        </div>
        <div>
          <label>Segundo Nombre del Encargado: </label>
          <input type="text" value={contactSecondName} onChange={(e) => setContactSecondName(e.target.value)} />
        </div>
        <div>
          <label>Primer Apellido del Encargado: </label>
          <input type="text" value={contactSurname} onChange={(e) => setContactSurname(e.target.value)} />
        </div>
        <div>
          <label>Segundo Apellido del Encargado: </label>
          <input type="text" value={contactSecondSurname} onChange={(e) => setContactSecondSurname(e.target.value)} />
        </div>
        <div>
          <label>Teléfono del Encargado: </label>
          <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
        </div>
        <button type="submit">Insertar</button>
      </form>
    </div>
  );
};

export default InsertPatient;