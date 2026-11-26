# IMPLEMENTATION_STATUS.md â€” Plexton

> **Single source of continuity for fresh sessions.** Read this file and `AGENTS.md` before making changes. Do not rely on chat history.

## 1. Project snapshot
- **Project**: Plexton â€” premium Android puzzle game.
- **Repo**: `asikrshoudo/plexton` | **Branch**: `main` | **Local**: `D:\shoudo\projects\plexton`
- **Stack**: Expo SDK ~58.0.26, React Native 0.88.1, React 19.3.0, TypeScript ~6.0.3, Expo Router ~58.0.32, Reanimated 4.7.1, Gesture Handler ~3.3.0, Safe Area Context ~5.11.1, expo-sqlite/kv-store ~58.0.18.
- **Platform**: Android-only (`app.json` `platforms:["android"]`, CNG; do not hand-edit `android/`/`ios/`).
- **Package manager**: npm (`package-lock.json` present, no bun lockfile).
- **Last updated**: 2026-11-26 â€” **R2 Full app shell/navigation redesign complete; awaiting user review before R3.**

## 2. Approved product scope (R0 reset â€” 2026-11-26)

### Playable games
- **All four existing games must become genuinely playable, polished, production-quality experiences**: Number Merge, Color Flow, Memory Flash, Word Game.
- **No additional games** beyond these four until all four are production-quality.
- No fake/placeholder game screens.

### Removed/excluded
- **Daily Challenge removed/hidden for current release.** No misleading placeholder screens or navigation entries.

### Monetization/scope boundaries
- No currency/coins, shop, achievements/unlock trees, ads/AdMob/banner/interstitial/rewarded, IAP, paid heart refills, or any monetization.
- No artificial urgency/failure mechanics.

### Preservation
- Preserve existing deterministic game mechanics and existing player progress wherever possible. Use safe, migration-aware schema changes.

## 3. Approved Heart System (not implemented)

- **Max**: 5 hearts.
- **Recovery**: exactly 1 heart every 30 minutes; continues while app closed/background; **timestamps are source of truth** (not in-memory countdown). Persist locally; handle elapsed time, app restarts, clock-skew/edge cases defensively.
- **Consumption**: only an **actual failed attempt result** consumes 1 heart. Pause/quit/navigate/background/close/restore never consume.
- **Per-game**:
  - **Number Merge**: failure consumes 1 heart; at 0 hearts cannot start/retry until regen.
  - **Color Flow**: playable at 0 hearts; no artificial failure mechanics.
  - **Memory Flash**: must **not** consume hearts unless separately, explicitly approved.
  - **Word Game**: must **not** consume hearts unless separately, explicitly approved.
- No paid refills/ads/IAP/currency.

## 4. Gameplay/session requirements

- Reliable persistence in appropriate stages: pause/resume, restore unfinished game after app restart, preserve board/state/score/moves/relevant progress, clear quit confirmation before abandoning active game.
- Never accidentally consume hearts when restoring/leaving a session.
- Do not break existing Number Merge or Color Flow mechanics.
- Memory Flash and Word Game: complete functional gameplay, instructions/onboarding, win/loss where appropriate, score/progress/result handling, reliable state, pause/resume where appropriate, progress integration, meaningful logic/edge-case tests.

## 5. Word Game constraints (approved)

- English-only initially.
- Fully offline.
- Carefully selected, legally usable dictionary/word dataset.
- Keep APK size in mind; evaluate asset size/licensing before adding data.

## 6. Design direction â€” Premium Cream Puzzle Arcade (supersedes S1)

- Warm cream/ivory/off-white/subtle beige foundation; deep ink/charcoal typography; carefully selected per-game accents; soft sophisticated borders/subtle shadows; beautiful typography/consistent spacing/intentional hierarchy; premium cards/tactile interactive elements; smooth purposeful animations/transitions; proper light/dark themes; responsive Android layouts; accessible contrast/readable text/comfortable touch targets.
- **Avoid**: generic AI dashboard layouts, excessive gradients, glassmorphism, unnecessary floating elements, excessive rounded cards everywhere, random decorative icons/emojis, repetitive identical card grids, overly colorful interfaces without clear system.
- Apply consistently across **entire app** (all screens/routes/dialogs/loading/empty/error states).
- S1 lavender/ink baseline is superseded as direction; S1 remains baseline work, not a pending approval gate.

