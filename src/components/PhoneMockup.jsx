import Waveform from './Waveform'

const friends = [
  { name:'Alex', track:'Blinding Lights', emoji:'🎧', active:true  },
  { name:'Sam',  track:'Flowers',         emoji:'🌸', active:true  },
  { name:'Mia',  track:'Cruel Summer',    emoji:'✨', active:false },
  { name:'Leo',  track:'As It Was',       emoji:'🎸', active:true  },
]

export default function PhoneMockup() {
  return (
    <div
      className="relative mx-auto"
      style={{
        width:240, height:480,
        background:'#0a0a0f',
        borderRadius:36,
        border:'6px solid #1e1e2e',
        boxShadow:'0 0 80px 20px rgba(147,51,234,0.25), inset 0 0 20px rgba(0,0,0,0.5)',
        overflow:'hidden',
      }}
    >
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:80, height:22, background:'#0a0a0f', borderRadius:'0 0 16px 16px', zIndex:10 }} />
      <div className="h-full flex flex-col p-4 pt-8 overflow-hidden" style={{ background:'linear-gradient(180deg,#111118,#0d0d16)', border:'1px solid rgba(147,51,234,0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-black gradient-text">DROP</span>
          <div className="flex items-center gap-1">
            <div className="status-dot" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
        <div className="rounded-xl p-3 mb-4" style={{ background:'rgba(147,51,234,0.15)', border:'1px solid rgba(147,51,234,0.3)' }}>
          <p className="text-xs text-purple-400 mb-1">YOU'RE PLAYING</p>
          <p className="text-sm font-bold">Midnight Rain</p>
          <p className="text-xs text-gray-400">Taylor Swift</p>
          <div className="mt-2">
            <Waveform heights={[35,60,80,50,90,40,70,55,85,45,75,60,95,50,65]} />
          </div>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Friends Listening</p>
        <div className="flex flex-col gap-2">
          {friends.map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg p-2" style={{ background:'rgba(255,255,255,0.03)' }}>
              <div style={{ background:'linear-gradient(135deg,#9333ea,#ec4899)', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>
                {f.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{f.name}</p>
                <p className="text-xs text-gray-500 truncate">{f.track}</p>
              </div>
              {f.active && (
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#1db954', boxShadow:'0 0 6px #1db954' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
