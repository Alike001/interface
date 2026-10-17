---
type: changed
area: docs
pr: 859
breaking: false
---

`VITE_INDEXER_GRAPHQL_URL` is now documented in the README and in every env file, including how to run the SubQuery indexer locally and what degrades without it. With no indexer configured the app logs its warning once per runtime instead of on every route.