## 7. Versioning & release (approved)

- **Next public release**: `1.0.1`.
- **Android `versionCode` start**: `10001`, monotonically increasing for every subsequent release; never reuse/decrease.
- **VersionName sequence**: `1.0.1`â€“`1.0.9`, `2.0.1`â€“`2.0.9`, `3.0.1`... (as approved). `versionCode` mapping formula must be documented and validated in R7 before release automation.
- Keep Expo/app/package/Android/release metadata consistent. Every public APK release gets unique version and tag `vX.Y.Z`. No arbitrary dev bumps.
- **GitHub Releases approved**: version-tagged production APKs; normal CI separate; preserve useful CI artifacts until release workflow verified. Failed builds never publish broken release. Least-privilege permissions; no secrets exposed.

## 8. Decision log (R0)

| Date | Decision | Status | Notes |
|---|---|---|---|
| 2026-11-26 | Full Premium Cream Puzzle Arcade redesign approved | Approved | Supersedes S1 lavender/ink direction. |
| 2026-11-26 | Make all four existing games genuinely playable: Number Merge, Color Flow, Memory Flash, Word Game | Approved | No fake screens; production quality before adding games. |
| 2026-11-26 | Remove/hide Daily Challenge for current release | Approved | No misleading placeholders/navigation entries. |
| 2026-11-26 | No additional games beyond these four until all four are production-quality | Approved |  |
| 2026-11-26 | Word Game English-only, fully offline, legally usable dictionary/word dataset, APK size mindful | Approved | Licensing/size audit required before adding data. |
| 2026-11-26 | Heart consumption initially applies only to Number Merge | Approved | Color Flow, Memory Flash, Word Game do not consume hearts unless separately explicitly approved. |
| 2026-11-26 | Next public release `1.0.1`; Android `versionCode` `10001`, monotonic thereafter | Approved | Formula/doc/validation in R7. |
| 2026-11-26 | Cream direction supersedes S1; S1 baseline, not pending approval gate | Approved |  |
| 2026-11-26 | GitHub Releases with version-tagged production APKs approved; keep CI separate; preserve artifacts until release workflow verified | Approved | Least privilege; no broken releases. |

## 9. Stage roadmap, dependencies, and gates

> **Approval gate after every stage. Do not implement multiple stages at once.**

| Stage | Status | Depends on | Scope | Exit criteria |
|---|---|---|---|---|
| **R0 â€” Scope reset & docs checkpoint** | **Complete (awaiting review)** | None | Update `AGENTS.md`/`IMPLEMENTATION_STATUS.md`; record approved decisions; replace conflicting old scope/roadmap; decision log & dependencies. No app/source/build/deps/workflow changes. | Docs updated; git diff inspected; no unintended modifications; user review. |
| **R1 â€” Cream design system foundation** | **Complete (awaiting review)** | R0 approval | Premium Cream tokens, typography/fonts, theme (light/dark), UI primitives, dialogs/sheets, loading/empty/error, edge-to-edge/nav/status, a11y baseline. | Lint/typecheck/test/doctor pass; design system reusable; no gameplay/hearts/sessions/versioning/release/workflow changes. |
| **R2 â€” Full app shell/navigation redesign** | **Complete (awaiting review)** | R1 | Redesign all non-gameplay screens/routes: Home, lobbies/selection, Profile, Settings, About, Language disposition, Daily removal/hide, navigation/transitions, truthful UI. | Lint/typecheck/test/doctor pass; Daily removed; all four games visible with Memory/Word clearly coming soon; no gameplay/heart/session/versioning/release changes. |
| **R3 - Number Merge & Color Flow premium rebuild** | **Complete (awaiting review)** | R1, R2 patterns | Gameplay HUD/board/result redesign; pause/resume/quit confirm; deterministic mechanics preserved; a11y/perf polish; tests. Session persistence/restore deferred to R4 boundary. | Mechanics preserved; pause/exit safe; no heart/session system; tests green. |
| **R4 â€” Heart System** | Not started | R3 | Timestamp heart model/store/provider/UI; Number Merge fail consumes; Color Flow/Memory Flash/Word Game no heart consumption (per decision); idempotent commits. | Edge-case tests pass; 0-heart gate correct; background/restart/clock-safe. |
| **R5 â€” Memory Flash implementation** | Not started | R1, R3 session/patterns, R4 rules | Genuine playable game: spec, deterministic logic/generator/validator, UI/animations, onboarding, win/loss, score/progress/result, pause/resume/session, progress integration, tests. No heart consumption. | Complete gameplay loop; tests green; no fake UI. |
| **R6 â€” Word Game implementation** | Not started | R1, R3 session/patterns, R4 rules | Genuine playable offline English game: legal dictionary/data audit, deterministic puzzle generation/validation, UI, onboarding, scoring/progress/result, pause/resume/session, tests. No heart consumption. | Complete gameplay loop; tests green; licensing/size documented. |
| **R7 â€” Versioning & GitHub Release automation** | Not started | R0 decisions, R3+ stable | versionName/versionCode policy implementation, bump docs/script, CI/release workflow split, tag-triggered GitHub Release, APK naming/changelog, least privilege, artifact preservation until verified. | Dry-run/validation passes; tag/version checks; no broken release path. |
| **R8 â€” Performance, QA, production release** | Not started | R5-R7 | Perf audit, APK size baseline/final, Android release config validation, full regression, physical device QA, production APK/release candidate. | Checks green; device QA reported (not fabricated); release artifacts validated. |

