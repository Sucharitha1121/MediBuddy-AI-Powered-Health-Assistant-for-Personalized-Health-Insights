import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from "./components/Signup";
import MedicalRecordsUpload from './components/MedicalRecordsUpload';
import PersonalInformationForm from './components/PersonalInformationForm';
import HealthConcerns from './components/HealthConcerns';
import Chatbot from './components/Chatbot';
import AskDoctorForm from './components/AskDoctorForm';
import Handle from './components/Handle';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Login />} /> 
      <Route path="/dashboard" element={<Chatbot />} />
      <Route path='/personalInformation' element={<PersonalInformationForm/>}/>
      <Route path='/healthConcerns' element={<HealthConcerns/>}/>
      <Route path="/medical-records" element={<MedicalRecordsUpload />} />
      <Route path="/ask-doctor" element={<AskDoctorForm />}/>
      <Route path="/handle" element={<Handle />} />
     
    </Routes>
  );
}

export default App;
