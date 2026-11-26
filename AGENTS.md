# AGENTS.md — Plexton Project Rules

> **Permanent project guidance.** Read this and `IMPLEMENTATION_STATUS.md` before making changes. Update both when approved scope/decisions change.

## 1. Project identity
- **Project**: Plexton — premium Android puzzle game.
- **Repo**: `asikrshoudo/plexton`
- **Local path**: `D:\shoudo\projects\plexton`
- **Branch**: `main`
- **Stack**: Expo SDK ~58, React Native 0.88.1, React 19.3, TypeScript ~6.0.3, Expo Router ~58, Reanimated, Gesture Handler, Safe Area Context, expo-sqlite/kv-store.
- **Platform priority**: Android. `app.json` is Android-only CNG; do not hand-edit `android/` or `ios/`.

## 2. Expo SDK 58 rules
- Do not trust training data for Expo APIs. Before touching Expo/EAS/RN APIs, read `package.json` major version and verify against `https://docs.expo.dev/versions/v58.0.0/` and `https://docs.expo.dev/llms.txt`.
- Install packages with `npx expo install <package>` (SDK-compatible). No bun lockfile present.
- Commands: `npm run lint`, `npm run typecheck`, `npm test -- --ci`, `npx expo-doctor`.
- If `node_modules/.bin` shims are missing/broken, run `npm ci --no-audit --no-fund` from existing `package-lock.json` before bypassing scripts.

## 3. Approved product scope (R0 reset — 2026-11-26)

### Playable games
- **All four existing games must become genuinely playable, polished, production-quality experiences**: **Number Merge**, **Color Flow**, **Memory Flash**, **Word Game**.
- Do **not** add any additional games beyond these four until all four are production-quality.
- Do not create fake/placeholder game screens that merely look playable.

### Removed/excluded for current release
- **Daily Challenge is removed/hidden for the current release.** Do not leave misleading placeholder screens or navigation entries.

### Monetization/scope boundaries
- **No** currency/coins, shop, achievements/unlock trees, ads/AdMob/banner/interstitial/rewarded ads, IAP, paid heart refills, or any monetization.
- No artificial urgency/failure mechanics.

### Preservation
- Preserve existing deterministic game mechanics and existing player progress wherever possible.
- Use safe, migration-aware schema changes for persisted data.

## 4. Heart system (approved)

- **Max Hearts**: 5.
- **Recovery**: exactly 1 Heart every 30 minutes. Recovery continues while app is closed/background. **Timestamps are source of truth**, not in-memory countdown. Persist locally; handle elapsed time, app restarts, and clock-skew/edge cases defensively.
- **Consumption**: only an **actual failed attempt result** consumes 1 Heart. Pausing, quitting, navigating away, backgrounding, closing the app, or restoring a session must **never** consume a Heart.
- **Per-game rule (current approved decision)**:
  - **Number Merge**: failure consumes 1 Heart. At 0 Hearts, user cannot start/retry Number Merge until a Heart regenerates.
  - **Color Flow**: playable at 0 Hearts; no artificial failure mechanics.
  - **Memory Flash**: must **not** consume Hearts unless a separate, explicitly approved gameplay decision justifies it.
  - **Word Game**: must **not** consume Hearts unless a separate, explicitly approved gameplay decision justifies it.
- Do not introduce paid refills, ads, IAP, or currency.

## 5. Gameplay/session requirements

- Implement reliable gameplay persistence in appropriate stages: pause/resume, restore unfinished game after app restart, preserve board/state/score/moves/relevant progress, clear quit confirmation before abandoning active game.
- Never accidentally consume Hearts when restoring/leaving a session.
- Do not break existing Number Merge or Color Flow mechanics.
- New games (Memory Flash, Word Game) must have complete functional gameplay, proper instructions/onboarding, win/loss conditions where appropriate, score/progress/result handling, reliable state, pause/resume where appropriate, progress-system integration, and meaningful tests for logic/edge cases.

## 6. Word Game constraints (approved)

- **English-only initially**.
- **Fully offline**.
- Use a carefully selected, **legally usable** dictionary/word dataset.
- Keep APK size in mind; evaluate bundled asset size and licensing before adding data.

## 7. Design direction — Premium Cream Puzzle Arcade (supersedes S1)

