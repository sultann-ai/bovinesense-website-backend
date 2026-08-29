import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models
import Founder from '../models/Founder.js';
import TeamMember from '../models/TeamMember.js';
import Service from '../models/Service.js';
import Partner from '../models/Partner.js';
import Project from '../models/Project.js';
import Product from '../models/Product.js';
import BlogPost from '../models/BlogPost.js';
import Recognition from '../models/Recognition.js';

dotenv.config();

// Connect to MongoDB function
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bovinesense');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Dummy data
const foundersData = [
  {
    name: 'Muhammad Mehdi Ali',
    role: 'CFO & Co-Founder',
    bio: 'Visionary leader with 10+ years of experience in AI and software development. Passionate about creating innovative solutions that transform businesses.',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: 'https://linkedin.com/in/mehdiali',
    twitter: 'https://twitter.com/mehdiali',
    email: 'mehdi@bovinesense.com'
  },
  {
    name: 'Sultan Mehmood',
    role: 'CTO & Co-Founder',
    bio: 'Technical expert specializing in machine learning and full-stack development. Leads our engineering team in building cutting-edge solutions.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: 'https://linkedin.com/in/sultanmehmood',
    twitter: 'https://twitter.com/sultanmehmood',
    email: 'sultan@bovinesense.com'
  },
  {
    name: 'Zohaib Afzaal',
    role: 'CPO & Co-Founder',
    bio: 'Product strategist with expertise in user experience and business development. Drives product vision and market expansion.',
    image: 'https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: 'https://linkedin.com/in/zohaibafzaal',
    twitter: 'https://twitter.com/zohaibafzaal',
    email: 'zohaib@bovinesense.com'
  }
];

const teamData = [
  {
    name: 'Sarah Johnson',
    role: 'Senior Frontend Developer',
    bio: 'React specialist with 5+ years of experience building responsive web applications.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    email: 'sarah@bovinesense.com'
  },
  {
    name: 'Ahmed Hassan',
    role: 'AI/ML Engineer',
    bio: 'Machine learning expert specializing in computer vision and natural language processing.',
    image: 'https://images.pexels.com/photos/2182968/pexels-photo-2182968.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: 'https://linkedin.com/in/ahmedhassan',
    email: 'ahmed@bovinesense.com'
  },
  {
    name: 'Emily Chen',
    role: 'UX/UI Designer',
    bio: 'Creative designer focused on user-centered design and intuitive interfaces.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: 'https://linkedin.com/in/emilychen',
    email: 'emily@bovinesense.com'
  }
];

