Soobin chat runs locally with `npm run dev`. It uses a Vite server middleware for
`POST /api/chat` and the same server handler as the Vercel Node function at
`api/chat.ts`. `vite preview` only previews the static build and does not run the API.

Put your Gemini key in the ignored `.env.local` file:

```dotenv
GEMINI_API_KEY=your-key-here
```

Restart the development server after changing it. Never add a `VITE_` prefix or
put the key in frontend code. An optional server-only `GEMINI_MODEL` setting can
override the default `gemini-3.1-flash-lite` model.

Edit `server/rachel-profile.json` to update Soobin's approved facts. Keep it to
public information; its contents are sent to Gemini with each question. Profile
sources are recorded there. The old sample achievements in `portfolioData.ts`
are deliberately not used as chatbot context.

Chat history lives in session storage in the visitor's browser tab. Up to 40
messages are retained; only the most recent 11 are sent for a reply. Closing the
chat preserves history. New chat clears it. Messages are sent through our server
to Google Gemini; this application does not persist them on the server.

The endpoint limits requests to 12 per IP per minute, one simultaneous provider
request per IP, 1,000 characters per question, 11 history messages, 12,000 history
characters, and a 24 KB request body. Provider calls time out after 20 seconds.
In-memory limits are best-effort per running server instance, not a global quota
across Vercel instances. For public traffic, add shared rate limiting or Vercel
Firewall rules and set provider billing/quota limits before relying on these
controls as spending protection. Grounding instructions reduce invented facts
but do not guarantee perfect model accuracy.

Run the server regression tests with:

```sh
node --import tsx --test server/chat.test.ts
```

Tests use fake provider responses and fake credentials. Real integration tests
must use the local endpoint, never expose the key in browser requests or logs.

To publish (only with approval), commit and push to GitHub. Never deploy with
Vercel CLI. Set `GEMINI_API_KEY` in the Vercel project's environment variables for
the appropriate environments before publishing; `.env.local` is never uploaded.
