# OFFTIME: TEACHER LEAVE MANAGEMENT SYSTEM

Real Time Research project Report submitted to 

**SRI INDU INSTITUTE OF ENGINEERING AND TECHNOLOGY**
(Affiliated to Jawaharlal Nehru Technological University Hyderabad) 
In partial fulfillment for the award of degree of

**Bachelor of Technology**
In
**Computer Science and Engineering** by

**BORRA PRUDVI THIRUMAL REDDY**

Under the Guidance of
**MR. D. NAGARAJU**
Assistant Professor

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**
**SRI INDU INSTITUTE OF ENGINEERING AND TECHNOLOGY (AUTONOMOUS)**
(Affiliated to JNTUH, Hyderabad, Approved by AICTE, New Delhi)
Sheriguda(V), Ibrahimpatnam(M), R.R.Dist., Telangana-501510.
**2025-2026**

---

## CERTIFICATE

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**

This is to certify that the dissertation entitled “**OFFTIME: TEACHER LEAVE MANAGEMENT SYSTEM**”, being submitted by **BORRA PRUDVI THIRUMAL REDDY** to **SRI INDU INSTITUE OF ENGINEERING AND TECHNOLOGY (AUTONOMOUS)** affiliated to **(Jawaharlal Nehru Technological University Hyderabad)** in partial fulfillment of the requirements for the award of the degree of *Bachelor of Technology* in *Computer Science & Engineering* , is a record of bonafide work carried out by me. The results of investigations enclosed in this report have been verified and found satisfactory. The results embodied in this dissertation have not been submitted to any other University or Institute for the award of any other degree.

**INTERNAL GUIDE**                **HEAD OF THE DEPARTMENT**
**COORDINATOR**                   **PRINCIPAL**

---

## DECLARATION

I, **BORRA PRUDVI THIRUMAL REDDY**, hereby declare that the project entitled "**OFFTIME: TEACHER LEAVE MANAGEMENT SYSTEM**" carried out under the guidance of **Mr. D. NAGARAJU** is submitted to **SRI INDU INSTITUTE OF ENGINEERING AND TECHNOLOGY (AUTONOMOUS)** affiliated to **(Jawaharlal Nehru Technological University Hyderabad)** in partial fulfillment of the requirements for the award of the degree of *Bachelor of Technology* in *Computer Science & Engineering*. This is a record of bonafide work carried out by me and the results embodied in this dissertation have not been reproduced or copied from any source. The results embodied in this dissertation have not been submitted to any other University or Institute for the award of any other degree.

**Date:**
**BORRA PRUDVI THIRUMAL REDDY**
**Department of CSE SIIET**

---

## INSTITUTE VISION
To become a premier institute of academic excellence by providing the world class education that transforms Individuals into high intellectuals, by evolving them as empathetic and responsible citizens through continuous improvement.

## INSTITUTE MISSION
* **IM1:** To offer outcome-based education and enhancement of technical and practical skills.
* **IM2:** To continuous assess of teaching-learning process through institute-industry collaboration.
* **IM3:** To be a centre of excellence for innovative and emerging fields in technology development with state-of-art facilities to faculty and students fraternity.
* **IM4:** To create an enterprising environment to ensure culture, ethics and social responsibility among the stakeholders.

## DEPARTMENT VISION
To become a prominent knowledge hub for learners, strive for educational excellence with innovative and industrial techniques so as to meet the global needs.

## DEPARTMENT MISSION
* **DM1:** To provide ambience that enhances innovations, problem solving skills, leadership qualities, decision making, team-spirit and ethical responsibilities.
* **DM2:** To impart quality education with professional and personal ethics, so as to meet the challenging technological needs of the industry and society.
* **DM3:** To provide academic infrastructure and develop linkage with the world class organizations to strengthen industry-academia relationships for learners.
* **DM4:** To provide and strengthen new concepts of research in the thrust area of Computer Science and Engineering to reach the needs of Government and Society.

---

## ACKNOWLEDGEMENT

