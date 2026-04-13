export interface ProjectData {
  id: string
  slug: string
  title: string
  tagline: string
  role: string
  timeline: string
  category: string
  icon: string
  accent: string
  shortDescription: string
  outcome: string
  tags: string[]
  /** Hero image for the portfolio gallery — path under `public/` (e.g. `/images/projects/{slug}.jpg`). */
  coverImage: string
  coverImageAlt: string
  span?: string
  minH?: string
  impactMetrics: {
    value: string
    label: string
  }[]
  problem: string
  myRole: string
  solution: string
  processSteps?: {
    phase: string
    description: string
  }[]
  metrics: string[]
  keyLearning?: string
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
    tagline: "Reduced false positives by 87% while catching 98% of fraud in real time — protecting $12M+ annually.",
    role: "Lead ML Engineer",
    timeline: "Q1–Q2 2023 · 5 months", // TODO: update with real data
    category: "AI/ML + Compliance",
    icon: "🚨",
    accent: "bg-red-500/15 text-red-600",
    shortDescription: "Real-time anomaly detection system using deep learning to flag suspicious transactions with 99.2% accuracy.",
    outcome: "99.2% accuracy",
    tags: ["Python", "TensorFlow", "Kafka", "Real-time ML"],
    coverImage: "/images/projects/fraud-detection-engine.jpg",
    coverImageAlt:
      "Code and data on a developer screen, suggesting fraud analysis and real-time detection systems.",
    span: "md:col-span-8",
    minH: "min-h-[300px] md:min-h-[340px]",
    impactMetrics: [
      { value: "99.2%", label: "detection accuracy" },
      { value: "87%", label: "fewer false positives" },
      { value: "$12M+", label: "fraud prevented annually" },
      { value: "<100ms", label: "detection latency" },
    ],
    problem: "Legacy fraud detection relied on rule-based systems with ~85% accuracy and 2-3 hour detection latency. Rules-based systems generated 40% false positives, causing customer friction. Banks needed real-time detection with minimal false positives.",
    myRole: "I designed and built the multi-model ensemble architecture, including the LSTM and graph neural network components. I also led the feature engineering work and set up the daily model retraining pipeline, collaborating with compliance stakeholders to balance precision and recall thresholds.", // TODO: update with real data
    solution: "Built a multi-model ensemble combining LSTM neural networks for behavioral patterns, XGBoost for transaction features, and graph neural networks for ring detection. Implemented streaming pipeline using Kafka for sub-100ms latency. Model retrained daily on new transaction patterns.",
    processSteps: [
      { phase: "Discovery", description: "Audited existing rule sets and interviewed compliance analysts to map false-positive failure modes." },
      { phase: "Modelling", description: "Experimented with LSTM, XGBoost, and graph neural networks; selected ensemble approach via A/B on holdout data." },
      { phase: "Pipeline", description: "Built Kafka streaming ingest and sub-100ms scoring service with feature store backed by Redis." },
      { phase: "Deployment", description: "Shadow-ran new model alongside legacy system for 4 weeks before full cutover with monitoring dashboards." },
    ],
    metrics: [
      "99.2% detection accuracy (up from 85%)",
      "87% reduction in false positives (40% → 5%)",
      "98% of fraud caught within 2 minutes",
      "$12M+ in fraud prevented annually",
      "Scales to 10M+ transactions per day",
    ],
    keyLearning: "Ensemble models are only as good as your retraining loop — the biggest accuracy gains came not from model architecture but from a daily feedback pipeline that fed confirmed fraud labels back into training within 24 hours.",
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
    tagline: "Reduced settlement time from 24 hours to under 2 seconds, processing $50B+ annually at 99.99% uptime.",
    role: "Principal Engineer — Distributed Systems",
    timeline: "Q3 2022–Q1 2023 · 6 months", // TODO: update with real data
    category: "Real-time Systems",
    icon: "⚡",
    accent: "bg-yellow-500/15 text-yellow-600",
    shortDescription: "Core infrastructure for real-time gross settlement. Handles payment routing, ledger updates, and compliance checks atomically with 5,000+ tx/sec throughput.",
    outcome: "5,000+ tx/sec",
    tags: ["Go", "PostgreSQL", "Event Sourcing", "Distributed Systems"],
    coverImage: "/images/projects/payment-settlement-platform.jpg",
    coverImageAlt: "Hands using a smartphone for a digital payment, suggesting instant settlement flows.",
    span: "md:col-span-8",
    minH: "min-h-[300px] md:min-h-[340px]",
    impactMetrics: [
      { value: "5,000+", label: "transactions per second" },
      { value: "<2s", label: "settlement time (was 24h)" },
      { value: "99.99%", label: "uptime SLA" },
      { value: "35%", label: "operational cost reduction" },
    ],
    problem: "Traditional payment systems batch-process transactions every 4-24 hours, causing working capital issues and poor customer experience. Existing batch systems couldn't handle real-time demand. Scaling required complex infrastructure changes and introduced reconciliation delays.",
    myRole: "I designed the event-sourced ledger architecture and led the implementation of the distributed consensus layer (Raft). I was responsible for the CQRS write path and worked closely with the product team to define idempotency guarantees and failure semantics.", // TODO: update with real data
    solution: "Designed event-sourced architecture with atomic ledger updates using distributed consensus (Raft). Implemented CQRS pattern with writes through event log and reads from denormalized views. Built modular payment routing engine. Used saga pattern for multi-step transactions.",
    processSteps: [
      { phase: "Architecture", description: "Mapped the existing batch settlement flow, identified consistency boundaries, and chose event sourcing + CQRS as the durability model." },
      { phase: "Consensus Layer", description: "Implemented Raft-based distributed ledger to guarantee atomic ledger updates across replicas." },
      { phase: "Routing Engine", description: "Built parallel rule-evaluation engine for payment routing with circuit breakers and timeout strategies." },
      { phase: "Migration", description: "Ran dual-write period for 8 weeks, comparing settlement results between old and new systems before full cutover." },
    ],
    metrics: [
      "5,000+ transactions per second sustained throughput",
      "<2 second settlement (vs 4–24 hours previously)",
      "99.99% uptime SLA achieved",
      "Zero transaction losses — 100% durability",
      "35% reduction in operational costs",
      "$50B+ processed annually",
    ],
    keyLearning: "The hardest part of real-time settlement isn't throughput — it's defining exactly-once semantics across failure modes. Getting the idempotency keys right at every saga step saved us from a class of subtle double-credit bugs that only surface under network partition.",
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
    tagline: "Cut customer onboarding from 3 days to 5 minutes while maintaining 99.5% accuracy across 100k+ applications.",
    role: "Lead Engineer — AI/Compliance",
    timeline: "Q4 2022–Q1 2023 · 4 months", // TODO: update with real data
    category: "Compliance + Automation",
    icon: "🔍",
    accent: "bg-blue-500/15 text-blue-600",
    shortDescription: "End-to-end identity verification and sanctions screening. Reduced customer onboarding from 2-3 days to under 5 minutes while maintaining 99.5% accuracy.",
    outcome: "35% faster onboarding",
    tags: ["Node.js", "Redis", "OCR/LLM", "PostgreSQL"],
    coverImage: "/images/projects/kyc-aml-automation.jpg",
    coverImageAlt: "Laptop and documents on a desk, representing identity verification and compliance review.",
    span: "md:col-span-4",
    minH: "min-h-[280px] md:min-h-[340px]",
    impactMetrics: [
      { value: "5 min", label: "onboarding time (was 3 days)" },
      { value: "87%", label: "auto-approved without review" },
      { value: "99.5%", label: "document extraction accuracy" },
      { value: "92%", label: "reduction in manual review queue" },
    ],
    problem: "Manual KYC/AML processes took 2-3 days, creating poor customer experience and causing 25% signup abandonment. Compliance team manually reviewed documents, which was error-prone and didn't scale.",
    myRole: "I built the document ingestion pipeline (OCR + LLM field extraction) and the risk-scoring model that gates automatic approval. I also designed the sanctions screening fuzzy-matching layer and worked with compliance officers to set the risk thresholds.", // TODO: update with real data
    solution: "Built automated pipeline with OCR/LLM document ingestion, multi-source identity verification, real-time sanctions screening, and a risk-scoring model for gated approval. Redis caching delivers sub-10ms sanctions lookups.",
    processSteps: [
      { phase: "Research", description: "Interviewed compliance officers and mapped every manual step; identified OCR and sanctions screening as the highest-leverage automation targets." },
      { phase: "Document Pipeline", description: "Built OCR + Claude API extraction layer that pulls structured fields from passports, utility bills, and bank statements." },
      { phase: "Risk Model", description: "Trained gradient-boosted model on historical approvals/rejections to score documents and route to auto-approve, review, or reject." },
      { phase: "Compliance Sign-off", description: "Ran parallel manual reviews for 3 weeks to validate model decisions before switching to automated flow." },
    ],
    metrics: [
      "Onboarding reduced from 3 days to under 5 minutes",
      "99.5% document extraction accuracy",
      "87% of applications auto-approved without human review",
      "92% reduction in manual review queue",
      "100k+ applications processed with zero compliance incidents",
    ],
    keyLearning: "LLM-based document extraction was far more resilient to layout variance than rule-based OCR parsing — but the accuracy gains only materialised once we added a structured validation layer that caught hallucinated field values before they reached the risk model.",
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
    tagline: "Eliminated 30-minute data lag so operations teams could detect and respond to incidents in under 30 seconds.",
    role: "Lead Frontend + Data Engineer",
    timeline: "Q2–Q3 2023 · 4 months", // TODO: update with real data
    category: "Data Engineering + Analytics",
    icon: "📊",
    accent: "bg-green-500/15 text-green-600",
    shortDescription: "Sub-second dashboards for financial operations. Real-time monitoring of payments, fraud alerts, liquidity position for 100+ concurrent users.",
    outcome: "Sub-second latency",
    tags: ["React", "ClickHouse", "WebSocket", "D3.js"],
    coverImage: "/images/projects/real-time-analytics-dashboard.jpg",
    coverImageAlt: "Business analytics dashboard on a screen with charts and KPIs.",
    span: "md:col-span-12",
    minH: "min-h-[240px]",
    impactMetrics: [
      { value: "<1s", label: "query latency on 1M+ events/sec" },
      { value: "30s", label: "incident detection (was 30 min)" },
      { value: "40%", label: "faster operational decisions" },
      { value: "100+", label: "concurrent users at <200ms" },
    ],
    problem: "Legacy reporting dashboards had 30+ minute data latency. Reports were generated hourly via batch jobs. Operations team couldn't react to real-time issues — every decision was based on stale data.",
    myRole: "I designed the end-to-end data pipeline (Kafka → ClickHouse) and built the React/D3.js frontend with WebSocket live updates. I also implemented the incremental aggregation strategy that keeps query latency under one second at scale.", // TODO: update with real data
    solution: "Built Kafka → ClickHouse → WebSocket pipeline with incremental aggregations and pre-computed rollups. React/D3.js frontend with virtual scrolling handles millions of rows at sub-second latency.",
    metrics: [
      "Sub-second query latency on 1M+ events/sec",
      "100+ concurrent users with <200ms updates",
      "Incident detection time: 30 minutes → 30 seconds",
      "Operations team decisions 40% faster",
      "$20B+ daily transaction volume handled",
    ],
    keyLearning: "Pre-computed rollups at multiple granularities were the key architectural decision — they made the difference between a dashboard that felt real-time and one that merely polled. The investment in schema design before any frontend work saved weeks of query performance tuning later.",
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
    tagline: "Decoupled a tightly coupled monolith into 12 independently evolving services with 100M+ events/day and zero data loss.",
    role: "Principal Data Architect",
    timeline: "Q1–Q3 2022 · 7 months", // TODO: update with real data
    category: "Real-time Data Systems",
    icon: "🌊",
    accent: "bg-indigo-500/15 text-indigo-600",
    shortDescription: "Event-driven architecture for transaction processing and audit trails. Decouples systems, enables 100M+ events/day with zero data loss.",
    outcome: "100M+ events/day",
    tags: ["Kafka", "Spark", "Scala", "Data Warehousing"],
    coverImage: "/images/projects/event-streaming-pipeline.jpg",
    coverImageAlt: "Server racks in a data center, representing high-throughput event streaming.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "100M+", label: "events per day" },
      { value: "12", label: "services evolving independently" },
      { value: "0", label: "data loss across all streams" },
      { value: "60%", label: "faster incident diagnosis" },
    ],
    problem: "Tightly coupled monolithic system made it impossible to add new services without breaking existing code. Audit trails were incomplete and unreliable. Regulatory compliance required immutable event logs.",
    myRole: "I led the event schema design and Kafka topic taxonomy, ensuring audit-grade immutability from the start. I also built the stream processors for compliance monitoring and mentored three engineers on the event sourcing patterns used throughout the migration.", // TODO: update with real data
    solution: "Migrated to Kafka-backbone event-driven architecture. Each domain publishes immutable events; multiple consumers (audit, analytics, compliance) process streams independently. Stream processors handle real-time aggregations and transformations.",
    metrics: [
      "100M+ events processed per day across 10+ topic streams",
      "At-least-once delivery guarantee — zero data loss",
      "12 services now evolve independently",
      "100% complete compliance audit trail",
      "60% faster incident diagnosis",
    ],
    keyLearning: "Schema registry adoption was the single highest-leverage investment of the entire migration. Without enforced schemas, a single producer change would silently break every downstream consumer — with it, breaking changes became compile-time errors across team boundaries.",
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
    tagline: "87% of customers onboard without any human touch — cutting time from 3 days to 8 hours and achieving 95% satisfaction.",
    role: "Lead AI Systems Engineer",
    timeline: "Q3–Q4 2023 · 4 months", // TODO: update with real data
    category: "AI/Agentic Systems",
    icon: "🤖",
    accent: "bg-purple-500/15 text-purple-600",
    shortDescription: "Multi-step agentic system that autonomously handles document collection, verification, and account creation. 87% fully autonomous completion.",
    outcome: "2-3x faster",
    tags: ["LLM APIs", "RAG", "Function Calling", "Node.js"],
    coverImage: "/images/projects/ai-customer-onboarding-agent.jpg",
    coverImageAlt: "Abstract AI neural visualization suggesting autonomous agent workflows.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "87%", label: "fully autonomous completions" },
      { value: "2-8h", label: "onboarding time (was 2-3 days)" },
      { value: "95%", label: "customer satisfaction" },
      { value: "5k+", label: "onboardings processed autonomously" },
    ],
    problem: "Customer onboarding required multiple manual steps with an average time of 2-3 days. High abandonment rate due to friction. Inconsistent experience across customers.",
    myRole: "I designed the ReAct-pattern agent loop, the function-calling tool schema, and the memory system for multi-turn context. I also built the escalation logic that routes edge cases to human agents and defined the confidence thresholds for autonomous decision-making.", // TODO: update with real data
    solution: "Built agentic system using Claude API with function calling and ReAct reasoning. Agent collects documents, looks up customer data via RAG, makes verification decisions, and triggers account creation — escalating to humans only on true edge cases.",
    processSteps: [
      { phase: "Tool Design", description: "Mapped every step a human agent performs and converted each into a typed function-calling tool the LLM could invoke." },
      { phase: "Memory Architecture", description: "Built conversation memory that persists across sessions so customers can resume onboarding without re-submitting documents." },
      { phase: "Confidence Thresholds", description: "Ran 500 shadowed conversations to calibrate the confidence scores that separate auto-approve, re-ask, and escalate paths." },
      { phase: "Monitoring", description: "Built real-time dashboard tracking autonomous completion rate, escalation causes, and CSAT to drive continuous improvement." },
    ],
    metrics: [
      "2–3× faster onboarding: 2-3 days → 2-8 hours",
      "87% of customers complete without human intervention",
      "Less than 1% escalation rate",
      "95% customer satisfaction score",
      "5,000+ onboardings processed autonomously",
    ],
    keyLearning: "The biggest reliability gain came from structured output validation, not prompt engineering. Enforcing JSON schemas on every tool call output — rather than trusting free-form LLM responses — eliminated an entire class of runtime failures that had plagued earlier prototype iterations.",
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
    tagline: "Raised approval rates by 23% while simultaneously cutting default risk — adding $15M+ in annual revenue.",
    role: "Lead ML Engineer — Credit",
    timeline: "Q2–Q3 2022 · 5 months", // TODO: update with real data
    category: "AI/ML + Finance",
    icon: "💳",
    accent: "bg-orange-500/15 text-orange-600",
    shortDescription: "ML-driven credit model replacing legacy rules. Improved approval rate by 23% while reducing default risk by 15%.",
    outcome: "23% approval uplift",
    tags: ["Python", "XGBoost", "Feature Engineering", "MLOps"],
    coverImage: "/images/projects/credit-risk-underwriting.jpg",
    coverImageAlt: "Financial charts and trading interfaces on monitors.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "23%", label: "approval rate uplift (65% → 88%)" },
      { value: "15%", label: "reduction in default rate" },
      { value: "$15M+", label: "added annual revenue" },
      { value: "92%", label: "AUC on holdout test set" },
    ],
    problem: "Legacy rule-based credit model had 65% approval rate but high default rate (8%). Static rules rejected creditworthy customers and couldn't capture complex behavioral patterns.",
    myRole: "I led the feature engineering pipeline (200+ features from transaction history and credit bureau data) and was responsible for model explainability via SHAP values — critical for satisfying regulatory requirements. I also designed the MLOps retraining pipeline with model drift monitoring.", // TODO: update with real data
    solution: "Built XGBoost-based credit model with 200+ engineered features. Used SHAP values for regulatory explainability. Implemented MLflow retraining pipeline with drift monitoring to keep the model current with market changes.",
    metrics: [
      "Approval rate improved: 65% → 88% (+23%)",
      "Default rate reduced: 8% → 6.8% (-15%)",
      "100ms prediction latency",
      "92% AUC on holdout test set",
      "$15M+ added annual revenue",
    ],
    keyLearning: "Model explainability via SHAP wasn't just a compliance checkbox — it became the primary tool for catching training data biases before they reached production. Two features we initially included were quietly discriminating against thin-file applicants; SHAP made that visible.",
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
    tagline: "Replaced a fragile monolith with 12 independently deployable services, achieving 99.99% SLA and 10× faster deployments.",
    role: "Principal Architect",
    timeline: "Q4 2021–Q2 2022 · 7 months", // TODO: update with real data
    category: "Cloud-native Architecture",
    icon: "🏗️",
    accent: "bg-cyan-500/15 text-cyan-600",
    shortDescription: "Modular API-first design with 12+ independent microservices. Each service independently deployable and scalable with 99.99% SLA.",
    outcome: "99.99% SLA",
    tags: ["TypeScript", "Node.js", "Kubernetes", "gRPC"],
    coverImage: "/images/projects/api-first-banking-microservices.jpg",
    coverImageAlt: "Rows of servers in a modern data center, suggesting cloud-native microservices.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "99.99%", label: "SLA (was 98%)" },
      { value: "10×", label: "faster feature deployments" },
      { value: "12", label: "independently deployable services" },
      { value: "100k+", label: "concurrent users supported" },
    ],
    problem: "Monolithic banking system was tightly coupled — one bug took down the entire platform. Scaling and deployment required coordinating across all teams, making feature velocity very slow.",
    myRole: "I designed the service decomposition strategy and the API gateway, and led the gRPC contract definitions between services. I also established the shared observability stack (Jaeger, Prometheus) and the GitOps deployment workflow that enables each team to deploy independently.", // TODO: update with real data
    solution: "Decomposed monolith into 12 domain-owned microservices with API gateway routing. gRPC for synchronous service-to-service communication, Kafka for async messaging. GitOps deployment via ArgoCD enables independent team delivery.",
    metrics: [
      "99.99% SLA achieved (up from 98%)",
      "<50ms p99 latency on critical paths",
      "10× faster feature deployments",
      "12 services with independent deploy cadence",
      "Scales to 100k+ concurrent users",
    ],
    keyLearning: "Service decomposition succeeds or fails on data ownership, not code structure. Every team fight we had during migration traced back to unclear ownership of a database table. Defining bounded contexts in data before touching code made the second half of the migration dramatically smoother.",
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
    tagline: "Achieved 98% money laundering detection accuracy with zero false positives on high-confidence alerts — saving $50M+ in identified suspicious patterns.",
    role: "Lead AI Engineer — Compliance",
    timeline: "Q1–Q2 2024 · 5 months", // TODO: update with real data
    category: "Compliance + AI",
    icon: "⚖️",
    accent: "bg-slate-500/15 text-slate-600",
    shortDescription: "Smart network analysis combined with LLM reasoning to detect money laundering patterns. 98% detection accuracy with zero false positives on high-confidence alerts.",
    outcome: "98% detection",
    tags: ["Python", "LLM APIs", "Graph DB", "React"],
    coverImage: "/images/projects/compliance-risk-monitoring.jpg",
    coverImageAlt: "Law books and a gavel, suggesting compliance and regulatory monitoring.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "98%", label: "detection accuracy" },
      { value: "0", label: "false positives on high-confidence alerts" },
      { value: "$50M+", label: "in suspicious patterns identified" },
      { value: "75%", label: "reduction in compliance review time" },
    ],
    problem: "Legacy AML systems flagged 40% of transactions as suspicious. Rules-based approaches miss sophisticated laundering rings and create an unsustainable false-positive burden on compliance teams.",
    myRole: "I designed the multi-layer detection architecture — graph analysis for ring detection, ML scoring for risk, and Claude API for explainable reasoning. I led the integration with the regulator-facing reporting layer and ensured the system met audit trail requirements.", // TODO: update with real data
    solution: "Three-layer detection: Neo4j graph analysis for ring detection → ML risk scoring → Claude API with function calling for explainable reasoning. Full audit trail for regulatory reporting.",
    metrics: [
      "98% detection accuracy on real money laundering cases",
      "$50M+ in suspicious patterns identified",
      "Zero false positives on high-confidence alerts",
      "75% reduction in compliance team review time",
      "Full explainability for regulatory audits",
    ],
    keyLearning: "Combining graph analysis with LLM reasoning unlocks a capability neither approach has alone: the graph finds structurally suspicious rings that ML misses, and the LLM provides the narrative reasoning that compliance officers and regulators need to act on the alert.",
    techStack: [
      { category: "Backend", technologies: ["Python", "FastAPI", "Node.js"] },
      { category: "Graphs", technologies: ["Neo4j", "Graph Algorithms"] },
      { category: "AI/LLM", technologies: ["Claude API", "Function Calling", "RAG"] },
      { category: "Frontend", technologies: ["React", "TypeScript", "Vis.js"] },
      { category: "Data", technologies: ["PostgreSQL", "TimescaleDB", "Apache Spark"] }
    ]
  },
  {
    id: "10",
    slug: "ecommerce-product-search-recommendations",
    title: "ML-Powered Product Search & Recommendations",
    tagline: "Lifted product discovery conversion by 35% and average order value by 18% through semantic search and real-time personalisation.",
    role: "Lead ML + Frontend Engineer",
    timeline: "Q3–Q4 2023 · 4 months", // TODO: update with real data
    category: "Ecommerce + AI/ML",
    icon: "🔍",
    accent: "bg-blue-500/15 text-blue-600",
    shortDescription: "Semantic search and real-time personalized recommendations engine. Improved product discovery conversion by 35% and average order value by 18%.",
    outcome: "18% AOV increase",
    tags: ["Python", "Elasticsearch", "ML Models", "Real-time"],
    coverImage: "/images/projects/ecommerce-product-search-recommendations.jpg",
    coverImageAlt: "Retail shopping bags and ecommerce context suggesting product discovery and recommendations.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "35%", label: "discovery conversion lift" },
      { value: "18%", label: "average order value increase" },
      { value: "28%", label: "lower search bounce rate" },
      { value: "40%", label: "faster time-to-find" },
    ],
    problem: "Traditional keyword search caused 25% cart abandonment from customers unable to find relevant products. Static rule-based recommendations couldn't personalise to individual behaviour.",
    myRole: "I designed the semantic search layer using BERT embeddings and led the real-time collaborative filtering implementation. I also built the A/B testing framework used to validate all recommendation improvements before full rollout.", // TODO: update with real data
    solution: "Multi-layer discovery: BERT semantic search → real-time collaborative filtering → contextual ranking on behavioural signals. Redis caching delivers sub-100ms search latency.",
    metrics: [
      "35% lift in product discovery conversion",
      "18% increase in average order value",
      "28% lower search results bounce rate",
      "40% faster time-to-find (3+ min → <2 min)",
      "5M+ search queries daily at sub-100ms latency",
    ],
    keyLearning: "Semantic search immediately outperformed keyword search on recall, but precision required a contextual re-ranking layer on top. The hybrid approach — semantic retrieval followed by behavioural re-ranking — consistently outperformed either strategy alone across all A/B test cohorts.",
    techStack: [
      { category: "ML/AI", technologies: ["Python", "TensorFlow", "Scikit-learn", "LangChain"] },
      { category: "Search", technologies: ["Elasticsearch", "Vector DBs", "BERT Embeddings"] },
      { category: "Real-time", technologies: ["Redis", "Apache Kafka", "Node.js"] },
      { category: "Backend", technologies: ["Python", "FastAPI", "PostgreSQL"] },
      { category: "Frontend", technologies: ["React", "TypeScript"] }
    ]
  },
  {
    id: "11",
    slug: "high-performance-ecommerce-checkout",
    title: "High-Performance Checkout with Fraud Prevention",
    tagline: "Reduced fraud by 94% and checkout abandonment by 12% simultaneously — with no perceptible latency increase.",
    role: "Lead Engineer — Payments & Security",
    timeline: "Q4 2022–Q1 2023 · 5 months", // TODO: update with real data
    category: "Ecommerce + Security",
    icon: "💳",
    accent: "bg-orange-500/15 text-orange-600",
    shortDescription: "Sub-200ms checkout with AI fraud prevention. Reduced fraud by 94% while improving checkout conversion by 12%.",
    outcome: "94% fraud reduction",
    tags: ["Go", "ML Models", "Real-time", "Payment Processing"],
    coverImage: "/images/projects/high-performance-ecommerce-checkout.jpg",
    coverImageAlt: "Contactless payment terminal suggesting fast, secure checkout flows.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "94%", label: "fraud reduction" },
      { value: "$3.8M+", label: "annual fraud savings" },
      { value: "12%", label: "checkout conversion improvement" },
      { value: "<200ms", label: "total checkout latency" },
    ],
    problem: "Dual pressures: $4M+ annual fraud losses and 12% checkout abandonment caused by an 8-second fraud detection step. Needed sub-200ms fraud decisions without weakening security.",
    myRole: "I designed and implemented the sub-50ms Go decision engine, including the multi-model ensemble orchestration and the async post-purchase verification path. I also set the feature vector design for device fingerprinting and velocity checks.", // TODO: update with real data
    solution: "Multi-model ensemble decision engine in Go delivers sub-50ms fraud scores inline with checkout. Edge cases handled async via OTP challenge post-purchase. Model retrained daily on new fraud patterns.",
    metrics: [
      "94% fraud reduction ($3.8M+ annual savings)",
      "12% checkout conversion improvement",
      "<200ms total checkout flow (was 8+ seconds)",
      "$500M+ annual transaction volume processed",
      "2% false positive rate (industry avg 8-15%)",
    ],
    keyLearning: "The async post-purchase OTP path was the breakthrough insight — it let us apply high-friction verification to genuinely suspicious orders without blocking the checkout flow for normal customers. Separating the fraud decision from the user-facing friction unlocked both security and conversion improvements simultaneously.",
    techStack: [
      { category: "Backend", technologies: ["Go", "gRPC", "Protocol Buffers"] },
      { category: "ML/Fraud", technologies: ["Python", "XGBoost", "TensorFlow", "Scikit-learn"] },
      { category: "Payment", technologies: ["Stripe API", "Payment Gateways", "Tokenization"] },
      { category: "Infrastructure", technologies: ["Kubernetes", "Redis", "Apache Kafka"] },
      { category: "Monitoring", technologies: ["Prometheus", "Datadog", "Grafana"] }
    ]
  },
  {
    id: "12",
    slug: "distributed-order-fulfillment",
    title: "Distributed Order Fulfillment & Inventory Management",
    tagline: "Cut average delivery time from 5 days to 2 hours and eliminated overselling entirely across 5 warehouses.",
    role: "Lead Systems Architect",
    timeline: "Q2–Q4 2023 · 6 months", // TODO: update with real data
    category: "Ecommerce + Real-time",
    icon: "📦",
    accent: "bg-green-500/15 text-green-600",
    shortDescription: "Real-time inventory sync across warehouses with intelligent routing. Achieved 2-hour average delivery and zero overselling at scale.",
    outcome: "2-hour delivery",
    tags: ["Kafka", "Event Sourcing", "Microservices", "Node.js"],
    coverImage: "/images/projects/distributed-order-fulfillment.jpg",
    coverImageAlt: "Stacked shipping boxes suggesting order fulfillment and logistics operations.",
    span: "md:col-span-12",
    minH: "min-h-[240px]",
    impactMetrics: [
      { value: "2h", label: "average delivery (was 3-5 days)" },
      { value: "99.5%", label: "orders fulfilled without cancellation" },
      { value: "25%", label: "lower operational costs" },
      { value: "0", label: "inventory write-offs" },
    ],
    problem: "10k+ daily orders across 5 warehouses with 3-5 day delivery, frequent overselling leading to customer cancellations, and $2M+ annual inventory write-offs from manual reconciliation.",
    myRole: "I designed the event-sourced inventory ledger and the intelligent routing engine that evaluates distance, stock, and warehouse load in real time. I also led the saga-pattern workflow design for multi-step fulfillment and the logistics partner API integrations.", // TODO: update with real data
    solution: "Event-sourced real-time inventory ledger with intelligent routing engine. Saga-pattern workflows manage pick → pack → ship → deliver. Logistics partner APIs provide live shipment tracking across all providers.",
    metrics: [
      "Average delivery: 3-5 days → 2 hours (same-day in metro areas)",
      "99.5% orders fulfilled without cancellation (zero overselling)",
      "Zero inventory write-offs",
      "10k+ orders per day at 99.9% success rate",
      "25% reduction in operational costs",
    ],
    keyLearning: "Event sourcing for inventory was the right choice for correctness, but the projection queries needed careful design. We learned to never compute available-to-promise on the raw event log at query time — pre-maintaining a materialised view of stock counts made the difference between sub-millisecond and multi-second routing decisions.",
    techStack: [
      { category: "Event Streaming", technologies: ["Apache Kafka", "Kafka Streams", "Schema Registry"] },
      { category: "Backend", technologies: ["Node.js", "TypeScript", "Express", "GraphQL"] },
      { category: "Database", technologies: ["PostgreSQL", "Redis", "TimescaleDB"] },
      { category: "Logistics", technologies: ["Geospatial APIs", "Routing Engines", "3PL Integrations"] },
      { category: "Observability", technologies: ["Jaeger", "Prometheus", "ELK"] }
    ]
  },
  {
    id: "13",
    slug: "real-time-api-attack-detection",
    title: "Real-Time API Attack Detection & Response",
    tagline: "Slashed attack detection time from 200+ days to under 5 minutes and automated remediation for 94% of incidents.",
    role: "Lead Security Engineer — AI",
    timeline: "Q1–Q3 2024 · 6 months", // TODO: update with real data
    category: "Cybersecurity + AI",
    icon: "🛡️",
    accent: "bg-red-500/15 text-red-600",
    shortDescription: "Behavioral anomaly detection for API attacks with <1 second detection and automated remediation. Detected 98% of attacks before exploitation.",
    outcome: "98% detection",
    tags: ["Python", "Graph DB", "ML Models", "Real-time"],
    coverImage: "/images/projects/real-time-api-attack-detection.jpg",
    coverImageAlt: "Hands on a laptop keyboard suggesting secure engineering and API threat monitoring.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "98%", label: "attacks detected" },
      { value: "<1s", label: "detection latency" },
      { value: "200d → 5m", label: "median detection time" },
      { value: "94%", label: "incidents auto-remediated" },
    ],
    problem: "Enterprises had no visibility into API attack patterns. Traditional WAFs missed sophisticated attacks. Industry median detection time was 200+ days — by then, attackers had already exfiltrated data.",
    myRole: "I designed the graph-based behavioral model and the ML anomaly scorer, and built the automated remediation engine that issues rate limits and session terminations without human approval. I also defined the LLM-assisted alert triage pipeline that reduces false positive burden on the security team.", // TODO: update with real data
    solution: "Neo4j graph models API call patterns and identifies anomalous behaviour. ML scorer flags deviations. Automated remediation engine handles 94% of incidents. LLM triage reduces false-positive burden on security analysts.",
    metrics: [
      "98% of attack attempts detected",
      "<1 second detection latency",
      "Median detection time: 200+ days → under 5 minutes",
      "87 unique attack patterns identified in first 6 months",
      "94% of attacks auto-remediated before data loss",
      "$2M+ in breach costs prevented",
    ],
    keyLearning: "The graph database was essential for catching lateral movement — pattern-matching on individual API calls misses attacks that look normal in isolation but are obviously malicious as a sequence. Framing the problem as graph anomaly detection rather than endpoint anomaly detection was the conceptual shift that unlocked the high detection rate.",
    techStack: [
      { category: "Backend", technologies: ["Python", "FastAPI", "Node.js"] },
      { category: "Graphs", technologies: ["Neo4j", "Graph Algorithms", "Cypher"] },
      { category: "ML/AI", technologies: ["TensorFlow", "Scikit-learn", "Claude API", "LLM"] },
      { category: "Real-time", technologies: ["Apache Kafka", "Redis", "WebSocket"] },
      { category: "Security", technologies: ["WAF Integration", "SIEM", "Incident Response APIs"] }
    ]
  },
  {
    id: "14",
    slug: "data-breach-forensics-ai",
    title: "Data Breach Detection & Forensic Analysis",
    tagline: "Compressed breach detection from 210 days to 2 hours — a 100× improvement — with full attacker timeline reconstruction.",
    role: "Lead AI Engineer — Security",
    timeline: "Q3–Q4 2023 · 5 months", // TODO: update with real data
    category: "Cybersecurity + Compliance",
    icon: "🔎",
    accent: "bg-purple-500/15 text-purple-600",
    shortDescription: "LLM-powered breach forensics identifying root cause, attacker identity, and data exposed. Reduced detection time from 6 months to 2 hours.",
    outcome: "6 months → 2 hours",
    tags: ["Python", "LLM APIs", "Graph Analysis", "Forensics"],
    coverImage: "/images/projects/data-breach-forensics-ai.jpg",
    coverImageAlt: "Digital security and access concept suggesting breach detection and forensic analysis.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "100×", label: "faster breach detection" },
      { value: "2h", label: "to root cause (was 210 days)" },
      { value: "3×", label: "faster incident response" },
      { value: "100%", label: "root cause identified on all incidents" },
    ],
    problem: "Median breach detection time of 210 days. By then attackers had already exfiltrated data, pivoted laterally, and sold credentials. No tooling to reconstruct the attacker timeline or answer the 'what was stolen?' question quickly enough for regulators.",
    myRole: "I built the data access audit aggregation layer, the behavioral baseline system, and the Claude API forensics engine with function calling. I also designed the automated incident timeline generator used for GDPR/CCPA regulatory reporting.", // TODO: update with real data
    solution: "Aggregated audit logs from all sources feed a behavioral baseline. Graph analysis maps attacker lateral movement. Claude API with function calling produces a narrative breach explanation and automated incident timeline for regulatory reporting.",
    metrics: [
      "Detection time: 210 days → 2 hours (100× improvement)",
      "Root cause identified in 100% of incidents",
      "Full attacker timeline generated automatically",
      "3× faster incident response",
      "Qualified for GDPR/CCPA fast-response exception, reducing fines",
    ],
    keyLearning: "LLMs are uniquely suited for forensic narrative generation because breaches are fundamentally stories — sequences of events with causality and intent. The model doesn't just summarise logs; it reasons about attacker motivation and reconstructs decision points. That narrative layer was what made the reports actionable for non-technical stakeholders and regulators.",
    techStack: [
      { category: "Backend", technologies: ["Python", "FastAPI", "Node.js"] },
      { category: "AI/LLM", technologies: ["Claude API", "Function Calling", "Prompt Engineering"] },
      { category: "Graphs", technologies: ["Neo4j", "Graph Algorithms"] },
      { category: "Data", technologies: ["TimescaleDB", "Elasticsearch", "S3"] },
      { category: "SIEM", technologies: ["Splunk", "Datadog", "CloudWatch"] }
    ]
  },
  {
    id: "15",
    slug: "cloud-security-compliance-automation",
    title: "Cloud Security Posture & Compliance Automation",
    tagline: "Achieved 87% fewer security incidents and continuous SOC2/ISO compliance — reducing audit prep from 40 hours to 2 hours.",
    role: "Lead Cloud Security Engineer",
    timeline: "Q2–Q3 2023 · 5 months", // TODO: update with real data
    category: "Cybersecurity + Compliance",
    icon: "☁️",
    accent: "bg-cyan-500/15 text-cyan-600",
    shortDescription: "Automated cloud security scanning, remediation, and compliance proof-gathering. Maintained continuous SOC2/ISO compliance with 87% fewer incidents.",
    outcome: "87% fewer incidents",
    tags: ["Python", "Kubernetes", "Policy-as-Code", "Automation"],
    coverImage: "/images/projects/cloud-security-compliance-automation.jpg",
    coverImageAlt: "Abstract technology and connectivity imagery suggesting cloud-scale systems and security posture.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "87%", label: "fewer security incidents" },
      { value: "2h", label: "audit prep (was 40 hours)" },
      { value: "$1.2M+", label: "in compliance fines prevented" },
      { value: "5×", label: "faster cloud deployments" },
    ],
    problem: "Manual cloud security audits ran twice a year and took 40+ hours each, yet still missed misconfigurations that were discovered months later. Regulators increasingly required continuous compliance evidence, not point-in-time snapshots.",
    myRole: "I designed the policy-as-code enforcement layer and the automated compliance evidence pipeline. I also built the real-time auto-remediation rules for the most common misconfigurations and integrated the scanning results into the CI/CD deployment gate.", // TODO: update with real data
    solution: "Policy-as-code gate at deployment prevents non-compliant infrastructure from reaching production. Continuous scanning auto-remediates common misconfigurations. Automated evidence gathering produces compliance reports in hours, not weeks.",
    metrics: [
      "87% reduction in security incidents",
      "Continuous SOC2 and ISO 27001 compliance",
      "Audit prep: 40 hours → 2 hours",
      "$1.2M+ in compliance fines prevented",
      "5× faster cloud deployments",
    ],
    keyLearning: "Shifting compliance left into the CI/CD pipeline transformed it from a periodic audit exercise into an engineering quality gate. The cultural change — teams feeling ownership of their security posture rather than dreading the compliance team — was as valuable as the technical automation itself.",
    techStack: [
      { category: "Cloud", technologies: ["AWS", "GCP", "Terraform"] },
      { category: "Backend", technologies: ["Python", "FastAPI", "Node.js"] },
      { category: "Infrastructure", technologies: ["Kubernetes", "Docker", "ArgoCD"] },
      { category: "Policy", technologies: ["Rego (OPA)", "Kyverno", "Policy-as-Code"] },
      { category: "Monitoring", technologies: ["Prometheus", "Grafana", "CloudTrail", "VPC Flow Logs"] }
    ]
  },
  {
    id: "16",
    slug: "landing-page-website",
    title: "Multi-Purpose Landing Page & Marketing Website",
    tagline: "Launched in 3 weeks with a 35% email conversion rate, page-1 keyword ranking in 2 months, and a 98/100 mobile score.",
    role: "Full-Stack Engineer + Consultant",
    timeline: "3 weeks · 2023", // TODO: update with real data
    category: "Web",
    icon: "🌐",
    accent: "bg-blue-500/15 text-blue-600",
    shortDescription: "Fast, optimized landing pages that convert. Built with modern best practices: SEO, analytics, A/B testing ready. Launch in 2-4 weeks.",
    outcome: "4-week launch",
    tags: ["Next.js", "React", "Tailwind", "Analytics"],
    coverImage: "/images/projects/landing-page-website.jpg",
    coverImageAlt: "Laptop showing charts and analytics, suggesting a high-performing marketing site and measurement.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "3 wks", label: "from kick-off to launch" },
      { value: "35%", label: "visitor-to-email conversion" },
      { value: "98/100", label: "mobile performance score" },
      { value: "1.2s", label: "page load time" },
    ],
    problem: "Client needed a professional, high-converting site in weeks, not months, at a fraction of agency cost — without sacrificing performance or SEO quality.",
    myRole: "I led end-to-end delivery: architecture, design, development, and SEO strategy. I also set up the analytics stack and A/B testing framework so the client could run campaigns independently after handover.", // TODO: update with real data
    solution: "Next.js marketing site with built-in analytics, A/B testing, email capture, and SEO optimisation. Deployed on Vercel with headless CMS for easy content updates post-launch.",
    metrics: [
      "Launched in 3 weeks (vs 8+ weeks for traditional agency)",
      "1.2 second page load time",
      "35% visitor-to-email conversion rate",
      "Mobile performance score: 98/100",
      "Page 1 keyword ranking within 2 months",
      "Cost: $8k (vs $15k+ agency quote)",
    ],
    keyLearning: "The biggest ROI came from spending the first week on conversion architecture — mapping the user journey and placing CTAs before writing a line of code. Sites that start with design instead of conversion strategy almost always require expensive rework after launch.",
    techStack: [
      { category: "Frontend", technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
      { category: "CMS", technologies: ["Contentful", "Markdown", "Config-driven"] },
      { category: "Analytics", technologies: ["Google Analytics", "Mixpanel", "Hotjar"] },
      { category: "Integrations", technologies: ["Mailchimp", "Stripe (for payments)", "Calendly"] },
      { category: "Hosting", technologies: ["Vercel", "AWS S3", "CloudFront"] }
    ]
  },
  {
    id: "17",
    slug: "hr-management-system",
    title: "Custom HR Management System",
    tagline: "Eliminated 15 hours/week of manual HR data entry and reduced leave approval from 5 days to 1 hour.",
    role: "Lead Full-Stack Engineer",
    timeline: "Q1–Q2 2023 · 4 months", // TODO: update with real data
    category: "Internal Systems",
    icon: "👥",
    accent: "bg-green-500/15 text-green-600",
    shortDescription: "In-house HR system: employee directory, attendance, leave management, payroll integration. Replaced 3 disconnected tools with one unified platform.",
    outcome: "3 tools → 1",
    tags: ["React", "Node.js", "PostgreSQL", "Automation"],
    coverImage: "/images/projects/hr-management-system.jpg",
    coverImageAlt: "HR management dashboard showing employee records and analytics.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "15h/wk", label: "manual data entry eliminated" },
      { value: "40%", label: "reduction in HR admin overhead" },
      { value: "5 days → 1h", label: "leave approval cycle" },
      { value: "3 → 1", label: "tools consolidated" },
    ],
    problem: "80-person company using three disconnected tools (Excel, ADP, Google Contacts) with no single source of truth. 15 hours/week lost to manual data entry and error reconciliation.",
    myRole: "I designed the unified data model, built the full stack (React + Node.js + GraphQL), and delivered the payroll sync integration with ADP and Gusto APIs. I also built the custom reporting layer that managers use for headcount and turnover analysis.", // TODO: update with real data
    solution: "Unified React + Node.js HR platform integrating ADP/Gusto payroll APIs. Automated attendance tracking, leave approvals, and payroll sync eliminate manual workflows. Custom reporting is self-serve for managers.",
    metrics: [
      "15 hours/week of manual data entry eliminated",
      "Leave approval: 5 days → 1 hour",
      "Payroll processing: 2 days → 30 minutes",
      "100% error reduction via single source of truth",
      "40% reduction in HR admin overhead",
    ],
    keyLearning: "The most valuable feature wasn't the one we planned — it was the real-time org chart. Once managers could see reporting structures and headcount changes live, they started using the platform for workforce planning, not just record-keeping. Designing for visibility beyond compliance unlocked the platform's full adoption.",
    techStack: [
      { category: "Frontend", technologies: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "Backend", technologies: ["Node.js", "Express", "GraphQL"] },
      { category: "Database", technologies: ["PostgreSQL", "Redis"] },
      { category: "Integrations", technologies: ["ADP API", "Gusto API", "Badge systems", "Email"] },
      { category: "Deployment", technologies: ["Docker", "AWS EC2", "GitHub Actions"] }
    ]
  },
  {
    id: "18",
    slug: "payroll-management-system",
    title: "Payroll Processing & Accounting Integration",
    tagline: "Cut payroll processing from 40 hours to 20 minutes per month with zero errors — eliminating $3k/month in outsourcing fees.",
    role: "Lead Engineer — Finance Systems",
    timeline: "Q3–Q4 2022 · 4 months", // TODO: update with real data
    category: "Internal Systems",
    icon: "💰",
    accent: "bg-yellow-500/15 text-yellow-600",
    shortDescription: "Automated payroll with tax compliance, GL integration, reporting. Reduced processing time from 2 days to 20 minutes, eliminated errors.",
    outcome: "2 days → 20 min",
    tags: ["Python", "PostgreSQL", "Compliance", "Automation"],
    coverImage: "/images/projects/payroll-management-system.jpg",
    coverImageAlt: "Coins and currency suggesting payroll, compensation, and financial compliance.",
    span: "md:col-span-6",
    minH: "min-h-[260px]",
    impactMetrics: [
      { value: "20 min", label: "payroll processing (was 40h/month)" },
      { value: "0%", label: "error rate (was 8%)" },
      { value: "$3k/mo", label: "outsourcing fees eliminated" },
      { value: "100%", label: "on-time tax filing" },
    ],
    problem: "200-person company with manual Excel-based payroll: 8% error rate, 40 hours/month of reconciliation, and GL entries created days late — causing accounting blind spots and compliance risk.",
    myRole: "I built the automated tax calculation engine, the ACH file generation flow, and the QuickBooks GL integration. I also designed the audit trail architecture to meet IRS record-keeping requirements and ran UAT with the finance team before cutover.", // TODO: update with real data
    solution: "Automated payroll engine handles tax calculations, deduction management, and ACH file generation. QuickBooks GL integration creates accounting entries automatically. Audit trail meets IRS requirements.",
    metrics: [
      "Processing time: 40 hours → 20 minutes per month",
      "Error rate: 8% → 0%",
      "$3k/month outsourcing fees eliminated",
      "GL entries created automatically — real-time accounting visibility",
      "100% on-time tax filing, zero audit exceptions",
    ],
    keyLearning: "The 8% error rate wasn't a human failure — it was an information architecture failure. Errors clustered around the same five edge cases (retroactive pay changes, mid-month starts, garnishment order changes) that the Excel template couldn't model cleanly. Building explicit state machines for those edge cases dropped the error rate to zero before we even added automated validation.",
    techStack: [
      { category: "Backend", technologies: ["Python", "FastAPI", "PostgreSQL"] },
      { category: "Tax Engine", technologies: ["Custom rules engine", "Regulation compliance"] },
      { category: "Integrations", technologies: ["HR system API", "QuickBooks API", "Bank APIs (ACH)", "ADP API"] },
      { category: "Reporting", technologies: ["Jasper Reports", "SQL", "PDF generation"] },
      { category: "Security", technologies: ["Encryption", "Audit logging", "Role-based access"] }
    ]
  }
]
