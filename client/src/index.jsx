import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
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
import AnnouncementDetails from "@pages/announcementdetails/AnnouncementDetails.jsx";
import CourseFiles from "@pages/coursefiles/CourseFiles.jsx";
import People from "@pages/people/People.jsx";
import Grade from "@pages/grade/Grade.jsx";
import Grades from "@pages/grades/Grades.jsx";

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
        <Route path="/course/:courseId/announcement/:announcementId" element={<AnnouncementDetails />} />
        <Route path="/course/:courseId/assignment/:assignmentId" element={<AssignmentDetails />} />
        <Route path="/course/:courseId/assignment/:assignmentId/grade" element={<Grade />} />
        <Route path="/course/:courseId/assignments/new" element={<AddAssignment />} />
        <Route path="/course/:courseId/announcements/new" element={<AddAnnouncement />} />
        <Route path="/course/:courseId/newstudent" element={<AddStudent />} />
        <Route path="/course/:courseId/files" element={<CourseFiles />} />
        <Route path="/course/:courseId/people" element={<People />} />
        <Route path="/course/:courseId/grades" element={<Grades />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