With great pleasure I take this opportunity to express my heartfelt gratitude to all the persons who helped me in making this project work a success.
First of all, I express my sincere thanks to **Mr. R. VENKAT RAO**, Chairman, Sri Indu Group of Institutions, for his continuous encouragement.
I am highly indebted to Principal, **Dr. K.S. SADASIVA RAO** for giving me the permission to carry out this minor project.
I would like to thank **Mrs. DEEPA DEVERASETTY** Assistant Professor & Head of the Department (CSE), for giving support throughout the period of my study in SIIET. I am grateful for her valuable suggestions and guidance during the execution of this minor project work.
My sincere thanks to project guide **MR. D. NAGARAJU** for potentially explaining the entire system and clarifying the queries at every stage of the minor project.
My wholehearted thanks to the staff of **Computer Science and Engineering** who cooperated with me for the completion of the minor project in time.
I also thank my parents and friends who aided me in completion of the minor project.

**BORRA PRUDVI THIRUMAL REDDY**

---

## ABSTRACT

The **OffTime (Teacher Leave Management System)** is a web-based application developed to digitize and manage the leave request workflow for educational institutions. The primary objective of this system is to bridge the communication gap between teachers and administrators, replacing slow and inefficient paper-based processes with an agile, real-time platform.

The system features role-based access control, allowing Teachers to submit, track, and withdraw leave requests (including custom leave types), while empowering Administrators to review, approve, or reject these requests seamlessly through an intuitive dashboard. To maximize operational efficiency, OffTime leverages real-time WebSocket communication, ensuring that users are instantly notified whenever the status of a leave request changes.

The application is architected utilizing the MERN stack (MongoDB, Express.js, React.js, Node.js), ensuring a robust, scalable, and responsive experience. The user interface employs modern design principles, including glassmorphism aesthetics and a dark-mode theme, to provide a premium user experience. Overall, this project demonstrates the effective use of modern full-stack web technologies to improve administrative accessibility, reduce approval turnaround times, and support centralized decision-making in academic environments.

---

## CONTENTS
1. **INTRODUCTION**
    1.1 Motivation
    1.2 Problem Definition
    1.3 Objective
    1.4 Limitations
2. **LITERATURE SURVEY**
    2.1 Introduction
    2.2 Existing System
    2.3 Proposed System
    2.4 Feasibility Study
    2.5 Technologies required for implementation
3. **ANALYSIS**
    3.1 Introduction
    3.2 Requirement Specification
        3.2.1 User Requirements
        3.2.2 Functional Requirements
        3.2.3 Non-functional Requirements
    3.3 Software and Hardware requirements
    3.4 System Constraints
4. **DESIGN**
    4.1 Introduction
    4.2 Proposed system Architecture
    4.3 UML diagrams (Use case Diagram, Activity diagram, Class Diagram)
    4.4 Module design and organization
5. **IMPLEMENTATION**
    5.1 Introduction
    5.2 Key functions
    5.3 Sample code
    5.4 Method of implementation
6. **TESTING, VALIDATION AND RESULTS**
    6.1 Introduction
    6.2 Testing Methodologies
    6.3 Design of test cases and scenarios
    6.4 Output Screens
7. **CONCLUSION**
    7.1 Conclusion
    7.2 Future Enhancement
8. **REFERENCES**

---

## 1. INTRODUCTION

### 1.1 MOTIVATION
In modern educational institutions, managing teacher attendance and leaves is a critical administrative task. Often, this process is handled using physical ledgers or disjointed communication channels (emails, chat apps), which leads to delayed approvals, lost paperwork, and lack of transparency. The motivation behind the **OffTime** project is to create a smart, centralized, and visually engaging web platform that streamlines the leave request workflow. By implementing real-time tracking, the system aims to eliminate administrative bottlenecks and simplify the approval process for both faculty and management.

### 1.2 PROBLEM DEFINITION
In traditional systems, applying for a leave is time-consuming. Teachers fill out physical forms which navigate through multiple desks before final approval. This leads to confusion regarding leave balances, delays in finding substitute teachers, and the inability to quickly retract a wrongly submitted request. Online generic form tools lack the specific constraints required by a school environment. The *OffTime Teacher Leave Management System* is developed to address these structural issues by supplying a dedicated, real-time web portal that precisely tracks leave states.

### 1.3 OBJECTIVES
* To design a secure and reliable authentication system for distinct user roles (Teacher and Admin).
* To develop an interactive dashboard allowing teachers to submit, monitor, and withdraw leave applications.
* To create a centralized administrative interface for reviewing and taking direct action (approve/reject) on applications.
* To implement a real-time notification engine using WebSockets so that teachers know their leave status instantly.
* To optimize the user experience with an aesthetically premium frontend design.