- **Design direction**: Premium Cream Puzzle Arcade. S1 lavender/ink baseline is superseded as visual direction; S1 is baseline work, not a pending approval gate.
- **Visual principles**: warm cream/ivory/off-white/subtle beige primary foundation; deep ink/charcoal typography for strong contrast; carefully selected accent colors for individual games; soft sophisticated borders and subtle shadows; beautiful typography, consistent spacing, intentional visual hierarchy; premium cards and tactile interactive elements; smooth purposeful animations/transitions; properly designed light and dark themes; responsive Android layouts; accessible contrast/readable text/comfortable touch targets.
- **Avoid**: generic AI dashboard layouts, excessive gradients, glassmorphism, unnecessary floating elements, excessive rounded cards everywhere, random decorative icons/emojis, repetitive card grids making every screen identical, overly colorful interfaces without clear design system.
- **Scope**: apply cohesive design system consistently across the **entire app**, not just Home. Redesign all screens/routes including secondary screens, dialogs, loading/empty/error states.

## 8. Android/performance/release quality

- APK quality is release-critical: lightweight, responsive, stable, production-ready.
- Audit/optimize: dependency footprint, image/font/bundled asset sizes, React re-renders/JS-thread workload, board gestures/gameplay animations, Reanimated usage, memory retention/session state, startup/navigation, background/battery, offline functionality, Hermes, Android release config, R8/minification/resource shrinking, ABI targeting after compatibility verification.
- Do not blindly remove dependencies or change build config; do not sacrifice gameplay correctness, stability, or visual quality for size.
- Maintain measurable optimization checklist: baseline/final APK size when available, build config, device testing results, performance issues/fixes, rejected optimizations with reasons.
- **Physical Android device testing required before release; emulator-only insufficient. Never fabricate device testing or APK measurements.**

## 9. Versioning & release rules (approved)

- **Next public release version**: `1.0.1`.
- **Android `versionCode` starting point**: `10001`, then increase monotonically for every subsequent release. **Never reuse or decrease** `versionCode`.
- **Version format policy**: human-readable `versionName` follows intended sequence `1.0.1`–`1.0.9`, `2.0.1`–`2.0.9`, `3.0.1`..., etc. (as approved). `versionCode` must be monotonically increasing integer; mapping formula must be documented and validated before release automation (R7).
- Keep Expo app version, Android config, package version, and release metadata consistent.
- Every public APK release must have a unique version and tag (`vX.Y.Z`).
- Do not increment versions arbitrarily during development.
- **GitHub Releases**: version-tagged production APKs approved. Keep normal CI separate and preserve useful CI artifacts until release workflow is verified. Failed builds must never publish broken release. Least-privilege workflow permissions; no secrets/credentials exposed.

## 10. Development workflow

- After each implementation stage: `npm run lint`, `npm run typecheck`, `npm test -- --ci`; run `npx expo-doctor` when config/deps change.
- Add tests for new business logic; fix regressions before proceeding.
- Review `git diff` and `git status`; keep changes focused/reviewable; avoid destructive git commands.
- Do not silently change approved product requirements. Ask before decisions that materially change approved behavior.
- **Approval gate after every stage**. Do not implement multiple stages at once.
- Update `IMPLEMENTATION_STATUS.md` after every major stage. If context is near limit, checkpoint docs and stop; never leave partial work undocumented.

## 11. Architecture map

- `src/app/` — Expo Router screens/layouts only.
- `src/components/` — reusable UI/game/home components.
- `src/engine/` — deterministic RNG, difficulty, shared types.
- `src/features/` — profile/settings/progress/daily/storage-facing feature logic.
- `src/games/` — registry, routes, per-game logic/generator/solver/hooks/tests.
- `src/storage/kv.ts` — local sync JSON KV over `expo-sqlite/kv-store`.
- `src/theme/` — palette/tokens/shade/useTheme.
- `assets/images/` — icons/splash currently; audit before adding assets.
- `.github/workflows/` — CI/release workflows.

## 12. Known constraints / current state

- **S0 complete**. **S1 initial baseline complete** (lavender/ink Home slice + shared primitives) — superseded as visual direction by Premium Cream Puzzle Arcade; not a pending approval gate.
- **R0 documentation reset complete** (this checkpoint). **R1 not started; awaiting user review after R0.**
- Current app code still reflects pre-R0 scope in places (Memory/Word coming soon, Daily route present, inert settings, no hearts/sessions, old visual direction). These are implementation targets for later approved stages.
- `node_modules/` present; npm scripts pass after `npm ci` (last recorded S0/S1). Package-lock changes from S0/S1 dependency updates are present.
- No `eas.json`; CI builds Android APK via prebuild + Gradle artifact workflow. `android/` and `ios/` are generated, not committed.
- Physical Android device testing not yet performed/reported; never fabricate.