export const followUpDeferred = (applicationId, interToken, content) =>
  fetch(`https://discord.com/api/v10/webhooks/${applicationId}/${interToken}/messages/@original`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

export async function verifySig(key, timestamp, body, sig) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    Uint8Array.fromHex(key),
    { name: 'ed25519' },
    false,
    ['verify']
  );
  return await crypto.subtle.verify(
    'ed25519',
    cryptoKey,
    Uint8Array.fromHex(sig, 'hex'),
    new TextEncoder().encode(timestamp + body)
  );
}