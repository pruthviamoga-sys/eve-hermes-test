import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export default function FlowResultsPage() {
  const file = path.resolve(process.cwd(), "flow-results.log");
  const lines = existsSync(file)
    ? readFileSync(file, "utf8").trim().split("\n").reverse()
    : [];

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Flow results</h1>
      {lines.length === 0 ? (
        <p>No runs yet.</p>
      ) : (
        lines.map((line, i) => {
          const r = JSON.parse(line);
          return (
            <div key={i} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <div>
                <b>{r.flow}</b> at {r.at}
              </div>
              <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(r.data, null, 2)}</pre>
            </div>
          );
        })
      )}
    </main>
  );
}