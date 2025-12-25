export const API_BASE = "http://localhost:5000/api/v1"; // your backend

export async function postJson(url: string, data: any) {
  const res = await fetch(API_BASE + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");

  return json;
}
