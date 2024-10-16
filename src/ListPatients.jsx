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

  const getExtensionValue = (extensions, url) => {
    const extension = extensions?.find(ext => ext.url === url);
    return extension ? extension.valueString : '';
  };

  return (
    <div>
      <h2>Lista de Pacientes</h2>
      <ul>
        {patients.map((entry, index) => (
          <li key={index}>
            <div>Nombre: {entry.resource.name?.[0]?.given?.join(' ')}</div>
            <div>Primer Apellido: {entry.resource.name?.[0]?.family}</div>
            <div>Segundo Apellido: {getExtensionValue(entry.resource.name?.[0]?.extension, "https://example.org/fhir/StructureDefinition/SegundoApellido")}</div>
            <div>Fecha de Nacimiento: {entry.resource.birthDate}</div>
            <div>Teléfono: {entry.resource.telecom?.find(t => t.system === 'phone')?.value}</div>
            <div>DPI: {entry.resource.identifier?.find(id => id.type?.text === 'DPI')?.value}</div>
            <div>NIT: {entry.resource.identifier?.find(id => id.type?.text === 'NIT')?.value}</div>
            <div>Historia Clínica Física: {entry.resource.identifier?.find(id => id.type?.text === 'Historia Clínica Física')?.value}</div>
            <div>Seguro Social: {entry.resource.identifier?.find(id => id.type?.text === 'Seguro Social')?.value}</div>
            <div>Religión: {getExtensionValue(entry.resource.extension, "http://hl7.org/fhir/StructureDefinition/patient-religion")}</div>
            <div>Dirección: {entry.resource.address?.[0]?.line?.join(', ')}</div>
            <div>Encargado:</div>
            <div>Nombre del Encargado: {entry.resource.contact?.[0]?.name?.family}</div>
            <div>Segundo Apellido del Encargado: {getExtensionValue(entry.resource.contact?.[0]?.name?.extension, "https://example.org/fhir/StructureDefinition/SegundoApellido")}</div>
            <div>Dirección del Encargado: {entry.resource.contact?.[0]?.address?.[0]?.line?.join(', ')}</div>
            <div>Teléfono del Encargado: {entry.resource.contact?.[0]?.telecom?.find(t => t.system === 'phone')?.value}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPatients;