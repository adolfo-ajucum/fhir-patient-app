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

  const [encounterReasonSelected, setEncounterReasonSelected] = useState(false);
  const [diagnosisSelected, setDiagnosisSelected] = useState(false);
  const [procedureSelected, setProcedureSelected] = useState(false);

  const LATERALITY_URL = `${snomedServer}/ValueSet/$expand?_format=json&url=${encodeURIComponent('http://snomed.info/sct?fhir_vs=ecl/< 182353008')}`;

  const fetchSuggestions = useCallback(
    debounce(async (url, setFilteredValues) => {
      try {
        const response = await axios.get(url);
        setFilteredValues(response.data.expansion?.contains || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchSuggestions(LATERALITY_URL, setLateralityValues);
  }, [snomedServer, fetchSuggestions]);

  useEffect(() => {
    if (!encounterReasonSelected && encounterReason.length >= 3) {
      fetchSuggestions(
        `${snomedServer}/snomedctEncounterReason?filter=${encodeURIComponent(encounterReason)}`,
        setFilteredEncounterReasonValues
      );
    } else if (encounterReason.length < 3) {
      setFilteredEncounterReasonValues([]);
    }
  }, [encounterReason, encounterReasonSelected, fetchSuggestions]);

  useEffect(() => {
    if (!diagnosisSelected && diagnosis.length >= 3) {
      fetchSuggestions(
        `${snomedServer}/snomedctDiagnostic?filter=${encodeURIComponent(diagnosis)}`,
        setFilteredDiagnosisValues
      );
    } else if (diagnosis.length < 3) {
      setFilteredDiagnosisValues([]);
    }
  }, [diagnosis, diagnosisSelected, fetchSuggestions]);

  useEffect(() => {
    if (!procedureSelected && procedure.length >= 3) {
      fetchSuggestions(
        `${snomedServer}/snomedctProcedure?filter=${encodeURIComponent(procedure)}`,
        setFilteredProcedureValues
      );
    } else if (procedure.length < 3) {
      setFilteredProcedureValues([]);
    }
  }, [procedure, procedureSelected, fetchSuggestions]);

  const handleSelectSuggestion = (value, setValue, setFilteredValues, setSelected) => {
    setValue(value);
    setFilteredValues([]); // Oculta las sugerencias
    setSelected(true); // Marca que se ha seleccionado una opción
  };

  const handleChange = (setValue, setSelected) => (e) => {
    setValue(e.target.value);
    setSelected(false); // Permite buscar nuevamente si el usuario edita el campo
  };

  return (
    <div>
      <div>
        <label>Razón de Encuentro:</label>
        <input
          type="text"
          value={encounterReason}
          onChange={handleChange(setEncounterReason, setEncounterReasonSelected)}
          placeholder="Buscar Razón de Encuentro"
        />
        {filteredEncounterReasonValues.length > 0 && (
          <ul className="suggestions">
            {filteredEncounterReasonValues.map((item) => (
              <li key={item.code} onClick={() => handleSelectSuggestion(item.display, setEncounterReason, setFilteredEncounterReasonValues, setEncounterReasonSelected)}>
                {item.display}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Diagnóstico:</label>
        <input
          type="text"
          value={diagnosis}
          onChange={handleChange(setDiagnosis, setDiagnosisSelected)}
          placeholder="Buscar Diagnóstico"
        />
        {filteredDiagnosisValues.length > 0 && (
          <ul className="suggestions">
            {filteredDiagnosisValues.map((item) => (
              <li key={item.code} onClick={() => handleSelectSuggestion(item.display, setDiagnosis, setFilteredDiagnosisValues, setDiagnosisSelected)}>
              {item.display}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Procedimiento:</label>
        <input
          type="text"
          value={procedure}
          onChange={handleChange(setProcedure, setProcedureSelected)}
          placeholder="Buscar Procedimiento"
        />
        {filteredProcedureValues.length > 0 && (
          <ul className="suggestions">
            {filteredProcedureValues.map((item) => (
              <li key={item.code} onClick={() => handleSelectSuggestion(item.display, setProcedure, setFilteredProcedureValues, setProcedureSelected)}>
                {item.display}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Lateralidad:</label>
        <select value={laterality} onChange={(e) => setLaterality(e.target.value)}>
          <option value="">Seleccionar Lateralidad</option>
          {lateralityValues.map((item) => (
            <option key={item.code} value={item.code}>
              {item.display}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EncounterFrame;
