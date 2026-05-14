export default function Waveform({ heights = [40,70,55,90,45,80,60,75,50,85,40,65,95,55,70] }) {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 32 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: `${h}%`,
            animationName: 'bar',
            animationDuration: `${0.8 + (i % 5) * 0.15}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  )
}
