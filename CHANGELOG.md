# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-05-17

### Added

- **Beatmap Leaderboards:** Added a dedicated leaderboard page for individual beatmaps (`/beatmapsets/{beatmapsetId}/{beatmapId}`), accessible via the search bar or by clicking a user's play on their profile.
- **Beatmap Search:** Added a new "Beatmap" search mode to the global `SearchBar`. It smartly parses and resolves various formats including raw IDs, beatmapset IDs, shortened links, and full osu! URLs.
- **API Caching:** Implemented a simple in-memory caching system to reduce redundant calls to external APIs and improve overall load times.

### Changed

- **Beatmap Modal Overhaul:** Upgraded the `BeatmapModal` with tabbed navigation. It now defaults to a new "Play Stats" view, alongside the classic "Map Info" view. Audio preview handling and state cleanup on close have also been improved.
- **Generic Leaderboard Components:** Completely refactored the core leaderboard UI (`LeaderboardTable`, `LeaderboardFilters`, `LeaderboardRow`, `LeaderboardCard`, and `LeaderboardPagination`) to be generic. They now accept arbitrary row data and snippets, allowing them to be reused seamlessly across both Global and Beatmap leaderboards.

---

## [1.0.0] - 2026-05-12

**The "Hub" Update**

Welcome to the 1.0.0 release! This update marks the milestone where the project transitions from a profile viewer into a larger platform. With new capabilities unlocked from the API, the scope has increased for further features.

### Added

- **Global Leaderboards:** Introduced a brand-new leaderboard page to see how players stack up against each other.
- **Leaderboard Filtering:** Added basic filtering options to the leaderboard, allowing users to sort rankings by **Type** (PP vs. Score) and by **Region/Country**.

### Changed

- **Project Rebrand:** Officially renamed the project from `osudroid-profile` to `osudroid-hub` to better reflect its expanding scope.
- **Documentation & Branding:** Updated all project documentation, readmes, and internal references to align with the new `osudroid-hub` identity.