const servicesData = [
  {
    category: 'Website Development',
    services: [
      {
        title: 'Business & Portfolio Websites',
        description: 'Professional websites that showcase your business and drive conversions.',
        icon: 'FaGlobe',
        features: [
          'Responsive design',
          'SEO optimization',
          'Contact forms',
          'Analytics integration',
          'Mobile-first approach'
        ]
      },
      {
        title: 'E-commerce & Marketplace Platforms',
        description: 'Scalable online stores with secure payment processing and inventory management.',
        icon: 'FaShoppingCart',
        features: [
          'Payment gateway integration',
          'Inventory management',
          'Order tracking',
          'Multi-vendor support',
          'Wishlist functionality'
        ]
      },
      {
        title: 'Full-Stack Development',
        description: 'Complete web applications using React, Next.js, Node.js, and modern frameworks.',
        icon: 'FaCode',
        features: [
          'Modern frameworks',
          'Database integration',
          'API development',
          'Authentication systems',
          'Real-time features'
        ]
      }
    ]
  },
  {
    category: 'Custom Software Development',
    services: [
      // {
      //   title: 'End-to-End Product Engineering',
      //   description: 'Complete product development from concept to deployment and maintenance.',
      //   icon: 'FaCogs',
      //   features: [
      //     'Product strategy',
      //     'Technical architecture',
      //     'Development lifecycle',
      //     'Testing & QA',
      //     'Maintenance & support'
      //   ]
      // },
      {
        title: 'Portal Development & Management',
        description: 'Admin panels, HR portals, CRM systems, and custom dashboards.',
        icon: 'FaTachometerAlt',
        features: [
          'Custom dashboards',
          'User management',
          'Role-based access',
          'Data visualization',
          'Reporting tools'
        ]
      },
      {
        title: 'Enterprise App Development',
        description: 'Scalable enterprise solutions tailored to your business needs.',
        icon: 'FaBuilding',
        features: [
          'Scalable architecture',
          'Enterprise security',
          'System integration',
          'Workflow automation',
          'Cloud deployment'
        ]
      },
      {
        title: 'SaaS Platform Development',
        description: 'Software-as-a-Service platforms with subscription management and analytics.',
        icon: 'FaCloud',
        features: [
          'Multi-tenancy',
          'Subscription billing',
          'Usage analytics',
          'API management',
          'Auto-scaling'
        ]
      }
    ]
  },
  {
    category: 'AI & Automation',
    services: [
      {
        title: 'AI Agents & Workflow Automation',
        description: 'Intelligent automation solutions with AI agents for streamlined business processes.',
        icon: 'FaCogs',
        features: [
          'Custom AI agents development',
          'Process automation',
          'Intelligent lead generation',
          'Multi-agent orchestration',
          'Workflow optimization',
          'Business process integration',
          'Automated decision making',
          'Smart resource allocation'
        ]
      },
      {
        title: 'Chatbot and Voicebot Development',
        description: 'Intelligent conversational AI solutions for customer service and business automation.',
        icon: 'FaComments',
        features: [
          'Custom chatbot development',
          'Voice assistant integration',
          'Multi-platform deployment',
          'Natural language understanding',
          'Conversation flow design'
        ]
      },
      {
        title: 'ML Model Development',
        description: 'Custom machine learning models for predictive analytics and automation.',
        icon: 'FaBrain',
        features: [
          'Custom algorithms',
          'Model training',
          'Performance optimization',
          'Data preprocessing',
          'Model deployment'
        ]
      },
      {
        title: 'AI-Powered Product Engineering',
        description: 'Integrating AI capabilities into your existing products and workflows.',
        icon: 'FaRobot',
        features: [
          'AI integration',
          'Workflow automation',
          'Intelligent recommendations',
          'Predictive features',
          'Smart analytics'
        ]
      },
      {
        title: 'Computer Vision',
        description: 'Image recognition, object detection, and video analysis solutions.',
        icon: 'FaEye',
        features: [
          'Image classification',
          'Object detection',
          'Face recognition',
          'Video analysis',
          'Real-time processing'
        ]
      }
    ]
  }
];

const partnersData = [
  {
    name: 'TechCorp',
    logo: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: 'https://techcorp.com'
  },
  {
    name: 'InnovateLabs',
    logo: 'https://images.pexels.com/photos/3184288/pexels-photo-3184288.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: 'https://innovatelabs.com'
  },
  {
    name: 'FutureTech',
    logo: 'https://images.pexels.com/photos/3184289/pexels-photo-3184289.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: 'https://futuretech.com'
  }
];

const recognitionsData = [
  {
    name: 'Innovation Certification Council',
    image: 'https://placehold.co/400x200/e8f1ff/17345a?text=Innovation+Council',
    website: 'https://example.com',
    section: 'trusted'
  },
  {
    name: 'Global Agritech Alliance',
    image: 'https://placehold.co/400x200/e8f1ff/17345a?text=Agritech+Alliance',
    website: 'https://example.com',
    section: 'trusted'
  },
  {
    name: 'Sustainable Technology Forum',
    image: 'https://placehold.co/400x200/e8f1ff/17345a?text=Technology+Forum',
    website: 'https://example.com',
    section: 'trusted'
  }
];


