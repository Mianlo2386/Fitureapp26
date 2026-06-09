import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore()
  return (
    <button
      onClick={toggle}
      className="cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
