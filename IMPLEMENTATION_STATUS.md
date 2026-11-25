# IMPLEMENTATION_STATUS.md — Plexton

> **Single source of continuity for fresh sessions.** Read this file and `AGENTS.md` before making changes. Do not rely on chat history.

## 1. Project snapshot
- **Project**: Plexton — premium Android puzzle game.
- **Repo**: `asikrshoudo/plexton` | **Branch**: `main` | **Local**: `D:\shoudo\projects\plexton`
- **Stack**: Expo SDK ~58.0.26, React Native 0.88.1, React 19.3.0, TypeScript ~6.0.3, Expo Router ~58.0.32, Reanimated 4.7.1, Gesture Handler ~3.3.0, Safe Area Context ~5.11.1, expo-sqlite/kv-store ~58.0.18.
- **Platform**: Android-only (`app.json` `platforms:["android"]`, CNG; do not hand-edit `android/`/`ios/`).
- **Package manager**: npm (`package-lock.json` present, no bun lockfile).
- **Last updated**: 2026-11-26 (S0+S1 continuity checkpoint; no product implementation in this task).

## 2. Approved product scope (strict)
- **Playable this release**: **Number Merge** and **Color Flow** only.
- **Coming Soon only**: Memory Flash, Word Game — do not implement.
- **Excluded**: Daily Challenge (future update).
- **Forbidden**: new games, currency/coins, shop, achievements/unlock trees, ads/AdMob, banner/interstitial/rewarded ads, IAP, paid heart refills, any monetization, artificial urgency/failure mechanics.
- **Preserve**: existing deterministic game mechanics, existing player progress; use safe schema migrations.

## 3. Approved Heart System (NOT implemented yet — S4)
- Max **5** hearts.
- Recover exactly **1 heart every 30 minutes**.
- Recovery continues while app closed/background; **timestamps are source of truth**, not in-memory countdown.
- Persist locally; handle elapsed time, app restarts, clock-skew/edge cases defensively.
- Only a **failed attempt result** consumes 1 heart.
- **Never consume** on pause/quit/navigate/background/close/success/practice/onboarding.
- **Number Merge**: failure consumes 1 heart; at 0 hearts cannot start/retry until regen.
- **Color Flow**: playable at 0 hearts; no artificial failure mechanics.
- Cross-game recovery challenge: **proposed only, not approved for implementation**.

## 4. Gameplay/session requirements (later stages — S5)
- Persistent sessions: pause/resume, restore unfinished game after restart, persist board/progress state.
- Confirm before quitting active game.
- Never accidentally consume hearts when restoring/leaving a session.
- Do not break existing Number Merge or Color Flow mechanics.

## 5. Design/UX/Android requirements
- **Direction**: Premium Tactile Puzzle Arcade — polished, human-designed, consistent typography/spacing/color/radius/components, clear hierarchy, smooth purposeful animations.
- Responsive Android layouts, accessible touch targets/readable text, proper light/dark support.
- Proper Android edge-to-edge and safe-area handling.
- Avoid excessive glass, unnecessary decoration, generic template UI.

## 6. Android APK/performance/release requirements
- Final APK must be lightweight, responsive, stable, production-ready. Physical Android device testing required before release; emulator-only insufficient. Never fabricate device testing/APK measurements.
- Audit/optimize: dependency footprint, assets/fonts/bundles, re-renders/JS workload, board gestures/animations, Reanimated, memory/session state, startup/navigation, background/battery, offline, Hermes, Android release config, R8/minify/resource shrinking, ABI targeting after compatibility verification.
- Do not blindly remove deps or change build config; do not sacrifice correctness/stability/visual quality for size.
- Maintain measurable optimization checklist when S6 begins (baseline/final APK size, build config, device results, issues/fixes, rejected optimizations).

## 7. Development quality gates
- After each implementation stage: `npm run lint`, `npm run typecheck`, `npm test -- --ci`; `npx expo-doctor` when config/deps change.
- Add tests for new business logic; fix regressions before proceeding.
- Review `git diff` and `git status`; keep changes focused/reviewable; avoid destructive git commands.
- Do not silently change approved product requirements. Ask before material behavior changes.

