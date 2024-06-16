import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query}`);
      
      if (response.data && response.data.drugGroup && response.data.drugGroup.conceptGroup) {
        const drugs = response.data.drugGroup.conceptGroup.flatMap(group => group.conceptProperties);
        console.log(drugs);
        
        const filteredDrugs = drugs.filter(drug => drug && drug.name !== undefined);
        setResults(filteredDrugs);
        setError('');
        
        
        if (filteredDrugs.length === 0) {
          await fetchSpellingSuggestions();
        }
      } else {
        
        await fetchSpellingSuggestions();
      }
    } catch (error) {
      setError('Error fetching data');
    }
  };

  const fetchSpellingSuggestions = async () => {
    try {
      const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${query}`);
      
      if (response.data && response.data.suggestionGroup && response.data.suggestionGroup.suggestionList) {
        const suggestions = response.data.suggestionGroup.suggestionList.suggestion;
        setResults(suggestions);
        setError('');
      } else {
        setError('No spelling suggestions found');
        setResults([]);
      }
    } catch (error) {
      setError('Error fetching spelling suggestions');
      setResults([]);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResultClick = (result) => {
    if (result.rxcui) {
      navigate(`/drugs/${result.rxcui}`);
    } else {
      setQuery(result);
      handleSearch();
    }
  };

  return (
    <div>
      
      <header style={headerStyle}>
        <div className="logo">
          <h5>XOGENE LOGO</h5>
        </div>
        <div className="title">
          <h5>SEARCH DRUGS</h5>
        </div>
      </header>

      
      <div className="search-container">
        <input type="text" value={query} onChange={handleInputChange} onKeyPress={handleKeyPress} />
        <button onClick={handleSearch}>Search</button>
        {error && <p>{error}</p>}
        <ul>
          {results.length > 0 ? (
            results.map((result, index) => (
              <li key={index} onClick={() => handleResultClick(result)}>
                <a href={`#/drugs/${result.rxcui}`}>{result.name || result}</a>
              </li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem',
  borderBottom: '1px solid #ccc',
};

export default Search;
