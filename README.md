# SalonPro E-Commerce Frontend

A professional B2B and B2C e-commerce platform tailored for the salon industry. This frontend application is built with **React** and **Vite**, providing a fast and responsive user experience for salon owners, individual customers, and agents.

## 🚀 Key Features

- **🛍️ Product Showcase**: Browse professional salon products by categories with high-quality imagery.
- **🔐 Multi-Role Authentication**: Dedicated flows for Customers, Agents, and Admin.
- **🛒 Advanced Cart System**: Real-time cart management with persistence across sessions.
- **💳 Integrated Payments**: Seamless checkout with **Razorpay** supporting UPI, Cards, and Cash on Delivery.
- **🏷️ Agent Attribution**: Commission-based sales tracking with agent verification during checkout.
- **📊 Dashboards**:
  - **Admin**: Complete control over orders, products, and users.
  - **Agent**: Track rewards, commissions, and assigned sales.
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile views.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 7](https://vite.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State Management**: React Context API (Cart & Auth)
- **Styling**: Modern CSS with CSS Variables
- **Notifications**: [React-Toastify](https://github.com/fkhadra/react-toastify)
- **API Client**: Standard Fetch API with custom wrappers

## 📦 Project Structure

```text
src/
├── components/     # Reusable UI components (Common, Layout, UI)
├── context/        # Global state (CartContext)
├── pages/          # Full page components (HomePage, Checkout, etc.)
├── utils/          # API client and helper functions
├── assets/         # Images and global styles
└── data/           # Mock data and constants
```

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration
Create a `.env` file in the `frontend` root:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Running Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## 🚢 Build & Deployment
To create a production build:
```bash
npm run build
```
The output will be in the `dist` folder.

---
Developed for **SalonPro** professional salon solutions.

