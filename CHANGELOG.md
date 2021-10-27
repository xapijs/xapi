# 2.0.0 (27 Oct 2021)

- Changed public API to use single object parameter
- Added full unit test coverage for node/dom environments
- Added new `useCacheBuster` feature for GET methods (Thanks [@wuzzo-mike](https://github.com/wuzzo-mike)!)
- Refactored entire library structure
- Bumped dependencies

# 1.2.3 (6 Oct 2021)

- Bumped dependencies
- Improved node testing

# 1.2.2 (7 Sep 2021)

- Bumped `axios` to solve security vulnerability
- Bumped dependencies

# 1.2.1 (3 Jul 2021)

- Document resources can now accept any content type ([#167](https://github.com/xapijs/xapi/issues/167))
- Query parameter decoding now correctly handling plus signs ([#175](https://github.com/xapijs/xapi/issues/175))
- Bumped dependencies

# 1.2.0 (23 Mar 2021)

- Added `toBasicAuth()` helper method ([#145](https://github.com/xapijs/xapi/pull/145))
- Updated e2e GitHub Actions workflow to run simultaneously ([#155](https://github.com/xapijs/xapi/pull/155))

# 1.1.0 (16 Mar 2021)

- Added `sendStatements()` method
- Added `voidStatements()` method
- Fixed return types for `getStatement()`, `getStatements()` and `getMoreStatements()` when requesting attachments
- Bumped dependencies

# 1.0.1 (12 Mar 2021)

- Fixed optional chaining not being transpiled with Babel on arm-64 devices ([#146](https://github.com/xapijs/xapi/issues/146))

# 1.0.0 (7 Mar 2021)

- The officially stable launch of xAPI.js v1.0.0! 🎉
- Added additional getting started examples
- Improved readme

# 0.6.10 (12 Jan 2021)

- Bumped `axios` to solve security vulnerability
- Bumped `node-notifier` to solve security vulnerability

# 0.6.9 (18 Oct 2020)

- Bundle external, non built-in dependencies for axios

# 0.6.8 (18 Oct 2020)

- Fixed typo in TinCanLaunchData
- Bumped dependencies

# 0.6.7 (14 Oct 2020)

- Added exports for helper interfaces

# 0.6.6 (14 Oct 2020)

- Fixed hash data returning in launch param helpers
- Improved multipart/mixed detection
- Added Prettier
- Bumped dependencies

# 0.6.5 (4 Oct 2020)

- Added missing parameter `since` when retrieving multiple Documents

# 0.6.4 (27 Sep 2020)

- Fixed Statement query interfaces for `format` parameter

# 0.6.3 (27 Sep 2020)

- Fixed xAPI Launch not returning error in Promise
- Added coercion for `actor.account`

# 0.6.2 (22 Sep 2020)

- Added additional constructor parameter to set XAPI version header

# 0.6.1 (21 Sep 2020)

- Coerce `actor` string arrays to strings if found in query string

# 0.6.0 (15 Sep 2020)

- Added `getXAPILaunchData()` method
- Added `getTinCanLaunchData()` method
- Added Terser to produce minified bundles

# 0.5.0 (12 Sep 2020)

- Fixed `getMoreStatements()` to use correct URL
- Fixed error if no `Content-Type` header is returned from LRS
- Changes responses to return entire `AxiosResponse` instead of `data` property (For ETag support)
- Added support for sending ETags with requests where required/optional

# 0.4.0 (8 Sep 2020)

- Added Activities Resource

# 0.3.0 (26 Aug 2020)

- Fixed Rollup configuration to export for UMD (Browser), CJS (Node) and ESM (Browser)

# 0.2.1 (5 Aug 2020)

- Fixed issue when using `getStatements()` and querying with `actor` parameter (https://github.com/xapijs/xapi/issues/34)

# 0.2.0 (28 May 2020)

- Split out SCORM profile, cmi5 profile, cmi5 demo into separate repos
- Module now exports as a single class
- Added State Resource documentation
- Added Activity Profile Resource documentation
- Added Agent Profile Resource documentation
- Modified authentication handling as per spec
- Added About Resource and documentation
- Added documentation for attachments
- Added support for deletion of multiple State documents
- Added Agents Resource and documentation
- Moved documentation to GitBook
- Scoped packages to `@xapi` namespace

# 0.1.0 (11 May 2020)

- cmi5 profile: Implemented profile for cmi5 defined statements
- cmi5 profile: Added additional helpers for cmi5 allowed statements
- cmi5 profile: Added demo
- SCORM profile: Added additional methods (WIP)
- SCORM profile: Added Jest tests
- xAPI: Renamed `LRSConnection` to `XAPI`
- xAPI: Added Activity Profile API
- xAPI: Added Agent Profile API
- xAPI: Added Activity State API
- xAPI: Added Jest tests for new APIs
- Global: Added eslint
- Global: Added Rollup bundling for umd/esm export

# 0.0.3 (21 Apr 2020)

- Extended documentation for xAPI Wrapper
- Added `getMoreStatements()` method

# 0.0.2 (14 Apr 2020)

- Added Jest unit tests for LRSConnection
- Added `voidStatement()` and `getVoidedStatement()` methods
- Updated `getStatements()` to support queries

# 0.0.1 (10 Feb 2020)

- Added xAPI LRS connection and statement getting/sending (WIP)
- Added SCORM Profile for performing SCORM style xAPI communications (WIP)