const projectsData = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with modern UI/UX and advanced features. This comprehensive platform was built to provide a seamless shopping experience for both customers and administrators. The platform includes advanced features like real-time inventory management, integrated payment processing, personalized recommendations, and comprehensive analytics dashboard. Built with scalability in mind, it can handle thousands of concurrent users and large product catalogs.",
    liveDemoLink: "https://demo-ecommerce.example.com",
    githubLink: "https://github.com/yourcompany/ecommerce-platform",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    features: [
      "User authentication and authorization",
      "Product catalog with advanced filtering",
      "Shopping cart and wishlist functionality",
      "Secure payment processing with Stripe",
      "Order tracking and management",
      "Admin dashboard with analytics",
      "Real-time inventory management",
      "Email notifications and marketing",
      "Mobile-responsive design",
      "SEO optimized"
    ],
    technologies: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "Stripe API",
      "JWT Authentication",
      "Tailwind CSS",
      "Socket.io",
      "Cloudinary",
      "SendGrid",
      "Docker"
    ],
    category: "Web Development",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    title: "AI-Powered Analytics Dashboard",
    description: "Machine learning dashboard for business intelligence and predictive analytics. An intelligent analytics platform that leverages machine learning algorithms to provide actionable business insights. The dashboard processes large datasets in real-time, identifies patterns and trends, and generates predictive models to forecast business metrics. Features include interactive data visualizations, automated report generation, and AI-driven recommendations.",
    liveDemoLink: "https://demo-analytics.example.com",
    githubLink: "https://github.com/yourcompany/ai-analytics-dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["Python", "TensorFlow", "React", "D3.js"],
    features: [
      "Real-time data processing and visualization",
      "Machine learning model training and deployment",
      "Predictive analytics and forecasting",
      "Interactive dashboards and charts",
      "Automated report generation",
      "Custom alert system",
      "Data export and sharing capabilities",
      "Role-based access control"
    ],
    technologies: [
      "Python",
      "TensorFlow",
      "Pandas",
      "NumPy",
      "React.js",
      "D3.js",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
      "Apache Kafka"
    ],
    category: "AI/ML",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  },
  {
    title: "Mobile Task Management App",
    description: "Cross-platform mobile app for team collaboration and task management. A comprehensive task management application designed for teams and individuals to organize, track, and collaborate on projects. The app features real-time synchronization, offline capabilities, advanced task filtering, team collaboration tools, and integrated time tracking. Built with React Native for cross-platform compatibility.",
    liveDemoLink: "https://apps.apple.com/app/task-manager",
    githubLink: "https://github.com/yourcompany/task-manager-mobile",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    tags: ["React Native", "Firebase", "Redux", "TypeScript"],
    features: [
      "Task creation and management",
      "Team collaboration and sharing",
      "Real-time synchronization",
      "Offline functionality",
      "Time tracking and reporting",
      "Push notifications",
      "File attachments and comments",
      "Advanced filtering and search",
      "Dark mode support",
      "Cross-platform compatibility"
    ],
    technologies: [
      "React Native",
      "TypeScript",
      "Redux Toolkit",
      "Firebase",
      "Firestore",
      "React Navigation",
      "Async Storage",
      "React Native Reanimated",
      "Expo",
      "Jest",
      "Detox"
    ],
    category: "Mobile Development",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05")
  }
];

