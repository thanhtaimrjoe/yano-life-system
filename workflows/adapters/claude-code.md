# Claude Code Adapter

Use this adapter when running workflows through Claude Code.

## Tier Mapping

| Shared tier | Claude Code mapping |
| --- | --- |
| Lightweight | Haiku-class alias |
| Balanced | Sonnet-class alias |
| Reasoning | Opus-class alias |

Claude Code aliases such as `haiku`, `sonnet`, and `opus` should be treated as tier aliases. They are preferred over pinned dated model IDs.

## Typical Workflow Shape

```javascript
phase('Extract')
const extracted = await agent('Extract facts from local logs', {
  model: 'haiku',
  schema: SOME_SCHEMA
})

phase('Analyze')
const analysis = await agent('Analyze compact facts and recommend changes', {
  model: 'opus'
})

phase('Format')
const markdown = await agent('Format final markdown using repo template', {
  model: 'sonnet'
})
```

## Rules

- Use Haiku-class agents for broad extraction and validation.
- Use Opus-class agents for synthesis or decisions that affect plans.
- Use Sonnet-class agents for markdown/code generation.
- Keep provider-specific syntax out of shared workflow contracts.
- Preserve repo privacy rules before sending sensitive content to any model.

