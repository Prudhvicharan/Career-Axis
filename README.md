# Job Application Tracker

A modern, user-friendly web application built with React to help job seekers organize and track their job applications efficiently.

## 🌟 Features

- **Application Dashboard**: Keep track of all your job applications in one place
- **Google OAuth Integration**: Secure authentication using Google Sign-In
- **Interactive Analytics**: Visualize your application progress with Recharts
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across all devices
- **Modern UI**: Clean and intuitive interface with a focus on usability

## 🚀 Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom configurations
- **Authentication**: Google OAuth 2.0
- **Charts & Visualization**: Recharts
- **HTTP Client**: Axios
- **Natural Language Processing**: Natural.js for text processing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/job-application-tracker.git
cd job-application-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Google OAuth credentials:
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📁 Project Structure
career-axis/
├── src/
│ ├── components/ # React components
│ ├── services/ # API and service integrations
│ ├── utils/ # Utility functions
│ ├── App.jsx # Main application component
│ └── index.js # Application entry point
├── public/ # Static assets
└── config files # Configuration files


## 🎨 Customization

The application uses Tailwind CSS for styling. You can customize the theme by modifying:
- `tailwind.config.js` for theme customization
- `src/custom.css` for custom styles
- `postcss.config.js` for PostCSS configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Google OAuth team for authentication support
- All contributors who help improve this project

## 📧 Contact

If you have any questions or suggestions, please open an issue in the repository.

---

Made with ❤️ for job seekers everywhere
