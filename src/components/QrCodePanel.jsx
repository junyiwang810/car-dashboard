import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

function QrCodePanel({ url }) {
  const [qrMarkup, setQrMarkup] = useState('')

  useEffect(() => {
    let cancelled = false

    async function generateQr() {
      const markup = await QRCode.toString(url, {
        errorCorrectionLevel: 'M',
        margin: 1,
        type: 'svg',
        width: 220,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })

      if (!cancelled) {
        setQrMarkup(markup)
      }
    }

    void generateQr()

    return () => {
      cancelled = true
    }
  }, [url])

  return (
    <div className="qr-panel">
      <div className="qr-frame" dangerouslySetInnerHTML={{ __html: qrMarkup }} />
      <div className="qr-meta">
        <p className="metric-label">Scanner Link</p>
        <p className="helper-text">
          Scan this QR code with the phone that will be used as the NFC relay.
        </p>
        <p className="helper-text">
          <span className="inline-code">{url}</span>
        </p>
      </div>
    </div>
  )
}

export default QrCodePanel
