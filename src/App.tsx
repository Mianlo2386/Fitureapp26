import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import Fixture from './pages/Fixture'
import Live from './pages/Live'
import MatchDetail from './pages/MatchDetail'
import Bracket from './pages/Bracket'
import TeamPage from './pages/TeamPage'
import { useThemeStore } from './stores/themeStore'

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 2,
    },
  },
})

function ThemeInit() {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <ThemeInit />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/grupos" element={<Groups />} />
            <Route path="/fixture" element={<Fixture />} />
            <Route path="/en-vivo" element={<Live />} />
            <Route path="/llaves" element={<Bracket />} />
            <Route path="/partido/:id" element={<MatchDetail />} />
            <Route path="/equipo/:id" element={<TeamPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
