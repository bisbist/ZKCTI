const BASE = "http://localhost:8000";

export async function getRandomSample() {
  const res = await fetch(`${BASE}/generate-random-sample`);
  return await res.json();
}

export async function predict(features) {
  const res = await fetch(`${BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features })
  });
  return await res.json();
}

export async function generateProof() {
  const res = await fetch(`${BASE}/generate-proof`, {
    method: "POST"
  });

  return await res.json(); // expects { proof, public }
}

export async function verifyProof() {
  const res = await fetch(`${BASE}/verify-proof`, {
    method: "POST",
  });
  return await res.json(); // {verified: true/false, log}
}
