import React, { useState } from 'react';

const SnomedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://snowstorm.snomedtools.org/fhir/ValueSet/$expand?url=http://snomed.info/sct/449081005/version/20240930?fhir_vs&displayLanguage=es&filter=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      setResults(data.expansion?.contains || []);
    } catch (err) {
      setError('Error al realizar la búsqueda. Por favor, intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Búsqueda SNOMED CT</h2>
      
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ingrese término a buscar..."
        />
        <button
          onClick={handleSearch}
          disabled={loading}
        >
          Buscar
        </button>
      </div>

      {error && (
        <div>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}

      {loading && <p>Buscando...</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((item) => (
              <tr key={item.code}>
                <td>{item.code}</td>
                <td>{item.display}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" align="center">
                {loading ? 'Buscando...' : 'No hay resultados para mostrar'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SnomedSearch;