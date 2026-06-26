import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { MapView } from './components/MapView';
import { RoomDetail } from './components/RoomDetail';
import { CharacterList } from './components/CharacterList';
import { CharacterDetail } from './components/CharacterDetail';
import { Timeline } from './components/Timeline';
import { Codex } from './components/Codex';
import { DocumentView } from './components/DocumentView';
import { Search } from './components/Search';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-tomb-black noise-overlay">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/room/:roomId" element={<RoomDetail />} />
        <Route path="/characters" element={<CharacterList />} />
        <Route path="/character/:characterId" element={<CharacterDetail />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/codex" element={<Codex />} />
        <Route path="/document/:documentId" element={<DocumentView />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};