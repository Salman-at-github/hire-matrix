import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateJobList from './components/CreateJobList';
import Login from './components/pages/Login';
import JobDetails from './components/pages/JobDetails';
import Navbar from './components/Navbar';
import JobsList from './components/pages/JobsList';
import ApplyForm from './components/pages/ApplyForm';
import SignUp from './components/pages/SignUp';
import Responses from './components/pages/Responses';
import Notification from './components/Notification';
import Footer from './components/Footer';


function App() {
  return (
    <div className='bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950'>
      <Router>
        <Navbar/>
      <Routes>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<JobsList/>}/>
      <Route path='/createjob' element={<CreateJobList/>}/>
      <Route path='/jobdetails/:id' element={<JobDetails/>}/>
      <Route path='/jobs/apply/:id' element={<ApplyForm/>}/>
      <Route path='/jobs/response/:id/:title' element={<Responses/>}/>
      
      </Routes>
      <Notification/>
      <Footer/>
      </Router>
    </div>
  );
}

export default App;
