---
name: kinken_elasticsearch
description: Elasticsearch concepts, aggregations, and optimization used in KINKEN.
type: project
---

# KINKEN Elasticsearch

## Core Concepts

### Index

**Two meanings**:

1. **Noun**: Like a "Table" in traditional databases
   - Example: `products` index contains product information
   - Example: `documents` index contains document metadata

2. **Verb (Indexing)**: The action of loading data into Elasticsearch and analyzing it for fast search
   - Similar to creating a "Table of Contents" in a book

### Mapping (Schema)

Declares data types for each field:
- `title` → text (analyzed for search)
- `price` → number
- `vector` → dense_vector (for semantic search)

### Query DSL (Domain Specific Language)

Elasticsearch's query language written in JSON format:

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "アルミサッシ" } }
      ],
      "filter": [
        { "term": { "category": "exterior" } }
      ]
    }
  }
}
```

## Aggregations (`aggs`)

Server-side summary computations executed with search queries. They produce grouped or metric results without returning every matching document.

### Common Aggregation Types

| Type | Purpose | Example |
|------|---------|---------|
| `terms` | Group and count by field value | Count documents per category |
| `avg`, `min`, `max`, `sum` | Metric calculations | Average price, max date |
| `filter` | Compute summaries for subset | Count only "technical" docs |

### Performance Guidance

| Issue | Solution |
|-------|----------|
| High-cardinality buckets | Expensive; keep `size` bounded |
| Slow aggregations | Use `keyword` fields, not `text` |
| Latency diagnosis | Profile with/without aggs to isolate cost |

## KINKEN-Specific Optimizations

### Hybrid Search (Morphological + Semantic)

To combine Semantic Search (vector-based) and Morphological Search (keyword-based) effectively, the following strategies are used:

1.  **Score Normalization**: Both scores are normalized to a 0-1 scale to ensure they are comparable.
2.  **Weighted Integration**: Scores are combined using weighted averages: `final_score = α * semantic_score + β * keyword_score`.
3.  **Bool Query**: Using `should` clauses to combine match queries and script scores.
4.  **Score Boosting**: Applying `boost` (e.g., `title^3`) to prioritize specific fields.
5.  **RRF (Reciprocal Rank Fusion)**: A robust algorithm that combines rankings from different search methods without needing normalized scores.
6.  **Re-ranking**: Obtaining initial results from ES and then re-sorting them on the server-side (Python/FastAPI) using custom logic.
7.  **Learning to Rank (LTR)**: (Advanced) Using machine learning models to optimize ranking based on training datasets.

#### Hybrid Search Example (Bool Query)

```json
{
  "query": {
    "bool": {
      "should": [
        { "match": { "title": { "query": "アルミサッシ", "analyzer": "kuromoji", "boost": 1.5 } } },
        { "knn": { "field": "title_vector", "query_vector": [...], "k": 10, "boost": 2.0 } }
      ]
    }
  }
}
```

### Index Alias Strategy

Enables zero-downtime reindexing:

```
1. Create new index: documents_v2 (with updated settings/dictionary)
2. Reindex data into documents_v2
3. Switch alias: documents → documents_v2
4. Delete old index: documents_v1
```

### Dictionary & Synonym Management

**Problem**: Updating morphological dictionaries (形態素辞書) typically requires restarting the Elastic Cloud cluster and re-ingesting data from the database, causing significant operational overhead.

**Solution Approach**:
1. Use Elasticsearch Extensions for dictionary files (since 1500+ lines is too large to put directly in index settings).
2. Manage dictionary files with versioning (keep old versions, add new ones).
3. **Reindex Strategy**: Instead of pulling all data from PostgreSQL again, use the `_reindex` API to copy data from the old index to a new index. The new index will apply the updated dictionary tokenizer during ingestion.

### Segment Bloat

**Problem**: Elasticsearch marks documents as deleted but doesn't remove them immediately, causing disk bloat.

**Solution**: Run `_forcemerge` to compact segments.

### AI Outage Fallback Mechanism (Degraded Operation)

**Problem**: System must remain operational even if OpenAI API is down (KINKEN-574).

**Solution**: Automatic Degraded Operation (縮退運転 - Shukutai unten) using Redis & Environment Secrets.
1. **Normal State**: Secret `openai-enabled-prod = true`, Redis is empty.
2. **Outage Detected**: System automatically sets `openai-enabled-prod = false` in Redis and creates a new Secret version = false.
3. **During Outage**: App checks Redis first. If false, it skips Semantic Search (KNN) and executes **Full-text Search only**.
4. **Recovery**: Manually clear Redis (via CLI/Databricks) and update Secret to true (via GCP Console) to resume Hybrid Search.

## Case Study: PoC Benchmark Discrepancy

**Problem**: Search results differed between old and new PoC despite same data.

**Root causes investigated**:
1. **Embedding vector non-determinism**: Same text may produce slightly different vectors
2. **HNSW algorithm randomness**: Index structure varies between builds
3. **ES version mismatch**: Old PoC version not recorded
4. **Sharding differences**: Global vs shard-level search

**Lesson learned**: Always lock and record infrastructure versions.

## Interview Talking Points

| Topic | Explanation |
|-------|-------------|
| Why Elasticsearch? | "Fast full-text search for 13M documents with Japanese morphological analysis" |
| Aggregations | "Server-side summaries for faceted search without returning all documents" |
| Hybrid search | "Combines keyword matching with semantic understanding for better results" |
| Zero-downtime reindex | "Use alias switching to update index without service interruption" |
