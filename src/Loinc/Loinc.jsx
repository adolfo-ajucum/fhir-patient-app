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
      console.log(result);

      // Extraer los parámetros necesarios
      const extractedData = {
        code: loincCode,
        // nombreComunLargo Impreso
        nombreComunLargo: result.parameter.find(p => p.name === 'display')?.valueString || "N/A",
        
        // componente Impreso
        componente:  result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'COMPONENT';
          });
        })?.part.find(part => part.name === 'value')?.valueCoding?.display || "N/A",

        //propiedad Impreso
        propiedad: result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'PROPERTY';
          });
        })?.part.find(part => part.name === 'value')?.valueCoding?.display || "N/A",

        //intervalo Impreso
        intervalo: result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'TIME_ASPCT';
          });
        })?.part.find(part => part.name === 'value')?.valueCoding?.display || "N/A",

        //Sistema Impreso
        sistema: result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'SYSTEM';
          });
        })?.part.find(part => part.name === 'value')?.valueCoding?.display || "N/A",

        //Escala Impreso
        escala: result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'SCALE_TYP';
          });
        })?.part.find(part => part.name === 'value')?.valueCoding?.display || "N/A",

        //Unidades de Medida Impreso
        unidades: result.parameter.find(param => {
          return param.name === 'property' && param.part.some(part => {
            return part.name === 'code' && part.valueCode === 'EXAMPLE_UCUM_UNITS';
          });
        })?.part.find(part => part.name === 'valueString') || "N/A",


        designations: result.parameter.find(param => {
          return param.name === 'designation' && param.part.some(part => {
            return part.name === 'language' && part.valueCode === 'es-MX';
          });
        })?.part.find(part => part.name === 'value')?.valueString?.display || "N/A",
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
          <p><strong>Unidades de Medida:</strong> {data.unidades}</p>
          <h4>Designaciones en Español (es-MX)</h4>
          <p><strong>{data.unidades}</strong></p>
        </div>
      )}
    </div>
  );
};

export default LoincCodeLookup;