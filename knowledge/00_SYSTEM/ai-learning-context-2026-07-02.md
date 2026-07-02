# AI Learning Context — 2026-07-02

> Purpose: Preserve Yano's current AI learning context so any future AI model/agent can continue the lesson without requiring platform-specific memory.

## How to teach Yano

Yano prefers learning AI through **system design and reverse engineering**, not textbook definitions.

Preferred teaching style:

- Use Vietnamese, informal and natural, with `tui/ông` style.
- Teach by concrete examples and analogies first, then name the concept.
- Do not jump ahead too quickly even if Yano answers correctly.
- If Yano is wrong, correct him directly and explain why.
- Avoid empty praise. Praise only when there is a clear reason.
- Use small challenges to make Yano reason from first principles.
- Prefer questions like: `If you were the AI Engineer, how would you design this?`
- Relate new concepts to Yano's background as QA/Tester/BrSE and his KINKEN project experience.
- Keep explanations concise but not shallow.

## Relevant background

Yano has QA/Tester/BrSE experience and previously worked on project **KINKEN**, which included:

- document search
- search APIs
- Databricks ETL
- Elasticsearch indexing
- retriever-like components
- boost score
- search ranking/relevance testing
- API response validation

This background makes AI search/RAG concepts easier to teach through production search system analogies.

Yano also maintains the repo `yano-life-system`, intended as an AI-readable personal knowledge base. His design principle is:

> AI does not need to remember me internally. AI should know how to read my repo.

This repo should act as a **Single Source of Truth** for AI agents, independent of ChatGPT/Codex/Claude/Gemini memory systems.

## Current mental model

### ChatGPT vs LLM

Yano understands that ChatGPT is not just an LLM.

- ChatGPT = application/system
- LLM = language reasoning/generation engine inside the system
- Other surrounding components may include memory, tools, web search, file reading, retrievers, orchestrators, runtime, and guardrails

Analogy used:

```text
User orders a smoothie.
ChatGPT/orchestrator = staff preparing ingredients.
LLM = blender.
Context = ingredients placed into the blender.
Response = smoothie.
```

Core rule:

> LLM only knows what is present in the context at the moment it is called.

### Context Window

Yano understands context window as the LLM's current working table.

- Context window is not long-term memory.
- Memory is more like a filing cabinet.
- To use memory, an external system must retrieve it and place relevant memory into context.
- If the context is too long, the system may truncate, summarize, select relevant chunks, or retrieve again.
- It is not always true that exactly the oldest N tokens are removed.

### Generative AI

Yano understands:

- AI is the broad field.
- Generative AI is a branch of AI that creates new content.
- Not all AI is generative.
- Classification/search/recognition systems may be AI without being generative AI.

Examples:

- Spam classifier: AI, not Generative AI.
- Face recognition: AI, not Generative AI.
- ChatGPT writing an answer: Generative AI.

## RAG understanding

RAG = Retrieval-Augmented Generation.

Yano's current understanding:

```text
User question
→ Retriever finds relevant documents
→ Retrieved content is augmented into context
→ LLM reads the context
→ LLM generates answer
```

Important principle:

> RAG does not make the LLM smarter. It lets the LLM read the right material before answering.

If retrieval quality is poor, the LLM may produce a fluent but wrong answer.

Rule:

> Garbage context in → garbage answer out.

## Embedding understanding

Yano understands embedding as representing meaning as vectors.

Example:

```text
"I want to log in"
"I want to sign in"
"Tôi muốn đăng nhập"
```

These can be close in vector space even when keywords differ.

Key idea:

> Embedding does not store words. It represents meaning.

Embedding can apply to:

- text
- images
- faces
- audio
- video
- code
- recommendations

## Vector Database understanding

Yano understands that vector databases store embedding vectors for nearest-neighbor search.

Common storage options discussed:

- Elasticsearch / OpenSearch
- PostgreSQL + pgvector
- Pinecone
- Qdrant
- Milvus
- Weaviate
- Chroma

KINKEN likely used Elasticsearch/OpenSearch-style search infrastructure after ETL/indexing.

A system may store vectors together with normal DB records or in a separate vector/search system depending on scale and architecture.

## Search model understanding

Yano understands the difference between:

### Lexical Search

Keyword-based search such as:

- exact keyword match
- BM25
- field boost
- title/tag/content weighting
- endpoint/code identifier matching

Useful when the user searches exact terms like `/api/login`, product IDs, technical names, or known keywords.

### Semantic Search

Meaning-based search using embeddings.

Useful when the user expresses the same concept with different wording.

### Hybrid Search

Yano believes a good production search UX should usually combine both.

Reasoning from KINKEN experience:

> If a keyword match exists, exact/strong keyword matches should rank well. Semantic search can then cover cases where wording differs. Using only one of the two often produces weaker UX.

## Tool Calling understanding

Yano understands that tool definitions are also context.

A model knows available tools because the system/orchestrator provides tool metadata such as:

- tool name
- description
- input schema
- constraints
- when to use it

Key point:

> Tool descriptions are prompts for the LLM.

Good tool description example:

```text
Tool: GymLog
Description: Read user's workout history. Use when answering questions about training frequency, muscle recovery, recent exercises, and progression.
```

Bad tool description example:

```text
Tool: tool_123
Description: Do stuff.
```

Yano initially associated this with files like `SKILL.md`, `AGENTS.md`, and workflow docs. This is partly correct in real agent systems: such files can become context if the runtime reads them and includes them.

## Orchestrator / Runtime / Planner understanding

Initial simple model:

```text
User
→ Orchestrator prepares context / decides tools
→ LLM
→ Tool results
→ LLM
→ Response
```

Refined model:

Many modern systems let the LLM act as planner/tool selector.

```text
User
→ LLM decides which tool to call
→ Runtime/orchestrator executes the tool
→ Tool result returns to context
→ LLM produces final answer
```

The orchestrator/runtime does not always need complex if/else logic. It may simply:

- expose tools
- execute requested tool calls
- manage context
- enforce permissions
- enforce guardrails
- handle retries/errors
- request user confirmation when needed

Yano independently reasoned:

> Why build a very smart orchestrator if we already have an LLM? Give the LLM the available tools/context and let it issue instructions; the runtime executes and protects the system.

This is an important AI system design insight.

## Guardrails / Human-in-the-loop

Yano should learn next that even if LLM chooses tools, it should not have full authority.

Runtime/orchestrator should enforce guardrails for dangerous or sensitive actions, such as:

- deleting files
- sending emails
- editing important records
- exposing sensitive data
- transferring money
- making irreversible changes
- expensive tool calls
- excessive token usage

Pattern:

```text
LLM proposes action
→ Runtime checks permission/risk
→ If safe: execute
→ If risky: ask user confirmation
```

This will connect naturally to:

- AI security
- permission model
- human-in-the-loop
- audit logs
- dry-run mode
- approval workflows

## Hallucination understanding

Yano understands that a bad answer is not always the LLM's fault.

Possible causes:

- bad retrieval
- poor context construction
- missing data
- vague tool descriptions
- wrong tool selection
- stale memory
- insufficient guardrails
- LLM hallucination

LLM may fabricate plausible information when context lacks the answer unless instructed and constrained properly.

Important instruction pattern:

```text
Answer only from the provided context. If the information is not present, say that it was not found.
```

## Context Engineering

Yano is especially interested in context engineering.

Definition in this learning path:

> Context engineering is designing what information enters the LLM context, when, in what format, and at what token cost.

This is more important to Yano than generic prompt hacks.

Related topics to teach later:

- chunking
- indexing
- retrieval
- reranking
- context compression
- context caching
- task decomposition
- agent workflows
- portable repo instructions
- cross-model agent design

## Repo architecture insight

Yano sees `yano-life-system` not just as notes, but as an AI-readable knowledge base.

Desired properties:

- model-agnostic
- vendor-neutral
- easy to index
- low-token
- has clear agent instructions
- contains durable user knowledge
- supports multiple agents/tools
- does not rely solely on one platform's memory

This repo can be thought of as an **Operating System for AI** or an AI-readable personal knowledge base.

## Audit large repo principle

If the user asks an agent to audit a large repo, do not put the entire repo into context.

Better design:

1. Read repo structure.
2. Identify project type and important modules.
3. Break audit into smaller tasks.
4. Retrieve/read only relevant files for each task.
5. Summarize findings per module.
6. Combine summaries into final report.

Key insight:

> The problem is not only selecting less context; it is decomposing a large task into multiple smaller contexts.

## Current stopping point

The latest discussion was about whether the orchestrator or the LLM should decide tool calls.

Current conclusion:

- Older/simple systems may use orchestrator if/else logic.
- Modern agent systems often let the LLM decide tool calls from tool descriptions/schema.
- Runtime/orchestrator executes tool calls and enforces guardrails.
- LLM can act as planner/tool selector, but should not receive unlimited authority.

Recommended next lesson:

## Next Lesson: Tool Calling Architecture + Guardrails

Suggested teaching flow:

1. Give Yano a scenario with tools such as `ReadRepo`, `EditFile`, `DeleteFile`, `SendEmail`, `GymLog`, `Calendar`.
2. Ask which tools should be safe auto-run and which require confirmation.
3. Teach tool risk classification:
   - read-only
   - reversible write
   - irreversible write
   - external side effect
   - sensitive/private data
   - expensive action
4. Show how an AI runtime can enforce policies around LLM tool calls.
5. Connect to Codex/Claude Code/Cursor and repo workflows.

## Useful teaching reminders

When continuing the course:

- Do not over-praise by default.
- Correct directly but supportively.
- Use Yano's own analogies when useful: smoothie shop, king/court, OS/CPU.
- Prefer system diagrams in markdown.
- Keep lessons phone-friendly.
- No code needed unless Yano asks or has laptop available.
- Always connect concepts back to KINKEN, repo design, Codex, ChatGPT, and future `Yano AI`.