## 10. Completed work detail

### S0 â€” Baseline and compatibility (complete)
- Fixed Expo SDK patch mismatch; `npm ci` restored scripts. Exact checks passed: `npm run lint`, `npm run typecheck`, `npm test -- --ci` (7 suites, 36 tests), `npx expo-doctor` (20/20).
- Files: `package.json`, `package-lock.json`.

### S1 â€” Design System & Android Shell baseline (complete; superseded as direction)
- Lavender/ink baseline: shared tokens/primitives/screen shell, Home visual slice, Android safe-area/StatusBar/navigation bar handling, `expo-navigation-bar` added. Checks passed (lint/typecheck/test).
- **Superseded by Premium Cream Puzzle Arcade**; remains useful baseline code, not pending approval gate.

### R0 â€” Scope reset & docs checkpoint (complete; awaiting user review)
- Updated `AGENTS.md` and `IMPLEMENTATION_STATUS.md` to new approved scope/decisions.
- Replaced conflicting old scope (two-game-only, Memory/Word coming soon only, Daily excluded-old framing, old S1 gate, old roadmap).
- Added decision log, stage dependencies, versioning/release rules, Word Game constraints, heart per-game rules.
- **No app/source/build/deps/workflow changes.**

### R1 â€” Premium Cream Design System Foundation (complete; awaiting user review)
- **Scope honored**: R1 only. No R2 screen redesign, no gameplay, no Heart System, no session persistence, no versioning/release workflow changes, no dependency additions.
- **Asset/font audit**: inspected `assets/images/*` only (icon/splash/favicon PNGs; no fonts). No custom font assets added. Typography uses platform system fonts (`Georgia`/serif for display, system/sans-serif for body) to avoid licensing risk and extra bundle/download cost.
- **Theme foundation**: rebuilt semantic palette to Premium Cream in `src/theme/colors.ts` (warm cream/ivory/beige light base, deep charcoal/ink dark base, semantic text/border/state tokens, per-game accent tokens, warningSoft added). Updated `src/theme/useTheme.ts` to expose `colorScheme`.
- **Tokens**: expanded `src/theme/tokens.ts` with spacing/radius/stroke/elevation/motion, typography scale, `MAX_FONT_SIZE_MULTIPLIER`, min touch constant. Motion includes reduced-motion-aware press behavior in primitives.
- **Primitives updated**: `AppText`, `Button`, `Card`, `ListRow`, `SwitchRow`, `ProgressBar`, `Screen`, `ScreenHeader`, `PressableScale` refined for cream direction, accessibility, touch targets, and consistent borders/elevation. `Screen` adds `keyboardDismissMode="on-drag"`.
- **New foundation primitives**: `AppDialog` (modal dialog/sheet foundation), `EmptyState`, `LoadingState` in `src/components/ui/`.
- **Not changed intentionally**: app routes/screens, game logic/hooks, storage schemas, heart/session systems, `app.json`, `package.json`, lockfile, CI/workflows. Existing screens still use old layouts/content and will be redesigned in R2/R3+.
- **Checks run**: `npm run lint` PASS; `npm run typecheck` PASS; `npm test -- --ci` PASS (7 suites, 36 tests); `npx expo-doctor` PASS (20/20).

