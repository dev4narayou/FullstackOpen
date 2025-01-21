/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import countryServices from "./services/countries";

const Countries = ({ countries, selectCountry, weather }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((country, index) => (
          <div key={country.name.common + index}>
            {country.name.common}{" "}
            <button onClick={() => selectCountry(country)}>show</button>
          </div>
        ))}
      </div>
    );
  } else if (countries.length === 1) {
    const country = countries[0];
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital?.[0] || "Unknown"}</div>
        <div>area {country.area}</div>

        <h2>languages</h2>
        <ul>
          {Object.values(country.languages || {}).map((language, index) => (
            <li key={language + index}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={country.name.common} width="150" />

        <h2>Weather in {country.capital?.[0] || "Unknown"}</h2>
        {weather ? (
          <div>
            <div>temperature {weather.main.temp} Celsius</div>
            <div>wind {weather.wind.speed} m/s</div>
          </div>
        ) : (
          <div>Loading weather...</div>
        )}
      </div>
    );
  } else {
    return <div>No countries found</div>;
  }
};

const App = () => {
  const [country, setCountry] = useState("");
  const [countrydata, setCountrydata] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);

  useEffect(() => {
    if (country) {
      countryServices.getAll().then((response) => {
        setCountrydata(response);

        const filteredCountries = response.filter((countryEntry) =>
          countryEntry.name.common.toLowerCase().includes(country.toLowerCase())
        );

        setSelectedCountries(filteredCountries);

        if (filteredCountries.length === 1) {
          const capital = filteredCountries[0].capital?.[0];
          if (capital) {
            countryServices.getWeather(capital).then((weatherData) => {
              setSelectedWeather(weatherData);
            });
          }
        } else {
          setSelectedWeather(null);
        }
      });
    } else {
      setSelectedCountries([]);
    }
  }, [country]);

  const handleFormChange = (event) => {
    setCountry(event.target.value);
  };

  return (
    <div>
      find countries{" "}
      <input value={country} onChange={handleFormChange} autoFocus />
      <Countries
        countries={selectedCountries}
        selectCountry={(country) => setCountry(country.name.common)}
        weather={selectedWeather}
      />
    </div>
  );
};

export default App;
