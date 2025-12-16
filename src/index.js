import * as commands from "./commands.js";
import { verifySig } from "./utils.js";

// Util to send a JSON response
const jsonResponse = obj => new Response(JSON.stringify(obj), {
  headers: {'Content-Type': 'application/json' }
});

// Util to verify a Discord interaction is legitimate
const handleInteractionVerification = (request, body, CLIENT_PUBLIC_KEY) => {
  const timestamp = request.headers.get('X-Signature-Timestamp') || "";
  const signature = request.headers.get('X-Signature-Ed25519') || "";
  if (!timestamp || !signature) return false;
  return verifySig(CLIENT_PUBLIC_KEY, timestamp, body, signature);
};

// Process a Discord interaction POST request
const handleInteraction = async ({ request, env, wait }) => {
  // Get the body text for signature verification
  const bodyText = await request.clone().text();

  // Verify a legitimate request
  if (!await handleInteractionVerification(request, bodyText, env.CLIENT_PUBLIC_KEY))
    return new Response(null, { status: 401 });

  // Work with JSON body going forward
  const body = await request.json();

  // Handle a PING
  if (body.type === 1)
    return jsonResponse({ type: 1 });

  // Otherwise, we only care for commands
  if (body.type !== 2)
    return new Response(null, { status: 501 });

  // Locate the command data
  const commandName = body.data.name;
  const commandsArray = Object.values(commands);
  const commandMatch = commandsArray.find(e => e.name == commandName);
  if (!commandMatch)
    return new Response(null, { status: 404 });
  else {
    try {
      const cmdResult = await commandMatch.execute({ interaction: body, auth: env.AUTH_KEY, wait });
      return jsonResponse(cmdResult);
    } catch (err) {
      console.log(body);
      console.error(err);
      return jsonResponse({
        type: 4,
        data: {
          content: 'An unexpected error occurred when executing the command.',
          flags: 64,
        },
      });
    }
  }
};

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    // Send interactions off to their own handler
    if (request.method === 'POST' && url.pathname === '/interactions')
      return await handleInteraction({ request, env, wait: context.waitUntil.bind(context) });
    return new Response(null, { status: 404 });
  }
}