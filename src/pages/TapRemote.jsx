import { useCallback, useEffect, useMemo, useState } from 'react'
import { set } from 'firebase/database'
import { useSearchParams } from 'react-router-dom'
import { PARTS, resolvePartSelection } from '../data/dashboardContent.js'
import {
  ACTIVE_CAR_PART_PATH,
  activeCarPartRef,
  hasFirebaseConfig,
} from '../lib/firebase.js'

const fallbackPart = 'Engine'

function TapRemote() {
  const [searchParams] = useSearchParams()
  const requestedPart = searchParams.get('part')
  const queryPart = useMemo(() => resolvePartSelection(requestedPart), [requestedPart])
  const [manualMenuOpen, setManualMenuOpen] = useState(false)
  const [manualPart, setManualPart] = useState(null)
  const [status, setStatus] = useState(
    queryPart
      ? `Detected ${queryPart}. Updating the dashboard now.`
      : 'Keep this phone open, then tap an NFC tag on the model.',
  )
  const selectedPart = manualPart ?? queryPart ?? fallbackPart

  const rememberRelayState = useCallback((part, nextStatus) => {
    setStatus(nextStatus)
  }, [])

  const publishPart = useCallback(async (part) => {
    if (!hasFirebaseConfig || !activeCarPartRef) {
      rememberRelayState(part, `Firebase is not configured. Previewing ${part} only.`)
      return
    }

    await set(activeCarPartRef, {
      part,
      updatedAt: Date.now(),
    })
    rememberRelayState(part, `${part} sent to ${ACTIVE_CAR_PART_PATH}`)
  }, [rememberRelayState])

  useEffect(() => {
    if (!queryPart) {
      return
    }

    let cancelled = false
    let resetTimerId = null

    async function syncQueryPart() {
      try {
        await publishPart(queryPart)

        if (!cancelled) {
          resetTimerId = window.setTimeout(() => {
            if (!cancelled) {
              window.location.replace('/tap')
            }
          }, 1800)
        }
      } catch (error) {
        if (!cancelled) {
          rememberRelayState(queryPart, `Unable to send ${queryPart}. ${error.message}`)
        }
      }
    }

    void syncQueryPart()

    return () => {
      cancelled = true
      if (resetTimerId) {
        window.clearTimeout(resetTimerId)
      }
    }
  }, [publishPart, queryPart, rememberRelayState])

  async function handleManualPublish(part) {
    setManualPart(part)

    try {
      await publishPart(part)
    } catch (error) {
      rememberRelayState(part, `Unable to send ${part}. ${error.message}`)
    }
  }

  return (
    <main className="app-shell">
      <div className="remote-shell remote-shell-simple">
        <section className="panel remote-stack remote-stack-simple">
          <header className="remote-hero">
            <p className="eyebrow">NFC Relay</p>
            <h1 className="remote-title">Ready to Scan</h1>
            <p className="remote-lead">Tap a car-part tag to update the dashboard lesson.</p>
          </header>

          <section className="remote-status-card">
            <div className={`status-chip ${hasFirebaseConfig ? 'active' : 'warning'}`}>
              {hasFirebaseConfig ? 'Phone ready' : 'Phone offline'}
            </div>

            <div className="remote-part-readout remote-part-readout-simple">
              <div>
                <p className="metric-label">Current Part</p>
                <div className="remote-part-value">{queryPart ?? 'Waiting for scan'}</div>
              </div>
              <div>
                <p className="metric-label">Status</p>
                <div className="metric-value">{status}</div>
              </div>
            </div>
          </section>

          <section className="notice remote-instructions">
            <strong>How to use it:</strong> keep this page open on the phone, then tap an NFC tag.
            The phone opens the matching URL and sends that part to the main dashboard.
          </section>

          <section className="remote-fallback">
            <button
              className="btn"
              type="button"
              onClick={() => setManualMenuOpen((open) => !open)}
              aria-expanded={manualMenuOpen}
              aria-controls="remote-manual-menu"
            >
              {manualMenuOpen ? 'Hide Manual Controls' : 'Manual Controls'}
            </button>

            {manualMenuOpen ? (
              <div id="remote-manual-menu" className="remote-actions remote-actions-simple">
                {PARTS.map((part) => (
                  <button
                    key={part}
                    className={`btn ${part === selectedPart ? 'btn-primary' : ''}`}
                    type="button"
                    onClick={() => handleManualPublish(part)}
                  >
                    {part}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  )
}

export default TapRemote