### R2 - Full App Shell & Navigation Redesign (complete; awaiting review)
- **Scope honored**: R2 only. No gameplay logic/hooks/rules changes, no Heart System, no session persistence, no Memory Flash/Word Game mechanics, no versioning, no GitHub Release automation. No dependency/app config/workflow changes.
- **Daily Challenge removed**: deleted `src/app/daily.tsx`, `src/components/home/DailyCard.tsx`, `src/features/daily/daily.ts`; removed Home Daily reference. Grep confirms no Daily/Daily Challenge references in `src/`.
- **Truthful settings**: removed non-functional Music/SFX/Break Reminder controls. `SettingsProvider` now persists only `vibration` and `language` (defensive load normalization; legacy unused keys ignored on next save). Vibration remains the only functional feedback toggle.
- **Language correction (minimal, approved)**: restored planned language metadata entries **English (US, available/selectable)**, **Bangla, Hindi, Spanish (visible, disabled, Coming soon)**. `LanguageCode` union includes planned codes; `SettingsProvider` preserves valid stored planned language codes. UI clarifies English is currently the only available UI language; no inaccurate app-wide â€œEnglish-onlyâ€ claim. No translations/localization libraries added. Word Game remains English-only by approved scope.
- **Game library**: Home now shows all four approved games via `GameLibrary` with intentional row composition (not repetitive 2-up card grid). Number Merge/Color Flow show playable level; Memory Flash/Word Game clearly marked **Coming Soon/In development** with no fake play route.
- **Lobby**: `src/app/game/[id].tsx` redesigned; playable games keep play CTA and level stats; coming-soon games show explicit non-playable message and no fake button/screen.
- **Profile**: redesigned with local-progress composition, XP/level summary, progress bar, rename flow, and local-only messaging; uses existing profile/progress data stores.
- **About**: redesigned with Premium Cream composition and truthful details (version, publisher, offline/on-device).
- **Navigation/shell**: root stack unchanged structurally; R1 `Screen`/`ScreenHeader` provide consistent back behavior and safe-area layout. No fake routes added.
- **Registry accents**: updated game accents to Premium Cream-aligned per-game accents for shell/lobby presentation (presentation-only; no gameplay mechanics changed).
- **Cleanup**: removed unused `src/components/home/GameCard.tsx` (replaced by `GameLibrary`).
- **Preserved data**: profile/settings/progress storage keys/shapes preserved compatibly.
- **Checks run**: `npm run lint` PASS; `npm run typecheck` PASS; `npm test -- --ci` PASS (7 suites, 36 tests); `npx expo-doctor` PASS (20/20).