### 1.4 LIMITATIONS
* The system requires continuous internet connectivity due to its reliance on WebSockets for real-time notifications.
* The current configuration assumes a direct Teacher-to-Admin workflow; institutions with multi-tier approval hierarchies (e.g., HOD -> Principal -> Chairman) would require module extensions.
* Physical document verification (such as medical certificates for sick leave) still needs to be manually verified by the administrator.

---

## 2. LITERATURE SURVEY

### 2.1 INTRODUCTION
The transition from manual filing systems to digitized Management Information Systems (MIS) has gained rapid adoption globally. Various web applications have been developed to manage human resources and payrolls. However, academic institutions possess unique workflow requirements that standard enterprise HR software often fails to address smoothly.

### 2.2 EXISTING SYSTEM
The existing systems predominantly consist of manual paper submissions or disjointed digital systems like Google Forms or standardized email sequences. 
**Drawbacks in existing system:**
* **Lack of Real-time Updates:** Teachers do not know when their application is reviewed until the final verdict is manually communicated.
* **Absence of Centralized Dashboard:** Admin staff struggle to calculate total absentees for a specific day efficiently.
* **Error Prone:** Physical forms can be misplaced, leading to unwarranted salary deductions or attendance conflicts.

### 2.3 PROPOSED SYSTEM
The proposed *OffTime* system replaces the manual paradigm with a full-stack web application. OffTime utilizes a robust Node.js backend linked with MongoDB to persist leave records securely. Real-time WebSockets (Socket.io) establish a persistent connection between the server and the active clients, meaning approval status triggers an immediate on-screen notification. The React-based UI is engineered for high usability, preventing common input errors.

### 2.4 FEASIBILITY STUDY
* **Technical Feasibility:** The MERN stack guarantees excellent community support and wide compatibility, making implementation feasible.
* **Economic Feasibility:** The use of open-source frameworks (React, Express, Node) minimizes developmental overhead.
* **Operational Feasibility:** The intuitive platform requires zero technical training for the teaching staff or administrators.

### 2.5 TECHNOLOGIES REQUIRED
* **Frontend:** React.js, TailwindCSS (for rapid styling), Context API (State Management)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose)
* **Real-time Engine:** Socket.io

---

## 3. ANALYSIS

### 3.1 INTRODUCTION
This phase identifies what the system needs to accomplish based on the user groups (Teachers and Admins). Analysis dictates module division, database modeling, and interface requirements to ensure a zero-friction experience.

### 3.2 REQUIREMENT SPECIFICATION
#### 3.2.1 User Requirements
Users expect the application to be highly responsive. Teachers require an interface that concisely explains how to apply and view history. Admins require comprehensive visual lists that separate pending cases from resolved ones.

#### 3.2.2 Functional Requirements
* **Authentication:** Secure user login and registration.
* **Leave Pipeline:** Users must be able to select specific leave types (Sick, Casual, Academic, Custom), provide dates, and input reasons.
* **Status Updates:** The application must transition leave statuses purely based on admin actions.
* **Notifications:** Dispatch real-time alerts.

#### 3.2.3 Non-Functional Requirements
* **Performance:** The dashboard must load quickly, independently fetching states asynchronously.
* **Reliability:** Data cannot be duplicated or lost under heavy concurrency.
* **Usability:** Implement clear visual hierarchies, typography, and dark mode optimizations.

### 3.3 SOFTWARE AND HARDWARE REQUIREMENTS
* **Operating System:** Windows, Linux, or macOS.
* **Development Tools:** VS Code, Git, Node.js environment.
* **Web Browser:** Google Chrome, Mozilla Firefox (Modern Browsers).
* **RAM:** Minimum 4GB DDR4 (8 GB recommended for development).

### 3.4 SYSTEM CONSTRAINTS
As the system is web-reliant, hosting constraints dictate its deployment structure. The database must restrict concurrent overlapping leave requests by the same user to maintain data integrity. 

---

## 4. DESIGN

### 4.1 INTRODUCTION
The architecture of OffTime utilizes an MVC (Model-View-Controller) oriented REST API layered with a WebSocket server for bidirectional communication.

### 4.2 PROPOSED SYSTEM ARCHITECTURE
The system is divided into an isolated Client Application and Server Application. The Client makes stateless HTTP requests for routine data retrieval (fetching leave history) and maintains a persistent Socket connection for live dashboard metrics. The Server acts as a middleware securely connecting the client intents to the MongoDB instance.

