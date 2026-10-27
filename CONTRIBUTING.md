# Contributing to TrackFlix

Thanks for helping out! 

1. Fork the repo and create a branch: `git checkout -b feature/short-name`
2. Follow the setup steps in the [README](README.md).
3. Make one focused change per pull request.
4. Before opening the PR:
   - `cd trackflix-backend && npm test`
   - `cd trackflix-frontend && npm run build`
5. Open the PR and fill in the template.

## Ground rules
- Never commit `.env` files or `serviceAccountKey.json`.
- New backend routes that touch user data must use `verifyToken` (and `requireOwner` for `/:userId` routes). Admin-only routes must use `requireAdmin`.
- Validate request bodies with the zod helpers in `trackflix-backend/middleware/validate.js`.
- Add a test in `trackflix-backend/tests/` for new endpoints.

Looking for something to work on? Check issues labelled `good first issue`.
