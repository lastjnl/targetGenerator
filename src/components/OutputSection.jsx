import { useState } from 'react'

export default function OutputSection({ output }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <section className="output-section">
      <h2 className="output-title" id="output-title">
        Your standup message
      </h2>
      <textarea
        className="output"
        readOnly
        value={output}
        rows={output.split('\n').length + 1}
        aria-labelledby="output-title"
      />
      <button className="copy-btn" onClick={copyToClipboard}>
        <span aria-live="polite">{copied ? '✅ Copied!' : '📋 Copy to clipboard'}</span>
      </button>
    </section>
  )
}
