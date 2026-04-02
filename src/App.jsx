import { useState, useEffect, useCallback } from 'react'
import './App.css'

import { NUMBER_EMOJIS } from './utils/constants'
import { useWeather } from './hooks/useWeather'
import { useLocalStorage } from './hooks/useLocalStorage'
import Hero from './components/Hero'
import LocationPicker from './components/LocationPicker'
import WeatherInput from './components/WeatherInput'
import TargetList from './components/TargetList'
import OutputSection from './components/OutputSection'
import InteractiveBackground from './components/InteractiveBackground'

function App() {
  const [location, setLocation] = useLocalStorage('standup-location', 'home')
  const [savedCity] = useLocalStorage('standup-city', 'Utrecht')
  const weather = useWeather(savedCity)
  const [, setSavedCity] = useLocalStorage('standup-city', 'Utrecht')
  const [handler, setHandler] = useLocalStorage('standup-handler', '')
  const [goal, setGoal] = useState('')
  const [targets, setTargets] = useState([''])
  const [output, setOutput] = useState('')

  // Sync city changes to localStorage
  useEffect(() => {
    setSavedCity(weather.city)
  }, [weather.city, setSavedCity])

  const addTarget = () => setTargets([...targets, ''])

  const removeTarget = (index) => {
    if (targets.length <= 1) return
    setTargets(targets.filter((_, i) => i !== index))
  }

  const updateTarget = (index, value) => {
    const updated = [...targets]
    updated[index] = value
    setTargets(updated)
  }

  const hasTargets = targets.some((t) => t.trim() !== '')
  const canGenerate = handler.trim() && goal.trim() && hasTargets && weather.temp

  const generate = useCallback(() => {
    if (!canGenerate) return
    const locationEmoji = location === 'home' ? '🏠' : '🏢'
    const header = `${locationEmoji} | ${weather.emoji} ${weather.temp} | ⛑️ ${handler} | 🎯 ${goal}`
    const targetLines = targets
      .filter((t) => t.trim() !== '')
      .map((t, i) => `${NUMBER_EMOJIS[i] || `${i + 1}.`} ${t}`)
      .join('\n')
    setOutput(header + '\n' + targetLines)
  }, [canGenerate, location, weather.emoji, weather.temp, handler, goal, targets])

  // Keyboard shortcut: Ctrl+Enter / ⌘+Enter to generate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        generate()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [generate])

  return (
    <>
      <InteractiveBackground />
      <div className="app">
        <Hero />

        <main className="card">
          <section className="form">
            <LocationPicker value={location} onChange={setLocation} />

            <WeatherInput
              city={weather.city}
              onCityChange={weather.setCity}
              temp={weather.temp}
              emoji={weather.emoji}
              hint={weather.hint}
              loading={weather.loading}
            />

            <label className="field">
              <span>⛑️ Support handler</span>
              <input
                type="text"
                placeholder="Jos"
                value={handler}
                onChange={(e) => setHandler(e.target.value)}
                aria-required="true"
              />
            </label>

            <label className="field">
              <span>🎯 Sprint goal / message of the day</span>
              <input
                type="text"
                placeholder="Fix login bug"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                aria-required="true"
              />
            </label>

            <TargetList
              targets={targets}
              onUpdate={updateTarget}
              onRemove={removeTarget}
              onAdd={addTarget}
            />

            <button
              className="generate-btn"
              onClick={generate}
              disabled={!canGenerate}
              title={canGenerate ? 'Generate (⌘+Enter)' : 'Fill in all fields first'}
            >
              ✨ Generate
            </button>
            {!canGenerate && (
              <p className="validation-hint" role="status">
                Fill in handler, goal, and at least one target to generate.
              </p>
            )}
          </section>

          {output && <OutputSection output={output} />}
        </main>

        <footer className="footer">
          Made with ☕ &amp; React — {new Date().getFullYear()} ·{' '}
          <a
            href="https://github.com/lastjnl/targetGenerator"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </footer>
      </div>
    </>
  )
}

export default App
