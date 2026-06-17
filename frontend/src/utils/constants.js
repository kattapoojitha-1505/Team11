export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const CATEGORIES = [
  'Development',
  'Data Science',
  'Security',
  'DevOps'
];

export const INITIAL_MOCK_PROJECTS = [
  {
    id: 1,
    title: "Cloud Sandbox IDE",
    category: "Development",
    techStack: "React, Node.js, Docker, WebSockets",
    description: "A live, isolated workspace environment running directly inside disposable secure cloud containers. Complete with terminal simulation and syntax highlighted file explorers.",
    demoUrl: "https://nimbus.live/sandbox/ide",
    thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
    userId: 1,
    author: "Srinivas K",
    stars: 124,
    views: 890,
    createdAt: "2026-05-10T14:30:00.000Z"
  },
  {
    id: 2,
    title: "SecureAuth Middleware",
    category: "Security",
    techStack: "Go, JWT, Redis, OAuth2",
    description: "Enterprise-grade authorization and authentication microservice built for maximum performance and low latency. Features advanced rate limiting and anomalies tracker.",
    demoUrl: "https://nimbus.live/auth/secure",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    userId: 2,
    author: "Jane Doe",
    stars: 89,
    views: 540,
    createdAt: "2026-06-01T09:15:00.000Z"
  },
  {
    id: 3,
    title: "NeuralFlow Estimator",
    category: "Data Science",
    techStack: "Python, PyTorch, FastAPI, NumPy",
    description: "Real-time predictions engine built on optimized deep neural networks. Processes multi-dimensional datasets to produce accurate predictive graphs in milliseconds.",
    demoUrl: "https://nimbus.live/ml/neuralflow",
    thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80",
    userId: 1,
    author: "Srinivas K",
    stars: 210,
    views: 1420,
    createdAt: "2026-06-12T18:00:00.000Z"
  },
  {
    id: 4,
    title: "KubeDeploy Orchestrator",
    category: "DevOps",
    techStack: "Kubernetes, Helm, Bash, Prometheus",
    description: "Automated blueprint deployment engine for Kubernetes cluster management. Spin up, monitor, and scale replicas dynamically with active resource alerts.",
    demoUrl: "",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80",
    userId: 3,
    author: "Alex Rivers",
    stars: 45,
    views: 290,
    createdAt: "2026-06-15T11:45:00.000Z"
  }
];
