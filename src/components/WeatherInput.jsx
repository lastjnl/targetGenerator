export default function WeatherInput({ city, onCityChange, temp, emoji, hint, loading }) {
  return (
    <div className="field">
      <span id="weather-label">🌤️ Weather</span>
      <div className="weather-row">
        <input
          type="text"
          placeholder="City name, e.g. Utrecht"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          aria-labelledby="weather-label"
        />
        <span
          className="weather-badge"
          aria-live="polite"
          aria-label={`Current weather: ${loading ? 'loading' : temp || 'unknown'}`}
        >
          {loading ? '⏳' : temp ? `${emoji} ${temp}` : '—'}
        </span>
      </div>
      {hint && (
        <span className="weather-hint" aria-live="polite">
          {hint}
        </span>
      )}
    </div>
  )
}
