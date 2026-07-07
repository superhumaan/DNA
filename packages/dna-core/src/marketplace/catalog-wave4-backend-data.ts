import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const F = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["frameworks"]);

const D = (id: string, name: string, desc: string, when: string, how: string) =>
  def(id, name, desc, when, how, ["databases"]);

export const WAVE4_BACKEND_DATA_PACK_DEFS = [
  F("frameworks/supabase-edge-functions", "Supabase Edge Functions", "Deno functions on Supabase", "Auth-adjacent logic at edge.", "JWT verify in function. Service role key server-only."),
  F("frameworks/tyk", "Tyk API Gateway", "Open-source API gateway", "Self-hosted Kong alternative.", "Policies per API. Analytics dashboard."),
  F("frameworks/apigee", "Apigee", "Google enterprise API management", "API products and monetization.", "Developer portal. Spike arrests. KVM caching."),
  F("frameworks/restify", "Restify", "Node.js REST framework", "Performance-focused Node APIs.", "Strict routing. Request lifecycle hooks."),
  F("frameworks/blitz", "Blitz.js", "Full-stack React framework", "Zero-API data layer on Next.", "RPC mutations. Prisma integration."),
  F("frameworks/ember", "Ember.js", "Opinionated SPA framework", "Legacy enterprise SPAs.", "Ember Data. Glimmer components. Octane patterns."),
  F("frameworks/tamagui", "Tamagui", "Universal React UI", "React Native + web shared components.", "Compiler optimizations. Theme tokens cross-platform."),
  F("frameworks/uniwind", "Uniwind", "Tailwind for React Native", "Utility classes on mobile.", "NativeWind alternative patterns. Platform variants."),
  F("frameworks/wasp", "Wasp", "DSL full-stack React + Node", "Rapid CRUD SaaS scaffolding.", "main.wasp config. Auth boilerplate included."),
  F("frameworks/nestjs-microservices", "NestJS Microservices", "Nest transport patterns", "gRPC, Kafka, Redis microservices.", "Hybrid apps. Health checks per transport."),
  D("databases/typeorm", "TypeORM", "TypeScript ORM", "Legacy Node ORM codebases.", "Entities decorators. Migrations CLI. DataSource config."),
  D("databases/sqlalchemy", "SQLAlchemy", "Python SQL toolkit ORM", "Django alternative raw SQL layer.", "2.0 style async. Alembic migrations."),
  D("databases/ecto", "Ecto", "Elixir database wrapper", "Phoenix data layer.", "Changesets. Preload associations. Repo transactions."),
  D("databases/flyway", "Flyway", "SQL migration tool", "Versioned migrations JVM/CI.", "flyway.conf per env. Repeatable migrations."),
  D("databases/liquibase", "Liquibase", "Database change management", "Enterprise schema governance.", "Changelog XML/YAML. Rollback scripts."),
  D("databases/atlas-migrate", "Atlas", "Schema-as-code migrations", "Declarative schema diff.", "atlas schema apply. HCL definitions."),
  D("databases/confluent", "Confluent Cloud", "Managed Kafka platform", "Enterprise streaming with Schema Registry.", "Avro schemas. ksqlDB. Flink on Confluent."),
  D("databases/surrealdb", "SurrealDB", "Multi-model database", "Document + graph + SQL.", "Record IDs. LIVE queries for realtime."),
  D("databases/fauna", "Fauna", "Serverless document DB", "Global ACID transactions.", "FQL queries. Region groups for latency."),
  D("databases/couchdb", "CouchDB", "Document DB with replication", "Offline-first sync patterns.", "Mango queries. _changes feed for sync."),
  D("databases/scylladb", "ScyllaDB", "Cassandra-compatible performant", "High throughput NoSQL.", "CQL compatible. Shard-aware drivers."),
  D("integrations/confluent-kafka", "Confluent Kafka Connect", "Kafka connectors ecosystem", "Stream data to/from Kafka.", "Connector configs. SMT transforms. DLQ topics."),
];

export const WAVE4_BACKEND_DATA_PACKS = packsFromDefs(WAVE4_BACKEND_DATA_PACK_DEFS);
