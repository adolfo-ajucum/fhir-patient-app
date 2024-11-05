import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoincCodeLookup = () => {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loincCodes = [
    { code: '8310-5', label: 'Temperatura corporal' },
    { code: '8867-4', label: 'Frecuencia cardíaca' },
    { code: '9279-1', label: 'Frecuencia respiratoria' },
    { code: '8480-6', label: 'Presión arterial sistólica' },
    { code: '8462-4', label: 'Presión arterial diastólica' },
    { code: '59408-5', label: 'Saturación de oxígeno en sangre' },
    { code: '8302-2', label: 'Estatura' },
    { code: '29463-7', label: 'Peso' },
    { code: '39156-5', label: 'Índice de masa corporal' },
    { code: '718-7', label: 'Hemoglobina' },
    { code: '2339-0', label: 'Glucosa en sangre' },
    { code: '2093-3', label: 'Colesterol total' },
    { code: '2085-9', label: 'Colesterol HDL' },
    { code: '2089-1', label: 'Colesterol LDL' },
    { code: '2571-8', label: 'Triglicéridos' },
    { code: '2951-2', label: 'Sodio en sangre' },
    { code: '2823-3', label: 'Potasio en sangre' },
    { code: '2160-0', label: 'Creatinina' },
    { code: '3094-0', label: 'Nitrógeno ureico en sangre' },
    { code: '3016-3', label: 'Hormona estimulante de la tiroides (TSH)' },
    { code: '4548-4', label: 'Hemoglobina A1c' },
    { code: '30522-7', label: 'Proteína C reactiva' },
    { code: '14682-9', label: 'Vitamina D' },
    { code: '2744-1', label: 'pH arterial' },
    { code: '2019-8', label: 'pCO2 arterial' },
    { code: '2703-7', label: 'pO2 arterial' },
    { code: '2028-9', label: 'Bicarbonato' },
  ];

  const fetchLoincData = async (loincCode) => {
    setLoading(true);
    setError(null);
    setData(null);

    const url = `http://localhost:8090/lookup-loinc?loincCode=${loincCode}`;
    console.log('Fetching URL:', url);

    try {
      const response = await axios.get(url);
      const result = response.data;
      const { parameter } = result;
      const designations = parameter.filter(item => item.name === "designation");
      const resultado = designations.find(designation => {
        const language = designation.part.find(part => part.name === "language" && part.valueCode === "es-MX");
        return language !== undefined;
      });

      const valuePart = resultado.part.find(part => part.name === "value");
      const valueString = valuePart ? valuePart.valueString : null;
      const valueStringArray = valueString ? valueString.split(":") : [];

      const extractedData = {
        code: loincCode,
        nombreComunLargo: valueString || 'No disponible',
        componente: valueStringArray[0] || 'N/A',
        propiedad: valueStringArray[1] || 'N/A',
        intervalo: valueStringArray[2] || 'N/A',
        sistema: valueStringArray[3] || 'N/A',
        escala: valueStringArray[4] || 'N/A',
        metodo: valueStringArray[5] || 'N/A',
        clase: result.parameter.find(param => param.name === 'property' && param.part.some(part => part.name === 'code' && part.valueCode === 'CLASS'))?.part.find(part => part.name === 'value')?.valueCoding?.display || "N/A",
        unidades: result.parameter.find(param => param.name === 'property' && param.part.some(part => part.name === 'code' && part.valueCode === 'EXAMPLE_UCUM_UNITS'))?.part.find(part => part.name === 'value')?.valueString || "N/A",
        order: result.parameter.find(param => param.name === 'property' && param.part.some(part => part.name === 'code' && part.valueCode === 'ORDER_OBS'))?.part.find(part => part.name === 'value')?.valueString || "N/A",
      };

      setData(extractedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchLoincData(code);
    }
  }, [code]);

  return (
    <div>
      <h2>Búsqueda de Código LOINC</h2>
      <select value={code} onChange={(e) => setCode(e.target.value)}>
        <option value="">Selecciona un código LOINC</option>
        {loincCodes.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label} ({item.code})
          </option>
        ))}
      </select>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <table>
          <thead>
            <tr>
              <th>Atributo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Código</strong></td>
              <td>{data.code}</td>
            </tr>
            <tr>
              <td><strong>Nombre Común Largo</strong></td>
              <td>{data.nombreComunLargo}</td>
            </tr>
            <tr>
              <td><strong>Componente</strong></td>
              <td>{data.componente}</td>
            </tr>
            <tr>
              <td><strong>Propiedad</strong></td>
              <td>{data.propiedad}</td>
            </tr>
            <tr>
              <td><strong>Intervalo</strong></td>
              <td>{data.intervalo}</td>
            </tr>
            <tr>
              <td><strong>Sistema</strong></td>
              <td>{data.sistema}</td>
            </tr>
            <tr>
              <td><strong>Escala</strong></td>
              <td>{data.escala}</td>
            </tr>
            <tr>
              <td><strong>Método</strong></td>
              <td>{data.metodo}</td>
            </tr>
            <tr>
              <td><strong>Clase</strong></td>
              <td>{data.clase}</td>
            </tr>
            <tr>
              <td><strong>Unidades de Medida</strong></td>
              <td>{data.unidades}</td>
            </tr>
            <tr>
              <td><strong>Orden/Observación</strong></td>
              <td>{data.order}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoincCodeLookup;