import './App.css';
import { BrowserRouter , Route , Routes , Navigate} from "react-router-dom"
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/events" />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/booking" element={<BookingsPage />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
