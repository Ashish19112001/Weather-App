import React, { useEffect } from "react";

const formatTimeFromTimezone = (unixSeconds, timezoneOffset = 0) => {
  if (!unixSeconds && unixSeconds !== 0) return "--:--";

  const localDate = new Date((unixSeconds + timezoneOffset) * 1000);
  return localDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

const formatDateFromTimezone = (timezoneOffset = 0) => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const localDate = new Date((nowInSeconds + timezoneOffset) * 1000);

  return {
    date: localDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
    time: localDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }),
  };
};

const Weathercard = ({
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
  isLoading,
}) => {
  const [weatherState, setWeatherState] = React.useState("wi-day-sunny");
  const [clock, setClock] = React.useState(formatDateFromTimezone(timezone));

  useEffect(() => {
    if (weathermood) {
      switch (weathermood) {
        case "Clouds":
          setWeatherState("wi-day-cloudy");
          break;
        case "Haze":
        case "Fog":
          setWeatherState("wi-fog");
          break;
        case "Clear":
          setWeatherState("wi-day-sunny");
          break;
        case "Mist":
          setWeatherState("wi-dust");
          break;
        case "Rain":
        case "Drizzle":
          setWeatherState("wi-rain");
          break;
        case "Thunderstorm":
          setWeatherState("wi-thunderstorm");
          break;
        case "Snow":
          setWeatherState("wi-snow");
          break;
        default:
          setWeatherState("wi-day-sunny-overcast");
          break;
      }
    }
  }, [weathermood]);

  useEffect(() => {
    setClock(formatDateFromTimezone(timezone));
    const timer = setInterval(() => {
      setClock(formatDateFromTimezone(timezone));
    }, 1000);

    return () => clearInterval(timer);
  }, [timezone]);

  const sunriseTime = formatTimeFromTimezone(sunrise, timezone);
  const sunsetTime = formatTimeFromTimezone(sunset, timezone);
  const displayTemp = typeof temp === "number" ? Math.round(temp) : "--";
  const displayFeels = typeof feels_like === "number" ? Math.round(feels_like) : "--";
  const displayWind = typeof speed === "number" ? speed.toFixed(1) : "--";

  return (
    <article className={`widget ${isLoading ? "loading" : ""}`}>
      <div className="weatherIcon">
        <div className="sun-orb"></div>
        <div className="floating-cloud cloud-card-one"></div>
        <div className="floating-cloud cloud-card-two"></div>
        <i className={`wi ${weatherState}`}></i>
        <h2>{description || weathermood || "Weather"}</h2>
        <p>Have a beautiful day ahead</p>
      </div>

      <div className="weatherInfo">
        <div className="temperature">
          <span>{displayTemp}&deg;</span>
          <small>Feels like {displayFeels}&deg;C</small>
        </div>

        <div className="description">
          <div className="weatherCondition">{weathermood || "Loading"}</div>
          <div className="place">
            {name || "Search City"}{country ? `, ${country}` : ""}
          </div>
        </div>
      </div>

      <div className="date">
        <span className="date-label">Local Time</span>
        <strong>{clock.time}</strong>
        <small>{clock.date}</small>
      </div>

      <div className="extra-temp">
        <div className="info-card">
          <i className="wi wi-sunrise"></i>
          <p>{sunriseTime}</p>
          <span>Sunrise</span>
        </div>

        <div className="info-card">
          <i className="wi wi-sunset"></i>
          <p>{sunsetTime}</p>
          <span>Sunset</span>
        </div>

        <div className="info-card">
          <i className="wi wi-humidity"></i>
          <p>{humidity || "--"}%</p>
          <span>Humidity</span>
        </div>

        <div className="info-card">
          <i className="wi wi-barometer"></i>
          <p>{pressure || "--"} hPa</p>
          <span>Pressure</span>
        </div>

        <div className="info-card">
          <i className="wi wi-strong-wind"></i>
          <p>{displayWind} m/s</p>
          <span>Wind Speed</span>
        </div>
      </div>
    </article>
  );
};

export default Weathercard;