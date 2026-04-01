# Bugs Found

## Backend

1. TestGenerationController — validation returns plain string not JSON
   Returns: "Feature description is required"
   Should return: {"message": "Feature description is required"}
   Frontend JSON.parse breaks on plain string

2. RegisterPage — after adding email verification, register endpoint returns
   {message, email} but RegisterPage still calls login({token: data.token})
   which is now undefined. User gets logged in with no real token.

3. RegisterPage catch block — same bug as LoginPage had. If backend offline,
   it silently logs user in with a fake token.

4. ChatController — only sends the LAST user message to AI, not conversation
   history. So the AI has zero context from previous messages in the chat.

5. GlobalExceptionHandler — no handler for IllegalArgumentException so it
   falls through to the generic 500 handler instead of returning 400.

6. AuthContext — JWT expires after 24 hours on backend but frontend never
   checks expiry. User stays "logged in" in UI but all API calls return 401.

7. ExportBar — dynamically imports CDN libs on every single click. If CDN
   is down, export silently fails with no error message shown to user.

8. RegisterPage imports styles from LoginPage.module.css instead of its own
   CSS file — relies on LoginPage styles existing which may not always match.
