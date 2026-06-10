import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-600">
        © {new Date().getFullYear()} MianloDev{' '}
        <span className="text-yellow-500">'26</span>. Todos los derechos reservados.
      </footer>
    </div>
  )
}
