import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "1fcb861d65032ef14bf54decab9757b6"

  const fetchWeather = async (url) => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError("City not found");
        setWeather(null);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByCity = () => {
    if (!city) return;
    fetchWeather(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
  };


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
    });
  }, []);

  const isDay =
    weather &&
    weather.weather[0].icon.includes("d");

  return (
    <div className={`app ${isDay ? "day" : "night"}`}>
      <h1>🌦️ Weather App</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeatherByCity}>Search</button>
      </div>

      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      {weather && !loading && (
        <div className="card">
          <h2>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather"
          />
          <h3>{weather.main.temp}°C</h3>
          <p>{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;


