import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateJobList from './components/CreateJobList';
import Login from './components/Login';
import JobDetails from './components/JobDetails';
import Navbar from './components/Navbar';
import JobsList from './components/JobsList';
import ApplyForm from './components/ApplyForm';
import SignUp from './components/SignUp';
import Responses from './components/Responses';
import Notification from './components/Notification';


function App() {
  return (
    <div className='h-screen'>
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
      </Router>
    </div>
  );
}

export default App;
