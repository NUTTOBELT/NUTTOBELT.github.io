const fs = require("fs");
const USER_ID = "39953283";

async function main() {
  const tokenRes = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.OSU_CLIENT_ID,
      client_secret: process.env.OSU_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    }),
  });
  if (!tokenRes.ok) throw new Error("token error " + tokenRes.status);
  const { access_token } = await tokenRes.json();

  const res = await fetch(
    `https://osu.ppy.sh/api/v2/users/${USER_ID}/mania?key=id`,
    { headers: { Authorization: `Bearer ${access_token}`, Accept: "application/json" } }
  );
  if (!res.ok) throw new Error("user error " + res.status);
  const u = await res.json();

  const s = u.statistics || {};
  const v4 = (s.variants || []).find((v) => v.variant === "4k") || {};

  const out = {
    pp: v4.pp ?? s.pp ?? null,
    global_rank: v4.global_rank ?? s.global_rank ?? null,
    country_rank: v4.country_rank ?? s.country_rank ?? null,
    accuracy: s.hit_accuracy ?? null,
    play_count: s.play_count ?? null,
    play_hours: s.play_time != null ? Math.round(s.play_time / 3600) : null,
    updated: new Date().toISOString(),
  };
  fs.writeFileSync("stats.json", JSON.stringify(out, null, 2));
  console.log(out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