## 8. Stage status

| Stage | Status | Summary |
|---|---|---|
| **S0 — Baseline & compatibility** | **Complete** | Expo patch mismatch fixed; `npm ci` restored script execution; lint/typecheck/test/doctor green. |
| **S1 — Design System & Android Shell** | **Initial implementation complete; HOME REVIEW PENDING** | Shared tokens/primitives/screen shell, Home visual slice, Android safe-area/status/nav bar handling. **Do not start S2 until explicit user approval of S1 Home screen.** |
| **S2 — Remaining shared screens & nav visual consistency** | Not started | Blocked on S1 approval. |
| **S3 — Number Merge & Color Flow screen polish/interaction quality** | Not started | After S2/approval. |
| **S4 — Heart System & timestamp-based recovery** | Not started | Approved design, not implemented. |
| **S5 — Persistent sessions, pause/resume, quit confirm, misleading excluded-release UI removal** | Not started | After S4/approval. |
| **S6 — Performance optimization & Android release config audit** | Not started |  |
| **S7 — Full regression, physical-device QA, production APK validation** | Not started |  |

## 9. Completed work detail

### S0 — Baseline and compatibility (complete)
- **Findings**: `npm run lint/typecheck/test` initially failed due missing/broken `.bin` shims; `npx expo-doctor` reported Expo SDK patch mismatches (`expo` ~58.0.26 expected, `expo-router` ~58.0.32 expected).
- **Fixes**: `npm install expo@~58.0.26 expo-router@~58.0.32 --no-audit --no-fund`; then `npm ci --no-audit --no-fund` to restore clean script execution.
- **Checks (exact scripts, post-fix)**: `npm run lint` PASS; `npm run typecheck` PASS; `npm test -- --ci` PASS (7 suites, 36 tests, 0 snapshots); `npx expo-doctor` PASS (20/20).
- **Files changed**: `package.json`, `package-lock.json`.
- **Notes**: No source/product changes in S0. npm install emitted deprecation warnings for transitive deps; no action taken.

### S1 — Design System & Android Shell (initial implementation complete, awaiting review)
- **Implemented**: semantic theme tokens (`src/theme/colors.ts`, `tokens.ts`), updated `useTheme`; shared UI primitives/screen shell (`AppText`, `Button`, `Card`, `Icon`, `ListRow`, `SwitchRow`, `Screen`, `ScreenHeader`, `SectionLabel`, `StatTile`, `ProgressBar`); Home-only polished visual slice (`src/app/index.tsx`, `components/home/*`); Android safe-area provider, StatusBar style, Android navigation bar style via `expo-navigation-bar`; `app.json` deduped `expo-build-properties`, updated splash/adaptive background.
- **Dependency added**: `expo-navigation-bar@~58.0.4` (SDK 58 compatible).
- **Checks**: `npm run lint` PASS; `npm run typecheck` PASS; `npm test -- --ci` PASS (7 suites, 36 tests, 0 snapshots). `npx expo-doctor` was 20/20 at S0 follow-up; dependency/config changed in S1 — run doctor before/at S2 start.
- **Intentional constraints**: No Heart System, no pause/resume, no session persistence, no game mechanic changes, no new games/Daily Challenge/ads/IAP/monetization. Existing navigation/functionality preserved.
- **Known S1 impact**: shared primitives changed, so non-Home screens inherit new base styling but have **not** been given screen-specific redesign/polish. This is expected; S2/S3 will handle.
- **Not yet done/verified**: no physical Android device screenshot/capture; dark mode not visually QA’d on device; Android nav bar behavior needs device QA across OEMs/API levels; Daily screen still contains old placeholder/misleading copy (excluded release, fix in S5); `app.json` plugin change should be validated by prebuild/CI.

