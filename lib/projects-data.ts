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
  /** Hero image for the portfolio gallery — path under `public/` (e.g. `/images/projects/{slug}.jpg`). */
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
    coverImage: "/images/projects/fraud-detection-engine.jpg",
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
    coverImage: "/images/projects/payment-settlement-platform.jpg",
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
    coverImage: "/images/projects/kyc-aml-automation.jpg",
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
    coverImage: "/images/projects/real-time-analytics-dashboard.jpg",
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
    coverImage: "/images/projects/event-streaming-pipeline.jpg",
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
    coverImage: "/images/projects/ai-customer-onboarding-agent.jpg",
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
    coverImage: "/images/projects/credit-risk-underwriting.jpg",
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
    coverImage: "/images/projects/api-first-banking-microservices.jpg",
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
    coverImage: "/images/projects/compliance-risk-monitoring.jpg",
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
  },
  {
    id: "10",
    slug: "ecommerce-product-search-recommendations",
    title: "ML-Powered Product Search & Recommendations",
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
    problemStatement: "Traditional keyword-based search drove poor product discovery: 25% cart abandonment from customers unable to find relevant products. Recommendations were rule-based and static. Competitors using ML-based discovery were capturing 40% more conversion from browse sessions.",
    solutionApproach: "Built multi-layer discovery system: (1) Semantic search using embedding models (BERT) to understand customer intent beyond keywords, (2) Real-time collaborative filtering for personalized recommendations, (3) Contextual ranking using behavioral signals (viewing history, dwell time, seasonal trends), (4) A/B testing framework to validate improvements. Implemented caching layer (Redis) for sub-100ms search latency.",
    resultsMetrics: "35% increase in product discovery conversion (customers who search → purchase). 18% increase in average order value through better recommendations. Reduced bounce rate on search results by 28%. Improved time-to-find by 40% (from 3+ minutes to <2 minutes). Processed 5M+ search queries daily with sub-100ms latency.",
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
    problemStatement: "E-commerce platform suffered from dual pressures: (1) Fraud losses of $4M+ annually, (2) Legacy fraud detection (3D Secure flows, manual reviews) added 8+ seconds to checkout, causing 12% abandonment. Fraudsters specifically targeted high-value orders ($1k+). Need sub-200ms fraud decision without compromising security.",
    solutionApproach: "Built real-time fraud prevention system: (1) Multi-model ensemble (transaction history, device fingerprinting, behavioral signals, amount/velocity checks), (2) Sub-50ms decision engine using Go (synchronously within checkout flow), (3) Async verification for edge cases (challenges sent post-purchase via OTP), (4) Machine learning model retrained daily on new fraud patterns. Implemented circuit breakers and fallback strategies for graceful degradation.",
    resultsMetrics: "Reduced fraud by 94% ($3.8M+ annual savings). Improved checkout conversion by 12% (faster, less friction). Maintained <200ms checkout flow (vs 8+ seconds previously). Processed $500M+ in annual transaction volume. False positive rate of only 2% (industry avg 8-15%), minimizing legitimate customer friction.",
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
    problemStatement: "E-commerce platform with 10k+ daily orders across 5 warehouses faced critical challenges: (1) 3-5 day average delivery, (2) Frequent overselling (customer receives cancellation after purchase), (3) Manual inventory reconciliation causing $2M+ in write-offs annually, (4) Cannot quickly reroute orders to closer warehouses.",
    solutionApproach: "Built event-driven fulfillment platform: (1) Real-time inventory ledger using event sourcing (every stock change = event), (2) Intelligent routing engine evaluating distance, inventory, current load across warehouses, (3) Saga pattern for multi-step workflows (pick → pack → ship → deliver), (4) Integration with logistics partners (FedEx, UPS) via APIs, (5) Real-time shipment tracking aggregating data from all providers. Implemented circuit breakers for resilience when warehouse systems unavailable.",
    resultsMetrics: "Reduced average delivery time from 3-5 days to 2 hours (same-day for metro areas). Eliminated overselling: 99.5% orders fulfilled without cancellation. Zero inventory write-offs through real-time accuracy. Processed 10k+ orders daily across 5 warehouses with 99.9% success rate. Reduced operational costs by 25% through optimized routing.",
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
    problemStatement: "APIs are the modern attack surface, yet enterprises had no visibility into attack patterns. Traditional WAF rules missed sophisticated attacks. By the time teams detected breaches, attackers had exfiltrated millions of records. Industry reports show 200+ days median detection time. Enterprise needed <1 second detection to prevent damage.",
    solutionApproach: "Built real-time attack detection system: (1) Network graph database (Neo4j) modeling API calls, users, data flows, (2) Behavioral ML model learning normal API patterns (frequency, endpoint combinations, data volumes), (3) Real-time anomaly detection identifying deviations: unusual endpoint sequences, data exfiltration patterns, lateral movement, (4) Automated response: rate limiting, IP blocking, user session termination, (5) LLM-based alert analysis to reduce false positives. Integrated with incident management system.",
    resultsMetrics: "Detected 98% of attack attempts within <1 second. Prevented $2M+ in potential data breach costs. Reduced median detection time from 200+ days to under 5 minutes. Identified 87 unique attack patterns in first 6 months. Zero false negatives on critical/high-severity attacks. Automated remediation prevented 94% of attacks from causing data loss.",
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
    problemStatement: "Traditional breach detection relied on manual log review and IT forensics: median detection time of 210 days (IBM benchmark). By then, attackers had pivoted to other systems, exfiltrated massive datasets, sold credentials. No visibility into: what was accessed? when? by whom? what data was stolen? Regulatory fines compounded by slow response time.",
    solutionApproach: "Built AI-powered forensics system: (1) Data access audit logs aggregated from all sources (databases, APIs, cloud storage, identity systems), (2) Behavioral baseline: who accesses what data, when, from where (normal patterns), (3) Real-time anomaly detection flagging suspicious access, (4) Graph-based analysis showing attacker's lateral movement path, (5) Claude API with function calling to analyze forensics and provide narrative explanation of breach, (6) Automated incident timeline generation. Integrated with SIEM and incident management.",
    resultsMetrics: "Reduced breach detection time from 210 days to 2 hours (100x improvement). Identified root cause in 100% of incidents within minutes. Provided full attacker timeline: entry point, lateral movement, data accessed, exfiltration time. Enabled 3x faster incident response. Reduced regulatory fines by qualifying for 'fast response' exception in GDPR/CCPA.",
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
    problemStatement: "Enterprise migrating to cloud (AWS + GCP) faced compliance burden: (1) Manual security audits 2x/year missed misconfigurations, (2) Compliance checklists required 40+ hours per audit, (3) Security incidents (exposed S3 buckets, overpermissioned IAM) discovered months later, (4) Regulators expect continuous compliance proof, not point-in-time audits. Traditional approaches don't scale with rapid cloud growth.",
    solutionApproach: "Built automated cloud security & compliance platform: (1) Policy-as-code (Terraform, CloudFormation linting) enforcing standards at deployment time, (2) Continuous scanning of all cloud resources against security benchmarks (CIS, NIST, AWS Well-Architected), (3) Real-time remediation: auto-fix common misconfigurations (public S3 buckets, overpermissioned security groups), (4) Compliance evidence gathering (audit logs, configurations, change history) for automated compliance reporting, (5) Dashboard showing security posture and compliance status, (6) Integration with CI/CD to prevent non-compliant infrastructure from deploying.",
    resultsMetrics: "Reduced security incidents by 87% (exposed buckets, overpermissioned access, unpatched systems). Maintained SOC2 and ISO 27001 compliance continuously (vs quarterly manual audits). Reduced audit preparation time from 40 hours to 2 hours (automated evidence gathering). Prevented $1.2M+ in compliance fines through proactive remediation. Enabled 5x faster cloud deployments without sacrificing security.",
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
    problemStatement: "Small business / startup needed professional online presence without breaking the budget. DIY website builders (Wix, Squarespace) felt generic and limited. Custom agencies quoted $15k+. Business needed: fast turnaround, SEO-friendly, mobile-optimized, ability to run campaigns and track results.",
    solutionApproach: "Built modern marketing website using Next.js for performance and SEO. Included: (1) Responsive design (desktop, tablet, mobile), (2) Built-in analytics (Google Analytics, Mixpanel), (3) A/B testing framework for landing page variants, (4) Email capture forms with Mailchimp integration, (5) Fast load times (<2s), (6) SEO optimization (meta tags, structured data, sitemap), (7) Easy content updates (via headless CMS or config files).",
    resultsMetrics: "Launched in 3 weeks vs 8+ weeks for traditional agency. Page load time: 1.2 seconds (vs 4-6s for Wix templates). 35% conversion rate from visitor to email signup. Mobile score 98/100. Ranked on page 1 for target keywords within 2 months. Cost: $8k (vs $15k+ agency quote).",
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
    problemStatement: "Growing SMB (80 employees) was juggling 3 separate tools: Excel spreadsheets for attendance, ADP for payroll, Google Contacts for employee directory. No single source of truth. Manual data entry took 15 hours/week. Leave requests were email chains. Reports were static, outdated.",
    solutionApproach: "Built custom HR system integrated with payroll provider (ADP/Gusto). Features: (1) Employee directory with org chart, (2) Automated attendance tracking (integration with badge system), (3) Leave management (request, approval workflow, accrual tracking), (4) Performance review cycle management, (5) Payroll integration (headcount, compensation data synced automatically), (6) Custom reports (headcount by department, turnover, cost analysis), (7) Onboarding workflow for new hires.",
    resultsMetrics: "Eliminated 15 hours/week of manual data entry. Single source of truth reduced errors by 100%. Leave approval cycle: 5 days → 1 hour (automated). Payroll processing time: 2 days → 30 minutes (auto-sync). Custom reports accessible to managers in real-time. Reduced HR admin overhead by 40%.",
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
    problemStatement: "Mid-size company (200 employees, multiple locations) processed payroll manually using Excel templates. Error rate: 8% (wrong tax withholding, missed deductions, calculation errors). Payroll manager spent 40 hours/month on manual reconciliation. Complex tax rules (state, local, fed) were hard to track. GL entries were manual, delayed.",
    solutionApproach: "Built payroll system with (1) Automated tax calculation (federal, state, local, special taxes), (2) Deduction management (insurance, 401k, FSA, garnishments), (3) Time sheet integration (pull hours from HR system or manual entry), (4) Direct deposit setup and ACH file generation, (5) GL integration: auto-create accounting entries for payroll expense, taxes, deductions, (6) Compliance reporting (W-2 generation, tax filings, audit trail), (7) YTD tracking and forecasting.",
    resultsMetrics: "Reduced payroll processing time from 40 hours → 20 minutes/month (automation + error elimination). Error rate: 8% → 0% (rule-based calculations + validation). Saved $3k/month in payroll processing fees (outsourcing not needed). GL entries generated automatically, enabling real-time accounting visibility. Compliance: 100% on-time tax filing, zero audit exceptions.",
    techStack: [
      { category: "Backend", technologies: ["Python", "FastAPI", "PostgreSQL"] },
      { category: "Tax Engine", technologies: ["Custom rules engine", "Regulation compliance"] },
      { category: "Integrations", technologies: ["HR system API", "QuickBooks API", "Bank APIs (ACH)", "ADP API"] },
      { category: "Reporting", technologies: ["Jasper Reports", "SQL", "PDF generation"] },
      { category: "Security", technologies: ["Encryption", "Audit logging", "Role-based access"] }
    ]
  }
]