### R3 - Number Merge & Color Flow Premium Rebuild (complete; awaiting review)
- **Scope honored**: R3 only. No Heart System, no session persistence/restore, no Memory Flash/Word Game mechanics, no versioning, no GitHub Release automation, no dependency/app config/workflow changes. R2 shell screens not redesigned.
- **Number Merge**: rebuilt play screen/HUD/board/result with Premium Cream styling, clear objective, score/moves-left/target/highest/next-tile, pause/restart/exit flows, win/loss result panel, and non-color tile marks for accessibility. Preserved deterministic engine/rules/generator/solver.
- **Color Flow**: rebuilt play screen/HUD/board/result with Premium Cream styling, paths/filled/open progress, endpoint marks, clearer path rendering, pause/restart/replay/exit flows, completion result panel. Preserved deterministic Hamiltonian generator/validator/logic rules.
- **Reliability/UX**: pause excludes paused time from duration; restart resets current level state; exit confirms and does not alter progress; active interaction disabled during pause/end states; Number Merge drop guard prevents double merge resolution in same tick. Color Flow pause ends active stroke to avoid accidental stroke carryover.
- **Accessibility/performance**: semantic labels/hints/live regions on key controls/results; 48dp targets via shared buttons; tile/endpoint marks add non-color cues; reduced-motion respected in existing PressableScale and tile animation; lightweight render updates.
- **Tests**: updated `src/games/numberMerge/__tests__/logic.test.ts` to cover `canMerge` board signature, no-move/unknown-tile/out-of-bounds/unique-full-board cases. All existing engine/game tests still pass.
- **Checks run**: `npm run lint` PASS; `npm run typecheck` PASS; `npm test -- --ci` PASS (7 suites, 39 tests); `npx expo-doctor` PASS (20/20).
- **Known limitations / not tested**: no physical Android device testing performed/fabricated; no APK size measurement; touch feel/perf validated only by code/static checks and unit tests; session persistence/restore intentionally deferred to R4.

### R4 - Heart System (complete; awaiting review)
- **Scope honored**: R4 only. No session persistence/restore, no Memory Flash/Word Game mechanics, no versioning, no GitHub Release automation, no dependency/app config/workflow changes, no monetization/currency/ads/IAP/paid refills. R2 shell/game-lobby screens only minimally extended for heart display/gating.
- **Architecture**: isolated pure logic in `src/features/hearts/hearts.ts` (timestamp-based normalization, sanitize, consume, duplicate-loss guard). React/provider integration in `src/features/hearts/HeartsProvider.tsx` using existing `src/storage/kv.ts` sync JSON storage. UI component `src/components/ui/HeartStatus.tsx`.
- **Persistence model**: `hearts.v1` = `{ version: 1, hearts: number, updatedAt: number }`. `updatedAt` is recovery baseline. Full hearts normalize baseline to now and clear countdown. Recovery computed from elapsed real time (`floor(elapsed/30min)`), capped at 5; remainder preserved by advancing baseline by recovered intervals.
- **Reliability**: normalization on load, on AppState active, and scheduled timeout at next recovery boundary. No `setInterval` polling loop for correctness; timers only refresh UI at boundary. Invalid/missing/future timestamps sanitized/clamped defensively. Clock-backward handled by clamping baseline to now (does not grant hearts, keeps state safe; limitation documented below).
- **Number Merge integration**: lobby (`src/app/game/[id].tsx`) shows HeartStatus, gates Play when 0 hearts, explains recovery. Play screen (`src/app/play/numberMerge.tsx`) requires heart to start attempt, creates per-attempt id, consumes exactly 1 heart only on actual loss via `consumeNumberMergeLoss(attemptId)`. Win does not consume. Pause/resume/restart UI/exit/navigation/background/close/restore flows do not consume. Duplicate loss consumption prevented by in-memory attempt-id guard and ref in play screen; restart after failed attempt is a new attempt requiring another heart.
- **Color Flow independence**: Color Flow lobby/play code has no heart imports/consumption; lobby explicitly states it does not use hearts and is always playable. HeartsProvider does not expose Color Flow consumption API.
- **Tests**: added `src/features/hearts/__tests__/hearts.test.ts` covering initial state, 30-min recovery, multi-recovery with remainder, closed-app elapsed recovery, full capacity, countdown, invalid/missing timestamps, clock backward, future timestamp, Number Merge loss consumption, full-to-recover baseline, zero-heart prevention, duplicate loss guard, win-no-consumption contract, Color Flow no-consumption design.
- **Checks run**: `npm run lint` PASS; `npm run typecheck` PASS; `npm test -- --ci` PASS (8 suites, 53 tests); `npx expo-doctor` PASS (20/20).
- **Known limitations / not tested**: no physical Android device testing performed/fabricated; no APK size measurement. Clock moving backward is handled defensively by clamping recovery baseline to now, which can delay next recovery by the backward jump but never grants extra hearts. `setTimeout` is used only for UI refresh at recovery boundary, not as source of truth. Session persistence/restore intentionally deferred to R5 boundary; current guard prevents duplicate consumption within app runtime for same attempt id.
- **No R5/R6/R7/R8 work started.**

