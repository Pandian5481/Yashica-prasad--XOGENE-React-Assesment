import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DrugDetails = ({ match }) => {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {

        const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${match.params.rxcui}/ndcs.json`);
        
        if (response.data && response.data.ndcGroups && response.data.ndcGroups.ndcGroup) {
          
          const ndcs = response.data.ndcGroups.ndcGroup.flatMap(group => group.ndcList);
          
         
          setDetails({
            rxcui: match.params.rxcui,
            name: response.data.ndcGroups.ndcGroup[0].name,
            synonym: response.data.ndcGroups.ndcGroup[0].synonym,
            ndcs: ndcs,
          });
          
          setError(''); 
        } else {
          setError('No details found');
        }
      } catch (error) {
        setError('Error fetching data');
      }
    };
    
    fetchDetails(); 
  }, [match.params.rxcui]); 

  
  if (!details) return <p>Loading...</p>;

  return (
    <div>
     
      <h2>{details.name}</h2>
      <p>RXCUI: {details.rxcui}</p>
      <p>Synonyms: {details.synonym}</p>
      <ul>
        {details.ndcs.length > 0 ? (
          details.ndcs.map((ndc, index) => (
            <li key={index}>{ndc.ndc}</li>
          ))
        ) : (
          <li>No NDCs found</li>
        )}
      </ul>
      {error && <p>{error}</p>}
    </div>
  );
};

export default DrugDetails;
