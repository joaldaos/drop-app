const items = [
  '🎵 Midnight Rain – Taylor Swift',
  '🎶 As It Was – Harry Styles',
  '🔥 Blinding Lights – The Weeknd',
  '✨ Flowers – Miley Cyrus',
  '🎸 Anti-Hero – Taylor Swift',
  '💜 Unholy – Sam Smith',
  '🎤 Escapism – RAYE',
  '🌊 Levitating – Dua Lipa',
]

export default function Ticker() {
  const repeated = [...items, ...items]
  return (
    <div className="overflow-hidden py-4" style={{ borderTop:'1px solid rgba(147,51,234,0.15)', borderBottom:'1px solid rgba(147,51,234,0.15)', background:'rgba(147,51,234,0.05)' }}>
      <div className="ticker">
        {repeated.map((t, i) => (
          <span key={i} className="text-sm text-gray-400 font-medium flex-shrink-0">{t}</span>
        ))}
      </div>
    </div>
  )
}
