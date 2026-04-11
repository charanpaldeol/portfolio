export interface ProjectData {
  id: string
  slug: string
  title: string
  category: string
  icon: string
  accent: string
  shortDescription: string
  outcome: string
  tags: string[]
  /** Hero image for the portfolio gallery (editorial index). */
  coverImage: string
  coverImageAlt: string
  span?: string
  minH?: string
  problemStatement: string
  solutionApproach: string
  resultsMetrics: string
  techStack: {
    category: string
    technologies: string[]
  }[]
}

export const projects: ProjectData[] = [
  {
    id: "1",
    slug: "fraud-detection-engine",
    title: "AI-Powered Fraud Detection Engine",
    category: "AI/ML + Compliance",
    icon: "🚨",
    accent: "bg-red-500/15 text-red-600",
    shortDescription: "Real-time anomaly detection system using deep learning to flag suspicious transactions with 99.2% accuracy.",
    outcome: "99.2% accuracy",
    tags: ["Python", "TensorFlow", "Kafka", "Real-time ML"],
    coverImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt:
      "Code and data on a developer screen, suggesting fraud analysis and real-time detection systems.",
    span: "md:col-span-8",
    minH: "min-h-[300px] md:min-h-[340px]",
    problemStatement: "Legacy fraud detection relied on rule-based systems with ~85% accuracy and 2-3 hour detection latency. Rules-based systems generated 40% false positives, causing customer friction. Banks needed real-time detection with minimal false positives.",
    solutionApproach: "Built a multi-model ensemble combining LSTM neural networks for behavioral patterns, XGBoost for transaction features, and graph neural networks for ring detection. Implemented streaming pipeline using Kafka for sub-100ms latency. Model retrained daily on new transaction patterns. Used feature engineering to capture temporal, geographic, and behavioral anomalies.",
    resultsMetrics: "Achieved 99.2% accuracy with <100ms latency. Reduced false positives by 87% (from 40% to 5%). Detected 98% of fraud attempts within 2 minutes. Prevented $12M+ in fraudulent transactions annually. Scaled to handle 10M+ transactions/day.",
    techStack: [
      { category: "ML/AI", technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "XGBoost"] },
      { category: "Data Pipeline", technologies: ["Apache Kafka", "Apache Spark", "PostgreSQL"] },
      { category: "Infrastructure", technologies: ["Kubernetes", "Docker", "Redis"] },
      { category: "Monitoring", technologies: ["Prometheus", "Grafana", "ELK Stack"] }
    ]
  },
  {
    id: "2",
    slug: "payment-settlement-platform",
    title: "Instant Payment Settlement Platform",
    category: "Real-time Systems",
    icon: "⚡",
    accent: "bg-yellow-500/15 text-yellow-600",
    shortDescription: "Core infrastructure for real-time gross settlement. Handles payment routing, ledger updates, and compliance checks atomically with 5,000+ tx/sec throughput.",
    outcome: "5,000+ tx/sec",
    tags: ["Go", "PostgreSQL", "Event Sourcing", "Distributed Systems"],
    coverImage:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Hands using a smartphone for a digital payment, suggesting instant settlement flows.",
    span: "md:col-span-8",
    minH: "min-h-[300px] md:min-h-[340px]",
    problemStatement: "Traditional payment systems batch-process transactions every 4-24 hours, causing working capital issues and poor customer experience. Existing batch systems couldn't handle real-time demand. Scaling required complex infrastructure changes and introduced reconciliation delays.",
    solutionApproach: "Designed event-sourced architecture with atomic ledger updates using distributed consensus (Raft). Implemented command-query responsibility segregation (CQRS) pattern: writes go through event log, reads from optimized denormalized views. Built modular payment routing engine that evaluates rules in parallel. Used saga pattern for multi-step transactions (reserve → transfer → settle). Implemented circuit breakers and timeout strategies for resilience.",
    resultsMetrics: "Handles 5,000+ transactions/sec with <2 second settlement time (vs 4-24 hours previously). Achieved 99.99% uptime SLA. Zero transaction losses (100% durability). Reduced operational costs by 35% through automation. Processing $50B+ annually.",
    techStack: [
      { category: "Backend", technologies: ["Go", "gRPC", "Protocol Buffers"] },
      { category: "Database", technologies: ["PostgreSQL", "pgLogical replication", "TimescaleDB"] },
      { category: "Event Streaming", technologies: ["Apache Kafka", "NATS"] },
      { category: "Infrastructure", technologies: ["Kubernetes", "CoreDNS", "etcd"] },
      { category: "Observability", technologies: ["Jaeger tracing", "Prometheus", "Loki"] }
    ]
  },
  {
    id: "3",
    slug: "kyc-aml-automation",
    title: "KYC/AML Automation Pipeline",
    category: "Compliance + Automation",
    icon: "🔍",
    accent: "bg-blue-500/15 text-blue-600",
    shortDescription: "End-to-end identity verification and sanctions screening. Reduced customer onboarding from 2-3 days to under 5 minutes while maintaining 99.5% accuracy.",
    outcome: "35% faster onboarding",
    tags: ["Node.js", "Redis", "OCR/LLM", "PostgreSQL"],
    coverImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Laptop and documents on a desk, representing identity verification and compliance review.",
    span: "md:col-span-4",
    minH: "min-h-[280px] md:min-h-[340px]",
    problemStatement: "Manual KYC/AML processes took 2-3 days, creating poor customer experience and causing 25% signup abandonment. Compliance team manually reviewed documents, which was error-prone and didn't scale. High false-positive rate on sanctions screening required extensive manual review.",
    solutionApproach: "Built automated pipeline: (1) Document ingestion using OCR and LLM-based field extraction, (2) Multi-source identity verification (government databases, biometric checks), (3) Real-time sanctions screening against OFAC and PEP lists with fuzzy matching, (4) Risk scoring model that gates approval. Implemented async processing with Celery for heavy lifting. Used Redis for caching sanctions lists for <10ms lookup.",
    resultsMetrics: "Reduced onboarding from 2-3 days to <5 minutes (99.5% faster). 99.5% accuracy on document extraction. 87% of users approved fully automatically. Reduced manual review queue by 92%. Processed 100k+ applications with zero compliance incidents.",
    techStack: [
      { category: "Backend", technologies: ["Node.js", "Express", "TypeScript"] },
      { category: "AI/ML", technologies: ["Tesseract OCR", "Claude API", "OpenAI GPT"] },
      { category: "Data", technologies: ["PostgreSQL", "Redis", "MongoDB"] },
      { category: "Queue", technologies: ["Bull", "RabbitMQ"] }
    ]
  },
  {
    id: "4",
    slug: "real-time-analytics-dashboard",
    title: "Real-time Analytics Dashboard",
    category: "Data Engineering + Analytics",
    icon: "📊",
    accent: "bg-green-500/15 text-green-600",
    shortDescription: "Sub-second dashboards for financial operations. Real-time monitoring of payments, fraud alerts, liquidity position for 100+ concurrent users.",
    outcome: "Sub-second latency",
    tags: ["React", "ClickHouse", "WebSocket", "D3.js"],
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Business analytics dashboard on a screen with charts and KPIs.",
    span: "md:col-span-12",
    minH: "min-h-[240px]",
    problemStatement: "Legacy reporting dashboards had 30+ minute data latency. Reports were generated hourly via batch jobs. Operations team couldn't react to real-time issues (fraud spikes, liquidity crunches, payment delays). Every decision was based on stale data.",
    solutionApproach: "Built event-driven data pipeline: Kafka streams real-time events → ClickHouse for OLAP queries → React frontend with WebSocket for live updates. Implemented incremental aggregations and pre-computed rollups at multiple time granularities (1m, 5m, 1h). Used virtual scrolling and data virtualization to handle millions of rows. Frontend built with D3.js for sophisticated visualizations.",
    resultsMetrics: "Achieved sub-second query latency on 1M+ events/sec. 100+ concurrent users with <200ms dashboard updates. Reduced incident detection time from 30 minutes to <30 seconds. Operations team made 40% faster decisions. Handles $20B+ daily transaction volume.",
    techStack: [
      { category: "Frontend", technologies: ["React", "TypeScript", "D3.js", "Recharts"] },
      { category: "Backend", technologies: ["Node.js", "Express", "WebSocket"] },
      { category: "OLAP", technologies: ["ClickHouse", "Apache Druid"] },
      { category: "Streaming", technologies: ["Apache Kafka", "Kafka Streams"] },
      { category: "Infrastructure", technologies: ["Docker", "Kubernetes", "AWS EC2"] }
    ]
  },
  {
    id: "5",
    slug: "event-streaming-pipeline",
    title: "Distributed Event Streaming Pipeline",
    category: "Real-time Data Systems",
    icon: "🌊",
    accent: "bg-indigo-500/15 text-indigo-600",
    shortDescription: "Event-driven architecture for transaction processing and audit trails. Decouples systems, enables 100M+ events/day with zero data loss.",
    outcome: "100M+ events/day",
    tags: ["Kafka", "Spark", "Scala", "Data Warehousing"],
    coverImage:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Server racks in a data center, representing high-throughput event streaming.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    problemStatement: "Tightly coupled monolithic system made it impossible to add new services without breaking existing code. Audit trails were incomplete and unreliable. Regulatory compliance required immutable event logs. System couldn't scale independently by function.",
    solutionApproach: "Migrated to event-driven architecture with Kafka as the event backbone. Each domain (payments, users, compliance) publishes events. Implemented event sourcing for audit trails—every state change recorded immutably. Built stream processors for real-time aggregations and event transformations. Implemented multiple event consumers: one for audit logging, one for analytics warehouse, one for compliance monitoring.",
    resultsMetrics: "Processes 100M+ events/day across 10+ topic streams. Guaranteed at-least-once delivery (0 data loss). Reduced coupling: 12 services can evolve independently. Compliance audit trail 100% complete. Reduced incident diagnosis time by 60%.",
    techStack: [
      { category: "Streaming", technologies: ["Apache Kafka", "Kafka Streams", "KSQL"] },
      { category: "Processing", technologies: ["Apache Spark", "Scala", "Python"] },
      { category: "Data Warehouse", technologies: ["Snowflake", "Redshift"] },
      { category: "Schemas", technologies: ["Avro", "Protocol Buffers", "Schema Registry"] }
    ]
  },
  {
    id: "6",
    slug: "ai-customer-onboarding-agent",
    title: "AI Agent for Customer Onboarding",
    category: "AI/Agentic Systems",
    icon: "🤖",
    accent: "bg-purple-500/15 text-purple-600",
    shortDescription: "Multi-step agentic system that autonomously handles document collection, verification, and account creation. 87% fully autonomous completion.",
    outcome: "2-3x faster",
    tags: ["LLM APIs", "RAG", "Function Calling", "Node.js"],
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Abstract AI neural visualization suggesting autonomous agent workflows.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    problemStatement: "Customer onboarding required multiple manual steps: collecting documents, requesting clarifications, verifying information, account creation. Average time: 2-3 days with human involvement. High abandonment rate due to friction. Inconsistent experience across customers.",
    solutionApproach: "Built agentic AI system using Claude API with function calling. Agent can: (1) Collect documents autonomously, (2) Use RAG to lookup customer info, (3) Make decisions on verification status, (4) Trigger account creation. Implemented memory system to track conversation context. Used ReAct pattern for reasoning and tool use. Fallback to humans for edge cases using escalation logic.",
    resultsMetrics: "2-3x faster onboarding (from 2-3 days to 2-8 hours). 87% of customers complete without human intervention. <1% escalation rate. 95% customer satisfaction. Processed 5k+ onboardings autonomously.",
    techStack: [
      { category: "LLM/AI", technologies: ["Claude API", "Function Calling", "Prompt Engineering"] },
      { category: "RAG", technologies: ["Pinecone", "LangChain", "OpenAI Embeddings"] },
      { category: "Backend", technologies: ["Node.js", "Express", "TypeScript"] },
      { category: "Database", technologies: ["PostgreSQL", "Redis"] }
    ]
  },
  {
    id: "7",
    slug: "credit-risk-underwriting",
    title: "Credit Risk Scoring & ML Underwriting",
    category: "AI/ML + Finance",
    icon: "💳",
    accent: "bg-orange-500/15 text-orange-600",
    shortDescription: "ML-driven credit model replacing legacy rules. Improved approval rate by 23% while reducing default risk by 15%.",
    outcome: "23% approval uplift",
    tags: ["Python", "XGBoost", "Feature Engineering", "MLOps"],
    coverImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Financial charts and trading interfaces on monitors.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    problemStatement: "Legacy rule-based credit model had 65% approval rate but high default rate (8%). Rules were static and didn't adapt to market changes. Many creditworthy customers were rejected. Model couldn't capture complex patterns in borrower behavior.",
    solutionApproach: "Built ML-driven credit model using gradient boosted decision trees (XGBoost). Feature engineering pipeline extracted 200+ features from transaction history, credit bureau data, and behavioral signals. Implemented ablation testing to understand feature importance. Used SHAP values for model explainability (critical for regulatory compliance). Implemented retraining pipeline with monitoring for model drift.",
    resultsMetrics: "Improved approval rate from 65% to 88% (23% uplift). Reduced default rate from 8% to 6.8% (15% improvement). Model predictions within 100ms. Validated on holdout test set: 92% AUC. Increased revenue by $15M+ annually through better lending decisions.",
    techStack: [
      { category: "ML", technologies: ["Python", "XGBoost", "LightGBM", "Scikit-learn"] },
      { category: "Feature Store", technologies: ["Feast", "Redis"] },
      { category: "MLOps", technologies: ["MLflow", "Airflow", "DVC"] },
      { category: "Explainability", technologies: ["SHAP", "LIME"] },
      { category: "Infrastructure", technologies: ["Docker", "Kubernetes"] }
    ]
  },
  {
    id: "8",
    slug: "api-first-banking-microservices",
    title: "API-First Banking Platform (Microservices)",
    category: "Cloud-native Architecture",
    icon: "🏗️",
    accent: "bg-cyan-500/15 text-cyan-600",
    shortDescription: "Modular API-first design with 12+ independent microservices. Each service independently deployable and scalable with 99.99% SLA.",
    outcome: "99.99% SLA",
    tags: ["TypeScript", "Node.js", "Kubernetes", "gRPC"],
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Rows of servers in a modern data center, suggesting cloud-native microservices.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    problemStatement: "Monolithic banking system was tightly coupled, making deployments risky and slow. One bug took down the entire platform. Scaling required scaling everything, not individual components. Team couldn't move fast or independently own services.",
    solutionApproach: "Migrated to microservices: Account Service, Payment Service, Compliance Service, Notification Service, Analytics Service, etc. Each service owns its data. Used API Gateway for routing and rate limiting. Implemented service-to-service communication via gRPC (fast, typed) and async messaging (Kafka). Built robust service discovery and load balancing. Implemented circuit breakers and timeouts.",
    resultsMetrics: "12 independently deployable services. <50ms p99 latency for critical paths. Achieved 99.99% SLA (vs 98% previously). 10x faster feature deployments. Each team can deploy independently without coordinating. Scaled to 100k+ concurrent users.",
    techStack: [
      { category: "Services", technologies: ["Node.js", "TypeScript", "Express", "NestJS"] },
      { category: "Communication", technologies: ["gRPC", "Protocol Buffers", "REST", "Kafka"] },
      { category: "Orchestration", technologies: ["Kubernetes", "Helm", "ArgoCD"] },
      { category: "Observability", technologies: ["Jaeger", "Prometheus", "ELK", "DataDog"] },
      { category: "Database", technologies: ["PostgreSQL", "MongoDB", "Redis"] }
    ]
  },
  {
    id: "9",
    slug: "compliance-risk-monitoring",
    title: "AI-Driven Compliance & Risk Monitoring",
    category: "Compliance + AI",
    icon: "⚖️",
    accent: "bg-slate-500/15 text-slate-600",
    shortDescription: "Smart network analysis combined with LLM reasoning to detect money laundering patterns. 98% detection accuracy with zero false positives on high-confidence alerts.",
    outcome: "98% detection",
    tags: ["Python", "LLM APIs", "Graph DB", "React"],
    coverImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Law books and a gavel, suggesting compliance and regulatory monitoring.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    problemStatement: "Legacy AML systems flag 40% of transactions as suspicious, creating huge false-positive burden on compliance teams. Regulators increasingly expect AI-driven monitoring. Traditional rule-based systems miss sophisticated laundering rings.",
    solutionApproach: "Built multi-layered compliance system: (1) Graph database (Neo4j) to map transaction networks and identify rings, (2) ML model to score transaction risk, (3) Claude API with function calling to analyze patterns and provide reasoning. Graph algorithms detect circular transactions and structuring patterns. LLM reasons about relationships and provides explainable decisions for regulators.",
    resultsMetrics: "98% detection accuracy on real money laundering cases. Identified $50M+ in suspicious patterns. Zero false positives on high-confidence alerts. Compliance team review time reduced by 75%. Full explainability for regulatory audits.",
    techStack: [
      { category: "Backend", technologies: ["Python", "FastAPI", "Node.js"] },
      { category: "Graphs", technologies: ["Neo4j", "Graph Algorithms"] },
      { category: "AI/LLM", technologies: ["Claude API", "Function Calling", "RAG"] },
      { category: "Frontend", technologies: ["React", "TypeScript", "Vis.js"] },
      { category: "Data", technologies: ["PostgreSQL", "TimescaleDB", "Apache Spark"] }
    ]
  }
]
