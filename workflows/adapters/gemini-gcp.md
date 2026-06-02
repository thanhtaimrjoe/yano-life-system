# Gemini/GCP Adapter

Use this adapter when running workflows through Google Vertex AI or another Gemini API surface.

## Tier Mapping

| Shared tier | Gemini/GCP mapping |
| --- | --- |
| Lightweight | Current Flash-class model |
| Balanced | Current Flash/mid-class model |
| Reasoning | Current Pro/highest-class model |

Resolve concrete model IDs at runtime or in one small provider config. Avoid scattering pinned model versions across workflow logic.

## Current Local Implementation

`workflows/weekly-gym-review.js` is the current Gemini Vertex AI implementation.

It expects:

- Node.js with native `fetch`.
- `gcloud` CLI installed and authenticated.
- Active GCP project, or fallback project `yano-brse-ai-api`.
- Vertex AI access in `us-central1`.

Run:

```bash
node workflows/weekly-gym-review.js
node workflows/weekly-gym-review.js --week 22 --year 2026
```

## Implementation Notes

- Keep GCP auth/client logic in provider-specific scripts.
- Keep shared schemas in `workflows/schemas/`.
- Keep prompt rules aligned with `AGENTS.md`.
- Do not send sensitive data to Gemini unless the user accepts that provider workflow.
- If a field is not present in repo logs, output `(not logged)` instead of estimating.

## Recommended Improvements

- Resolve model IDs through a single tier map.
- Zero-pad weekly output filenames.
- Check for an existing weekly review before writing.
- Include daily recovery/sleep/mood logs when the review asks for those fields.

