import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const EncounterFrame = ({ snomedServer }) => {
  const [encounterReason, setEncounterReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [procedure, setProcedure] = useState('');
  const [laterality, setLaterality] = useState('');
  
  const [filteredEncounterReasonValues, setFilteredEncounterReasonValues] = useState([]);
  const [filteredDiagnosisValues, setFilteredDiagnosisValues] = useState([]);
  const [filteredProcedureValues, setFilteredProcedureValues] = useState([]);
  const [lateralityValues, setLateralityValues] = useState([]);

  //const ENCOUNTER_REASON_URL = `${snomedServer}/ValueSet/$expand?url=${encodeURIComponent('http://snomed.info/sct?fhir_vs=ecl/< 404684003 OR < 71388002 OR < 243796009 OR < 272379006')}&count=20`;
  //const DIAGNOSIS_URL = `${snomedServer}/ValueSet/$expand?url=${encodeURIComponent('http://snomed.info/sct?fhir_vs=ecl/< 404684003')}&count=20`;
 // const PROCEDURE_URL = `${snomedServer}/ValueSet/$expand?url=${encodeURIComponent('http://snomed.info/sct?fhir_vs=ecl/< 71388002')}&count=20`;
  const LATERALITY_URL = `${snomedServer}/ValueSet/$expand?_format=json&url=${encodeURIComponent('http://snomed.info/sct?fhir_vs=ecl/< 182353008')}`;

  const fetchSuggestions = useCallback(debounce(async (url, setFilteredValues) => {
    try {
      const response = await axios.get(url);
      setFilteredValues(response.data.expansion?.contains || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, 500), []);

  useEffect(() => {
    fetchSuggestions(LATERALITY_URL, setLateralityValues);
  }, [snomedServer, fetchSuggestions]);

  useEffect(() => {
    if (encounterReason.length >= 3) {
      fetchSuggestions(`${snomedServer}/snomedctEncounterReason?filter=${encodeURIComponent(encounterReason)}`, setFilteredEncounterReasonValues);
    }
  }, [encounterReason, fetchSuggestions]);

  useEffect(() => {
    if (diagnosis.length >= 3) {
      fetchSuggestions(`${snomedServer}/snomedctDiagnostic?filter=${encodeURIComponent(diagnosis)}`, setFilteredDiagnosisValues);
    }
  }, [diagnosis, fetchSuggestions]);

  useEffect(() => {
    if (procedure.length >= 3) {
      fetchSuggestions(`${snomedServer}/snomedctProcedure?filter=${encodeURIComponent(procedure)}`, setFilteredProcedureValues);
    }
  }, [procedure, fetchSuggestions]);

  return (
    <div>
      <div>
        <label>Razón de Encuentro:</label>
        <input 
          type="text" 
          value={encounterReason} 
          onChange={(e) => setEncounterReason(e.target.value)} 
          placeholder="Buscar Razon de Encuentro"
        />
        {filteredEncounterReasonValues.length > 0 && (
          <ul>
            {filteredEncounterReasonValues.map((item) => (
              <li key={item.code}>{item.display}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Diagnostico:</label>
        <input 
          type="text" 
          value={diagnosis} 
          onChange={(e) => setDiagnosis(e.target.value)} 
          placeholder="Buscar Diagnostico"
        />
        {filteredDiagnosisValues.length > 0 && (
          <ul>
            {filteredDiagnosisValues.map((item) => (
              <li key={item.code}>{item.display}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Procedimiento:</label>
        <input 
          type="text" 
          value={procedure} 
          onChange={(e) => setProcedure(e.target.value)} 
          placeholder="Buscar Procedimiento"
        />
        {filteredProcedureValues.length > 0 && (
          <ul>
            {filteredProcedureValues.map((item) => (
              <li key={item.code}>{item.display}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Lateralidad:</label>
        <select value={laterality} onChange={(e) => setLaterality(e.target.value)}>
          <option value="">Seleccionar Lateralidad</option>
          {lateralityValues.map((item) => (
            <option key={item.code} value={item.code}>{item.display}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EncounterFrame;
