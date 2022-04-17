import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@pages/auth/login/Login.jsx";
import Signup from "@pages/auth/signup/Signup.jsx";
import Dashboard from "@pages/dashboard/Dashboard.jsx";
import Course from "@pages/course/Course.jsx";
import Assignments from "@pages/assignments/Assignments.jsx";
import Announcements from "@pages/announcements/Announcements.jsx";
import NotFound from "@pages/notfound/NotFound.jsx";
import AssignmentDetails from "@pages/assignmentdetails/AssignmentDetails.jsx";
import AddCourse from "@pages/addcourse/AddCourse.jsx";
import AddAssignment from "@pages/addassignment/AddAssignment.jsx";
import AddAnnouncement from "@pages/addannouncement/AddAnnouncement.jsx";
import AddStudent from "@pages/addstudent/AddStudent.jsx";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/course/:courseId" element={<Course />} />
        <Route exact path="/newcourse" element={<AddCourse />} />
        <Route path="/course/:courseId/assignments" element={<Assignments />} />
        <Route path="/course/:courseId/announcements" element={<Announcements />} />
        <Route path="/course/:courseId/assignment/:assignmentId" element={<AssignmentDetails />} />
        <Route path="/course/:courseId/assignments/new" element={<AddAssignment />} />
        <Route path="/course/:courseId/announcements/new" element={<AddAnnouncement />} />
        <Route path="/course/:courseId/newstudent" element={<AddStudent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
