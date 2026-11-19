# Release checklist — evidence, not a completion declaration

## Implemented, verification pending current CI
- P0: chapter navigation, initial task code, source-linked studio, search retry/full index, offline cache routes, selected arithmetic parity, guessing validation, ZIP archives, progress and badges, copy loading guard.
- P1 architecture: generated curriculum registry and validation, partial modular JS/CSS, local storage, versioned cache, backup/restore, existing URLs.
- P1 UI: responsive layout, desktop/sidebar, mobile navigation, light/dark, command palette, reduced motion, notifications for new tools. Animation count requires a distinct-keyframe inventory and visual review.
- P1 learning: Python runtime, editor, terminal, STDIN, stop and timeout, flowchart builder, dynamic lab, multi-case coding challenges, 210 numeric variants, UTS/UAS practice, notes/flashcards, learning statistics, achievements, references/ZIP.
- P2: README, developer and learner guides, changelog, privacy/security docs, SEO, deployment gates.

## Open blockers before Stable
- No claim that all 80 feature requirements or 35 animation types have been independently completed. Audit feature-by-feature with real acceptance evidence.
- Full academic cross-check of all seven binary PDFs, every assignment, examples, answers, references and distribution rights. Source PDFs are not copied into Pages dist; ownership/licensing must be confirmed by the rights holder. Do not add a blanket open-source license covering these PDFs.
- Full parity across all operations (current parity suite covers duration, parking, shopping, geometry and temperature), browser visual regression baseline and accessibility audit.
- Runtime end-to-end test with actual Pyodide CDN, cross-browser Firefox/Edge/WebKit/Safari and physical Android/iOS, keyboard flows, low-end performance and Lighthouse.
- Review versioned storage and import validation, multi-tab conflicts, security isolation and error boundaries. Existing code runs trusted Python only.
- Verify latest successful live deployment and then publish stable tag/release; never bypass a failed quality gate.

## Latest evidence
Commit 70822e1 deployed successfully in [Actions run 44520297773](https://github.com/jxxzy/algoritima1/actions/runs/44520297773). Unit tests, parity, dependency audit, browser smoke and deployment passed. 36 CSS keyframe definitions counted; visual behavior is not certified by the count. Newer changes require their own CI evidence.

## Extended gates
See [quality guide](QUALITY.md) and [80-feature registry](feature-registry.json). Public deployment cd67115 passed run 44520889160. Stable tagging remains blocked until all requirements are evidenced.

## Additional hardening
Focusable code/table regions, valid ARIA regions, transactional backup schema validation and rollback, multi-file modules, error inspector, editable pseudocode, session history and searchable help; latest acceptance requires new CI evidence. Real runtime test at c55e0a5 passed before these additions. Extended Chromium found serious accessibility groups; this patch specifically addresses those targets.