### 4.3 UML DIAGRAMS
*(Note: Empty placeholder section. Please insert your Use Case, Activity, and Class Diagrams here)*
* **Use Case:** Illustrate the Teacher initiating a leave and the Admin resolving it.
* **Activity:** Show the flow from the user submitting the form to the socket dispatching an approval.
* **Class:** Outline `User`, `Leave`, and `Notification` document schemas.

### 4.4 MODULE DESIGN AND ORGANIZATION
* **Auth Module:** Handles password hashing (bcrypt) and JWT generation.
* **Leave Module:** Manages C.R.U.D operations for leave objects.
* **Notification Module:** Distributes events to target Users securely mapping IDs to Socket connections.

---

## 5. IMPLEMENTATION

### 5.1 INTRODUCTION
Implementation constitutes the actual translation of architectures into software code. The frontend was scaffolded using Vite for fast compilation, while the backend utilizes Express routing. 

### 5.2 KEY FUNCTIONS
The crucial functionality orbits the `Socket.io` event handlers integrated directly with REST endpoints. Upon a successful database update mapping a leave request to "Approved", the route invokes the global `io` instance to emit an event solely to the socket mapped to the teacher's ID.

### 5.3 SAMPLE CODE
**Server Setup & Real-time Connectivity (`server.js`)**
```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Map user IDs to specific active sockets for targeted notifications
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Custom Registration Logic mapping Teacher/Admin IDs to socket IDs
  socket.on('register', (userId) => {
    userSockets.set(Number(userId), socket.id);
  });
});

// Pass IO globally to routes as middleware to trigger notifications during API calls
app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

server.listen(5000, () => console.log('Server running on port 5000'));
```

### 5.4 METHOD OF IMPLEMENTATION
Development followed an agile methodology. First, the database schema operations were solidified. Next, REST endpoints were developed and tested using tools like Postman. The frontend was then constructed natively in React, connecting HTTP endpoints. Finally, WebSocket handlers were layered on top to provide the "live" aesthetic.

---

## 6. TESTING, VALIDATION AND RESULTS

### 6.1 INTRODUCTION
Testing verifies the durability of OffTime. The focus was to confirm that the leave tracking algorithms correctly prohibit illegal states (e.g., trying to withdraw an already approved leave).

### 6.2 TESTING METHODOLOGIES
* **Unit Testing:** Validated independent API endpoints for correct HTTP response codes (200 OK, 401 Unauthorized for bad tokens).
* **Integration Testing:** Verified that when a database state alters, the Socket module successfully receives and broadcasts the relevant event.
* **Manual Testing:** Exhaustively simulated dual-user scenarios in split browser profiles acting as Admin and Teacher simultaneously.

### 6.3 DESIGN OF TEST CASES AND SCENARIOS
* **Scenario 1:** A teacher attempts to submit an application missing a required field. The system should throw a client-side validation error. Result: Passed.
* **Scenario 2:** An admin approves a request. The target teacher's dashboard should immediately flag a new notification without page refresh. Result: Passed.

### 6.4 OUTPUT SCREENS
*(Note: Placeholder. Please insert your Application Screenshots here)*

---

## 7. CONCLUSION

### 7.1 CONCLUSION
The **OffTime Teacher Leave Management System** successfully digitizes and innovates upon the traditional leave assessment pipeline. By achieving an architecture that merges RESTful persistence with Socket-based real-time interactivity, the project delivers unparalleled transparency, speeds up administrative verdicts, and vastly improves the quality of life for educational personnel. The application functions accurately, dependably, and represents exactly the premium grade of operational software modern institutions require.

### 7.2 FUTURE ENHANCEMENT
The system's modular nature leaves ample room for scale. Future iterations could integrate:
* **Generative AI Analysis:** Charting and predicting leave frequencies to notify admins of potential staff shortages.
* **Multi-Hierarchical Auth:** Embedding chained authorizations (e.g., Department Head -> Principal) before final approval.
* **Mobile Portability:** React Native deployment for iOS/Android native clients.

---

## 8. REFERENCES
1. React.js Official Documentation, Available: https://react.dev/
2. Express.js Web framework, Available: https://expressjs.com/
3. Socket.io Real-time event-based communication, Available: https://socket.io/
4. MongoDB Mongoose Object Data Modeling, Available: https://mongoosejs.com/
5. JavaScript Developer Network (MDN), WebSockets API.