### R5 - Memory Flash implementation (complete; awaiting review)
- **Scope honored**: R5 only. No Word Game, no Number Merge/Color Flow rule changes, no Heart rule changes, no session persistence/restore, no versioning/release automation, no daily/additional games, no monetization/ads/IAP/currency, no unrelated screen redesigns, no new dependencies.
- **Gameplay**: new offline memory-sequence game in `src/games/memoryFlash/` (deterministic generator, pure logic, hook) and `src/app/play/memoryFlash.tsx` + `src/components/memoryFlash/`. Player watches highlighted sequence, then reproduces it. Round clears advance to next round/sequence; wrong input ends run. Pause/resume/restart/exit dialogs included; resume replays current sequence fairly and clears partial input.
- **Difficulty formula**: `gridSize = level<=4?3 : level<=12?4 : 5`; `startLength = min(grid^2-1, 2 + floor((level-1)/2))`; `targetRounds = min(8, 3 + floor((level-1)/3))`; `sequenceLength(round)=min(grid^2-1, startLength + floor(round/2))`; `flashMs=max(320,620-tier*18-floor((level-1)/4)*10)`; `gapMs=max(120,220-tier*6)`. Seed = `hashSeed(memoryFlash:level:tier)`, per-round RNG via `mixSeed`; sequences are shuffled unique cells (no duplicates).
- **Scoring/XP**: score += `sequenceLength*10` per cleared round. Result `GameResult` uses `moves=roundsCleared`, `moveLimit=targetRounds`. XP uses existing `progressStore` contract: win on new/current level = `min(60,20+level*2)`; win on already-cleared level = 5; loss = 0. `recordResult` prevents level inflation on loss and is called once in hook finish path; hook has `reportedRef` guard preventing duplicate completion.
- **Heart independence**: no `useHearts`/heart consumption imports in memoryFlash game/play/components; lobby states “Memory Flash does not use hearts and is always playable”. Playable at 0 hearts; no `consumeNumberMergeLoss` path.
- **Safety/reliability**: input ignored during showing/roundWon/paused/ended; `applyInput` rejects invalid/over-length input; timers cleared on pause/restart/unmount; finish guarded by `reportedRef`; no session persistence/restore.
- **UI/a11y**: Premium Cream tokens/components, responsive square board, sequence playback highlight, selected-step numbers (non-color cue), wrong-input flash, reduced-motion respected via Reanimated/PressableScale, accessible labels/states, 48dp targets.
- **Tests added**: `src/games/memoryFlash/__tests__/generator.test.ts`, `src/games/memoryFlash/__tests__/logic.test.ts`, `src/features/progress/__tests__/progressStore.memoryFlash.test.ts`.
- **Checks run**: `npm run lint` PASS; `npm run typecheck` PASS; `npm test -- --ci` PASS (11 suites, 63 tests); `npx expo-doctor` PASS (20/20).
- **Known limitations / not tested**: no physical Android device testing/fabrication; no APK size measurement. Pause/resume replays current sequence (fair but reveals sequence again). No session persistence/restore. No audio/haptics beyond existing PressableScale. Word Game still Coming Soon.

## 11. Current git/worktree state (R5 checkpoint)

