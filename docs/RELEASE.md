# Release Process

## Versioning
- Human-readable version: `package.json` `version` and `app.json` `expo.version` must match.
- Android `versionCode`: set in `app.json` `expo.android.versionCode`. Must monotonically increase for every release; never reuse or decrease.
- Current release target: **1.0.1** (`versionCode` **10001**).

## CI test APK (existing workflow)
- Workflow: `.github/workflows/android-apk.yml`
- Triggers: push to `main`, `workflow_dispatch`.
- Runs typecheck, tests, lint, Expo prebuild, Gradle `assembleRelease` (arm64-v8a).
- Uploads installable APK artifact named `plexton-v<version>-<sha>-arm64-v8a.apk`, retention 14 days.
- This workflow does **not** create GitHub Releases or tags.

## Production release (tag-triggered)
- Workflow: `.github/workflows/release.yml`
- Trigger: push of tags matching `vX.Y.Z`, or manual dispatch with a tag input.
- Validates tag matches `package.json`/`app.json` version.
- Builds release APK, creates GitHub Release, attaches APK, generates release notes.
- **Do not create/push production tags during normal development.**

## Release checklist
1. Ensure `main` is green (lint/typecheck/test/doctor, CI APK build).
2. Bump `package.json` version, `app.json` expo.version, and increment `expo.android.versionCode`.
3. Update `package-lock.json` version fields.
4. Update docs/changelog as needed.
5. Commit version bump on `main`.
6. Create and push tag `vX.Y.Z` only when intentionally publishing production release.
7. Confirm GitHub Release workflow succeeds and APK asset is attached.

## Safety
- Least-privilege permissions (`contents: read` for CI, `contents: write` only for release workflow).
- No secrets required for unsigned debug/release artifact flow as currently configured.
- Failed builds must not publish releases (release job builds/tests before creating release).
