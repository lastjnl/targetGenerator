import { useState, useEffect, useRef } from 'react'
import { NL_FALLBACK, weatherCodeToEmoji, fetchWeather, geocodeCity } from '../utils/weather'

export function useWeather(initialCity = 'Utrecht') {
  const [city, setCity] = useState(initialCity)
  const [temp, setTemp] = useState('')
  const [emoji, setEmoji] = useState('☁️')
  const [hint, setHint] = useState('')
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    clearTimeout(debounceRef.current)

    const trimmed = city.trim()

    debounceRef.current = setTimeout(
      () => {
        if (!trimmed) {
          setTemp('')
          setHint('')
          return
        }

        setLoading(true)
        setHint('')

        geocodeCity(trimmed)
          .then((geo) => {
            if (geo.results && geo.results.length > 0) {
              const place = geo.results[0]
              setHint(place.name + (place.country ? `, ${place.country}` : ''))
              return fetchWeather(place.latitude, place.longitude)
            }
            setHint(`Not found — using ${NL_FALLBACK.label}`)
            return fetchWeather(NL_FALLBACK.lat, NL_FALLBACK.lon)
          })
          .then((data) => {
            const t = Math.round(data.current_weather.temperature)
            setTemp(`${t}°C`)
            setEmoji(weatherCodeToEmoji(data.current_weather.weathercode))
          })
          .catch(() => {
            setTemp('')
            setEmoji('☁️')
            setHint('Failed to fetch weather')
          })
          .finally(() => setLoading(false))
      },
      trimmed ? 600 : 0,
    )

    return () => clearTimeout(debounceRef.current)
  }, [city])

  return { city, setCity, temp, emoji, hint, loading }
}
