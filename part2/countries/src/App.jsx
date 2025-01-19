/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((country, index) => (
          <div key={country.name.common + index}>{country.name.common}</div>
        ))}
      </div>
    );
  } else if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name.common}</h1>
        <div>capital {countries[0].capital[0]}</div>
        <div>area {countries[0].area}</div>

        <h2>languages</h2>
        <ul>
          {Object.values(countries[0].languages).map((language, index) => (
            <li key={language + index}>{language}</li>
          ))}
        </ul>
        <img
          src={countries[0].flags.png}
          alt={countries[0].name.common}
          width="150"
        />
      </div>
    )
  }
};

const App = () => {
  const [country, setCountry] = useState("");
  const [countrydata, setCountrydata] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    if (country) {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        console.log("fetched all countries");
        setCountrydata(response.data); // Save the entire response data
      });
    }
  }, [country]);

  const handleChange = (event) => {
    setCountry(event.target.value);
    const filteredCountries = countrydata.filter((country) => {
      return country.name.common.toLowerCase().includes(event.target.value.toLowerCase());
    })
    setSelectedCountries(filteredCountries);
  };

  return (
    <div>
      find countries <input value={country} onChange={handleChange} />
      <Countries countries={selectedCountries} />
    </div>
  );
};

export default App;
