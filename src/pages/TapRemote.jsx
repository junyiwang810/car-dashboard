import { useEffect, useMemo, useState } from 'react'
import { set } from 'firebase/database'
import { useSearchParams } from 'react-router-dom'
import { PARTS } from '../data/dashboardContent.js'
import { activePartRef, hasFirebaseConfig } from '../lib/firebase.js'

function TapRemote() {
  const [searchParams] = useSearchParams()
  const requestedPart = searchParams.get('part')
  const normalizedPart = useMemo(
    () => PARTS.find((part) => part.toLowerCase() === requestedPart?.toLowerCase()),
    [requestedPart],
  )
  const [manualPart, setManualPart] = useState(null)
  const [status, setStatus] = useState(
    normalizedPart
      ? `Relay detected ${normalizedPart}. Updating dashboard now.`
      : 'Standby page ready. Keep this page open, then tap a programmed NFC tag and open the iPhone notification.',
  )
  const selectedPart = manualPart ?? normalizedPart ?? 'Engine'

  async function writePart(part) {
    if (!hasFirebaseConfig || !activePartRef) {
      setStatus(`Firebase not configured. Previewing ${part} only.`)
      return
    }

    await set(activePartRef, part)
    setStatus(`${part} published to dashboard/active_part`)
  }

  useEffect(() => {
    if (!normalizedPart) {
      return
    }

    let cancelled = false

    async function syncQueryPart() {
      if (!hasFirebaseConfig || !activePartRef) {
        if (!cancelled) {
          setStatus(`Firebase not configured. Previewing ${normalizedPart} only.`)
        }
        return
      }

      await set(activePartRef, normalizedPart)

      if (!cancelled) {
        setStatus(`${normalizedPart} published to dashboard/active_part`)
        window.setTimeout(() => {
          if (!cancelled) {
            window.location.replace('/tap')
          }
        }, 1800)
      }
    }

    void syncQueryPart()

    return () => {
      cancelled = true
    }
  }, [normalizedPart])

  async function publishPart(part) {
    setManualPart(part)
    await writePart(part)
  }

  return (
    <main className="app-shell">
      <div className="remote-shell">
        <section className="panel remote-stack">
          <header className="panel-header">
            <div>
              <p className="eyebrow">iPhone NFC Relay</p>
              <h1 className="panel-title">Standby Tag Receiver</h1>
              <p className="panel-subtitle">
                This page stays on standby. On iPhone, the NFC tag itself opens
                the hosted URL, and that URL pushes the active subsystem to the
                dashboard listener.
              </p>
            </div>
            <div className={`status-chip ${hasFirebaseConfig ? 'active' : 'warning'}`}>
              {hasFirebaseConfig ? 'Remote online' : 'Remote offline'}
            </div>
          </header>

          <div className="remote-body">
            <div className="remote-part-readout">
              <div>
                <p className="metric-label">Relay Status</p>
                <div className="remote-part-value">
                  {normalizedPart ? 'Tag received' : 'Standby'}
                </div>
              </div>
              <div>
                <p className="metric-label">Current Part</p>
                <div className="metric-value">
                  {normalizedPart ?? 'Waiting for NFC tag'}
                </div>
              </div>
            </div>

            <p className="helper-text">{status}</p>

            <div className="notice">
              <strong>How it works on iPhone:</strong> this page does not read
              NFC itself. Tapping an NFC tag shows an iPhone notification, and
              opening that notification launches a hosted URL like{' '}
              <span className="inline-code">/tap?part=Engine</span>. That URL
              relays the part to Firebase, updates the laptop, then returns to
              standby automatically.
            </div>

            <div className="notice">
              <strong>Chrome on iPhone note:</strong> Chrome still uses the
              iPhone system NFC behavior, so you should expect the notification
              handoff instead of direct in-page scanning.
            </div>

            <div className="notice">
              <strong>Troubleshooting fallback:</strong> if you need to simulate
              a tag open without hardware, use the buttons below.
            </div>

            <div className="remote-actions">
              {PARTS.map((part) => (
                <button
                  key={part}
                  className={`btn ${part === selectedPart ? 'btn-primary' : ''}`}
                  type="button"
                  onClick={() => publishPart(part)}
                >
                  Simulate {part}
                </button>
              ))}
            </div>
            <div className="notice">
              <strong>NFC tag URL set:</strong>{' '}
              <span className="inline-code">/tap?part=Engine</span>,{' '}
              <span className="inline-code">/tap?part=Drivetrain</span>,{' '}
              <span className="inline-code">/tap?part=Wheels</span>,{' '}
              <span className="inline-code">/tap?part=Fuel%20Tank</span>.
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default TapRemote
