import { NUMBER_EMOJIS } from '../utils/constants'

export default function TargetList({ targets, onUpdate, onRemove, onAdd }) {
  return (
    <fieldset className="field">
      <legend>🗒️ Targets for the day</legend>
      <div className="targets-list">
        {targets.map((target, index) => (
          <div key={index} className="target-row">
            <span className="target-number">{NUMBER_EMOJIS[index]}</span>
            <input
              type="text"
              placeholder={`Target ${index + 1}`}
              value={target}
              onChange={(e) => onUpdate(index, e.target.value)}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => onRemove(index)}
              disabled={targets.length <= 1}
              title="Remove target"
              aria-label={`Remove target ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="add-btn" onClick={onAdd}>
        + Add target
      </button>
    </fieldset>
  )
}
