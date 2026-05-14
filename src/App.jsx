import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { AppProvider }   from './context/AppContext';
import Navbar            from './components/Navbar';
import Footer            from './components/Footer';
import Notification      from './components/Notification';
import Feed              from './pages/Feed';
import Trending          from './pages/Trending';
import Search            from './pages/Search';
import Playlists         from './pages/Playlists';
import Discover          from './pages/Discover';
import Profile           from './pages/Profile';
import Pricing           from './pages/Pricing';
import Admin             from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <div style={{ minHeight:'100vh', background:'#0a0a0f', color:'#f1f5f9' }}>
            <Navbar />
            <main>
              <Routes>
                <Route path="/"          element={<Feed />}      />
                <Route path="/trending"  element={<Trending />}  />
                <Route path="/search"    element={<Search />}    />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/discover"  element={<Discover />}  />
                <Route path="/profile"   element={<Profile />}   />
                <Route path="/pricing"   element={<Pricing />}   />
                <Route path="/admin"     element={<Admin />}     />
              </Routes>
            </main>
            <Footer />
            <Notification />
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
