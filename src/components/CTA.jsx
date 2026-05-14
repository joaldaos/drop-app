const AppleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.39.07 2.35.74 3.16.8 1.2-.23 2.35-.93 3.63-.84 1.54.13 2.71.74 3.47 1.89-3.19 1.91-2.66 6.37.74 7.73-.49 1.21-1.09 2.4-3 3.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.18 23.76c.26.13.56.13.82 0L12 18.88l-8-4.88V23.76zM12 18.88l8.82-5.38a.75.75 0 000-1.3L12 6.82 3.18 12.2a.75.75 0 000 1.3L12 18.88zM12 .36L1.13 6.75a.75.75 0 000 1.3L12 14.43l10.87-6.38a.75.75 0 000-1.3L12 .36z"/>
  </svg>
)

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:600, height:600, background:'rgba(147,51,234,0.12)', filter:'blur(80px)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4">Join the movement</p>
        <h2 className="text-5xl md:text-7xl font-black mb-6">
          Start dropping<br /><span className="gradient-text">right now.</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Free forever. No algorithm. Just music and the people who love it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl text-base font-bold text-white no-underline">
            <AppleIcon /> Download for iPhone
          </a>
          <a href="#" className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl text-base font-bold text-white no-underline"
            style={{ border:'1px solid rgba(147,51,234,0.5)', transition:'all 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(147,51,234,0.1)'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.transform='' }}>
            <GoogleIcon /> Download for Android
          </a>
        </div>
      </div>
    </section>
  )
}
