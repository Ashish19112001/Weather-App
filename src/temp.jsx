import React, { useCallback, useEffect, useState } from "react";
import Weathercard from "./weathercard";
import "./style.css";

const API_KEY = "d96fe5c6182bf7e2da6eee8ac010b4dc";

const Temp = () => {
  const [searchValue, setSearchValue] = useState("Greater Noida");
  const [tempInfo, setTempInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeatherInfo = useCallback(async () => {
    const city = searchValue.trim();

    if (!city) {
      setError("Please enter a city name");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "City not found");
      }

      const { temp, feels_like, humidity, pressure } = data.main;
      const { main: weathermood, description } = data.weather[0];
      const { name, timezone } = data;
      const { speed } = data.wind;
      const { country, sunset, sunrise } = data.sys;

      setTempInfo({
        temp,
        feels_like,
        humidity,
        pressure,
        weathermood,
        description,
        name,
        speed,
        country,
        sunset,
        sunrise,
        timezone,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [searchValue]);

  useEffect(() => {
    getWeatherInfo();
  }, [getWeatherInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeatherInfo();
  };

  return (
    <main className="app-shell">
      <div className="cloud cloud-one"></div>
      <div className="cloud cloud-two"></div>
      <div className="cloud cloud-three"></div>

      <section className="hero-copy compact-hero">
        <p className="eyebrow">Weather Forecast</p>
        <h1>Weather Dashboard</h1>
      </section>

      <form className="search" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search city e.g. Chicago"
          autoFocus
          id="search"
          className="searchTerm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <button className="searchButton" type="submit" disabled={isLoading}>
          {isLoading ? "..." : "Search"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <Weathercard {...tempInfo} isLoading={isLoading} />
      <footer className="page-footer">copyright© | Design and Code by Ashish Gangwar ❤️</footer>
    </main>
  );
};

export default Temp;