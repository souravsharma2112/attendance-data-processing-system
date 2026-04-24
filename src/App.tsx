
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './routes'
import ToasterWrapper from './components/toastWrapper/ToastWrapper'


function App() {

  return (
    <>
      <BrowserRouter>
        <MainRoutes />
        <ToasterWrapper />
      </BrowserRouter>
    </>
  )
}

export default App
