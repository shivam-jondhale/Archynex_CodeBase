import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaDownload,

  FaPlus,
  FaStar,
  FaFilter,
  FaCloud,
  FaShoppingCart,
  FaGamepad,
  FaCog,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaDatabase,
  FaMobile,
  FaBrain,
  FaBuilding,
  FaCodeBranch,
  FaVial,
  FaBoxOpen,
  FaFlask,
  FaRandom,
  FaTable,
  FaArchive,
  FaServer,
  FaGlobe,
  FaBolt,
  FaVideo,
  FaComments,
  FaCogs,
  FaKey,
  FaListAlt,
  FaCreditCard,
  FaUserClock,
  FaExchangeAlt,
  FaBell,
  FaBalanceScale,
  FaHandshake,
  FaShippingFast,
  FaHeart,
  FaBriefcase,
  FaHome,
  FaIndustry,
  FaCar,
  FaLeaf,
  FaChess,
  FaGhost,
  FaDice,
  FaWifi,
  FaMicrochip,
  FaChartPie,
  FaChartBar,
  FaLock,
  FaUserSecret,
  FaFingerprint,
  FaClipboardCheck,
  FaDocker,
  FaBug,
  FaTerminal,
  FaNetworkWired,
  FaCode,
  FaRobot,
  FaDna,
  FaEnvelope,
  FaThumbsUp,
  FaEye,
  FaCommentDots,
  FaUserPlus,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const TemplateManager = ({ isOpen, onClose }) => {
  const { createProject, setCurrentProject, importProject } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Predefined templates
  const templates = [
    {
      id: "microservices-ecommerce",
      name: "E-commerce Microservices (Advanced)",
      description:
        "Complete e-commerce platform with microservices, async messaging, caching, observability, and centralized API gateway.",
      category: "ecommerce",
      icon: FaShoppingCart,
      difficulty: "Advanced",
      components: 15,
      rating: 4.8,
      featured: true,
      preview: "/templates/ecommerce-preview.png",
      data: {
        nodes: [
          {
            id: "api-gateway-1",
            type: "custom",
            position: { x: 400, y: 100 },
            data: {
              id: "gateway",
              label: "API Gateway",
              icon: "FaKey",
              color: "#f97316",
              category: "network",
              description:
                "Central entry point with routing, authentication, rate limiting, and request logging",
            },
          },
          {
            id: "user-service-1",
            type: "custom",
            position: { x: 150, y: 240 },
            data: {
              id: "microservice",
              label: "User Service",
              icon: "FaUserCog",
              color: "#10b981",
              category: "compute",
              description:
                "Manages user accounts, profiles, addresses, and role-based access",
            },
          },
          {
            id: "auth-service-1",
            type: "custom",
            position: { x: 150, y: 180 },
            data: {
              id: "microservice",
              label: "Auth Service",
              icon: "FaShieldAlt",
              color: "#facc15",
              category: "security",
              description:
                "Handles JWT/OAuth2, token issuance, refresh tokens, and SSO integration",
            },
          },
          {
            id: "product-service-1",
            type: "custom",
            position: { x: 350, y: 240 },
            data: {
              id: "microservice",
              label: "Product Service",
              icon: "FaCogs",
              color: "#10b981",
              category: "compute",
              description:
                "Manages product catalog, variants, pricing, and category metadata",
            },
          },
          {
            id: "inventory-service-1",
            type: "custom",
            position: { x: 550, y: 240 },
            data: {
              id: "microservice",
              label: "Inventory Service",
              icon: "FaBoxes",
              color: "#10b981",
              category: "compute",
              description:
                "Tracks stock levels, reservations, and multi-warehouse availability",
            },
          },
          {
            id: "cart-service-1",
            type: "custom",
            position: { x: 300, y: 310 },
            data: {
              id: "microservice",
              label: "Cart Service",
              icon: "FaShoppingCart",
              color: "#10b981",
              category: "compute",
              description:
                "Maintains customer carts, applied discounts, and dynamic pricing",
            },
          },
          {
            id: "order-service-1",
            type: "custom",
            position: { x: 500, y: 310 },
            data: {
              id: "microservice",
              label: "Order Service",
              icon: "FaReceipt",
              color: "#10b981",
              category: "compute",
              description:
                "Coordinates order creation, status transitions, and orchestration with payments",
            },
          },
          {
            id: "payment-service-1",
            type: "custom",
            position: { x: 700, y: 260 },
            data: {
              id: "microservice",
              label: "Payment Service",
              icon: "FaCreditCard",
              color: "#ef4444",
              category: "compute",
              description:
                "Integrates with payment gateways, handles captures, refunds, and webhooks",
            },
          },
          {
            id: "notification-service-1",
            type: "custom",
            position: { x: 700, y: 340 },
            data: {
              id: "microservice",
              label: "Notification Service",
              icon: "FaBell",
              color: "#0ea5e9",
              category: "compute",
              description:
                "Sends email, SMS, and push notifications for orders, refunds, and alerts",
            },
          },
          {
            id: "search-service-1",
            type: "custom",
            position: { x: 250, y: 390 },
            data: {
              id: "microservice",
              label: "Search Service",
              icon: "FaSearch",
              color: "#22c55e",
              category: "compute",
              description:
                "Provides full-text search, filtering, and autocomplete over product catalog",
            },
          },
          {
            id: "analytics-service-1",
            type: "custom",
            position: { x: 650, y: 430 },
            data: {
              id: "microservice",
              label: "Analytics Service",
              icon: "FaChartLine",
              color: "#22c55e",
              category: "compute",
              description:
                "Consumes events for dashboards, funnel analysis, and business metrics",
            },
          },
          {
            id: "cache-1",
            type: "custom",
            position: { x: 150, y: 460 },
            data: {
              id: "cache",
              label: "Redis Cache",
              icon: "FaBolt",
              color: "#f97316",
              category: "storage",
              description:
                "Low-latency cache for sessions, carts, and frequently accessed product data",
            },
          },
          {
            id: "message-broker-1",
            type: "custom",
            position: { x: 450, y: 460 },
            data: {
              id: "queue",
              label: "Message Broker (Kafka)",
              icon: "FaStream",
              color: "#f97316",
              category: "queue",
              description:
                "Event streaming backbone for orders, payments, and inventory updates",
            },
          },
          {
            id: "database-1",
            type: "custom",
            position: { x: 400, y: 560 },
            data: {
              id: "database",
              label: "PostgreSQL",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description:
                "Primary relational database for users, orders, and transactional data",
            },
          },
          {
            id: "logging-service-1",
            type: "custom",
            position: { x: 650, y: 540 },
            data: {
              id: "infra",
              label: "Logging & Monitoring",
              icon: "FaFileAlt",
              color: "#6b7280",
              category: "observability",
              description:
                "Centralized logs, metrics, and alerts for all microservices and gateway",
            },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "api-gateway-1",
            target: "user-service-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "edge-2",
            source: "api-gateway-1",
            target: "product-service-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "edge-3",
            source: "api-gateway-1",
            target: "order-service-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "edge-4",
            source: "user-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-5",
            source: "product-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-6",
            source: "order-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-7",
            source: "api-gateway-1",
            target: "auth-service-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-8",
            source: "api-gateway-1",
            target: "cart-service-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-9",
            source: "api-gateway-1",
            target: "inventory-service-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-10",
            source: "api-gateway-1",
            target: "search-service-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-11",
            source: "order-service-1",
            target: "payment-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-12",
            source: "payment-service-1",
            target: "notification-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-13",
            source: "cart-service-1",
            target: "cache-1",
            animated: true,
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
          {
            id: "edge-14",
            source: "product-service-1",
            target: "cache-1",
            animated: true,
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
          {
            id: "edge-15",
            source: "order-service-1",
            target: "message-broker-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-16",
            source: "payment-service-1",
            target: "message-broker-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-17",
            source: "inventory-service-1",
            target: "message-broker-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-18",
            source: "message-broker-1",
            target: "analytics-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-19",
            source: "api-gateway-1",
            target: "logging-service-1",
            animated: true,
            style: { stroke: "#6b7280", strokeWidth: 2 },
          },
          {
            id: "edge-20",
            source: "order-service-1",
            target: "logging-service-1",
            animated: true,
            style: { stroke: "#6b7280", strokeWidth: 2 },
          },
          {
            id: "edge-21",
            source: "payment-service-1",
            target: "logging-service-1",
            animated: true,
            style: { stroke: "#6b7280", strokeWidth: 2 },
          },
        ],
      },
    },

    {
      id: "social-media-platform",
      name: "Social Media Platform (Advanced)",
      description: "Scalable social platform with feeds, real-time messaging, media storage, notifications, and analytics.",
      category: "social",
      icon: FaUsers,
      difficulty: "Advanced",
      components: 18,
      rating: 4.9,
      featured: true,
      data: {
        nodes: [
          {
            id: "load-balancer-1",
            type: "custom",
            position: { x: 400, y: 50 },
            data: {
              id: "loadBalancer",
              label: "Load Balancer",
              icon: "FaBalanceScale",
              color: "#06b6d4",
              category: "network",
              description: "Routes traffic to frontend + API services",
            },
          },

          {
            id: "web-app-1",
            type: "custom",
            position: { x: 200, y: 150 },
            data: {
              id: "webApp",
              label: "Web Frontend",
              icon: "FaDesktop",
              color: "#0ea5e9",
              category: "client",
              description: "React/Next.js web application",
            },
          },

          {
            id: "mobile-app-1",
            type: "custom",
            position: { x: 600, y: 150 },
            data: {
              id: "mobileApp",
              label: "Mobile App",
              icon: "FaMobile",
              color: "#ec4899",
              category: "client",
              description: "iOS/Android app built with React Native",
            },
          },

          {
            id: "api-gateway-1",
            type: "custom",
            position: { x: 400, y: 200 },
            data: {
              id: "apiGateway",
              label: "API Gateway",
              icon: "FaKey",
              color: "#f97316",
              category: "network",
              description: "Unified API access, auth, routing, and throttling",
            },
          },

          {
            id: "auth-service-1",
            type: "custom",
            position: { x: 150, y: 280 },
            data: {
              id: "authService",
              label: "Auth Service",
              icon: "FaShieldAlt",
              color: "#facc15",
              category: "compute",
              description: "Handles login, JWT, sessions, and OAuth",
            },
          },

          {
            id: "user-service-1",
            type: "custom",
            position: { x: 300, y: 280 },
            data: {
              id: "userService",
              label: "User Service",
              icon: "FaUser",
              color: "#10b981",
              category: "compute",
              description: "User profiles, followers, blocking, settings",
            },
          },

          {
            id: "post-service-1",
            type: "custom",
            position: { x: 500, y: 280 },
            data: {
              id: "postService",
              label: "Post Service",
              icon: "FaFeather",
              color: "#10b981",
              category: "compute",
              description: "Creates posts, captions, hashtags, comments",
            },
          },

          {
            id: "feed-service-1",
            type: "custom",
            position: { x: 650, y: 300 },
            data: {
              id: "feedService",
              label: "Feed Service",
              icon: "FaStream",
              color: "#22c55e",
              category: "compute",
              description: "Personalized algorithmic feed generation",
            },
          },

          {
            id: "realtime-service-1",
            type: "custom",
            position: { x: 250, y: 380 },
            data: {
              id: "realTimeService",
              label: "Real-time Chat",
              icon: "FaComments",
              color: "#0ea5e9",
              category: "compute",
              description: "WebSocket-based DM & group chat system",
            },
          },

          {
            id: "notification-service-1",
            type: "custom",
            position: { x: 450, y: 380 },
            data: {
              id: "notificationService",
              label: "Notification Service",
              icon: "FaBell",
              color: "#3b82f6",
              category: "compute",
              description: "Push notifications, email alerts, in-app notifications",
            },
          },

          {
            id: "media-service-1",
            type: "custom",
            position: { x: 650, y: 380 },
            data: {
              id: "mediaService",
              label: "Media Service",
              icon: "FaImage",
              color: "#8b5cf6",
              category: "storage",
              description: "Uploads, compresses, and stores images & videos",
            },
          },

          {
            id: "database-1",
            type: "custom",
            position: { x: 350, y: 500 },
            data: {
              id: "database",
              label: "PostgreSQL",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description: "Primary database storing users, posts, chats, metadata",
            },
          },

          {
            id: "cache-1",
            type: "custom",
            position: { x: 150, y: 500 },
            data: {
              id: "cache",
              label: "Redis Cache",
              icon: "FaBolt",
              color: "#f97316",
              category: "storage",
              description: "Caching feeds, auth tokens, trending content",
            },
          },

          {
            id: "event-stream-1",
            type: "custom",
            position: { x: 550, y: 500 },
            data: {
              id: "eventStream",
              label: "Kafka Broker",
              icon: "FaExchangeAlt",
              color: "#f97316",
              category: "queue",
              description: "Event streaming for posts, likes, notifications",
            },
          },

          {
            id: "analytics-service-1",
            type: "custom",
            position: { x: 750, y: 500 },
            data: {
              id: "analytics",
              label: "Analytics Service",
              icon: "FaChartLine",
              color: "#22c55e",
              category: "compute",
              description: "Insights, trends, user behavior analysis",
            },
          },

          {
            id: "logging-service-1",
            type: "custom",
            position: { x: 450, y: 600 },
            data: {
              id: "logService",
              label: "Logging & Monitoring",
              icon: "FaFileAlt",
              color: "#6b7280",
              category: "observability",
              description: "Centralized logs, alerts, and dashboards",
            },
          }
        ],

        edges: [
          {
            id: "edge-1",
            source: "load-balancer-1",
            target: "web-app-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "edge-2",
            source: "load-balancer-1",
            target: "mobile-app-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },

          {
            id: "edge-3",
            source: "web-app-1",
            target: "api-gateway-1",
            animated: true,
            style: { stroke: "#06b6d4", strokeWidth: 2 },
          },
          {
            id: "edge-4",
            source: "mobile-app-1",
            target: "api-gateway-1",
            animated: true,
            style: { stroke: "#06b6d4", strokeWidth: 2 },
          },

          {
            id: "edge-5",
            source: "api-gateway-1",
            target: "auth-service-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-6",
            source: "api-gateway-1",
            target: "user-service-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-7",
            source: "api-gateway-1",
            target: "post-service-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-8",
            source: "api-gateway-1",
            target: "feed-service-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },

          {
            id: "edge-9",
            source: "post-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-10",
            source: "user-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },

          {
            id: "edge-11",
            source: "post-service-1",
            target: "event-stream-1",
            animated: true,
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },
          {
            id: "edge-12",
            source: "user-service-1",
            target: "event-stream-1",
            animated: true,
            style: { stroke: "#f59e0b", strokeWidth: 2 },
          },

          {
            id: "edge-13",
            source: "event-stream-1",
            target: "feed-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-14",
            source: "event-stream-1",
            target: "analytics-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },

          {
            id: "edge-15",
            source: "real-time-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-16",
            source: "notification-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },

          {
            id: "edge-17",
            source: "api-gateway-1",
            target: "media-service-1",
            animated: true,
            style: { stroke: "#ec4899", strokeWidth: 2 },
          },

          {
            id: "edge-18",
            source: "api-gateway-1",
            target: "logging-service-1",
            animated: true,
            style: { stroke: "#6b7280", strokeWidth: 2 },
          }
        ],
      },
    },

    {
      id: "iot-platform",
      name: "IoT Data Platform (Expert)",
      description:
        "Multi-tenant, real-time IoT platform with edge processing, secure device onboarding, streaming analytics, and time-series storage.",
      category: "iot",
      icon: FaCog,
      difficulty: "Expert",
      components: 12,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          {
            id: "iot-gateway-1",
            type: "custom",
            position: { x: 100, y: 100 },
            data: {
              id: "gateway",
              label: "IoT Edge Gateway",
              icon: "FaKey",
              color: "#f97316",
              category: "network",
              description:
                "Edge node aggregating devices, doing protocol translation (MQTT/Modbus/OPC-UA), local buffering, and basic filtering.",
            },
          },
          {
            id: "device-registry-1",
            type: "custom",
            position: { x: 300, y: 100 },
            data: {
              id: "service",
              label: "Device Registry & Digital Twin",
              icon: "FaListAlt",
              color: "#0ea5e9",
              category: "compute",
              description:
                "Stores device identities, config, firmware version, and digital-twin state; supports multi-tenant isolation.",
            },
          },
          {
            id: "auth-service-1",
            type: "custom",
            position: { x: 500, y: 100 },
            data: {
              id: "security",
              label: "Auth & IAM",
              icon: "FaShieldAlt",
              color: "#facc15",
              category: "security",
              description:
                "Mutual TLS, device certificates, token-based API auth, fine-grained RBAC for tenants and operators.",
            },
          },
          {
            id: "mqtt-broker-1",
            type: "custom",
            position: { x: 200, y: 220 },
            data: {
              id: "broker",
              label: "MQTT Broker Cluster",
              icon: "FaExchangeAlt",
              color: "#06b6d4",
              category: "network",
              description:
                "Horizontally scalable MQTT/AMQP broker with QoS levels, backpressure, and retained messages for telemetry.",
            },
          },
          {
            id: "ingestion-service-1",
            type: "custom",
            position: { x: 400, y: 220 },
            data: {
              id: "service",
              label: "Ingestion & Schema Validation",
              icon: "FaSignInAlt",
              color: "#22c55e",
              category: "compute",
              description:
                "Validates payloads against versioned schemas, enriches with metadata, and routes bad data to a dead-letter queue.",
            },
          },
          {
            id: "stream-processor-1",
            type: "custom",
            position: { x: 600, y: 220 },
            data: {
              id: "stream",
              label: "Streaming Analytics Engine",
              icon: "FaStream",
              color: "#22c55e",
              category: "compute",
              description:
                "Flink/Spark jobs for windowed aggregations, anomaly detection, and real-time feature computation with watermarking.",
            },
          },
          {
            id: "timeseries-db-1",
            type: "custom",
            position: { x: 250, y: 360 },
            data: {
              id: "database",
              label: "Time-Series DB",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description:
                "Partitioned time-series store (e.g., Timescale/Influx) with retention, downsampling, and compression policies.",
            },
          },
          {
            id: "data-lake-1",
            type: "custom",
            position: { x: 450, y: 360 },
            data: {
              id: "storage",
              label: "Data Lakehouse",
              icon: "FaServer",
              color: "#6366f1",
              category: "storage",
              description:
                "Object storage with Iceberg/Delta tables for raw, curated, and ML-ready IoT datasets and replayable history.",
            },
          },
          {
            id: "rules-engine-1",
            type: "custom",
            position: { x: 650, y: 360 },
            data: {
              id: "service",
              label: "Low-Latency Rules Engine",
              icon: "FaProjectDiagram",
              color: "#f97316",
              category: "compute",
              description:
                "Declarative rules for threshold alerts, actuation commands, and routing to downstream systems.",
            },
          },
          {
            id: "analytics-service-1",
            type: "custom",
            position: { x: 350, y: 480 },
            data: {
              id: "analytics",
              label: "Analytics & ML API",
              icon: "FaChartLine",
              color: "#22c55e",
              category: "analytics",
              description:
                "REST/GraphQL endpoints for dashboards, KPI queries, forecasting, and online ML scoring from time-series data.",
            },
          },
          {
            id: "dashboard-1",
            type: "custom",
            position: { x: 550, y: 480 },
            data: {
              id: "dashboard",
              label: "Ops & Tenant Dashboard",
              icon: "FaDesktop",
              color: "#0ea5e9",
              category: "client",
              description:
                "Multi-tenant UI for device fleets, real-time metrics, drill-down, and configuration management.",
            },
          },
          {
            id: "alerting-service-1",
            type: "custom",
            position: { x: 150, y: 480 },
            data: {
              id: "alerting",
              label: "Alerting & On-Call",
              icon: "FaBell",
              color: "#ef4444",
              category: "observability",
              description:
                "Integrates with PagerDuty/Slack/Email for SLO-based and rule-based alerts on devices and pipelines.",
            },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "iot-gateway-1",
            target: "mqtt-broker-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-2",
            source: "iot-gateway-1",
            target: "device-registry-1",
            animated: true,
            style: { stroke: "#0ea5e9", strokeWidth: 2 },
          },
          {
            id: "edge-3",
            source: "iot-gateway-1",
            target: "auth-service-1",
            animated: true,
            style: { stroke: "#facc15", strokeWidth: 2 },
          },
          {
            id: "edge-4",
            source: "mqtt-broker-1",
            target: "ingestion-service-1",
            animated: true,
            style: { stroke: "#06b6d4", strokeWidth: 2 },
          },
          {
            id: "edge-5",
            source: "ingestion-service-1",
            target: "stream-processor-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-6",
            source: "stream-processor-1",
            target: "timeseries-db-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-7",
            source: "stream-processor-1",
            target: "data-lake-1",
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
          {
            id: "edge-8",
            source: "stream-processor-1",
            target: "rules-engine-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-9",
            source: "timeseries-db-1",
            target: "analytics-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-10",
            source: "data-lake-1",
            target: "analytics-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-11",
            source: "analytics-service-1",
            target: "dashboard-1",
            animated: true,
            style: { stroke: "#0ea5e9", strokeWidth: 2 },
          },
          {
            id: "edge-12",
            source: "rules-engine-1",
            target: "alerting-service-1",
            animated: true,
            style: { stroke: "#ef4444", strokeWidth: 2 },
          },
        ],
      },
    },

    {
      "id": "gaming-backend-advanced",
      "name": "Gaming Backend (Advanced)",
      "description": "Scalable multiplayer gaming backend with real-time matchmaking, chat, analytics, and microservices architecture",
      "category": "gaming",
      icon: FaGamepad,
      "difficulty": "Advanced",
      "components": 12,
      "rating": 4.9,
      "featured": true,
      "data": {
        "nodes": [
          {
            "id": "game-client",
            "type": "custom",
            "position": { "x": 100, "y": 200 },
            "data": {
              "id": "client",
              "label": "Game Client",
              "icon": "FaGamepad",
              "color": "#f59e0b",
              "category": "client",
              "description": "Player device running the game"
            }
          },
          {
            "id": "api-gateway",
            "type": "custom",
            "position": { "x": 300, "y": 200 },
            "data": {
              "id": "gateway",
              "label": "API Gateway",
              "icon": "FaKey",
              "color": "#f97316",
              "category": "network",
              "description": "Authentication, routing, rate limiting"
            }
          },
          {
            "id": "load-balancer",
            "type": "custom",
            "position": { "x": 500, "y": 200 },
            "data": {
              "id": "loadBalancer",
              "label": "Load Balancer",
              "icon": "FaBalanceScale",
              "color": "#06b6d4",
              "category": "network",
              "description": "Distributes traffic to game servers"
            }
          },
          {
            "id": "game-server",
            "type": "custom",
            "position": { "x": 700, "y": 150 },
            "data": {
              "id": "server",
              "label": "Game Server",
              "icon": "FaServer",
              "color": "#3b82f6",
              "category": "compute",
              "description": "Handles real-time game logic and state"
            }
          },
          {
            "id": "matchmaking-service",
            "type": "custom",
            "position": { "x": 700, "y": 300 },
            "data": {
              "id": "service",
              "label": "Matchmaking Service",
              "icon": "FaUsers",
              "color": "#10b981",
              "category": "service",
              "description": "Matches players into games"
            }
          },
          {
            "id": "chat-service",
            "type": "custom",
            "position": { "x": 900, "y": 100 },
            "data": {
              "id": "chatService",
              "label": "Chat Service",
              "icon": "FaComments",
              "color": "#ec4899",
              "category": "service",
              "description": "Real-time player chat"
            }
          },
          {
            "id": "leaderboard-service",
            "type": "custom",
            "position": { "x": 900, "y": 200 },
            "data": {
              "id": "leaderboardService",
              "label": "Leaderboard Service",
              "icon": "FaTrophy",
              "color": "#eab308",
              "category": "service",
              "description": "Tracks and displays player rankings"
            }
          },
          {
            "id": "analytics-service",
            "type": "custom",
            "position": { "x": 900, "y": 300 },
            "data": {
              "id": "analyticsService",
              "label": "Analytics Service",
              "icon": "FaChartLine",
              "color": "#059669",
              "category": "service",
              "description": "Game analytics and events processing"
            }
          },
          {
            "id": "database",
            "type": "custom",
            "position": { "x": 1100, "y": 200 },
            "data": {
              "id": "database",
              "label": "Game Database",
              "icon": "FaDatabase",
              "color": "#8b5cf6",
              "category": "storage",
              "description": "Stores player profiles, inventory, and game state"
            }
          },
          {
            "id": "cache",
            "type": "custom",
            "position": { "x": 1300, "y": 200 },
            "data": {
              "id": "cache",
              "label": "Cache",
              "icon": "FaBolt",
              "color": "#ef4444",
              "category": "storage",
              "description": "Low-latency data access for leaderboards and sessions"
            }
          },
          {
            "id": "message-queue",
            "type": "custom",
            "position": { "x": 1500, "y": 200 },
            "data": {
              "id": "queue",
              "label": "Message Queue",
              "icon": "FaCloud",
              "color": "#1e40af",
              "category": "cloud",
              "description": "Async communication between services (e.g., RabbitMQ)"
            }
          },
          {
            "id": "monitoring",
            "type": "custom",
            "position": { "x": 1700, "y": 200 },
            "data": {
              "id": "monitoring",
              "label": "Monitoring & Logging",
              "icon": "FaEye",
              "color": "#0f766e",
              "category": "ops",
              "description": "System health, metrics, and logs"
            }
          }
        ],
        "edges": [
          { "id": "edge-1", "source": "game-client", "target": "api-gateway", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } },
          { "id": "edge-2", "source": "api-gateway", "target": "load-balancer", "animated": true, "style": { "stroke": "#06b6d4", "strokeWidth": 2 } },
          { "id": "edge-3", "source": "load-balancer", "target": "game-server", "animated": true, "style": { "stroke": "#3b82f6", "strokeWidth": 2 } },
          { "id": "edge-4", "source": "game-server", "target": "matchmaking-service", "animated": true, "style": { "stroke": "#10b981", "strokeWidth": 2 } },
          { "id": "edge-5", "source": "game-server", "target": "chat-service", "animated": true, "style": { "stroke": "#ec4899", "strokeWidth": 2 } },
          { "id": "edge-6", "source": "game-server", "target": "leaderboard-service", "animated": true, "style": { "stroke": "#eab308", "strokeWidth": 2 } },
          { "id": "edge-7", "source": "game-server", "target": "analytics-service", "animated": true, "style": { "stroke": "#059669", "strokeWidth": 2 } },
          { "id": "edge-8", "source": "matchmaking-service", "target": "database", "animated": true, "style": { "stroke": "#8b5cf6", "strokeWidth": 2 } },
          { "id": "edge-9", "source": "leaderboard-service", "target": "cache", "animated": true, "style": { "stroke": "#ef4444", "strokeWidth": 2 } },
          { "id": "edge-10", "source": "analytics-service", "target": "message-queue", "animated": true, "style": { "stroke": "#1e40af", "strokeWidth": 2 } },
          { "id": "edge-11", "source": "message-queue", "target": "monitoring", "animated": true, "style": { "stroke": "#0f766e", "strokeWidth": 2 } }
        ]
      },
    },
    {
      id: "analytics-platform",
      name: "Analytics Platform (Expert)",
      description:
        "End-to-end big data analytics stack with streaming + batch pipelines, lakehouse, semantic layer, and self-service BI.",
      category: "analytics",
      icon: FaChartLine,
      difficulty: "Expert",
      components: 14,
      rating: 4.8,
      featured: true,
      data: {
        nodes: [
          {
            id: "data-pipeline-1",
            type: "custom",
            position: { x: 350, y: 200 },
            data: {
              id: "microservice",
              label: "Data Pipeline Orchestrator",
              icon: "FaCogs",
              color: "#10b981",
              category: "compute",
              description:
                "Airflow/dbt-style orchestration for batch ETL/ELT jobs, dependencies, and scheduling.",
            },
          },
          {
            id: "ingestion-service-1",
            type: "custom",
            position: { x: 150, y: 120 },
            data: {
              id: "microservice",
              label: "Ingestion Service",
              icon: "FaSignInAlt",
              color: "#0ea5e9",
              category: "compute",
              description:
                "Connectors for SaaS, databases, and files; handles CDC, bulk loads, and schema discovery.",
            },
          },
          {
            id: "message-broker-1",
            type: "custom",
            position: { x: 150, y: 260 },
            data: {
              id: "queue",
              label: "Event Stream (Kafka)",
              icon: "FaExchangeAlt",
              color: "#f97316",
              category: "queue",
              description:
                "Durable event bus for real-time ingestion of logs, events, and CDC streams.",
            },
          },
          {
            id: "stream-processor-1",
            type: "custom",
            position: { x: 150, y: 400 },
            data: {
              id: "microservice",
              label: "Streaming Processor",
              icon: "FaStream",
              color: "#22c55e",
              category: "compute",
              description:
                "Flink/Spark streaming jobs for windowed aggregates, enrichment, and anomaly detection.",
            },
          },
          {
            id: "batch-processor-1",
            type: "custom",
            position: { x: 350, y: 320 },
            data: {
              id: "microservice",
              label: "Batch Processing Engine",
              icon: "FaTasks",
              color: "#22c55e",
              category: "compute",
              description:
                "Spark/SQL-based batch transforms, dimensional models, and heavy joins over large datasets.",
            },
          },
          {
            id: "data-lake-1",
            type: "custom",
            position: { x: 550, y: 260 },
            data: {
              id: "storage",
              label: "Data Lake",
              icon: "FaServer",
              color: "#6366f1",
              category: "storage",
              description:
                "Object storage for raw, staged, and curated data (parquet/iceberg/delta).",
            },
          },
          {
            id: "data-warehouse-1",
            type: "custom",
            position: { x: 550, y: 380 },
            data: {
              id: "database",
              label: "Cloud Data Warehouse",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description:
                "Snowflake/BigQuery/Redshift for highly-performant analytical queries and reporting models.",
            },
          },
          {
            id: "semantic-layer-1",
            type: "custom",
            position: { x: 750, y: 320 },
            data: {
              id: "service",
              label: "Semantic Layer / Metrics",
              icon: "FaProjectDiagram",
              color: "#f97316",
              category: "compute",
              description:
                "Centralized business metrics, governed dimensions, and row/column-level security.",
            },
          },
          {
            id: "bi-tool-1",
            type: "custom",
            position: { x: 750, y: 180 },
            data: {
              id: "client",
              label: "BI Dashboards",
              icon: "FaChartPie",
              color: "#0ea5e9",
              category: "client",
              description:
                "Self-service dashboards and reports (Tableau/Power BI/Looker) for business users.",
            },
          },
          {
            id: "notebook-1",
            type: "custom",
            position: { x: 750, y: 460 },
            data: {
              id: "client",
              label: "Notebook Workspace",
              icon: "FaLaptopCode",
              color: "#ec4899",
              category: "client",
              description:
                "Jupyter-style environment for data scientists to explore, model, and experiment.",
            },
          },
          {
            id: "catalog-service-1",
            type: "custom",
            position: { x: 350, y: 460 },
            data: {
              id: "microservice",
              label: "Data Catalog & Lineage",
              icon: "FaBook",
              color: "#6b7280",
              category: "analytics",
              description:
                "Tracks datasets, schemas, lineage, and ownership; supports search and impact analysis.",
            },
          },
          {
            id: "quality-service-1",
            type: "custom",
            position: { x: 150, y: 520 },
            data: {
              id: "microservice",
              label: "Data Quality & Tests",
              icon: "FaCheckCircle",
              color: "#22c55e",
              category: "analytics",
              description:
                "Monitors freshness, completeness, and constraints; fails pipelines on critical issues.",
            },
          },
          {
            id: "monitoring-service-1",
            type: "custom",
            position: { x: 550, y: 520 },
            data: {
              id: "infra",
              label: "Pipeline Monitoring",
              icon: "FaHeartbeat",
              color: "#ef4444",
              category: "observability",
              description:
                "Metrics, logs, and alerts for pipeline latency, failures, and warehouse performance.",
            },
          },
          {
            id: "scheduler-1",
            type: "custom",
            position: { x: 350, y: 80 },
            data: {
              id: "microservice",
              label: "Job Scheduler",
              icon: "FaClock",
              color: "#facc15",
              category: "compute",
              description:
                "Cron/event-driven triggers for orchestration, SLAs, and dependency-aware runs.",
            },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "ingestion-service-1",
            target: "message-broker-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-2",
            source: "ingestion-service-1",
            target: "data-lake-1",
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
          {
            id: "edge-3",
            source: "message-broker-1",
            target: "stream-processor-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-4",
            source: "stream-processor-1",
            target: "data-lake-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-5",
            source: "stream-processor-1",
            target: "data-warehouse-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-6",
            source: "scheduler-1",
            target: "data-pipeline-1",
            animated: true,
            style: { stroke: "#facc15", strokeWidth: 2 },
          },
          {
            id: "edge-7",
            source: "data-pipeline-1",
            target: "batch-processor-1",
            animated: true,
            style: { stroke: "#10b981", strokeWidth: 2 },
          },
          {
            id: "edge-8",
            source: "batch-processor-1",
            target: "data-lake-1",
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
          {
            id: "edge-9",
            source: "batch-processor-1",
            target: "data-warehouse-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-10",
            source: "data-lake-1",
            target: "catalog-service-1",
            animated: true,
            style: { stroke: "#6b7280", strokeWidth: 2 },
          },
          {
            id: "edge-11",
            source: "data-warehouse-1",
            target: "catalog-service-1",
            animated: true,
            style: { stroke: "#6b7280", strokeWidth: 2 },
          },
          {
            id: "edge-12",
            source: "data-warehouse-1",
            target: "semantic-layer-1",
            animated: true,
            style: { stroke: "#f97316", strokeWidth: 2 },
          },
          {
            id: "edge-13",
            source: "semantic-layer-1",
            target: "bi-tool-1",
            animated: true,
            style: { stroke: "#0ea5e9", strokeWidth: 2 },
          },
          {
            id: "edge-14",
            source: "data-warehouse-1",
            target: "notebook-1",
            animated: true,
            style: { stroke: "#ec4899", strokeWidth: 2 },
          },
          {
            id: "edge-15",
            source: "data-lake-1",
            target: "notebook-1",
            animated: true,
            style: { stroke: "#ec4899", strokeWidth: 2 },
          },
          {
            id: "edge-16",
            source: "data-lake-1",
            target: "quality-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-17",
            source: "data-warehouse-1",
            target: "quality-service-1",
            animated: true,
            style: { stroke: "#22c55e", strokeWidth: 2 },
          },
          {
            id: "edge-18",
            source: "data-pipeline-1",
            target: "monitoring-service-1",
            animated: true,
            style: { stroke: "#ef4444", strokeWidth: 2 },
          },
        ],
      },
    },

  ];

  // Additional templates to make the library vast
  const newTemplates = [
    {
      id: "realtime-chat",
      name: "Real-time Chat App",
      description: "Scalable chat application with WebSocket gateway, presence, and message history.",
      category: "social",
      icon: FaComments,
      difficulty: "Intermediate",
      components: 9,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          {
            id: "client-app",
            type: "custom",
            position: { x: 100, y: 250 },
            data: {
              id: "client",
              label: "Chat Client",
              icon: "FaMobile",
              color: "#0ea5e9",
              category: "client",
              description: "Web/Mobile chat interface"
            }
          },
          {
            id: "lb",
            type: "custom",
            position: { x: 300, y: 250 },
            data: {
              id: "network",
              label: "Load Balancer",
              icon: "FaBalanceScale",
              color: "#06b6d4",
              category: "network",
              description: "Distributes WebSocket connections"
            }
          },
          {
            id: "ws-gateway",
            type: "custom",
            position: { x: 500, y: 250 },
            data: {
              id: "service",
              label: "WebSocket Gateway",
              icon: "FaExchangeAlt",
              color: "#22c55e",
              category: "service",
              description: "Holds persistent connections"
            }
          },
          {
            id: "auth-service",
            type: "custom",
            position: { x: 500, y: 100 },
            data: {
              id: "service",
              label: "Auth Service",
              icon: "FaShieldAlt",
              color: "#facc15",
              category: "security",
              description: "Authenticates users"
            }
          },
          {
            id: "presence-service",
            type: "custom",
            position: { x: 700, y: 150 },
            data: {
              id: "service",
              label: "Presence Service",
              icon: "FaUserClock",
              color: "#10b981",
              category: "service",
              description: "Tracks online/offline status"
            }
          },
          {
            id: "chat-service",
            type: "custom",
            position: { x: 700, y: 350 },
            data: {
              id: "service",
              label: "Chat Service",
              icon: "FaComments",
              color: "#3b82f6",
              category: "service",
              description: "Manages rooms and history"
            }
          },
          {
            id: "redis",
            type: "custom",
            position: { x: 700, y: 250 },
            data: {
              id: "cache",
              label: "Redis Pub/Sub",
              icon: "FaBolt",
              color: "#f97316",
              category: "queue",
              description: "Message routing between gateway nodes"
            }
          },
          {
            id: "cassandra",
            type: "custom",
            position: { x: 900, y: 350 },
            data: {
              id: "database",
              label: "Cassandra",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description: "Stores chat history (write-heavy)"
            }
          },
          {
            id: "push-service",
            type: "custom",
            position: { x: 900, y: 150 },
            data: {
              id: "service",
              label: "Push Notification",
              icon: "FaBell",
              color: "#ef4444",
              category: "service",
              description: "Sends offline notifications"
            }
          }
        ],
        edges: [
          { id: "e1", source: "client-app", target: "lb", animated: true, label: "WS Connect" },
          { id: "e2", source: "lb", target: "ws-gateway", animated: true },
          { id: "e3", source: "ws-gateway", target: "auth-service", animated: true, label: "Auth Token" },
          { id: "e4", source: "ws-gateway", target: "redis", animated: true, label: "Pub/Sub" },
          { id: "e5", source: "ws-gateway", target: "presence-service", animated: true, label: "Heartbeat" },
          { id: "e6", source: "ws-gateway", target: "chat-service", animated: true, label: "Persist Msg" },
          { id: "e7", source: "chat-service", target: "cassandra", animated: true },
          { id: "e8", source: "chat-service", target: "push-service", animated: true, label: "If Offline" }
        ]
      }
    },
    {
      id: "serverless-video-processing",
      name: "Serverless Video Processing",
      description: "Event-driven architecture for uploading, processing, and distributing videos using serverless functions.",
      category: "cloud",
      icon: FaCloud,
      difficulty: "Intermediate",
      components: 8,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          {
            id: "client-upload",
            type: "custom",
            position: { x: 100, y: 200 },
            data: {
              id: "client",
              label: "Client App",
              icon: "FaMobile",
              color: "#0ea5e9",
              category: "client",
              description: "Uploads video to S3 via signed URL"
            }
          },
          {
            id: "api-gateway",
            type: "custom",
            position: { x: 300, y: 100 },
            data: {
              id: "gateway",
              label: "API Gateway",
              icon: "FaKey",
              color: "#f97316",
              category: "network",
              description: "Generates presigned URLs for upload"
            }
          },
          {
            id: "s3-raw",
            type: "custom",
            position: { x: 300, y: 300 },
            data: {
              id: "storage",
              label: "S3 (Raw Video)",
              icon: "FaDatabase",
              color: "#6366f1",
              category: "storage",
              description: "Stores raw video files uploaded by users"
            }
          },
          {
            id: "lambda-trigger",
            type: "custom",
            position: { x: 500, y: 300 },
            data: {
              id: "compute",
              label: "Lambda Trigger",
              icon: "FaBolt",
              color: "#facc15",
              category: "compute",
              description: "Triggered by S3 upload event"
            }
          },
          {
            id: "media-convert",
            type: "custom",
            position: { x: 700, y: 300 },
            data: {
              id: "service",
              label: "MediaConvert",
              icon: "FaVideo",
              color: "#ef4444",
              category: "service",
              description: "Transcodes video into multiple formats"
            }
          },
          {
            id: "s3-processed",
            type: "custom",
            position: { x: 900, y: 300 },
            data: {
              id: "storage",
              label: "S3 (Processed)",
              icon: "FaDatabase",
              color: "#6366f1",
              category: "storage",
              description: "Stores transcoded video files"
            }
          },
          {
            id: "dynamodb",
            type: "custom",
            position: { x: 700, y: 450 },
            data: {
              id: "database",
              label: "DynamoDB",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description: "Stores video metadata and processing status"
            }
          },
          {
            id: "cdn",
            type: "custom",
            position: { x: 1100, y: 300 },
            data: {
              id: "network",
              label: "CloudFront CDN",
              icon: "FaGlobe",
              color: "#10b981",
              category: "network",
              description: "Distributes content globally"
            }
          }
        ],
        edges: [
          { id: "e1", source: "client-upload", target: "api-gateway", animated: true },
          { id: "e2", source: "api-gateway", target: "client-upload", animated: true, label: "Signed URL" },
          { id: "e3", source: "client-upload", target: "s3-raw", animated: true, label: "Upload" },
          { id: "e4", source: "s3-raw", target: "lambda-trigger", animated: true, label: "S3 Event" },
          { id: "e5", source: "lambda-trigger", target: "media-convert", animated: true, label: "Start Job" },
          { id: "e6", source: "lambda-trigger", target: "dynamodb", animated: true, label: "Update Status" },
          { id: "e7", source: "media-convert", target: "s3-processed", animated: true, label: "Save Output" },
          { id: "e8", source: "s3-processed", target: "cdn", animated: true },
          { id: "e9", source: "media-convert", target: "dynamodb", animated: true, label: "Job Complete" }
        ]
      }
    },
    {
      id: "devops-pipeline",
      name: "DevOps CI/CD Pipeline",
      description: "Automated build, test, and deployment pipeline with monitoring and rollback capabilities.",
      category: "devops",
      icon: FaCogs,
      difficulty: "Intermediate",
      components: 10,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          {
            id: "git-repo",
            type: "custom",
            position: { x: 100, y: 250 },
            data: {
              id: "tool",
              label: "Git Repository",
              icon: "FaCodeBranch",
              color: "#f97316",
              category: "tool",
              description: "Source code version control"
            }
          },
          {
            id: "ci-server",
            type: "custom",
            position: { x: 300, y: 250 },
            data: {
              id: "tool",
              label: "CI Server",
              icon: "FaServer",
              color: "#3b82f6",
              category: "tool",
              description: "Jenkins/GitHub Actions runner"
            }
          },
          {
            id: "test-runner",
            type: "custom",
            position: { x: 300, y: 100 },
            data: {
              id: "tool",
              label: "Test Runner",
              icon: "FaVial",
              color: "#10b981",
              category: "tool",
              description: "Unit and integration tests"
            }
          },
          {
            id: "artifact-repo",
            type: "custom",
            position: { x: 500, y: 250 },
            data: {
              id: "storage",
              label: "Artifact Registry",
              icon: "FaBoxOpen",
              color: "#6366f1",
              category: "storage",
              description: "Docker Hub / ECR"
            }
          },
          {
            id: "staging-env",
            type: "custom",
            position: { x: 700, y: 150 },
            data: {
              id: "env",
              label: "Staging Environment",
              icon: "FaServer",
              color: "#facc15",
              category: "env",
              description: "Pre-production testing environment"
            }
          },
          {
            id: "prod-env",
            type: "custom",
            position: { x: 900, y: 250 },
            data: {
              id: "env",
              label: "Production Environment",
              icon: "FaGlobe",
              color: "#22c55e",
              category: "env",
              description: "Live user-facing environment"
            }
          },
          {
            id: "monitoring",
            type: "custom",
            position: { x: 900, y: 400 },
            data: {
              id: "tool",
              label: "Monitoring (Prometheus)",
              icon: "FaChartLine",
              color: "#ef4444",
              category: "observability",
              description: "Metrics and alerting"
            }
          },
          {
            id: "logging",
            type: "custom",
            position: { x: 700, y: 400 },
            data: {
              id: "tool",
              label: "Logging (ELK)",
              icon: "FaListAlt",
              color: "#f59e0b",
              category: "observability",
              description: "Centralized log management"
            }
          }
        ],
        edges: [
          { id: "e1", source: "git-repo", target: "ci-server", animated: true, label: "Push" },
          { id: "e2", source: "ci-server", target: "test-runner", animated: true, label: "Run Tests" },
          { id: "e3", source: "ci-server", target: "artifact-repo", animated: true, label: "Build & Push Image" },
          { id: "e4", source: "artifact-repo", target: "staging-env", animated: true, label: "Deploy" },
          { id: "e5", source: "staging-env", target: "prod-env", animated: true, label: "Promote" },
          { id: "e6", source: "prod-env", target: "monitoring", animated: true, label: "Metrics" },
          { id: "e7", source: "prod-env", target: "logging", animated: true, label: "Logs" }
        ]
      }
    },
    {
      id: "mlops-pipeline",
      name: "Machine Learning MLOps",
      description: "End-to-end ML lifecycle management from training to serving.",
      category: "ml",
      icon: FaBrain,
      difficulty: "Expert",
      components: 12,
      rating: 4.8,
      featured: true,
      data: {
        nodes: [
          {
            id: "data-source",
            type: "custom",
            position: { x: 100, y: 200 },
            data: {
              id: "storage",
              label: "Data Lake",
              icon: "FaDatabase",
              color: "#6366f1",
              category: "storage",
              description: "Raw training data"
            }
          },
          {
            id: "feature-store",
            type: "custom",
            position: { x: 300, y: 200 },
            data: {
              id: "storage",
              label: "Feature Store",
              icon: "FaTable",
              color: "#10b981",
              category: "storage",
              description: "Versioned features for training/serving"
            }
          },
          {
            id: "training-cluster",
            type: "custom",
            position: { x: 500, y: 200 },
            data: {
              id: "compute",
              label: "Training Cluster",
              icon: "FaCogs",
              color: "#f97316",
              category: "compute",
              description: "GPU cluster for model training"
            }
          },
          {
            id: "model-registry",
            type: "custom",
            position: { x: 700, y: 200 },
            data: {
              id: "storage",
              label: "Model Registry",
              icon: "FaArchive",
              color: "#3b82f6",
              category: "storage",
              description: "Versioned model artifacts"
            }
          },
          {
            id: "inference-service",
            type: "custom",
            position: { x: 900, y: 200 },
            data: {
              id: "service",
              label: "Inference Service",
              icon: "FaServer",
              color: "#22c55e",
              category: "service",
              description: "Model serving API"
            }
          },
          {
            id: "monitoring",
            type: "custom",
            position: { x: 900, y: 350 },
            data: {
              id: "tool",
              label: "Drift Monitoring",
              icon: "FaChartLine",
              color: "#ef4444",
              category: "observability",
              description: "Detects data/model drift"
            }
          },
          {
            id: "experiment-tracking",
            type: "custom",
            position: { x: 500, y: 350 },
            data: {
              id: "tool",
              label: "Experiment Tracking",
              icon: "FaFlask",
              color: "#ec4899",
              category: "tool",
              description: "MLflow/Weights & Biases"
            }
          }
        ],
        edges: [
          { id: "e1", source: "data-source", target: "feature-store", animated: true, label: "ETL" },
          { id: "e2", source: "feature-store", target: "training-cluster", animated: true, label: "Get Features" },
          { id: "e3", source: "training-cluster", target: "model-registry", animated: true, label: "Register Model" },
          { id: "e4", source: "model-registry", target: "inference-service", animated: true, label: "Deploy" },
          { id: "e5", source: "inference-service", target: "monitoring", animated: true, label: "Metrics" },
          { id: "e6", source: "training-cluster", target: "experiment-tracking", animated: true, label: "Log Metrics" },
          { id: "e7", source: "monitoring", target: "training-cluster", animated: true, label: "Retrain Trigger", style: { strokeDasharray: "5,5" } }
        ]
      }
    },
    {
      id: "saas-multitenant",
      name: "SaaS Multi-tenant Architecture",
      description: "Scalable B2B SaaS application with tenant isolation and shared services.",
      category: "saas",
      icon: FaBuilding,
      difficulty: "Advanced",
      components: 14,
      rating: 4.9,
      featured: true,
      data: {
        nodes: [
          {
            id: "tenant-router",
            type: "custom",
            position: { x: 300, y: 100 },
            data: {
              id: "gateway",
              label: "Tenant Router",
              icon: "FaRandom",
              color: "#f97316",
              category: "network",
              description: "Routes requests based on subdomain/header"
            }
          },
          {
            id: "auth-service",
            type: "custom",
            position: { x: 100, y: 200 },
            data: {
              id: "service",
              label: "Auth Service",
              icon: "FaShieldAlt",
              color: "#facc15",
              category: "security",
              description: "Multi-tenant authentication & RBAC"
            }
          },
          {
            id: "app-service",
            type: "custom",
            position: { x: 300, y: 250 },
            data: {
              id: "service",
              label: "App Service",
              icon: "FaServer",
              color: "#3b82f6",
              category: "compute",
              description: "Core application logic"
            }
          },
          {
            id: "tenant-db-1",
            type: "custom",
            position: { x: 200, y: 400 },
            data: {
              id: "database",
              label: "Tenant A DB",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description: "Isolated database for Tenant A"
            }
          },
          {
            id: "tenant-db-2",
            type: "custom",
            position: { x: 400, y: 400 },
            data: {
              id: "database",
              label: "Tenant B DB",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description: "Isolated database for Tenant B"
            }
          },
          {
            id: "billing-service",
            type: "custom",
            position: { x: 500, y: 200 },
            data: {
              id: "service",
              label: "Billing Service",
              icon: "FaCreditCard",
              color: "#10b981",
              category: "service",
              description: "Subscription management"
            }
          },
          {
            id: "analytics-service",
            type: "custom",
            position: { x: 700, y: 200 },
            data: {
              id: "service",
              label: "Analytics Service",
              icon: "FaChartLine",
              color: "#0ea5e9",
              category: "service",
              description: "Cross-tenant analytics"
            }
          }
        ],
        edges: [
          { id: "e1", source: "tenant-router", target: "auth-service", animated: true },
          { id: "e2", source: "tenant-router", target: "app-service", animated: true },
          { id: "e3", source: "app-service", target: "tenant-db-1", animated: true, label: "Tenant Context" },
          { id: "e4", source: "app-service", target: "tenant-db-2", animated: true, label: "Tenant Context" },
          { id: "e5", source: "app-service", target: "billing-service", animated: true },
          { id: "e6", source: "app-service", target: "analytics-service", animated: true }
        ]
      }
    },
    {
      id: "zero-trust-security",
      name: "Zero Trust Security Architecture",
      description: "Identity-centric security model with micro-segmentation and continuous validation.",
      category: "security",
      icon: FaShieldAlt,
      difficulty: "Advanced",
      components: 10,
      rating: 4.8,
      featured: true,
      data: {
        nodes: [
          {
            id: "user-device",
            type: "custom",
            position: { x: 100, y: 250 },
            data: {
              id: "client",
              label: "User Device",
              icon: "FaMobile",
              color: "#0ea5e9",
              category: "client",
              description: "Endpoint requesting access"
            }
          },
          {
            id: "idp",
            type: "custom",
            position: { x: 300, y: 100 },
            data: {
              id: "service",
              label: "Identity Provider (IdP)",
              icon: "FaUserClock",
              color: "#facc15",
              category: "security",
              description: "MFA & SSO (Okta/Auth0)"
            }
          },
          {
            id: "pep",
            type: "custom",
            position: { x: 300, y: 250 },
            data: {
              id: "gateway",
              label: "Policy Enforcement Point",
              icon: "FaKey",
              color: "#f97316",
              category: "security",
              description: "Identity-Aware Proxy"
            }
          },
          {
            id: "policy-engine",
            type: "custom",
            position: { x: 500, y: 100 },
            data: {
              id: "service",
              label: "Policy Engine",
              icon: "FaBalanceScale",
              color: "#ef4444",
              category: "security",
              description: "Decides access based on context"
            }
          },
          {
            id: "micro-seg-gateway",
            type: "custom",
            position: { x: 500, y: 250 },
            data: {
              id: "network",
              label: "Micro-segmentation Gateway",
              icon: "FaNetworkWired",
              color: "#6366f1",
              category: "network",
              description: "Controls east-west traffic"
            }
          },
          {
            id: "app-service-a",
            type: "custom",
            position: { x: 700, y: 200 },
            data: {
              id: "service",
              label: "Protected Service A",
              icon: "FaServer",
              color: "#10b981",
              category: "compute",
              description: "Internal workload"
            }
          },
          {
            id: "app-service-b",
            type: "custom",
            position: { x: 700, y: 350 },
            data: {
              id: "service",
              label: "Protected Service B",
              icon: "FaServer",
              color: "#10b981",
              category: "compute",
              description: "Internal workload"
            }
          },
          {
            id: "siem",
            type: "custom",
            position: { x: 500, y: 400 },
            data: {
              id: "tool",
              label: "SIEM / Analytics",
              icon: "FaChartLine",
              color: "#6b7280",
              category: "observability",
              description: "Threat detection & logs"
            }
          }
        ],
        edges: [
          { id: "e1", source: "user-device", target: "pep", animated: true, label: "Request" },
          { id: "e2", source: "pep", target: "idp", animated: true, label: "AuthN" },
          { id: "e3", source: "pep", target: "policy-engine", animated: true, label: "AuthZ Check" },
          { id: "e4", source: "pep", target: "micro-seg-gateway", animated: true, label: "Allowed" },
          { id: "e5", source: "micro-seg-gateway", target: "app-service-a", animated: true },
          { id: "e6", source: "micro-seg-gateway", target: "app-service-b", animated: true },
          { id: "e7", source: "pep", target: "siem", animated: true, label: "Log Access" }
        ]
      }
    },

    // Batch 1: E-commerce
    {
      id: "b2b-marketplace",
      name: "B2B Marketplace",
      description: "Multi-vendor platform with RFQ system, bulk pricing, and vendor portals.",
      category: "ecommerce",
      icon: FaHandshake,
      difficulty: "Advanced",
      components: 12,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          { id: "vendor-portal", type: "custom", position: { x: 100, y: 100 }, data: { label: "Vendor Portal", icon: "FaDesktop", color: "#0ea5e9" } },
          { id: "buyer-portal", type: "custom", position: { x: 100, y: 300 }, data: { label: "Buyer Portal", icon: "FaDesktop", color: "#0ea5e9" } },
          { id: "api-gateway", type: "custom", position: { x: 300, y: 200 }, data: { label: "API Gateway", icon: "FaKey", color: "#f97316" } },
          { id: "rfq-service", type: "custom", position: { x: 500, y: 100 }, data: { label: "RFQ Service", icon: "FaFileAlt", color: "#10b981" } },
          { id: "catalog-service", type: "custom", position: { x: 500, y: 200 }, data: { label: "Catalog Service", icon: "FaList", color: "#10b981" } },
          { id: "order-service", type: "custom", position: { x: 500, y: 300 }, data: { label: "Order Service", icon: "FaShoppingCart", color: "#10b981" } },
          { id: "db-primary", type: "custom", position: { x: 700, y: 200 }, data: { label: "Primary DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "vendor-portal", target: "api-gateway", animated: true },
          { id: "e2", source: "buyer-portal", target: "api-gateway", animated: true },
          { id: "e3", source: "api-gateway", target: "rfq-service", animated: true },
          { id: "e4", source: "api-gateway", target: "catalog-service", animated: true },
          { id: "e5", source: "api-gateway", target: "order-service", animated: true },
          { id: "e6", source: "rfq-service", target: "db-primary", animated: true },
          { id: "e7", source: "catalog-service", target: "db-primary", animated: true },
          { id: "e8", source: "order-service", target: "db-primary", animated: true }
        ]
      }
    },
    {
      id: "headless-commerce",
      name: "Headless Commerce",
      description: "Decoupled frontend and backend for flexibility and omnichannel experiences.",
      category: "ecommerce",
      icon: FaCodeBranch,
      difficulty: "Intermediate",
      components: 8,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          { id: "nextjs-fe", type: "custom", position: { x: 100, y: 200 }, data: { label: "Next.js Frontend", icon: "FaReact", color: "#0ea5e9" } },
          { id: "mobile-app", type: "custom", position: { x: 100, y: 350 }, data: { label: "Mobile App", icon: "FaMobile", color: "#0ea5e9" } },
          { id: "headless-cms", type: "custom", position: { x: 400, y: 150 }, data: { label: "Headless CMS", icon: "FaEdit", color: "#facc15" } },
          { id: "commerce-engine", type: "custom", position: { x: 400, y: 300 }, data: { label: "Commerce Engine", icon: "FaShoppingCart", color: "#10b981" } },
          { id: "cdn", type: "custom", position: { x: 250, y: 50 }, data: { label: "CDN", icon: "FaGlobe", color: "#f97316" } }
        ],
        edges: [
          { id: "e1", source: "nextjs-fe", target: "headless-cms", animated: true },
          { id: "e2", source: "nextjs-fe", target: "commerce-engine", animated: true },
          { id: "e3", source: "mobile-app", target: "headless-cms", animated: true },
          { id: "e4", source: "mobile-app", target: "commerce-engine", animated: true },
          { id: "e5", source: "headless-cms", target: "cdn", animated: true }
        ]
      }
    },
    {
      id: "subscription-box",
      name: "Subscription Box Service",
      description: "Recurring billing, box customization, and logistics management.",
      category: "ecommerce",
      icon: FaBoxOpen,
      difficulty: "Intermediate",
      components: 9,
      rating: 4.5,
      featured: false,
      data: {
        nodes: [
          { id: "web-store", type: "custom", position: { x: 100, y: 200 }, data: { label: "Web Store", icon: "FaDesktop", color: "#0ea5e9" } },
          { id: "subscription-svc", type: "custom", position: { x: 300, y: 200 }, data: { label: "Subscription Svc", icon: "FaRedo", color: "#10b981" } },
          { id: "billing-svc", type: "custom", position: { x: 500, y: 100 }, data: { label: "Billing Service", icon: "FaCreditCard", color: "#facc15" } },
          { id: "logistics-svc", type: "custom", position: { x: 500, y: 300 }, data: { label: "Logistics Service", icon: "FaTruck", color: "#f97316" } },
          { id: "db", type: "custom", position: { x: 700, y: 200 }, data: { label: "Database", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "web-store", target: "subscription-svc", animated: true },
          { id: "e2", source: "subscription-svc", target: "billing-svc", animated: true },
          { id: "e3", source: "subscription-svc", target: "logistics-svc", animated: true },
          { id: "e4", source: "subscription-svc", target: "db", animated: true }
        ]
      }
    },
    {
      id: "quick-commerce",
      name: "Quick Commerce (10-min)",
      description: "Hyper-local delivery system with dark stores and real-time rider dispatch.",
      category: "ecommerce",
      icon: FaShippingFast,
      difficulty: "Advanced",
      components: 14,
      rating: 4.8,
      featured: true,
      data: {
        nodes: [
          { id: "user-app", type: "custom", position: { x: 100, y: 100 }, data: { label: "User App", icon: "FaMobile", color: "#0ea5e9" } },
          { id: "rider-app", type: "custom", position: { x: 100, y: 300 }, data: { label: "Rider App", icon: "FaMotorcycle", color: "#0ea5e9" } },
          { id: "dispatch-engine", type: "custom", position: { x: 300, y: 300 }, data: { label: "Dispatch Engine", icon: "FaMapMarkedAlt", color: "#f97316" } },
          { id: "inventory-svc", type: "custom", position: { x: 300, y: 100 }, data: { label: "Inventory (Dark Store)", icon: "FaWarehouse", color: "#10b981" } },
          { id: "redis-geo", type: "custom", position: { x: 500, y: 200 }, data: { label: "Redis Geo", icon: "FaMapMarkerAlt", color: "#ef4444" } }
        ],
        edges: [
          { id: "e1", source: "user-app", target: "inventory-svc", animated: true },
          { id: "e2", source: "rider-app", target: "dispatch-engine", animated: true },
          { id: "e3", source: "dispatch-engine", target: "redis-geo", animated: true },
          { id: "e4", source: "inventory-svc", target: "dispatch-engine", animated: true, label: "Order Ready" }
        ]
      }
    },
    // Batch 1: Social
    {
      id: "dating-app",
      name: "Dating Application",
      description: "Geo-location based matching, swiping logic, and real-time chat.",
      category: "social",
      icon: FaHeart,
      difficulty: "Intermediate",
      components: 10,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          { id: "mobile-client", type: "custom", position: { x: 100, y: 200 }, data: { label: "Mobile Client", icon: "FaMobile", color: "#0ea5e9" } },
          { id: "matching-engine", type: "custom", position: { x: 300, y: 100 }, data: { label: "Matching Engine", icon: "FaHeart", color: "#ef4444" } },
          { id: "geo-svc", type: "custom", position: { x: 300, y: 300 }, data: { label: "Geo Service", icon: "FaMapMarkerAlt", color: "#10b981" } },
          { id: "chat-svc", type: "custom", position: { x: 500, y: 200 }, data: { label: "Chat Service", icon: "FaComments", color: "#f97316" } },
          { id: "db", type: "custom", position: { x: 700, y: 200 }, data: { label: "User DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "mobile-client", target: "matching-engine", animated: true },
          { id: "e2", source: "mobile-client", target: "geo-svc", animated: true },
          { id: "e3", source: "mobile-client", target: "chat-svc", animated: true },
          { id: "e4", source: "matching-engine", target: "db", animated: true },
          { id: "e5", source: "geo-svc", target: "db", animated: true }
        ]
      }
    },
    {
      id: "professional-network",
      name: "Professional Network",
      description: "Job board, connections graph, and professional endorsements.",
      category: "social",
      icon: FaBriefcase,
      difficulty: "Advanced",
      components: 12,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          { id: "web-app", type: "custom", position: { x: 100, y: 200 }, data: { label: "Web App", icon: "FaDesktop", color: "#0ea5e9" } },
          { id: "graph-svc", type: "custom", position: { x: 300, y: 100 }, data: { label: "Graph Service", icon: "FaProjectDiagram", color: "#10b981" } },
          { id: "feed-svc", type: "custom", position: { x: 300, y: 300 }, data: { label: "Feed Service", icon: "FaStream", color: "#f97316" } },
          { id: "job-svc", type: "custom", position: { x: 500, y: 200 }, data: { label: "Job Board", icon: "FaBriefcase", color: "#facc15" } },
          { id: "neo4j", type: "custom", position: { x: 500, y: 50 }, data: { label: "Neo4j (Graph DB)", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "web-app", target: "graph-svc", animated: true },
          { id: "e2", source: "web-app", target: "feed-svc", animated: true },
          { id: "e3", source: "web-app", target: "job-svc", animated: true },
          { id: "e4", source: "graph-svc", target: "neo4j", animated: true }
        ]
      }
    },
    {
      id: "creator-platform",
      name: "Content Creator Platform",
      description: "Video hosting, tipping, and subscription management for creators.",
      category: "social",
      icon: FaVideo,
      difficulty: "Intermediate",
      components: 9,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          { id: "creator-dash", type: "custom", position: { x: 100, y: 100 }, data: { label: "Creator Dashboard", icon: "FaDesktop", color: "#0ea5e9" } },
          { id: "fan-app", type: "custom", position: { x: 100, y: 300 }, data: { label: "Fan App", icon: "FaMobile", color: "#0ea5e9" } },
          { id: "video-svc", type: "custom", position: { x: 300, y: 100 }, data: { label: "Video Service", icon: "FaVideo", color: "#ef4444" } },
          { id: "payment-svc", type: "custom", position: { x: 300, y: 300 }, data: { label: "Payment/Tipping", icon: "FaCreditCard", color: "#10b981" } },
          { id: "cdn", type: "custom", position: { x: 500, y: 100 }, data: { label: "CDN", icon: "FaGlobe", color: "#f97316" } }
        ],
        edges: [
          { id: "e1", source: "creator-dash", target: "video-svc", animated: true },
          { id: "e2", source: "fan-app", target: "video-svc", animated: true },
          { id: "e3", source: "fan-app", target: "payment-svc", animated: true },
          { id: "e4", source: "video-svc", target: "cdn", animated: true }
        ]
      }
    },
    {
      id: "k8s-cluster",
      name: "Kubernetes Cluster",
      description: "Production-grade Kubernetes cluster with control plane, workers, and ingress.",
      category: "cloud",
      icon: FaCloud,
      difficulty: "Advanced",
      components: 12,
      rating: 4.9,
      featured: true,
      data: {
        nodes: [
          {
            id: "ingress-controller",
            type: "custom",
            position: { x: 100, y: 250 },
            data: {
              id: "gateway",
              label: "Ingress Controller",
              icon: "FaRandom",
              color: "#f97316",
              category: "network",
              description: "Nginx/Traefik ingress"
            }
          },
          {
            id: "control-plane",
            type: "custom",
            position: { x: 300, y: 100 },
            data: {
              id: "service",
              label: "Control Plane",
              icon: "FaCogs",
              color: "#3b82f6",
              category: "compute",
              description: "API Server, Scheduler, Controller Manager"
            }
          },
          {
            id: "etcd",
            type: "custom",
            position: { x: 500, y: 100 },
            data: {
              id: "database",
              label: "etcd",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description: "Cluster state store"
            }
          },
          {
            id: "worker-node-1",
            type: "custom",
            position: { x: 300, y: 300 },
            data: {
              id: "compute",
              label: "Worker Node 1",
              icon: "FaServer",
              color: "#10b981",
              category: "compute",
              description: "App pods & Kubelet"
            }
          },
          {
            id: "worker-node-2",
            type: "custom",
            position: { x: 500, y: 300 },
            data: {
              id: "compute",
              label: "Worker Node 2",
              icon: "FaServer",
              color: "#10b981",
              category: "compute",
              description: "App pods & Kubelet"
            }
          },
          {
            id: "persistent-vol",
            type: "custom",
            position: { x: 400, y: 450 },
            data: {
              id: "storage",
              label: "Persistent Volume",
              icon: "FaHdd",
              color: "#6366f1",
              category: "storage",
              description: "Block/File storage"
            }
          },
          {
            id: "registry",
            type: "custom",
            position: { x: 700, y: 200 },
            data: {
              id: "storage",
              label: "Container Registry",
              icon: "FaBoxOpen",
              color: "#0ea5e9",
              category: "storage",
              description: "Docker images"
            }
          },
          {
            id: "monitoring",
            type: "custom",
            position: { x: 700, y: 350 },
            data: {
              id: "tool",
              label: "Prometheus/Grafana",
              icon: "FaChartLine",
              color: "#ef4444",
              category: "observability",
              description: "Cluster monitoring"
            }
          }
        ],
        edges: [
          { id: "e1", source: "ingress-controller", target: "worker-node-1", animated: true },
          { id: "e2", source: "ingress-controller", target: "worker-node-2", animated: true },
          { id: "e3", source: "control-plane", target: "worker-node-1", animated: true, style: { strokeDasharray: "5,5" } },
          { id: "e4", source: "control-plane", target: "worker-node-2", animated: true, style: { strokeDasharray: "5,5" } },
          { id: "e5", source: "control-plane", target: "etcd", animated: true },
          { id: "e6", source: "worker-node-1", target: "persistent-vol", animated: true },
          { id: "e7", source: "worker-node-2", target: "persistent-vol", animated: true },
          { id: "e8", source: "worker-node-1", target: "registry", animated: true, label: "Pull Image" },
          { id: "e9", source: "worker-node-2", target: "registry", animated: true, label: "Pull Image" },
          { id: "e10", source: "monitoring", target: "control-plane", animated: true, label: "Scrape" }
        ]
      }
    },
    // Batch 2: IoT
    {
      id: "smart-home-hub",
      name: "Smart Home Hub",
      description: "Local control hub with Zigbee/Z-Wave bridge and cloud synchronization.",
      category: "iot",
      icon: FaHome,
      difficulty: "Intermediate",
      components: 8,
      rating: 4.5,
      featured: false,
      data: {
        nodes: [
          { id: "iot-hub", type: "custom", position: { x: 300, y: 200 }, data: { label: "IoT Hub (Local)", icon: "FaMicrochip", color: "#10b981" } },
          { id: "sensors", type: "custom", position: { x: 100, y: 100 }, data: { label: "Sensors (Zigbee)", icon: "FaWifi", color: "#0ea5e9" } },
          { id: "mobile-app", type: "custom", position: { x: 100, y: 300 }, data: { label: "Mobile App", icon: "FaMobile", color: "#0ea5e9" } },
          { id: "cloud-sync", type: "custom", position: { x: 500, y: 200 }, data: { label: "Cloud Sync Svc", icon: "FaCloud", color: "#f97316" } },
          { id: "user-db", type: "custom", position: { x: 700, y: 200 }, data: { label: "User DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "sensors", target: "iot-hub", animated: true, label: "Zigbee" },
          { id: "e2", source: "mobile-app", target: "iot-hub", animated: true, label: "Local WiFi" },
          { id: "e3", source: "iot-hub", target: "cloud-sync", animated: true, label: "MQTT" },
          { id: "e4", source: "cloud-sync", target: "user-db", animated: true }
        ]
      }
    },
    {
      id: "industrial-iot",
      name: "Industrial IoT (IIoT)",
      description: "SCADA integration, predictive maintenance, and digital twin architecture.",
      category: "iot",
      icon: FaIndustry,
      difficulty: "Advanced",
      components: 12,
      rating: 4.8,
      featured: true,
      data: {
        nodes: [
          { id: "plc", type: "custom", position: { x: 100, y: 200 }, data: { label: "PLC / SCADA", icon: "FaIndustry", color: "#6b7280" } },
          { id: "edge-gateway", type: "custom", position: { x: 300, y: 200 }, data: { label: "Edge Gateway", icon: "FaServer", color: "#f97316" } },
          { id: "iot-core", type: "custom", position: { x: 500, y: 100 }, data: { label: "IoT Core", icon: "FaCloud", color: "#0ea5e9" } },
          { id: "digital-twin", type: "custom", position: { x: 500, y: 300 }, data: { label: "Digital Twin", icon: "FaClone", color: "#10b981" } },
          { id: "analytics", type: "custom", position: { x: 700, y: 200 }, data: { label: "Predictive Analytics", icon: "FaChartLine", color: "#ef4444" } }
        ],
        edges: [
          { id: "e1", source: "plc", target: "edge-gateway", animated: true, label: "Modbus/OPC UA" },
          { id: "e2", source: "edge-gateway", target: "iot-core", animated: true, label: "MQTT over TLS" },
          { id: "e3", source: "iot-core", target: "digital-twin", animated: true },
          { id: "e4", source: "iot-core", target: "analytics", animated: true }
        ]
      }
    },
    {
      id: "connected-fleet",
      name: "Connected Vehicle Fleet",
      description: "Real-time telemetry, route optimization, and driver monitoring.",
      category: "iot",
      icon: FaCar,
      difficulty: "Intermediate",
      components: 10,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          { id: "vehicle", type: "custom", position: { x: 100, y: 200 }, data: { label: "Vehicle Telemetry", icon: "FaCar", color: "#0ea5e9" } },
          { id: "ingestion", type: "custom", position: { x: 300, y: 200 }, data: { label: "Data Ingestion", icon: "FaStream", color: "#f97316" } },
          { id: "stream-proc", type: "custom", position: { x: 500, y: 100 }, data: { label: "Stream Processing", icon: "FaCogs", color: "#facc15" } },
          { id: "fleet-dash", type: "custom", position: { x: 500, y: 300 }, data: { label: "Fleet Dashboard", icon: "FaDesktop", color: "#10b981" } },
          { id: "ts-db", type: "custom", position: { x: 700, y: 100 }, data: { label: "Time-Series DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "vehicle", target: "ingestion", animated: true, label: "4G/5G" },
          { id: "e2", source: "ingestion", target: "stream-proc", animated: true },
          { id: "e3", source: "stream-proc", target: "ts-db", animated: true },
          { id: "e4", source: "stream-proc", target: "fleet-dash", animated: true }
        ]
      }
    },
    {
      id: "smart-agri",
      name: "Smart Agriculture",
      description: "Soil sensors, automated irrigation, and weather data integration.",
      category: "iot",
      icon: FaLeaf,
      difficulty: "Intermediate",
      components: 7,
      rating: 4.4,
      featured: false,
      data: {
        nodes: [
          { id: "soil-sensor", type: "custom", position: { x: 100, y: 100 }, data: { label: "Soil Sensor", icon: "FaLeaf", color: "#10b981" } },
          { id: "weather-stn", type: "custom", position: { x: 100, y: 300 }, data: { label: "Weather Station", icon: "FaCloudSun", color: "#facc15" } },
          { id: "lora-gateway", type: "custom", position: { x: 300, y: 200 }, data: { label: "LoRaWAN Gateway", icon: "FaBroadcastTower", color: "#f97316" } },
          { id: "cloud-platform", type: "custom", position: { x: 500, y: 200 }, data: { label: "Agri Platform", icon: "FaCloud", color: "#0ea5e9" } },
          { id: "irrigation", type: "custom", position: { x: 700, y: 200 }, data: { label: "Irrigation System", icon: "FaWater", color: "#0ea5e9" } }
        ],
        edges: [
          { id: "e1", source: "soil-sensor", target: "lora-gateway", animated: true, label: "LoRa" },
          { id: "e2", source: "weather-stn", target: "lora-gateway", animated: true, label: "LoRa" },
          { id: "e3", source: "lora-gateway", target: "cloud-platform", animated: true },
          { id: "e4", source: "cloud-platform", target: "irrigation", animated: true, label: "Control Command" }
        ]
      }
    },
    // Batch 2: Gaming
    {
      id: "mmorpg-backend",
      name: "MMORPG Backend",
      description: "Sharded worlds, guild system, trading post, and persistent state.",
      category: "gaming",
      icon: FaGlobe,
      difficulty: "Expert",
      components: 15,
      rating: 4.9,
      featured: true,
      data: {
        nodes: [
          { id: "client", type: "custom", position: { x: 100, y: 250 }, data: { label: "Game Client", icon: "FaGamepad", color: "#0ea5e9" } },
          { id: "login-server", type: "custom", position: { x: 300, y: 100 }, data: { label: "Login Server", icon: "FaKey", color: "#facc15" } },
          { id: "world-server", type: "custom", position: { x: 300, y: 400 }, data: { label: "World Server (Shard)", icon: "FaGlobe", color: "#10b981" } },
          { id: "chat-server", type: "custom", position: { x: 500, y: 250 }, data: { label: "Chat Server", icon: "FaComments", color: "#f97316" } },
          { id: "db-shard", type: "custom", position: { x: 500, y: 400 }, data: { label: "Shard DB", icon: "FaDatabase", color: "#8b5cf6" } },
          { id: "global-db", type: "custom", position: { x: 500, y: 100 }, data: { label: "Account DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "client", target: "login-server", animated: true },
          { id: "e2", source: "login-server", target: "client", animated: true, label: "Token" },
          { id: "e3", source: "client", target: "world-server", animated: true, label: "Connect w/ Token" },
          { id: "e4", source: "client", target: "chat-server", animated: true },
          { id: "e5", source: "world-server", target: "db-shard", animated: true },
          { id: "e6", source: "login-server", target: "global-db", animated: true }
        ]
      }
    },
    {
      id: "turn-based-strategy",
      name: "Turn-based Strategy",
      description: "Game state synchronization, lobby system, and matchmaking.",
      category: "gaming",
      icon: FaChess,
      difficulty: "Intermediate",
      components: 8,
      rating: 4.5,
      featured: false,
      data: {
        nodes: [
          { id: "client", type: "custom", position: { x: 100, y: 200 }, data: { label: "Game Client", icon: "FaChess", color: "#0ea5e9" } },
          { id: "lobby", type: "custom", position: { x: 300, y: 100 }, data: { label: "Lobby Service", icon: "FaUsers", color: "#facc15" } },
          { id: "matchmaker", type: "custom", position: { x: 300, y: 300 }, data: { label: "Matchmaker", icon: "FaRandom", color: "#f97316" } },
          { id: "game-server", type: "custom", position: { x: 500, y: 200 }, data: { label: "Game Server (State)", icon: "FaServer", color: "#10b981" } },
          { id: "redis", type: "custom", position: { x: 700, y: 200 }, data: { label: "Redis (State Cache)", icon: "FaDatabase", color: "#ef4444" } }
        ],
        edges: [
          { id: "e1", source: "client", target: "lobby", animated: true },
          { id: "e2", source: "client", target: "matchmaker", animated: true },
          { id: "e3", source: "matchmaker", target: "game-server", animated: true, label: "Assign Room" },
          { id: "e4", source: "client", target: "game-server", animated: true, label: "Join Room" },
          { id: "e5", source: "game-server", target: "redis", animated: true }
        ]
      }
    },
    {
      id: "battle-royale",
      name: "Battle Royale",
      description: "Large scale UDP networking, spatial partitioning, and shrinking zone logic.",
      category: "gaming",
      icon: FaGhost,
      difficulty: "Advanced",
      components: 12,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          { id: "client", type: "custom", position: { x: 100, y: 200 }, data: { label: "Client (UDP)", icon: "FaGamepad", color: "#0ea5e9" } },
          { id: "dedicated-server", type: "custom", position: { x: 300, y: 200 }, data: { label: "Dedicated Server", icon: "FaServer", color: "#10b981" } },
          { id: "agones", type: "custom", position: { x: 300, y: 50 }, data: { label: "Agones (K8s)", icon: "FaCogs", color: "#0ea5e9" } },
          { id: "spatial-db", type: "custom", position: { x: 500, y: 200 }, data: { label: "Spatial DB", icon: "FaMap", color: "#f97316" } },
          { id: "matchmaker", type: "custom", position: { x: 100, y: 50 }, data: { label: "Matchmaker", icon: "FaRandom", color: "#facc15" } }
        ],
        edges: [
          { id: "e1", source: "client", target: "matchmaker", animated: true },
          { id: "e2", source: "matchmaker", target: "agones", animated: true, label: "Request Server" },
          { id: "e3", source: "agones", target: "dedicated-server", animated: true, label: "Spin up" },
          { id: "e4", source: "client", target: "dedicated-server", animated: true, label: "Connect UDP" },
          { id: "e5", source: "dedicated-server", target: "spatial-db", animated: true }
        ]
      }
    },
    {
      id: "cloud-gaming",
      name: "Cloud Gaming Streaming",
      description: "WebRTC video stream, edge rendering, and low-latency input handling.",
      category: "gaming",
      icon: FaDice,
      difficulty: "Expert",
      components: 10,
      rating: 4.8,
      featured: false,
      data: {
        nodes: [
          { id: "thin-client", type: "custom", position: { x: 100, y: 200 }, data: { label: "Thin Client", icon: "FaDesktop", color: "#0ea5e9" } },
          { id: "edge-node", type: "custom", position: { x: 300, y: 200 }, data: { label: "Edge Node (GPU)", icon: "FaMicrochip", color: "#10b981" } },
          { id: "control-plane", type: "custom", position: { x: 500, y: 100 }, data: { label: "Control Plane", icon: "FaCogs", color: "#f97316" } },
          { id: "game-storage", type: "custom", position: { x: 500, y: 300 }, data: { label: "Game Storage (SAN)", icon: "FaHdd", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "thin-client", target: "control-plane", animated: true, label: "Auth/Session" },
          { id: "e2", source: "control-plane", target: "edge-node", animated: true, label: "Allocate" },
          { id: "e3", source: "edge-node", target: "thin-client", animated: true, label: "WebRTC Stream" },
          { id: "e4", source: "thin-client", target: "edge-node", animated: true, label: "Input" },
          { id: "e5", source: "edge-node", target: "game-storage", animated: true, label: "Load Assets" }
        ]
      }
    },
    // Batch 3: Analytics
    {
      id: "realtime-analytics-dash",
      name: "Real-time Analytics Dashboard",
      description: "Live data visualization with WebSocket updates and in-memory aggregation.",
      category: "analytics",
      icon: FaChartPie,
      difficulty: "Intermediate",
      components: 8,
      rating: 4.6,
      featured: true,
      data: {
        nodes: [
          { id: "data-source", type: "custom", position: { x: 100, y: 200 }, data: { label: "Data Source", icon: "FaDatabase", color: "#6366f1" } },
          { id: "kafka", type: "custom", position: { x: 300, y: 200 }, data: { label: "Kafka", icon: "FaStream", color: "#f97316" } },
          { id: "spark-streaming", type: "custom", position: { x: 500, y: 100 }, data: { label: "Spark Streaming", icon: "FaBolt", color: "#facc15" } },
          { id: "redis-agg", type: "custom", position: { x: 700, y: 100 }, data: { label: "Redis (Aggregates)", icon: "FaDatabase", color: "#ef4444" } },
          { id: "socket-server", type: "custom", position: { x: 700, y: 300 }, data: { label: "Socket Server", icon: "FaExchangeAlt", color: "#10b981" } },
          { id: "dashboard-ui", type: "custom", position: { x: 900, y: 200 }, data: { label: "Dashboard UI", icon: "FaChartPie", color: "#0ea5e9" } }
        ],
        edges: [
          { id: "e1", source: "data-source", target: "kafka", animated: true, label: "CDC / Events" },
          { id: "e2", source: "kafka", target: "spark-streaming", animated: true },
          { id: "e3", source: "spark-streaming", target: "redis-agg", animated: true, label: "Update Counts" },
          { id: "e4", source: "redis-agg", target: "socket-server", animated: true, label: "Pub/Sub" },
          { id: "e5", source: "socket-server", target: "dashboard-ui", animated: true, label: "WS Push" }
        ]
      }
    },
    {
      id: "marketing-analytics",
      name: "Marketing Analytics Platform",
      description: "Customer journey tracking, attribution modeling, and campaign performance.",
      category: "analytics",
      icon: FaChartBar,
      difficulty: "Advanced",
      components: 10,
      rating: 4.5,
      featured: false,
      data: {
        nodes: [
          { id: "ad-platforms", type: "custom", position: { x: 100, y: 100 }, data: { label: "Ad Platforms", icon: "FaBullhorn", color: "#f97316" } },
          { id: "web-tracking", type: "custom", position: { x: 100, y: 300 }, data: { label: "Web Tracking", icon: "FaGlobe", color: "#0ea5e9" } },
          { id: "etl-pipeline", type: "custom", position: { x: 300, y: 200 }, data: { label: "ETL Pipeline", icon: "FaCogs", color: "#10b981" } },
          { id: "data-warehouse", type: "custom", position: { x: 500, y: 200 }, data: { label: "Data Warehouse", icon: "FaDatabase", color: "#8b5cf6" } },
          { id: "bi-tool", type: "custom", position: { x: 700, y: 200 }, data: { label: "BI Tool", icon: "FaChartBar", color: "#facc15" } }
        ],
        edges: [
          { id: "e1", source: "ad-platforms", target: "etl-pipeline", animated: true, label: "API Pull" },
          { id: "e2", source: "web-tracking", target: "etl-pipeline", animated: true, label: "Events" },
          { id: "e3", source: "etl-pipeline", target: "data-warehouse", animated: true, label: "Load" },
          { id: "e4", source: "data-warehouse", target: "bi-tool", animated: true, label: "Query" }
        ]
      }
    },
    {
      id: "log-analytics",
      name: "Centralized Log Analytics",
      description: "Aggregating logs from multiple services for search, analysis, and alerting.",
      category: "analytics",
      icon: FaListAlt,
      difficulty: "Intermediate",
      components: 7,
      rating: 4.4,
      featured: false,
      data: {
        nodes: [
          { id: "app-servers", type: "custom", position: { x: 100, y: 200 }, data: { label: "App Servers", icon: "FaServer", color: "#0ea5e9" } },
          { id: "log-shipper", type: "custom", position: { x: 300, y: 200 }, data: { label: "Log Shipper (Fluentd)", icon: "FaTruck", color: "#f97316" } },
          { id: "elasticsearch", type: "custom", position: { x: 500, y: 200 }, data: { label: "Elasticsearch", icon: "FaSearch", color: "#10b981" } },
          { id: "kibana", type: "custom", position: { x: 700, y: 200 }, data: { label: "Kibana", icon: "FaDesktop", color: "#ec4899" } },
          { id: "s3-archive", type: "custom", position: { x: 500, y: 400 }, data: { label: "S3 Archive", icon: "FaArchive", color: "#6366f1" } }
        ],
        edges: [
          { id: "e1", source: "app-servers", target: "log-shipper", animated: true, label: "Logs" },
          { id: "e2", source: "log-shipper", target: "elasticsearch", animated: true, label: "Index" },
          { id: "e3", source: "log-shipper", target: "s3-archive", animated: true, label: "Backup" },
          { id: "e4", source: "elasticsearch", target: "kibana", animated: true, label: "Visualize" }
        ]
      }
    },
    // Batch 3: Security
    {
      id: "iam-system",
      name: "Identity & Access Management (IAM)",
      description: "Centralized user management, SSO, and role-based access control.",
      category: "security",
      icon: FaKey,
      difficulty: "Advanced",
      components: 9,
      rating: 4.8,
      featured: false,
      data: {
        nodes: [
          { id: "user", type: "custom", position: { x: 100, y: 200 }, data: { label: "User", icon: "FaUser", color: "#0ea5e9" } },
          { id: "api-gateway", type: "custom", position: { x: 300, y: 200 }, data: { label: "API Gateway", icon: "FaKey", color: "#f97316" } },
          { id: "auth-server", type: "custom", position: { x: 500, y: 100 }, data: { label: "Auth Server (OAuth2)", icon: "FaShieldAlt", color: "#facc15" } },
          { id: "directory-service", type: "custom", position: { x: 700, y: 100 }, data: { label: "Directory (LDAP)", icon: "FaAddressBook", color: "#8b5cf6" } },
          { id: "app-service", type: "custom", position: { x: 500, y: 300 }, data: { label: "App Service", icon: "FaServer", color: "#10b981" } }
        ],
        edges: [
          { id: "e1", source: "user", target: "api-gateway", animated: true, label: "Request" },
          { id: "e2", source: "api-gateway", target: "auth-server", animated: true, label: "Validate Token" },
          { id: "e3", source: "auth-server", target: "directory-service", animated: true, label: "Lookup User" },
          { id: "e4", source: "api-gateway", target: "app-service", animated: true, label: "Proxy" }
        ]
      }
    },
    {
      id: "soc-architecture",
      name: "SOC / SIEM Architecture",
      description: "Security Operations Center setup with log ingestion, threat detection, and incident response.",
      category: "security",
      icon: FaShieldAlt,
      difficulty: "Expert",
      components: 12,
      rating: 4.9,
      featured: false,
      data: {
        nodes: [
          { id: "firewall", type: "custom", position: { x: 100, y: 100 }, data: { label: "Firewall Logs", icon: "FaShieldAlt", color: "#ef4444" } },
          { id: "endpoint", type: "custom", position: { x: 100, y: 300 }, data: { label: "Endpoint (EDR)", icon: "FaDesktop", color: "#0ea5e9" } },
          { id: "log-collector", type: "custom", position: { x: 300, y: 200 }, data: { label: "Log Collector", icon: "FaStream", color: "#f97316" } },
          { id: "siem-core", type: "custom", position: { x: 500, y: 200 }, data: { label: "SIEM Core", icon: "FaBrain", color: "#8b5cf6" } },
          { id: "soar", type: "custom", position: { x: 700, y: 200 }, data: { label: "SOAR (Response)", icon: "FaRobot", color: "#10b981" } }
        ],
        edges: [
          { id: "e1", source: "firewall", target: "log-collector", animated: true, label: "Syslog" },
          { id: "e2", source: "endpoint", target: "log-collector", animated: true, label: "Agent" },
          { id: "e3", source: "log-collector", target: "siem-core", animated: true, label: "Normalize" },
          { id: "e4", source: "siem-core", target: "soar", animated: true, label: "Alert Trigger" }
        ]
      }
    },
    {
      id: "ddos-mitigation",
      name: "DDoS Mitigation System",
      description: "Multi-layered defense against volumetric and application-layer attacks.",
      category: "security",
      icon: FaCloud,
      difficulty: "Advanced",
      components: 8,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          { id: "internet", type: "custom", position: { x: 100, y: 200 }, data: { label: "Internet Traffic", icon: "FaGlobe", color: "#6b7280" } },
          { id: "scrubbing", type: "custom", position: { x: 300, y: 200 }, data: { label: "Scrubbing Center", icon: "FaFilter", color: "#ef4444" } },
          { id: "waf", type: "custom", position: { x: 500, y: 200 }, data: { label: "WAF", icon: "FaShieldAlt", color: "#f97316" } },
          { id: "load-balancer", type: "custom", position: { x: 700, y: 200 }, data: { label: "Load Balancer", icon: "FaBalanceScale", color: "#0ea5e9" } },
          { id: "origin", type: "custom", position: { x: 900, y: 200 }, data: { label: "Origin Server", icon: "FaServer", color: "#10b981" } }
        ],
        edges: [
          { id: "e1", source: "internet", target: "scrubbing", animated: true, label: "BGP Anycast" },
          { id: "e2", source: "scrubbing", target: "waf", animated: true, label: "Clean Traffic" },
          { id: "e3", source: "waf", target: "load-balancer", animated: true },
          { id: "e4", source: "load-balancer", target: "origin", animated: true }
        ]
      }
    },
    {
      id: "compliance-monitoring",
      name: "Compliance Monitoring",
      description: "Continuous compliance auditing for GDPR, HIPAA, and SOC2.",
      category: "security",
      icon: FaClipboardCheck,
      difficulty: "Intermediate",
      components: 7,
      rating: 4.5,
      featured: false,
      data: {
        nodes: [
          { id: "cloud-resources", type: "custom", position: { x: 100, y: 200 }, data: { label: "Cloud Resources", icon: "FaCloud", color: "#0ea5e9" } },
          { id: "config-scanner", type: "custom", position: { x: 300, y: 200 }, data: { label: "Config Scanner", icon: "FaSearch", color: "#f97316" } },
          { id: "compliance-db", type: "custom", position: { x: 500, y: 200 }, data: { label: "Compliance DB", icon: "FaDatabase", color: "#8b5cf6" } },
          { id: "dashboard", type: "custom", position: { x: 700, y: 200 }, data: { label: "Audit Dashboard", icon: "FaClipboardCheck", color: "#10b981" } },
          { id: "alert-system", type: "custom", position: { x: 500, y: 400 }, data: { label: "Alert System", icon: "FaBell", color: "#ef4444" } }
        ],
        edges: [
          { id: "e1", source: "cloud-resources", target: "config-scanner", animated: true, label: "Scan API" },
          { id: "e2", source: "config-scanner", target: "compliance-db", animated: true, label: "Store Results" },
          { id: "e3", source: "compliance-db", target: "dashboard", animated: true },
          { id: "e4", source: "config-scanner", target: "alert-system", animated: true, label: "Violation" }
        ]
      }
    },
    // Batch 4: Cloud Native
    {
      id: "service-mesh",
      name: "Service Mesh Architecture",
      description: "Microservices communication with sidecar proxies, mTLS, and observability.",
      category: "cloud",
      icon: FaNetworkWired,
      difficulty: "Advanced",
      components: 10,
      rating: 4.8,
      featured: true,
      data: {
        nodes: [
          { id: "ingress", type: "custom", position: { x: 100, y: 200 }, data: { label: "Ingress Gateway", icon: "FaRandom", color: "#f97316" } },
          { id: "service-a", type: "custom", position: { x: 300, y: 100 }, data: { label: "Service A", icon: "FaServer", color: "#0ea5e9" } },
          { id: "sidecar-a", type: "custom", position: { x: 350, y: 150 }, data: { label: "Sidecar A", icon: "FaShip", color: "#6366f1" } },
          { id: "service-b", type: "custom", position: { x: 500, y: 200 }, data: { label: "Service B", icon: "FaServer", color: "#10b981" } },
          { id: "sidecar-b", type: "custom", position: { x: 550, y: 250 }, data: { label: "Sidecar B", icon: "FaShip", color: "#6366f1" } },
          { id: "control-plane", type: "custom", position: { x: 500, y: 400 }, data: { label: "Istio Control Plane", icon: "FaCogs", color: "#3b82f6" } }
        ],
        edges: [
          { id: "e1", source: "ingress", target: "sidecar-a", animated: true },
          { id: "e2", source: "sidecar-a", target: "service-a", animated: true, label: "Localhost" },
          { id: "e3", source: "sidecar-a", target: "sidecar-b", animated: true, label: "mTLS" },
          { id: "e4", source: "sidecar-b", target: "service-b", animated: true, label: "Localhost" },
          { id: "e5", source: "control-plane", target: "sidecar-a", animated: true, label: "Config", style: { strokeDasharray: "5,5" } },
          { id: "e6", source: "control-plane", target: "sidecar-b", animated: true, label: "Config", style: { strokeDasharray: "5,5" } }
        ]
      }
    },
    {
      id: "serverless-event-bus",
      name: "Serverless Event Bus",
      description: "Event-driven architecture using EventBridge/CloudEvents for decoupled services.",
      category: "cloud",
      icon: FaBolt,
      difficulty: "Intermediate",
      components: 8,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          { id: "source-app", type: "custom", position: { x: 100, y: 200 }, data: { label: "Source App", icon: "FaDesktop", color: "#0ea5e9" } },
          { id: "event-bus", type: "custom", position: { x: 300, y: 200 }, data: { label: "Event Bus", icon: "FaBolt", color: "#facc15" } },
          { id: "rule-1", type: "custom", position: { x: 500, y: 100 }, data: { label: "Rule: Order Created", icon: "FaFilter", color: "#f97316" } },
          { id: "rule-2", type: "custom", position: { x: 500, y: 300 }, data: { label: "Rule: User Signup", icon: "FaFilter", color: "#f97316" } },
          { id: "target-lambda", type: "custom", position: { x: 700, y: 100 }, data: { label: "Process Order", icon: "FaMicrochip", color: "#10b981" } },
          { id: "target-sns", type: "custom", position: { x: 700, y: 300 }, data: { label: "Email User", icon: "FaBell", color: "#ef4444" } }
        ],
        edges: [
          { id: "e1", source: "source-app", target: "event-bus", animated: true, label: "PutEvents" },
          { id: "e2", source: "event-bus", target: "rule-1", animated: true },
          { id: "e3", source: "event-bus", target: "rule-2", animated: true },
          { id: "e4", source: "rule-1", target: "target-lambda", animated: true },
          { id: "e5", source: "rule-2", target: "target-sns", animated: true }
        ]
      }
    },
    {
      id: "dr-multi-region",
      name: "Multi-Region Disaster Recovery",
      description: "Active-active or active-passive setup across multiple geographic regions.",
      category: "cloud",
      icon: FaGlobe,
      difficulty: "Expert",
      components: 10,
      rating: 4.9,
      featured: false,
      data: {
        nodes: [
          { id: "dns", type: "custom", position: { x: 400, y: 50 }, data: { label: "Global DNS (Route53)", icon: "FaGlobe", color: "#facc15" } },
          { id: "region-a-lb", type: "custom", position: { x: 200, y: 150 }, data: { label: "Region A LB", icon: "FaBalanceScale", color: "#0ea5e9" } },
          { id: "region-b-lb", type: "custom", position: { x: 600, y: 150 }, data: { label: "Region B LB", icon: "FaBalanceScale", color: "#0ea5e9" } },
          { id: "region-a-app", type: "custom", position: { x: 200, y: 250 }, data: { label: "App Server A", icon: "FaServer", color: "#10b981" } },
          { id: "region-b-app", type: "custom", position: { x: 600, y: 250 }, data: { label: "App Server B", icon: "FaServer", color: "#10b981" } },
          { id: "region-a-db", type: "custom", position: { x: 200, y: 400 }, data: { label: "Primary DB", icon: "FaDatabase", color: "#8b5cf6" } },
          { id: "region-b-db", type: "custom", position: { x: 600, y: 400 }, data: { label: "Replica DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "dns", target: "region-a-lb", animated: true, label: "Primary" },
          { id: "e2", source: "dns", target: "region-b-lb", animated: true, label: "Failover" },
          { id: "e3", source: "region-a-lb", target: "region-a-app", animated: true },
          { id: "e4", source: "region-b-lb", target: "region-b-app", animated: true },
          { id: "e5", source: "region-a-app", target: "region-a-db", animated: true },
          { id: "e6", source: "region-b-app", target: "region-b-db", animated: true, label: "Read" },
          { id: "e7", source: "region-a-db", target: "region-b-db", animated: true, label: "Async Repl", style: { strokeDasharray: "5,5" } }
        ]
      }
    },
    // Batch 4: DevOps
    {
      id: "gitops-workflow",
      name: "GitOps Workflow",
      description: "Infrastructure and application deployment managed via Git repositories.",
      category: "devops",
      icon: FaCodeBranch,
      difficulty: "Intermediate",
      components: 8,
      rating: 4.7,
      featured: true,
      data: {
        nodes: [
          { id: "dev", type: "custom", position: { x: 100, y: 200 }, data: { label: "Developer", icon: "FaUser", color: "#0ea5e9" } },
          { id: "git-repo", type: "custom", position: { x: 300, y: 200 }, data: { label: "Git Config Repo", icon: "FaCodeBranch", color: "#f97316" } },
          { id: "argocd", type: "custom", position: { x: 500, y: 200 }, data: { label: "ArgoCD", icon: "FaSync", color: "#10b981" } },
          { id: "k8s-cluster", type: "custom", position: { x: 700, y: 200 }, data: { label: "K8s Cluster", icon: "FaServer", color: "#3b82f6" } },
          { id: "registry", type: "custom", position: { x: 500, y: 100 }, data: { label: "Image Registry", icon: "FaBoxOpen", color: "#6366f1" } }
        ],
        edges: [
          { id: "e1", source: "dev", target: "git-repo", animated: true, label: "Commit YAML" },
          { id: "e2", source: "argocd", target: "git-repo", animated: true, label: "Watch" },
          { id: "e3", source: "argocd", target: "k8s-cluster", animated: true, label: "Sync/Apply" },
          { id: "e4", source: "k8s-cluster", target: "registry", animated: true, label: "Pull Image" }
        ]
      }
    },
    {
      id: "blue-green-deploy",
      name: "Blue/Green Deployment",
      description: "Zero-downtime deployment strategy switching traffic between two identical environments.",
      category: "devops",
      icon: FaExchangeAlt,
      difficulty: "Intermediate",
      components: 7,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          { id: "load-balancer", type: "custom", position: { x: 100, y: 200 }, data: { label: "Load Balancer", icon: "FaBalanceScale", color: "#facc15" } },
          { id: "blue-env", type: "custom", position: { x: 300, y: 100 }, data: { label: "Blue Env (Live)", icon: "FaServer", color: "#10b981" } },
          { id: "green-env", type: "custom", position: { x: 300, y: 300 }, data: { label: "Green Env (Idle)", icon: "FaServer", color: "#ef4444" } },
          { id: "db", type: "custom", position: { x: 500, y: 200 }, data: { label: "Shared DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "load-balancer", target: "blue-env", animated: true, label: "100% Traffic" },
          { id: "e2", source: "load-balancer", target: "green-env", animated: true, label: "0% Traffic", style: { strokeDasharray: "5,5" } },
          { id: "e3", source: "blue-env", target: "db", animated: true },
          { id: "e4", source: "green-env", target: "db", animated: true }
        ]
      }
    },
    {
      id: "canary-release",
      name: "Canary Release Pipeline",
      description: "Gradual rollout of new features to a small subset of users before full release.",
      category: "devops",
      icon: FaVial,
      difficulty: "Advanced",
      components: 8,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          { id: "users", type: "custom", position: { x: 100, y: 200 }, data: { label: "Users", icon: "FaUsers", color: "#0ea5e9" } },
          { id: "ingress", type: "custom", position: { x: 300, y: 200 }, data: { label: "Ingress (Traffic Split)", icon: "FaRandom", color: "#f97316" } },
          { id: "stable-v1", type: "custom", position: { x: 500, y: 100 }, data: { label: "Stable v1.0", icon: "FaServer", color: "#10b981" } },
          { id: "canary-v2", type: "custom", position: { x: 500, y: 300 }, data: { label: "Canary v2.0", icon: "FaServer", color: "#facc15" } },
          { id: "metrics", type: "custom", position: { x: 700, y: 200 }, data: { label: "Metrics Analysis", icon: "FaChartLine", color: "#ef4444" } }
        ],
        edges: [
          { id: "e1", source: "users", target: "ingress", animated: true },
          { id: "e2", source: "ingress", target: "stable-v1", animated: true, label: "90%" },
          { id: "e3", source: "ingress", target: "canary-v2", animated: true, label: "10%" },
          { id: "e4", source: "canary-v2", target: "metrics", animated: true, label: "Error Rate" }
        ]
      }
    },
    {
      id: "iac-pipeline",
      name: "Infrastructure as Code (IaC)",
      description: "Provisioning infrastructure using Terraform/Ansible pipelines.",
      category: "devops",
      icon: FaCode,
      difficulty: "Intermediate",
      components: 9,
      rating: 4.5,
      featured: false,
      data: {
        nodes: [
          { id: "dev", type: "custom", position: { x: 100, y: 200 }, data: { label: "DevOps Engineer", icon: "FaUser", color: "#0ea5e9" } },
          { id: "git", type: "custom", position: { x: 300, y: 200 }, data: { label: "Git (Terraform)", icon: "FaCodeBranch", color: "#f97316" } },
          { id: "ci-runner", type: "custom", position: { x: 500, y: 200 }, data: { label: "CI Runner", icon: "FaTerminal", color: "#10b981" } },
          { id: "state-file", type: "custom", position: { x: 500, y: 400 }, data: { label: "State File (S3)", icon: "FaFileAlt", color: "#6366f1" } },
          { id: "cloud-provider", type: "custom", position: { x: 700, y: 200 }, data: { label: "Cloud Provider", icon: "FaCloud", color: "#0ea5e9" } }
        ],
        edges: [
          { id: "e1", source: "dev", target: "git", animated: true, label: "Push .tf" },
          { id: "e2", source: "git", target: "ci-runner", animated: true, label: "Trigger Plan" },
          { id: "e3", source: "ci-runner", target: "state-file", animated: true, label: "Lock/Read" },
          { id: "e4", source: "ci-runner", target: "cloud-provider", animated: true, label: "Apply" }
        ]
      }
    },
    // Batch 5: Machine Learning
    {
      id: "recommender-system",
      name: "Recommender System",
      description: "Real-time personalization engine using collaborative filtering and deep learning.",
      category: "ml",
      icon: FaThumbsUp,
      difficulty: "Advanced",
      components: 9,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          { id: "user-events", type: "custom", position: { x: 100, y: 200 }, data: { label: "User Events", icon: "FaMousePointer", color: "#0ea5e9" } },
          { id: "feature-store", type: "custom", position: { x: 300, y: 100 }, data: { label: "Feature Store", icon: "FaDatabase", color: "#f97316" } },
          { id: "inference-api", type: "custom", position: { x: 300, y: 300 }, data: { label: "Inference API", icon: "FaBrain", color: "#8b5cf6" } },
          { id: "model-registry", type: "custom", position: { x: 500, y: 300 }, data: { label: "Model Registry", icon: "FaArchive", color: "#6366f1" } },
          { id: "cache", type: "custom", position: { x: 500, y: 100 }, data: { label: "Redis Cache", icon: "FaDatabase", color: "#ef4444" } }
        ],
        edges: [
          { id: "e1", source: "user-events", target: "feature-store", animated: true, label: "Ingest" },
          { id: "e2", source: "user-events", target: "inference-api", animated: true, label: "Request Recs" },
          { id: "e3", source: "inference-api", target: "feature-store", animated: true, label: "Fetch Features" },
          { id: "e4", source: "inference-api", target: "model-registry", animated: true, label: "Load Model" },
          { id: "e5", source: "inference-api", target: "cache", animated: true, label: "Cache Results" }
        ]
      }
    },
    {
      id: "cv-pipeline",
      name: "Computer Vision Pipeline",
      description: "Image processing workflow with GPU inference and object detection.",
      category: "ml",
      icon: FaEye,
      difficulty: "Expert",
      components: 8,
      rating: 4.8,
      featured: true,
      data: {
        nodes: [
          { id: "camera", type: "custom", position: { x: 100, y: 200 }, data: { label: "Camera Feed", icon: "FaVideo", color: "#6b7280" } },
          { id: "pre-process", type: "custom", position: { x: 300, y: 200 }, data: { label: "Pre-processing", icon: "FaCogs", color: "#facc15" } },
          { id: "inference-gpu", type: "custom", position: { x: 500, y: 200 }, data: { label: "GPU Inference", icon: "FaMicrochip", color: "#ef4444" } },
          { id: "post-process", type: "custom", position: { x: 700, y: 200 }, data: { label: "Post-processing", icon: "FaFilter", color: "#10b981" } },
          { id: "storage", type: "custom", position: { x: 900, y: 200 }, data: { label: "Result Storage", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "camera", target: "pre-process", animated: true, label: "RTSP" },
          { id: "e2", source: "pre-process", target: "inference-gpu", animated: true, label: "Tensor" },
          { id: "e3", source: "inference-gpu", target: "post-process", animated: true, label: "BBox" },
          { id: "e4", source: "post-process", target: "storage", animated: true, label: "JSON" }
        ]
      }
    },
    {
      id: "nlp-chatbot",
      name: "NLP Chatbot Architecture",
      description: "Conversational AI with intent recognition, entity extraction, and fulfillment.",
      category: "ml",
      icon: FaCommentDots,
      difficulty: "Intermediate",
      components: 7,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          { id: "user", type: "custom", position: { x: 100, y: 200 }, data: { label: "User", icon: "FaUser", color: "#0ea5e9" } },
          { id: "chat-ui", type: "custom", position: { x: 300, y: 200 }, data: { label: "Chat UI", icon: "FaComments", color: "#10b981" } },
          { id: "nlu-engine", type: "custom", position: { x: 500, y: 200 }, data: { label: "NLU Engine (LLM)", icon: "FaBrain", color: "#8b5cf6" } },
          { id: "fulfillment", type: "custom", position: { x: 700, y: 100 }, data: { label: "Fulfillment API", icon: "FaServer", color: "#f97316" } },
          { id: "context-db", type: "custom", position: { x: 700, y: 300 }, data: { label: "Context DB", icon: "FaDatabase", color: "#facc15" } }
        ],
        edges: [
          { id: "e1", source: "user", target: "chat-ui", animated: true },
          { id: "e2", source: "chat-ui", target: "nlu-engine", animated: true, label: "Text" },
          { id: "e3", source: "nlu-engine", target: "fulfillment", animated: true, label: "Intent" },
          { id: "e4", source: "nlu-engine", target: "context-db", animated: true, label: "State" },
          { id: "e5", source: "fulfillment", target: "chat-ui", animated: true, label: "Response" }
        ]
      }
    },
    {
      id: "federated-learning",
      name: "Federated Learning",
      description: "Distributed model training across edge devices preserving data privacy.",
      category: "ml",
      icon: FaNetworkWired,
      difficulty: "Expert",
      components: 6,
      rating: 4.5,
      featured: false,
      data: {
        nodes: [
          { id: "central-server", type: "custom", position: { x: 500, y: 100 }, data: { label: "Central Server", icon: "FaServer", color: "#6366f1" } },
          { id: "edge-1", type: "custom", position: { x: 300, y: 300 }, data: { label: "Edge Device 1", icon: "FaMobile", color: "#0ea5e9" } },
          { id: "edge-2", type: "custom", position: { x: 500, y: 300 }, data: { label: "Edge Device 2", icon: "FaMobile", color: "#0ea5e9" } },
          { id: "edge-3", type: "custom", position: { x: 700, y: 300 }, data: { label: "Edge Device 3", icon: "FaMobile", color: "#0ea5e9" } }
        ],
        edges: [
          { id: "e1", source: "central-server", target: "edge-1", animated: true, label: "Global Model" },
          { id: "e2", source: "central-server", target: "edge-2", animated: true, label: "Global Model" },
          { id: "e3", source: "central-server", target: "edge-3", animated: true, label: "Global Model" },
          { id: "e4", source: "edge-1", target: "central-server", animated: true, label: "Gradients", style: { strokeDasharray: "5,5" } },
          { id: "e5", source: "edge-2", target: "central-server", animated: true, label: "Gradients", style: { strokeDasharray: "5,5" } },
          { id: "e6", source: "edge-3", target: "central-server", animated: true, label: "Gradients", style: { strokeDasharray: "5,5" } }
        ]
      }
    },
    // Batch 5: SaaS
    {
      id: "subscription-mgmt",
      name: "Subscription Management",
      description: "Handling recurring billing, invoicing, and plan upgrades/downgrades.",
      category: "saas",
      icon: FaCreditCard,
      difficulty: "Intermediate",
      components: 8,
      rating: 4.6,
      featured: false,
      data: {
        nodes: [
          { id: "user", type: "custom", position: { x: 100, y: 200 }, data: { label: "User", icon: "FaUser", color: "#0ea5e9" } },
          { id: "billing-ui", type: "custom", position: { x: 300, y: 200 }, data: { label: "Billing UI", icon: "FaCreditCard", color: "#10b981" } },
          { id: "payment-gateway", type: "custom", position: { x: 500, y: 100 }, data: { label: "Stripe/PayPal", icon: "FaExchangeAlt", color: "#6366f1" } },
          { id: "billing-service", type: "custom", position: { x: 500, y: 300 }, data: { label: "Billing Service", icon: "FaServer", color: "#f97316" } },
          { id: "invoice-db", type: "custom", position: { x: 700, y: 300 }, data: { label: "Invoice DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "user", target: "billing-ui", animated: true },
          { id: "e2", source: "billing-ui", target: "payment-gateway", animated: true, label: "Checkout" },
          { id: "e3", source: "payment-gateway", target: "billing-service", animated: true, label: "Webhook" },
          { id: "e4", source: "billing-service", target: "invoice-db", animated: true, label: "Record" }
        ]
      }
    },
    {
      id: "api-first-saas",
      name: "API-First SaaS",
      description: "Headless architecture focusing on developer experience and API consumption.",
      category: "saas",
      icon: FaCode,
      difficulty: "Advanced",
      components: 7,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          { id: "developer", type: "custom", position: { x: 100, y: 200 }, data: { label: "Developer", icon: "FaUser", color: "#0ea5e9" } },
          { id: "api-gateway", type: "custom", position: { x: 300, y: 200 }, data: { label: "API Gateway", icon: "FaKey", color: "#f97316" } },
          { id: "rate-limiter", type: "custom", position: { x: 500, y: 100 }, data: { label: "Rate Limiter", icon: "FaStopwatch", color: "#ef4444" } },
          { id: "core-service", type: "custom", position: { x: 500, y: 300 }, data: { label: "Core Service", icon: "FaServer", color: "#10b981" } },
          { id: "usage-db", type: "custom", position: { x: 700, y: 200 }, data: { label: "Usage DB", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "developer", target: "api-gateway", animated: true, label: "API Key" },
          { id: "e2", source: "api-gateway", target: "rate-limiter", animated: true, label: "Check Quota" },
          { id: "e3", source: "api-gateway", target: "core-service", animated: true, label: "Proxy" },
          { id: "e4", source: "core-service", target: "usage-db", animated: true, label: "Track Usage" }
        ]
      }
    },
    {
      id: "enterprise-sso",
      name: "Enterprise SSO SaaS",
      description: "SAML/OIDC integration for enterprise customers.",
      category: "saas",
      icon: FaKey,
      difficulty: "Intermediate",
      components: 6,
      rating: 4.5,
      featured: false,
      data: {
        nodes: [
          { id: "user", type: "custom", position: { x: 100, y: 200 }, data: { label: "Enterprise User", icon: "FaUser", color: "#0ea5e9" } },
          { id: "sp", type: "custom", position: { x: 300, y: 200 }, data: { label: "Service Provider", icon: "FaServer", color: "#10b981" } },
          { id: "idp", type: "custom", position: { x: 500, y: 200 }, data: { label: "Identity Provider", icon: "FaShieldAlt", color: "#f97316" } },
          { id: "user-store", type: "custom", position: { x: 700, y: 200 }, data: { label: "User Store", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "user", target: "sp", animated: true, label: "Login" },
          { id: "e2", source: "sp", target: "idp", animated: true, label: "Redirect (SAML)" },
          { id: "e3", source: "idp", target: "user-store", animated: true, label: "Auth" },
          { id: "e4", source: "idp", target: "sp", animated: true, label: "Assertion" }
        ]
      }
    },
    {
      id: "freemium-app",
      name: "Freemium App",
      description: "Feature gating and upgrade flows for free-to-paid conversion.",
      category: "saas",
      icon: FaUserPlus,
      difficulty: "Intermediate",
      components: 7,
      rating: 4.4,
      featured: false,
      data: {
        nodes: [
          { id: "user", type: "custom", position: { x: 100, y: 200 }, data: { label: "User", icon: "FaUser", color: "#0ea5e9" } },
          { id: "app-ui", type: "custom", position: { x: 300, y: 200 }, data: { label: "App UI", icon: "FaDesktop", color: "#10b981" } },
          { id: "feature-gate", type: "custom", position: { x: 500, y: 200 }, data: { label: "Feature Gate", icon: "FaLock", color: "#ef4444" } },
          { id: "upgrade-page", type: "custom", position: { x: 500, y: 400 }, data: { label: "Upgrade Page", icon: "FaStar", color: "#facc15" } },
          { id: "db", type: "custom", position: { x: 700, y: 200 }, data: { label: "User DB (Plan)", icon: "FaDatabase", color: "#8b5cf6" } }
        ],
        edges: [
          { id: "e1", source: "user", target: "app-ui", animated: true },
          { id: "e2", source: "app-ui", target: "feature-gate", animated: true, label: "Access Feature" },
          { id: "e3", source: "feature-gate", target: "db", animated: true, label: "Check Plan" },
          { id: "e4", source: "feature-gate", target: "upgrade-page", animated: true, label: "Deny/Upsell" }
        ]
      }
    }
  ];

  const allTemplates = [...templates, ...newTemplates];


  const categories = [
    { id: "all", label: "All Templates", icon: FaPlus },
    { id: "ecommerce", label: "E-commerce", icon: FaShoppingCart },
    { id: "social", label: "Social Media", icon: FaUsers },
    { id: "iot", label: "IoT", icon: FaCog },
    { id: "gaming", label: "Gaming", icon: FaGamepad },
    { id: "analytics", label: "Analytics", icon: FaChartLine },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "cloud", label: "Cloud Native", icon: FaCloud },
    { id: "devops", label: "DevOps", icon: FaCogs },
    { id: "ml", label: "Machine Learning", icon: FaBrain },
    { id: "saas", label: "SaaS", icon: FaBuilding },
  ];

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = async (template) => {
    const projectName = `${template.name} - ${new Date().toLocaleDateString()}`;
    const newProject = await createProject(projectName, template.description);

    // Import the template data
    const updatedProject = {
      ...newProject,
      nodes: template.data.nodes || [],
      edges: template.data.edges || [],
    };

    setCurrentProject(updatedProject);
    toast.success(`Template "${template.name}" loaded successfully!`);
    onClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-600 bg-green-100";
      case "Intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "Advanced":
        return "text-orange-600 bg-orange-100";
      case "Expert":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Template Gallery
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from pre-built system design templates
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Featured Templates */}
              {selectedCategory === "all" && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    Featured Templates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {templates
                      .filter((t) => t.featured)
                      .map((template) => {
                        const Icon = template.icon;
                        return (
                          <motion.div
                            key={template.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-lg"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                  <Icon className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 dark:text-white">
                                    {template.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                        template.difficulty
                                      )}`}
                                    >
                                      {template.difficulty}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <FaStar
                                        className="text-yellow-500"
                                        size={12}
                                      />
                                      <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {template.rating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <FaStar className="text-yellow-500" size={16} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {template.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {template.components} components
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUseTemplate(template)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                                >
                                  Use Template
                                </button>
                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-400">
                                  <FaEye size={12} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* All Templates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {selectedCategory === "all"
                    ? "All Templates"
                    : categories.find((c) => c.id === selectedCategory)?.label}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                    ({filteredTemplates.length} templates)
                  </span>
                </h3>

                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <FaFilter className="text-gray-400 text-2xl" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No templates found
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Icon className="text-gray-600 dark:text-gray-300" size={20} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 dark:text-white">
                                  {template.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                      template.difficulty
                                    )}`}
                                  >
                                    {template.difficulty}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <FaStar
                                      className="text-yellow-500"
                                      size={12}
                                    />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {template.rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {template.featured && (
                              <FaStar className="text-yellow-500" size={16} />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {template.components} components
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUseTemplate(template)}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                              >
                                Use Template
                              </button>
                              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-400">
                                <FaEye size={12} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div >
          </div >
        </motion.div >
      </motion.div >
    </AnimatePresence >
  );
};

export default TemplateManager;
