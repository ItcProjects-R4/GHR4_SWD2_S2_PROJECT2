import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import { SearchProvider } from './context/SearchContext'
import UserContextProvider from './context/UserContext'
import { AuthModalProvider } from './context/AuthModalContext'
import ThemedToaster from './components/ThemedToaster/ThemedToaster'
import './App.css'

import Layout from './components/Layout/Layout'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Notfound from './components/Notfound/Notfound'
import Home from './components/Home/Home'
import Categories from './components/Categories/Categories'
import CategoryDetails from './components/Categories/CategoryDetails/CategoryDetails'
import Trending from './components/Trending/Trending'
import Favorites from './components/Favorites/Favorites'
import PodcastDetails from './components/PodcastDetails/PodcastDetails'
import EpisodeDetails from './components/EpisodeDetails/EpisodeDetails'
import SearchResults from './components/SearchResults/SearchResults'
import About from './components/About/About'
import Dashboard from './components/Dashboard/Dashboard'
import ProtectedRoute from './components/Guards/ProtectedRoute'
import GuestRoute from './components/Guards/GuestRoute'

function App() {
  const routers = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'categories', element: <Categories /> },
        { path: 'category/:id', element: <CategoryDetails /> },
        { path: 'trending', element: <Trending /> },
        { path: 'favorites', element: <ProtectedRoute><Favorites /></ProtectedRoute> },
        { path: 'podcast/:id', element: <PodcastDetails /> },
        { path: 'episode/:id', element: <EpisodeDetails /> },
        { path: 'search', element: <SearchResults /> },
        { path: 'about', element: <About /> },
        { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
        { path: '*', element: <Notfound /> },
      ],
    },
    {
      path: 'login',
      element: <GuestRoute><Login /></GuestRoute>,
    },
    {
      path: 'register',
      element: <GuestRoute><Register /></GuestRoute>,
    },
  ])

  return (
    <UserContextProvider>
      <AuthModalProvider>
        <FavoritesProvider>
          <SearchProvider>
            <ThemedToaster />
            <RouterProvider router={routers} />
          </SearchProvider>
        </FavoritesProvider>
      </AuthModalProvider>
    </UserContextProvider>
  )
}

export default App
