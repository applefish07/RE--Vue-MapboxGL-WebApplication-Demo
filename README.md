# Vue MapboxGL Project

An interactive map visualization project combining Vue 3, Mapbox GL, and Three.js.

## 📋 Project Overview

This project integrates powerful modern web development tools:
- **Vue 3** - Progressive JavaScript framework
- **Mapbox GL** - Interactive vector maps
- **Three.js** - 3D graphics rendering library
- **Vuex** - State management
- **Vue Router** - Routing management

## ✨ Key Features

- 🗺️ Interactive map visualization
- 🎨 3D data visualization
- 🔍 Geographic location search (Mapbox Geocoder)
- 📊 Data parsing and processing (PapaParse)
- 🎯 Responsive design
- 🔄 Real-time data updates

## 🚀 Tech Stack

### Core Technologies
- Vue 3.5.13
- Mapbox GL 3.9.4
- Three.js 0.173.0
- Vuex 4.1.0
- Vue Router 4.5.0

### Development Tools
- Vite 6.1.0
- Vue CLI 5.0
- ESLint
- Babel

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn

### Install Dependencies

```bash
npm install
```

## 🛠️ Development

### Start Development Server

```bash
npm run serve
```

Or start both the development server and JSON Server simultaneously:

```bash
npm start
```

This will launch:
- Vue development server (default port 8080)
- JSON Server (port 3000) for mocking backend API

## 🔑 Configuration

### Mapbox Access Token

Before using Mapbox features, you need to configure your Mapbox Access Token:

1. Register an account at [Mapbox](https://www.mapbox.com/)
2. Get your Access Token
3. Configure the token in your project (usually in environment variables or config files)

```javascript
// Example configuration
mapboxgl.accessToken = 'your-mapbox-token-here';
```

## 📁 Project Structure

```
vue-mapbox-threejs/
├── public/              # Static assets
├── src/
│   ├── assets/         # Project resource files
│   ├── components/     # Vue components
│   ├── router/         # Router configuration
│   ├── store/          # Vuex state management
│   ├── views/          # Page views
│   ├── App.vue         # Root component
│   └── main.js         # Entry file
├── db.json             # JSON Server data file
└── package.json        # Project configuration
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

> IE 11 is not supported

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run serve` | Start development server |
| `npm start` | Start both dev server and JSON Server |

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

[MIT License](LICENSE)

## 👥 Author

[Your Name](https://github.com/yourusername)

## 🔗 Links

- [Vue 3 Documentation](https://vuejs.org/)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Live Demo](your-demo-link)

---

For any questions, please submit an [Issue](https://github.com/yourusername/projectname/issues)
