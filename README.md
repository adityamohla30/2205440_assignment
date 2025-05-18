# 🚀 Notification Service

A robust Node.js microservice for sending notifications via Email, SMS (simulated), and In-App messages.  
Features queue-based delivery, retry logic, and live API documentation.

---

## 🌐 Live Demo

**App:**  
https://two205440-assignment.onrender.com

**API Docs (Swagger):**  
https://two205440-assignment.onrender.com/api-docs

**GitHub Repository:**  
https://github.com/adityamohla30/2205440_assignment

---

## 📖 Table of Contents

- Features
- Tech Stack & Libraries
- How to Run Locally
- API Usage
- Example Requests
- Assumptions & Notes
- Future Improvements
- Author

---

## ✨ Features

- Send notifications via:
  - Email (using Nodemailer & Ethereal)
  - SMS (simulated for demo)
  - In-App (stored in memory)
- Queue-based processing for reliable delivery
- Automatic retry logic for failed notifications (up to 3 attempts)
- View all notifications for a user
- Interactive API documentation with Swagger/OpenAPI
- Deployed on Render for live testing

---

## 🛠️ Tech Stack & Libraries

- Node.js (Express) - REST API framework
- Nodemailer - Email sending (Ethereal for safe testing)
- Swagger UI Express & swagger-jsdoc - API documentation
- body-parser - JSON request parsing
- Render - Cloud deployment
- In-memory queue - Simulated job queue for notifications

---

## 🖥️ How to Run Locally

Open your terminal, go to your project folder, and run these commands one after the other:


npm install
npm start


Then open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser.


---

## 📬 API Usage

### Send a Notification

- Endpoint: `POST /notifications`
- Body fields:
  - `userId` (string, required)
  - `type` (string: `email`, `sms`, or `in-app`, required)
  - `message` (string, required)
  - `email` (string, required for email type)
  - `phone` (string, required for sms type)

### Get All Notifications for a User

- Endpoint: `GET /users/:id/notifications`

---

## 📦 Example Requests

Send an email notification:
POST /notifications
Content-Type: application/json

{
  "userId": "123",
  "type": "email",
  "message": "Hello via Email!",
  "email": "test@example.com"
}

Send an SMS notification:
POST /notifications
Content-Type: application/json

{
  "userId": "123",
  "type": "sms",
  "message": "Hello via SMS!",
  "phone": "+911234567890"
}

Send an in-app notification:
POST /notifications
Content-Type: application/json

{
  "userId": "123",
  "type": "in-app",
  "message": "Hello in-app!"
}

Get all notifications for a user:
GET /users/123/notifications

---

## 📝 Assumptions & Notes

- SMS notifications are simulated (not sent to real phones).
- Email notifications use Ethereal, a test SMTP service; preview links are shown in the server logs.
- In-app notifications are stored in memory; all notifications are lost if the server restarts.
- Queue and retry logic ensure reliable delivery (up to 3 attempts).
- No sensitive data is hardcoded.

---

## 🚧 Future Improvements

- Integrate real SMS/email providers (e.g., Twilio, SendGrid)
- Use a persistent database (MongoDB, PostgreSQL) for notifications
- Add user preferences and notification scheduling
- Implement a production-grade queue (RabbitMQ, Redis, etc.)
- Add authentication and rate limiting

---

## 👤 Author

**Aditya Kumar Mohla**  
Email: mohla.aditya30@gmail.com  
GitHub: https://github.com/adityamohla30

---

Thank you for reviewing my project! I hope you find the implementation, documentation, and deployment clear and professional.
