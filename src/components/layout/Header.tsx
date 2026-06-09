import { Link, useLocation } from 'react-router-dom'
import { Trophy, Calendar, Tv, GitBranch, Swords } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const nav = [
  { to: '/', label: 'Hoy', icon: Calendar },
  { to: '/grupos', label: 'Grupos', icon: Trophy },
  { to: '/fixture', label: 'Fixture', icon: Calendar },
  { to: '/en-vivo', label: 'En Vivo', icon: Tv },
  { to: '/llaves', label: 'Llaves', icon: GitBranch },
]

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Swords size={22} className="text-yellow-500" />
          <span>FixtureApp<span className="text-yellow-500">'26</span></span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === to
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <ThemeToggle />
      </div>

      <nav className="flex justify-center gap-2 border-t border-gray-100 px-4 py-2 sm:hidden dark:border-gray-800">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium transition ${
              pathname === to
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-gray-500 dark:text-gray-500'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
