import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';

const ALL_TAGS = ['todos', 'pop', 'indie', 'rap', 'hip-hop', 'lofi', 'estudio', 'jazz', 'relax', 'fiesta', 'verano', 'gym', 'hits'];

export default function Discover() {
  const { t } = useTranslation();
  const { communityPlaylists } = useApp();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('todos');
  const [sort, setSort] = useState('trending');

  const filtered = communityPlaylists
    .filter(p => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
      const matchTag = activeTag === 'todos' || p.tags.includes(activeTag);
      return matchSearch && matchTag;
    })
    .sort((a, b) => {
      if (sort === 'trending') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.plays - a.plays;
      if (sort === 'likes') return b.likes - a.likes;
      if (sort === 'plays') return b.plays - a.plays;
      return 0;
    });

  return (
    <div style={{ paddingTop: 90, maxWidth: 1100, margin: '0 auto', padding: '90px 24px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin:'0 0 4px', fontSize:28, fontWeight:900, color:'#f1f5f9' }}>✨ {t('playlists.discover_title')}</h1>
        <p style={{ margin:0, fontSize:14, color:'#6b7280' }}>{t('home.discover_sub')}</p>
      </div>

      {/* Search + sort */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t('playlists.search')}
          style={{
            flex:1, minWidth:200, background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
            padding:'10px 14px', color:'#f1f5f9', fontSize:14, outline:'none',
          }}
        />
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:10, padding:'10px 14px', color:'#9ca3af', fontSize:14, outline:'none', cursor:'pointer',
        }}>
          <option value="trending">🔥 Trending</option>
          <option value="likes">♥ Más likes</option>
          <option value="plays">▶ Más escuchadas</option>
        </select>
      </div>

      {/* Tags */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
        {ALL_TAGS.map(tag => (
          <button key={tag} onClick={() => setActiveTag(tag)} style={{
            background: activeTag === tag ? 'rgba(147,51,234,0.3)' : 'rgba(255,255,255,0.05)',
            border: activeTag === tag ? '1px solid rgba(147,51,234,0.6)' : '1px solid rgba(255,255,255,0.08)',
            color: activeTag === tag ? '#c084fc' : '#6b7280',
            borderRadius:20, padding:'5px 14px', fontSize:13, fontWeight:600, cursor:'pointer',
          }}>
            {tag === 'todos' ? t('playlists.all') : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ fontSize:13, color:'#4b5563', marginBottom:20 }}>{filtered.length} playlists</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#6b7280' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
          <p>No se encontraron playlists</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
          {filtered.map(p => <PlaylistCard key={p.id} playlist={p} />)}
        </div>
      )}
    </div>
  );
}
