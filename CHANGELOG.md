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