// Fallback: centre of the Netherlands
export const NL_FALLBACK = { lat: 52.13, lon: 5.29, label: 'Netherlands' }

export function weatherCodeToEmoji(code) {
  if (code === 0) return '☀️' // Clear sky
  if (code <= 3) return '⛅' // Partly cloudy
  if (code <= 48) return '🌫️' // Fog
  if (code <= 57) return '🌧️' // Drizzle
  if (code <= 65) return '🌧️' // Rain
  if (code <= 67) return '🌨️' // Freezing rain
  if (code <= 77) return '❄️' // Snow
  if (code <= 82) return '🌧️' // Rain showers
  if (code <= 86) return '🌨️' // Snow showers
  if (code === 95) return '⛈️' // Thunderstorm
  if (code <= 99) return '⛈️' // Thunderstorm with hail
  return '☁️'
}

export function fetchWeather(lat, lon) {
  return fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  ).then((res) => res.json());
}

export function geocodeCity(name) {
  return fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en`,
  ).then((res) => res.json())
}
