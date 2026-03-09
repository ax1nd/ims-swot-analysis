# RIT Information Management System (IMS) - Frontend

A modern, responsive frontend application for the RIT Information Management System (IMS) and Student Dashboard. This project provides a comprehensive hub for RIT students to easily track attendance, view their daily schedules, monitor academic performance, and apply for leaves.

## 🚀 Features

- **Dashboard:** At-a-glance view of the student profile, upcoming classes, and quick actions.
- **Timetable Management:** Dynamic schedule viewing with support for different days and visual period indicators.
- **Attendance Tracking:** Detailed attendance reports per subject with visual progress bars.
- **CAT Marks:** Track internal assessment performance in an easy-to-read tabular format.
- **Leave & OD Requests:** Streamlined interface for applying and tracking Leave/On-Duty requests.
- **Theming:** Full support for both **Light and Dark Modes** tailored for a great user experience.

## 🛠️ tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 for utility-first, responsive, and theme-aware styling.
- **Icons:** Lucide React for modern, scalable SVGs.

## ⚙️ Getting Started

Follow these steps to set up the project locally:

### Prerequisites
Make sure you have Node.js and a package manager (npm, yarn, pnpm) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/ax1nd/ims-swot-analysis.git
cd "RIT IMS"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
By default, the Vite dev server will start at `http://localhost:5173`. Open this URL in your browser to view the application.

### 4. Build for production (Optional)
To create a production-ready build:
```bash
npm run build
```
The optimized files will be generated in the `dist` folder.

## 📁 Project Structure

- `src/` - Contains the main application code.
  - `app.jsx` - Main application logic, routing, and UI components.
  - `index.css` - Global stylesheet, including Tailwind CSS directives.
  - `main.jsx` - React application entry point.
- `ml-api/` - Contains the Python API server and ML model for SWOT Analysis.

## 🤖 Running the ML Model

The IMS includes an ML model for SWOT analysis. To run the ML API server locally:

### 1. Navigate to the ML API directory
```bash
cd ml-api
```

### 2. Install Python dependencies
```bash
# For macOS users, XGBoost requires libomp:
brew install libomp

pip3 install -r requirements.txt
```

### 3. Start the API server
```bash
python3 api_server.py
```

The API server will run on `http://127.0.0.1:5001`. You can then run the SWOT analysis from the Admin Dashboard in the frontend.

Alternatively, to run the ML model analysis directly in the terminal:
```bash
python3 ml.py
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is intended for educational/personal use.

---
*Developed with ❤️*
