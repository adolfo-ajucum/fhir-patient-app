import React, { useState } from 'react';

const LoincCodeLookup = () => {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Datos de autenticación (reemplaza con los valores reales)
  const username = 'aajucum';
  const password = 'Desarollo22.';

  const fetchLoincData = async (loincCode) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`https://fhir.loinc.org/CodeSystem/$lookup?system=http://loinc.org&code=${loincCode}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`), // Autenticación básica
          'Accept-Language': 'es'
        }
      });

      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const result = await response.json();

      // Extraer los parámetros necesarios
      const extractedData = {
        code: loincCode,
        nombreComunLargo: result.parameter.find(p => p.name === 'display')?.valueString || "N/A",
        componente: result.parameter.find(p => p.name === 'component')?.valueString || "N/A",
        propiedad: result.parameter.find(p => p.name === 'property')?.valueString || "N/A",
        intervalo: result.parameter.find(p => p.name === 'time')?.valueString || "N/A",
        sistema: result.parameter.find(p => p.name === 'system')?.valueString || "N/A",
        escala: result.parameter.find(p => p.name === 'scale')?.valueString || "N/A",
        unidades: result.parameter.find(p => p.name === 'units')?.valueString || "N/A",
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
        </div>
      )}
    </div>
  );
};

export default LoincCodeLookup;
