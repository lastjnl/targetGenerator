export default function LocationPicker({ value, onChange }) {
  return (
    <fieldset className="field">
      <legend>📍 Work location</legend>
      <div className="radio-group" role="radiogroup" aria-label="Work location">
        <label className={`radio-pill${value === 'home' ? ' active' : ''}`}>
          <input
            type="radio"
            name="location"
            value="home"
            checked={value === 'home'}
            onChange={(e) => onChange(e.target.value)}
          />
          🏠 Home
        </label>
        <label className={`radio-pill${value === 'office' ? ' active' : ''}`}>
          <input
            type="radio"
            name="location"
            value="office"
            checked={value === 'office'}
            onChange={(e) => onChange(e.target.value)}
          />
          🏢 Office
        </label>
      </div>
    </fieldset>
  )
}