const productsData = [
  {
    name: 'SmartAnalytics Pro',
    slug: 'smartanalytics-pro',
    shortDescription: 'Advanced analytics platform powered by AI for business intelligence.',
    fullDescription: 'SmartAnalytics Pro is a comprehensive business intelligence platform that leverages artificial intelligence to provide deep insights into your data. With real-time analytics, predictive modeling, and intuitive dashboards, it helps businesses make data-driven decisions.',
    bannerImage: 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Real-time data visualization',
      'AI-powered predictive analytics',
      'Custom dashboard builder',
      'Advanced reporting tools',
      'API integrations'
    ],
    screenshots: [
      'https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    githubLink: 'https://github.com/bovinesense/smartanalytics-pro',
    liveLink: 'https://smartanalytics-pro.com'
  },
  {
    name: 'CodeFlow IDE',
    slug: 'codeflow-ide',
    shortDescription: 'Next-generation IDE with AI-powered code completion and debugging.',
    fullDescription: 'CodeFlow IDE revolutionizes the development experience with AI-powered features that help developers write better code faster. Features include intelligent code completion, automated debugging, and seamless collaboration tools.',
    bannerImage: 'https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'AI-powered code completion',
      'Intelligent debugging assistant',
      'Real-time collaboration',
      'Multi-language support',
      'Plugin ecosystem'
    ],
    screenshots: [
      'https://images.pexels.com/photos/3184303/pexels-photo-3184303.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3184304/pexels-photo-3184304.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    githubLink: 'https://github.com/bovinesense/codeflow-ide',
    liveLink: 'https://codeflow-ide.com'
  }
];

const blogPostsData = [
  {
    title: 'The Future of AI in Software Development',
    slug: 'future-of-ai-in-software-development',
    coverImage: 'https://images.pexels.com/photos/3184305/pexels-photo-3184305.jpeg?auto=compress&cs=tinysrgb&w=800',
    excerpt: 'Explore how artificial intelligence is transforming the software development landscape and what it means for developers.',
    content: `
      <h2>Introduction</h2>
      <p>Artificial Intelligence is revolutionizing software development in ways we never imagined. From automated code generation to intelligent debugging, AI is becoming an integral part of the development process.</p>
      
      <h2>Key Areas of Impact</h2>
      <p>AI is making significant impacts in several areas:</p>
      <ul>
        <li>Code Generation and Completion</li>
        <li>Bug Detection and Fixing</li>
        <li>Testing Automation</li>
        <li>Code Review and Optimization</li>
      </ul>
      
      <h2>The Road Ahead</h2>
      <p>As AI continues to evolve, we can expect even more sophisticated tools that will further enhance developer productivity and code quality.</p>
    `,
    author: 'Muhammad Mehdi Ali'
  },
  {
    title: 'Building Scalable Web Applications with React and Node.js',
    slug: 'building-scalable-web-applications-react-nodejs',
    coverImage: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
    excerpt: 'A comprehensive guide to building scalable web applications using modern JavaScript technologies.',
    content: `
      <h2>Getting Started</h2>
      <p>Building scalable web applications requires careful planning and the right technology stack. React and Node.js provide an excellent foundation for creating robust, scalable applications.</p>
      
      <h2>Best Practices</h2>
      <p>Here are some key best practices to follow:</p>
      <ul>
        <li>Component-based architecture</li>
        <li>State management with Redux or Context API</li>
        <li>RESTful API design</li>
        <li>Database optimization</li>
        <li>Caching strategies</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>By following these principles and leveraging modern tools, you can build applications that scale with your business needs.</p>
    `,
    author: 'Sultan Mehmood'
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Ensure database connection is established first
    await connectToDatabase();

    // Clear existing data
    await Promise.all([
      Founder.deleteMany({}),
      TeamMember.deleteMany({}),
      Service.deleteMany({}),
      Partner.deleteMany({}),
      Project.deleteMany({}),
      Product.deleteMany({}),
      BlogPost.deleteMany({}),
      Recognition.deleteMany({})
    ]);

    // Insert new data
    await Promise.all([
      Founder.insertMany(foundersData),
      TeamMember.insertMany(teamData),
      Service.insertMany(servicesData),
      Partner.insertMany(partnersData),
      Project.insertMany(projectsData),
      Product.insertMany(productsData),
      BlogPost.insertMany(blogPostsData),
      Recognition.insertMany(recognitionsData)
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();