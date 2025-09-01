AfriHealth Connect
Overview
AfriHealth Connect is an AI-powered web application designed to enhance healthcare accessibility in rural African communities, aligning with Sustainable Development Goal 3 (SDG3) - Good Health and Well-being. The platform provides telehealth appointment booking, AI-generated health tips based on user-reported symptoms, and a premium subscription model for enhanced features. Built with MySQL, HTML, CSS, JavaScript, and deployed using GitHub Pages (frontend) and Render (backend), the app integrates IntaSend for monetization, ensuring sustainability.
Features

User Authentication: Secure login and registration with email and password.
AI Health Tips: Real-time advice based on symptom input using an AI backend.
Telehealth Booking: Schedule virtual consultations with doctors via Jitsi Meet.
Premium Subscription: Upgrade to premium features with a $1/month fee via IntaSend.
Responsive Design: Professional layout with left navigation, header, footer, and health tips sidebar (dashboard pages).
Deployment: Scalable hosting on GitHub Pages and Render.

Prerequisites

Node.js and npm installed.
MySQL server running locally or on a remote instance.
Git for version control.
IntaSend sandbox API key for testing payments (obtain from sandbox.intasend.com).
A Render account for backend deployment.
A GitHub account for frontend deployment.

Installation
Backend Setup

Clone the repository:git clone https://github.com/your-username/afrihealth-connect.git
cd afrihealth-connect/server


Install dependencies:npm install


Configure environment variables in a .env file:DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=afrihealth_db
INTASEND_API_KEY=your_intasend_sandbox_key
PORT=3000


Set up the MySQL database:
Create a database named afrihealth_db.
Run the SQL schema from server/schema.sql to create tables.


Start the server:node server.js



Frontend Setup

Navigate to the public directory:cd ../public


Open index.html in a browser with a local server (e.g., Live Server extension) or serve it via a web server.

Usage

Login: Access the app at the deployed URL or locally via index.html. Enter credentials (e.g., test19@example.com / 12345 for testing).
Dashboard: After login, use the left sidebar to navigate to registration, AI tips, booking, or premium upgrade.
AI Tips: Input symptoms (e.g., "fever, cough") to receive health advice.
Booking: Schedule appointments with a doctor and date, launching a Jitsi Meet session.
Premium: Upgrade via the IntaSend button ($1/month) for enhanced features.

Deployment
Frontend (GitHub Pages)

Push the public directory to a GitHub repository.
Enable GitHub Pages in the repository settings, selecting the public folder as the source.
Access the live site at https://your-username.github.io/afrihealth-connect.

Backend (Render)

Create a new web service on Render.
Connect your GitHub repository and set the build command to npm install and start command to node server.js.
Configure environment variables in Render matching the .env file.
Deploy and note the Render URL (e.g., https://afrihealth-connect.onrender.com).

Technologies

Frontend: HTML, CSS, JavaScript, Bootstrap 5, Animate.css, Toastify.js.
Backend: Node.js, Express.js, MySQL.
AI Integration: Custom API endpoint for health tips.
Payment: IntaSend Inline SDK.
Deployment: GitHub Pages, Render.

Contributing
Contributions are welcome. Fork the repository, create a feature branch, and submit a pull request with detailed changes.
License
MIT License - See LICENSE file for details.
Useful Prompts
The following prompts have been instrumental in shaping this project:

"using ai tools and low code, focusing on sdg3, a project in mysql, html, css, js, ai powered, this project should solve an african based problem based on sdg3. the web app should be deployed on vercel, it should be monetizable"
"this is the display and its ugly and unprofessional, please remove it"
"make the webpage, professional with navigation on left, well described header, well described footer in middle, health tips on the right. the login page shouldnot change but change the other pages, use this website as a reference https://academy.powerlearnprojectafrica.org/dashboard.
"i donot want login page to have the same layout as the other pages, donot include footer, header, notification menu, health tip on the log in page"

These prompts guided the iterative development, ensuring alignment with project goals and user feedback.
Contact
For support or inquiries, reach out via the project repository issues page.