## 10. Current git/worktree state (this checkpoint)
- **Branch**: `main`
- **Modified files (expected from S0/S1 + docs)**: `AGENTS.md`, `IMPLEMENTATION_STATUS.md`, `app.json`, `package-lock.json`, `package.json`, `src/app/_layout.tsx`, `src/app/index.tsx`, `src/components/home/DailyCard.tsx`, `src/components/home/GameCard.tsx`, `src/components/home/HomeHeader.tsx`, `src/components/home/PlayerCard.tsx`, `src/components/ui/AppText.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Icon.tsx`, `src/components/ui/ListRow.tsx`, `src/components/ui/ProgressBar.tsx`, `src/components/ui/Screen.tsx`, `src/components/ui/ScreenHeader.tsx`, `src/components/ui/SectionLabel.tsx`, `src/components/ui/StatTile.tsx`, `src/components/ui/SwitchRow.tsx`, `src/theme/colors.ts`, `src/theme/tokens.ts`, `src/theme/useTheme.ts`.
- **Unexpected changes**: none identified at checkpoint creation. Review `git diff` before any commit.
- **No product code changed in this documentation task**.

## 11. Key architectural decisions
- **Persistence**: local sync JSON via `expo-sqlite/kv-store` (`src/storage/kv.ts`); keys versioned (`*.v1`). Future schema changes require migration-safe read/write and preservation of existing progress/profile/settings.
- **Game architecture**: deterministic RNG/generators/solvers in `src/games/*` and `src/engine/*`; do not change mechanics.
- **Navigation**: Expo Router file routes; playable routes only for `numberMerge` and `colorFlow` (`src/games/routes.ts`).
- **Theming**: `useTheme()` returns palette + dark flag; semantic tokens in `src/theme/*`; system color scheme currently drives theme.
- **Edge-to-edge**: `SafeAreaProvider` at root; screen shells use `useSafeAreaInsets`; Android nav bar button style set via `expo-navigation-bar` `setStyle`; StatusBar style set by theme.
- **Hearts (planned)**: timestamp-based `hearts.v1` model, pure normalization/consume logic, AppState/foreground normalization, idempotent loss consumption. Not implemented.
- **Sessions (planned)**: versioned per-game session snapshots (`session.<gameId>.v1`), resume on launch, no heart consume on pause/quit/background. Not implemented.

## 12. Risks / watchlist
- **S1 approval gate**: Home screen awaiting user review; no S2.
- **Shared primitive ripple**: non-Home screens visually changed by base primitives; need careful S2 pass without breaking functionality.
- **Daily screen copy**: still misleading/placeholder; excluded from release — must be made truthful in S5 or kept clearly non-misleading.
- **Settings**: Music/SFX/Break Reminder toggles still present but inert; Vibration works. S5/S3 cleanup per approved decision (hide/remove non-functional, keep Vibration).
- **Clock skew / heart fairness**: must be defensive in S4; no punitive behavior.
- **No device QA yet**: physical Android testing required before release.
- **Package install shape**: if npm scripts fail again, use `npm ci --no-audit --no-fund` before bypassing.

## 13. Next approved action (exact)
1. **Wait for user review/approval of S1 Home screen.** Do **not** start S2 or any product implementation.
2. After explicit S1 approval, begin **S2 — Remaining shared screens & navigation visual consistency**: audit all non-Home screens for base-style regressions, apply screen-specific Premium Tactile Puzzle Arcade polish, preserve functionality/routes, keep scope limited (no hearts/sessions/pause-resume/game mechanics). Run lint/typecheck/test (+ doctor if config/deps change).
3. If user requests Home changes before S2, make only requested Home/S1-scoped adjustments, rerun checks, update this file, and wait again.

## 14. Fresh OpenCode session resume instructions
1. `cd D:\shoudo\projects\plexton` (Windows path; repo root).
2. Read `AGENTS.md` and `IMPLEMENTATION_STATUS.md` fully.
3. Run `git status --short` and `git branch --show-current`; confirm you are on `main` and worktree matches Section 10 expectations.
4. Do **not** start S2 until user explicitly approves S1 Home screen.
5. Before any implementation stage: confirm scope against approved decisions; inspect only relevant files.
6. Use exact commands: `npm run lint`, `npm run typecheck`, `npm test -- --ci`, `npx expo-doctor` (when config/deps change). If shims missing, `npm ci --no-audit --no-fund`.
7. After each major stage: update `IMPLEMENTATION_STATUS.md` (status, files, checks, risks, next action), review `git diff --stat`, and report clearly.
8. Never fabricate device/APK measurements; never add forbidden scope items.