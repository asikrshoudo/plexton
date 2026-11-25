# AGENTS.md — Plexton Project Rules

## Project identity
- **Project**: Plexton — premium Android puzzle game.
- **Repo**: `asikrshoudo/plexton`
- **Local path**: `D:\shoudo\projects\plexton`
- **Branch**: `main`
- **Stack**: Expo SDK ~58, React Native 0.88.1, React 19.3, TypeScript ~6.0.3, Expo Router ~58, Reanimated, Gesture Handler, Safe Area Context, expo-sqlite/kv-store.
- **Platform priority**: Android. `app.json` is Android-only CNG; do not hand-edit `android/` or `ios/`.

## Expo SDK 58 rules
- Do not trust training data for Expo APIs. Before touching Expo/EAS/RN APIs, read `package.json` major version and verify against `https://docs.expo.dev/versions/v58.0.0/` and `https://docs.expo.dev/llms.txt`.
- Install packages with `npx expo install <package>` (SDK-compatible). No bun lockfile present.
- Commands: `npm run lint`, `npm run typecheck`, `npm test -- --ci`, `npx expo-doctor`.
- If `node_modules/.bin` shims are missing/broken, run `npm ci --no-audit --no-fund` from existing `package-lock.json` before bypassing scripts.

## Approved release scope (strict)
- **Only** Number Merge and Color Flow are playable in this release.
- Memory Flash and Word Game remain **Coming Soon** only; do not implement.
- Daily Challenge excluded from this release.
- **No** new games, currency/coins, shop, achievements/unlock trees, ads/AdMob, IAP, paid heart refills, or any monetization.
- Preserve existing deterministic game mechanics and existing player progress. Use safe migrations for schema changes.

## Heart system (approved, not implemented yet)
- Max 5 hearts; recover exactly 1 heart every 30 minutes.
- Recovery continues while app closed/background; timestamps are source of truth, not in-memory countdown.
- Persist locally; handle elapsed time, restarts, clock-skew/edge cases defensively.
- Only a **failed attempt result** consumes 1 heart. Pause/quit/navigate/background/close never consume.
- Number Merge failure consumes 1 heart. At 0 hearts, cannot start/retry Number Merge until regen.
- Color Flow remains playable at 0 hearts; no artificial failure mechanics.

## Gameplay/session requirements (later stages)
- Persistent sessions: pause/resume, restore unfinished game after restart, persist board/progress state, confirm before quitting active game.
- Never accidentally consume hearts when restoring/leaving a session.
- Do not break Number Merge or Color Flow mechanics.

## Design direction
- **Premium Tactile Puzzle Arcade**: polished, human-designed, consistent typography/spacing/color/radius/components, clear hierarchy, smooth purposeful animations, responsive Android layouts, accessible touch targets/readable text, proper light/dark support, proper edge-to-edge/safe areas.
- Avoid excessive glass, unnecessary decoration, generic template UI.
- S1 Home screen visual slice is implemented but **awaiting user review/approval**. Do not assume approval or roll out broadly before approval.

## Android/performance/release quality
- APK quality is release-critical: lightweight, responsive, stable, production-ready.
- Audit/optimize dependencies, assets, re-renders/JS workload, gestures/animations, Reanimated, memory/session state, startup/navigation, background/battery, offline, Hermes, Android release config, R8/minify/resource shrinking, ABI targeting after compatibility verification.
- Do not blindly remove deps or change build config; do not sacrifice correctness/stability/visual quality for size.
- Physical Android device testing required before release; emulator-only insufficient. Never fabricate device testing/APK measurements.

## Development workflow
- After each implementation stage: `npm run lint`, `npm run typecheck`, `npm test -- --ci`; run `npx expo-doctor` when config/deps change.
- Add tests for new business logic; fix regressions before proceeding.
- Review `git diff` and `git status`; keep changes focused/reviewable; avoid destructive git commands.
- Do not silently change approved product requirements. Ask before decisions that materially change approved behavior.
- Update `IMPLEMENTATION_STATUS.md` after every major stage. If context is near limit, checkpoint docs and stop; never leave partial work undocumented.

## Architecture map
- `src/app/` — Expo Router screens/layouts only.
- `src/components/` — reusable UI/game/home components.
- `src/engine/` — deterministic RNG, difficulty, shared types.
- `src/features/` — profile/settings/progress/daily/storage-facing feature logic.
- `src/games/` — registry, routes, per-game logic/generator/solver/hooks/tests.
- `src/storage/kv.ts` — local sync JSON KV over `expo-sqlite/kv-store`.
- `src/theme/` — palette/tokens/shade/useTheme.
- `assets/images/` — icons/splash only currently.

## Known constraints / current state
- S0 complete; S1 initial implementation complete and awaiting Home review approval. **Do not start S2** until explicit approval.
- `node_modules/` is present and npm scripts pass after `npm ci`. Package-lock changes from S0/S1 dependency updates are present; keep lockfile consistent.
- No `eas.json`; CI builds Android APK via prebuild + Gradle. `android/` and `ios/` are generated, not committed.