- **Branch**: `main`
- **Tracked modified files**: `AGENTS.md`, `IMPLEMENTATION_STATUS.md`, `src/app/game/[id].tsx`, `src/app/index.tsx`, `src/app/play/colorFlow.tsx`, `src/app/play/numberMerge.tsx`, `src/app/profile.tsx`, `src/app/settings/about.tsx`, `src/app/settings/index.tsx`, `src/app/settings/language.tsx`, `src/components/colorFlow/FlowBoard.tsx`, `src/components/colorFlow/FlowResult.tsx`, `src/components/colorFlow/flowColors.ts`, `src/components/home/HomeHeader.tsx`, `src/components/numberMerge/Board.tsx`, `src/components/numberMerge/ResultPanel.tsx`, `src/components/numberMerge/TileView.tsx`, `src/components/ui/AppText.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/ListRow.tsx`, `src/components/ui/PressableScale.tsx`, `src/components/ui/ProgressBar.tsx`, `src/components/ui/Screen.tsx`, `src/components/ui/ScreenHeader.tsx`, `src/components/ui/SwitchRow.tsx`, `src/features/settings/SettingsProvider.tsx`, `src/games/colorFlow/useColorFlowGame.ts`, `src/games/numberMerge/__tests__/logic.test.ts`, `src/games/numberMerge/useNumberMergeGame.ts`, `src/games/registry.ts`, `src/i18n/languages.ts`, `src/theme/colors.ts`, `src/theme/tokens.ts`, `src/theme/useTheme.ts`.
- **Deleted tracked files**: `src/app/daily.tsx`, `src/components/home/DailyCard.tsx`, `src/components/home/GameCard.tsx`, `src/features/daily/daily.ts`.
- **New untracked files**: `src/components/home/GameLibrary.tsx`, `src/components/ui/AppDialog.tsx`, `src/components/ui/EmptyState.tsx`, `src/components/ui/LoadingState.tsx`.
- **Not changed**: gameplay rule/engine files (`src/games/numberMerge/generator.ts`, `logic.ts`, `solver.ts`, `src/games/colorFlow/generator.ts`, `logic.ts`, generator/logic tests except Number Merge logic test additions), storage engine, progress/profile data schemas, `package.json`, `package-lock.json`, `app.json`, `.github/workflows/*`, Android/iOS native dirs.

## 12. Key architectural decisions / constraints

- **Persistence**: local sync JSON via `expo-sqlite/kv-store` (`src/storage/kv.ts`); versioned keys and migration-aware reads/writes required for future schema changes.
- **Game architecture**: deterministic RNG/generators/solvers in `src/games/*` and `src/engine/*`; preserve existing mechanics.
- **Navigation**: Expo Router file routes; R2/R5/R6 will add/remove routes as approved.
- **Theming**: semantic tokens in `src/theme/*`; R1 will rebuild for Premium Cream direction with light/dark.
- **Hearts**: timestamp-based `hearts.v1`, pure normalization/consume logic, AppState/foreground normalization, idempotent loss consumption. Only Number Merge consumes initially.
- **Sessions**: versioned per-game session snapshots, resume on launch, no heart consume on pause/quit/background/restore.
- **Release**: tag-driven GitHub Release workflow separate from CI; versionCode monotonic starting 10001 for 1.0.1.

## 13. Risks / watchlist

- **Scope size**: four production-quality games + full redesign + hearts/sessions/release is large; keep stages small and gated.
- **Word Game data**: dictionary licensing and APK size risk; audit before implementation.
- **Memory/Word specs**: need clear game-design specs in R5/R6 before coding.
- **Daily removal**: existing `src/app/daily.tsx`, home daily card, and settings/routes references must be removed/hidden cleanly in R2.
- **Inert settings**: Music/SFX/Break Reminder currently misleading; fix in R2/R3 as appropriate.
- **No device QA yet**: physical Android testing required before release; never fabricate.
- **Version metadata drift**: `app.json` currently `1.0.0`, no `versionCode`; align in R7 with approved rules.

## 14. Next approved action (exact)

1. **Await user review of R2 full app shell/navigation redesign.**
2. After explicit approval, start **R6 - Word Game implementation** only. R5 is complete and awaiting review; do not begin R6 until user explicitly approves R5.

## 15. Fresh OpenCode session resume instructions

1. `cd D:\shoudo\projects\plexton`
2. Read `AGENTS.md` and `IMPLEMENTATION_STATUS.md` fully.
3. Run `git status --short` and `git branch --show-current` (expect `main`).
4. Confirm latest approved stage in this file; **do not start R1 until user explicitly approves R0**.
5. Work one stage at a time; after each stage run `npm run lint`, `npm run typecheck`, `npm test -- --ci`, and `npx expo-doctor` when config/deps change.
6. Review `git diff --stat` and `git status`; update this file with files changed, checks, risks, implemented/partial/untested, and next action.
7. Never fabricate device/APK measurements; never add out-of-scope games/monetization.

