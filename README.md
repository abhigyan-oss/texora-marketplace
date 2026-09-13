# 🧵 Texora — AI-Powered B2B Textile Marketplace

Texora is a full-stack B2B textile marketplace designed to connect textile buyers and suppliers through a modern, responsive platform.

It provides product discovery, natural-language AI assistance, supplier inventory management, order workflows, role-based authentication, and a streamlined buyer purchasing experience.

## 🚀 Live Demo

👉 https://texora-marketplace-two.vercel.app/

---

## ✨ Key Features

### 🛍️ Buyer Experience

- Browse textile products through a responsive marketplace
- Search and filter textile products
- Natural-language product search
- Product detail pages
- Add products to cart
- Cart quantity management
- Checkout workflow
- Order creation and confirmation
- Buyer dashboard
- View order history and order status
- Buyer onboarding and profile management

### 🏭 Supplier Experience

- Supplier registration and onboarding
- Supplier profile management
- Supplier dashboard
- Product inventory management
- Add new products
- Edit existing products
- Delete products
- Update stock quantities
- Mark products as available/out of stock
- View incoming orders
- Update order status through the workflow

### 🤖 AI Textile Assistant

Texora includes an AI-powered assistant designed specifically for textile sourcing.

The assistant can help users:

- Search for products using natural language
- Find fabrics based on requirements
- Recommend suitable textile products
- Compare fabrics
- Answer textile-related questions
- Suggest products based on use cases
- Navigate users directly to relevant products

Example queries:

> "Show breathable cotton fabrics under ₹300"

> "Compare cotton and linen"

> "What fabric is best for summer shirts?"

### 🎙️ Voice Input

The AI assistant also supports voice-based input using the browser's Web Speech API.

Users can speak their textile requirements instead of typing them.

---

## 🧠 Hugging Face AI Integration

Texora integrates a Hugging Face-powered language model on the backend to provide AI-assisted textile sourcing.

The AI architecture keeps the Hugging Face API credentials on the server rather than exposing them in the frontend.

High-level flow:

User
  ↓
Texora AI Assistant
  ↓
Backend API
  ↓
Hugging Face Inference
  ↓
AI Response
  ↓
Texora Assistant

The AI layer works together with the marketplace product database to make recommendations relevant to the available products.

🏗️ Architecture
                    ┌─────────────────────┐
                    │       Buyer         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   Vite + TypeScript │
                    │      Tailwind CSS   │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────┬───────┬──────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
     ┌─────────────────┐               ┌─────────────────┐
     │    MongoDB      │               │ Hugging Face AI │
     │ Product / Users │               │   Inference     │
     │ Orders / Data   │               │                 │
     └─────────────────┘               └─────────────────┘
                           ▲
                           │
                    ┌──────┴───────┐
                    │   Supplier   │
                    └──────────────┘
🛠️ Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
React Router
Axios
Motion
Lucide React
React Hook Form
Zod
Backend
Node.js
Express.js
MongoDB
Mongoose
REST APIs
JWT Authentication
AI
Hugging Face Inference
Natural-language textile search
AI recommendations
Product comparison
AI-powered Q&A
Deployment
Vercel — Frontend
Node.js / Express backend deployment
MongoDB database
🔐 Authentication & Authorization

Texora implements role-based authentication.

Supported roles:

Buyer
Supplier

Authentication uses:

JWT tokens
Protected API routes
Role-based access control
Protected buyer pages
Protected supplier pages

Users are shown different dashboards and workflows depending on their role.

📦 Product Management

Each textile product can contain information such as:

Product name
Category
Description
Price
Available stock
Fabric specifications
Colors
Supplier information
Product availability
Product images

Example textile categories include:

Cotton
Linen
Denim
Rayon
Velvet
Satin
Cotton Twill
📋 Order Management

Texora supports a simplified B2B order workflow.

Supplier order statuses:

Pending
   ↓
Accepted
   ↓
Preparing
   ↓
Ready for Dispatch
   ↓
Completed

This provides buyers with visibility into their order progress.

Payment processing, escrow, logistics and delivery workflows are intentionally outside the project scope.

📱 Responsive Design

Texora is designed for:

Desktop
Tablet
Mobile

The UI uses responsive layouts and reusable components to provide a consistent experience across screen sizes.

📁 Project Structure
texora-marketplace/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── home/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
⚙️ Local Development
1. Clone the repository
git clone https://github.com/abhigyan-oss/texora-marketplace
cd texora-marketplace
2. Install frontend dependencies
cd client
npm install
3. Install backend dependencies
cd ../server
npm install
4. Configure environment variables

Create a .env file inside the server directory.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_token

Never commit your .env file or API keys to GitHub.

5. Start the backend
cd server
npm start
6. Start the frontend

Open another terminal:

cd client
npm run dev

The frontend will normally be available at:

http://localhost:5173
🔑 Environment Variables
Variable	Description
PORT	Backend server port
MONGO_URI	MongoDB connection string
JWT_SECRET	Secret used for JWT authentication
HF_TOKEN	Hugging Face API token
🔄 Main Application Flow
Buyer
Register / Login
      ↓
Buyer Onboarding
      ↓
Marketplace
      ↓
Search / Filter / AI Assistant
      ↓
Product Details
      ↓
Add to Cart
      ↓
Checkout
      ↓
Create Order
      ↓
Buyer Dashboard
      ↓
Track Order
Supplier
Register / Login
      ↓
Supplier Onboarding
      ↓
Supplier Dashboard
      ↓
Manage Inventory
      ↓
Receive Orders
      ↓
Update Order Status
      ↓
Complete Order
🎯 Project Goals

Texora was built to demonstrate how a modern B2B marketplace can combine:

Full-stack web development
Role-based authentication
REST API architecture
Database-driven product management
AI-powered search
Natural-language interaction
Voice input
Buyer and supplier workflows
Responsive UI/UX
🔮 Future Improvements

Potential future improvements include:

Advanced supplier discovery
Fabric specification comparison
AI-powered supplier matching
Bulk quotation requests
Real-time notifications
Advanced analytics
Multi-language AI assistance
Improved recommendation ranking
👨‍💻 Author

Abhigyan Jha

Full Stack Web Developer

GitHub: https://github.com/abhigyan-oss
LinkedIn:https://www.linkedin.com/in/abhigyan-fullstack/
📄 License

This project was developed as a B2B textile marketplace prototype for demonstration and hackathon purposes.
