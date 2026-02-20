<<<<<<< HEAD
# NeuroShield Frontend

AI-powered malware detection and cybersecurity threat analysis platform built with Next.js. NeuroShield provides real-time file and URL scanning, comprehensive threat reporting, and an intuitive admin dashboard for managing security operations.

## Features

- **Real-time Malware Scanning**: Upload files for instant AI-powered malware detection
- **URL Safety Analysis**: Scan URLs for potential threats and phishing attempts
- **Threat Trends Dashboard**: Visualize malware trends and security insights
- **Admin Panel**: Comprehensive user management and system monitoring
- **Report Generation**: Export detailed security reports in PDF and DOCX formats
- **Firebase Authentication**: Secure user authentication and authorization
- **Responsive Design**: Mobile-friendly interface with cosmic-themed UI
- **AI Integration**: Powered by Google Gemini AI for intelligent threat analysis

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI/ML**: Google Gemini AI, Genkit
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod validation

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm or yarn package manager
- Firebase account with a project set up
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jarrarh117/neuroshield-frontend.git
cd neuroshield-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Keys
GOOGLE_API_KEY=your_google_api_key
GEMINI_API_KEY=your_gemini_api_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# Backend API
EMBER_API_URL=http://127.0.0.1:5000

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@neuroshield.io

# Firebase Admin SDK (JSON string)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

4. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage for file uploads
   - Download your service account key and add it to `FIREBASE_SERVICE_ACCOUNT`

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:9002`

### Production Build

```bash
npm run build
npm start
```

### Other Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Genkit development (AI flows)
npm run genkit:dev

# Watch Genkit changes
npm run genkit:watch
```

## Project Structure

```
neuroshield-frontend/
├── src/
│   ├── app/              # Next.js app directory (pages & API routes)
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── api/          # API endpoints
│   │   ├── auth/         # Authentication pages
│   │   ├── scan/         # File & URL scanning pages
│   │   └── reports/      # Report management
│   ├── components/       # React components
│   │   ├── cosmic/       # Cosmic-themed UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── auth/         # Authentication components
│   │   ├── scan/         # Scanning components
│   │   └── layout/       # Layout components
│   ├── ai/               # AI flows and Genkit configuration
│   ├── lib/              # Utility functions and Firebase config
│   ├── contexts/         # React contexts (Auth, etc.)
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
├── functions/            # Firebase Cloud Functions
└── docs/                 # Documentation
```

## Key Features Explained

### File Scanning
Upload files up to 100MB for malware detection. The system uses AI models to analyze file characteristics and provide threat assessments.

### URL Scanning
Enter URLs to check for phishing, malware distribution, and other security threats. Results include safety scores and detailed analysis.

### Admin Dashboard
- User management (add, edit, delete users)
- System statistics and analytics
- Report management
- Security settings configuration

### Report Generation
Export scan results in multiple formats:
- PDF reports with detailed analysis
- DOCX documents for documentation
- JSON data for integration

## Firebase Setup

1. **Authentication Rules**: Enable Email/Password authentication
2. **Firestore Rules**: Configure security rules for collections:
   - `users`: User profiles and settings
   - `reports`: Scan reports and history
   - `feedback`: User feedback submissions

3. **Storage Rules**: Set up rules for file uploads in the `scans/` directory

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy
```

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Environment Variables Security

⚠️ **Important**: Never commit `.env.local` or any file containing API keys to version control.

- Use environment variables for all sensitive data
- Rotate API keys regularly
- Use different keys for development and production
- Implement proper Firebase security rules

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: jarrarh117@gmail.com

## Related Repositories

- [NeuroShield Backend](https://github.com/jarrarh117/neuroshield-backend) - Python ML backend
- [NeuroShield Extension](https://github.com/jarrarh117/neuroshield-extension) - Chrome extension

---

Built with ❤️ by the NeuroShield Team
=======
# NeuroShield Frontend

AI-powered malware detection and cybersecurity threat analysis platform built with Next.js. NeuroShield provides real-time file and URL scanning, comprehensive threat reporting, and an intuitive admin dashboard for managing security operations.

## Features

- **Real-time Malware Scanning**: Upload files for instant AI-powered malware detection
- **URL Safety Analysis**: Scan URLs for potential threats and phishing attempts
- **Threat Trends Dashboard**: Visualize malware trends and security insights
- **Admin Panel**: Comprehensive user management and system monitoring
- **Report Generation**: Export detailed security reports in PDF and DOCX formats
- **Firebase Authentication**: Secure user authentication and authorization
- **Responsive Design**: Mobile-friendly interface with cosmic-themed UI
- **AI Integration**: Powered by Google Gemini AI for intelligent threat analysis

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI/ML**: Google Gemini AI, Genkit
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod validation

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm or yarn package manager
- Firebase account with a project set up
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jarrarh117/neuroshield-frontend.git
cd neuroshield-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Keys
GOOGLE_API_KEY=your_google_api_key
GEMINI_API_KEY=your_gemini_api_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# Backend API
EMBER_API_URL=http://127.0.0.1:5000

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@neuroshield.io

# Firebase Admin SDK (JSON string)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

4. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage for file uploads
   - Download your service account key and add it to `FIREBASE_SERVICE_ACCOUNT`

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:9002`

### Production Build

```bash
npm run build
npm start
```

### Other Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Genkit development (AI flows)
npm run genkit:dev

# Watch Genkit changes
npm run genkit:watch
```

## Project Structure

```
neuroshield-frontend/
├── src/
│   ├── app/              # Next.js app directory (pages & API routes)
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── api/          # API endpoints
│   │   ├── auth/         # Authentication pages
│   │   ├── scan/         # File & URL scanning pages
│   │   └── reports/      # Report management
│   ├── components/       # React components
│   │   ├── cosmic/       # Cosmic-themed UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── auth/         # Authentication components
│   │   ├── scan/         # Scanning components
│   │   └── layout/       # Layout components
│   ├── ai/               # AI flows and Genkit configuration
│   ├── lib/              # Utility functions and Firebase config
│   ├── contexts/         # React contexts (Auth, etc.)
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
├── functions/            # Firebase Cloud Functions
└── docs/                 # Documentation
```

## Key Features Explained

### File Scanning
Upload files up to 100MB for malware detection. The system uses AI models to analyze file characteristics and provide threat assessments.

### URL Scanning
Enter URLs to check for phishing, malware distribution, and other security threats. Results include safety scores and detailed analysis.

### Admin Dashboard
- User management (add, edit, delete users)
- System statistics and analytics
- Report management
- Security settings configuration

### Report Generation
Export scan results in multiple formats:
- PDF reports with detailed analysis
- DOCX documents for documentation
- JSON data for integration

## Firebase Setup

1. **Authentication Rules**: Enable Email/Password authentication
2. **Firestore Rules**: Configure security rules for collections:
   - `users`: User profiles and settings
   - `reports`: Scan reports and history
   - `feedback`: User feedback submissions

3. **Storage Rules**: Set up rules for file uploads in the `scans/` directory

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy
```

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Environment Variables Security

⚠️ **Important**: Never commit `.env.local` or any file containing API keys to version control.

- Use environment variables for all sensitive data
- Rotate API keys regularly
- Use different keys for development and production
- Implement proper Firebase security rules

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: jarrarh117@gmail.com

## Related Repositories

- [NeuroShield Backend](https://github.com/jarrarh117/neuroshield-backend) - Python ML backend
- [NeuroShield Extension](https://github.com/jarrarh117/neuroshield-extension) - Chrome extension

---

Built with ❤️ by the NeuroShield Team
>>>>>>> master
