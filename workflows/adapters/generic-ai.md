# Generic AI Adapter

Use this adapter for AI tools that do not have a dedicated provider note yet.

## Required Capabilities

An AI runtime can run these workflows if it can:

1. Read local repo files or receive selected file contents.
2. Produce structured JSON or equivalent structured notes.
3. Follow folder rules from `AGENTS.md`.
4. Create or update markdown files without inventing missing personal data.

## Tier Mapping

Map the shared tiers to the provider's current model families:

| Shared tier | Pick |
| --- | --- |
| Lightweight | cheapest fast model/tool |
| Balanced | mid-tier general model |
| Reasoning | strongest reasoning/synthesis model |

Use provider docs or runtime model lists to resolve the actual model. Do not edit repo workflow docs every time a model version changes.

## Portable Pipeline

1. Extract: gather facts into the shared schema.
2. Analyze: reason from the compact facts.
3. Format: write the final markdown in the target repo template.
4. Verify: check file paths, frontmatter, and required sync targets.

## Safety Rules

- Treat this repo as private.
- Do not upload sensitive raw logs unless the user selected that provider.
- Never infer health, sleep, nutrition, or mood data that is not logged.
- Preserve uncertainty explicitly.
