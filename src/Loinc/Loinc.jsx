import React, { useState } from 'react';
import axios from 'axios';

const LoincCodeLookup = () => {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchLoincData = async (loincCode) => {
    setLoading(true);
    setError(null);
    setData(null);

    const url = `http://localhost:8090/lookup-loinc?loincCode=${loincCode}`;
    console.log('Fetching URL:', url);

    try {
      const response = await axios.get(url, {
        headers: {

        }
      });

      
      const result = response.data;
     
      const {parameter} = result;

      const designations = parameter.filter(item => item.name === "designation");

      const resultado = designations.find(designation => {
        const language = designation.part.find(part => part.name === "language" && part.valueCode === "es-MX");
        return language !== undefined;
        });

      // Accedemos a `valueString`
      const valuePart = resultado.part.find(part => part.name === "value");
      const valueString = valuePart ? valuePart.valueString : null;

      // Split the string into an array of strings
      const valueStringArray = valueString.split(":");
    

      // Extraer los parámetros necesarios
      const extractedData = {
        code: loincCode,
        nombreComunLargo: valueString,
        componente: valueStringArray[0],
        propiedad: valueStringArray[1],
        intervalo: valueStringArray[2],
        sistema: valueStringArray[3],
        escala: valueStringArray[4],
        metodo: valueStringArray[5],
        // Clase
        clase: result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'CLASS';
          });
        })?.part.find(part => part.name === 'value')?.valueCoding?.display || "N/A",


        // Unidades de Medida
        unidades: result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'EXAMPLE_UCUM_UNITS';
          });
        })?.part.find(part => part.name === 'value')?.valueString || "N/A",

        order: result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'ORDER_OBS';
          });
        })?.part.find(part => part.name === 'value')?.valueString || "N/A",
      };

      setData(extractedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar el envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (code.trim() !== '') {
      fetchLoincData(code.trim());
    }
  };

  return (
    <div>
      <h2>Búsqueda de Código LOINC</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ingresa el código LOINC"
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h3>Detalles del Código LOINC</h3>
          <p><strong>Código:</strong> {data.code}</p>
          <p><strong>Nombre Común Largo:</strong> {data.nombreComunLargo}</p>
          <p><strong>Componente:</strong> {data.componente}</p>
          <p><strong>Propiedad:</strong> {data.propiedad}</p>
          <p><strong>Intervalo:</strong> {data.intervalo}</p>
          <p><strong>Sistema:</strong> {data.sistema}</p>
          <p><strong>Escala:</strong> {data.escala}</p>
          <p><strong>Método:</strong> {data.metodo}</p>
          <p><strong>Clase:</strong> {data.clase}</p>
          <p><strong>Unidades de Medida:</strong> {data.unidades}</p>
          <p><strong>Orden/Observación:</strong> {data.order}</p>
        </div>
      )}
    </div>
  );
};

export default LoincCodeLookup;