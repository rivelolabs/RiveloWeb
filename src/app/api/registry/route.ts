import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { validateRegistration } from "@/lib/directory";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const own = new URL(request.url);
  const allowed = [own.origin, "https://rivelolabs.com", "https://www.rivelolabs.com"];
  if (process.env.NODE_ENV === "development") allowed.push(`http://localhost:${own.port || '3000'}`, `http://127.0.0.1:${own.port || '3000'}`);
  if (!origin || !allowed.includes(origin)) return NextResponse.json({error:"Please submit from the product directory."},{status:403});
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({error:"Please use the registration form."},{status:415});
  let data: unknown;
  try {
    if (Number(request.headers.get("content-length") || 0) > 6000) return NextResponse.json({error:"Your submission is too long."},{status:413});
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Empty body");
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 6000) { await reader.cancel(); return NextResponse.json({error:"Your submission is too long."},{status:413}); }
      chunks.push(value);
    }
    data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return NextResponse.json({error:"Please check your details and try again."},{status:400}); }
  if (!validateRegistration(data)) return NextResponse.json({error:"Check your product name, website URL, genre, and contact email."},{status:400});
  const directory = process.env.DIRECTORY_DATA_DIR || (process.env.NODE_ENV !== "production" ? path.join(process.cwd(), ".data", "registry") : null);
  if (!directory) return NextResponse.json({error:"Product registration is temporarily unavailable. Please try again later."},{status:503});
  const normalized = { requestId: data.requestId, name:data.name.trim(), url:new URL(data.url).href, genre:data.genre, type:data.type, tagline:data.tagline.trim(), email:data.email.trim().toLowerCase() };
  try {
    await mkdir(directory, { recursive:true, mode:0o700 });
    const file = path.join(directory, `${data.requestId}.json`);
    const record = { ...normalized, status:"pending", submittedAt:new Date().toISOString() };
    try { await writeFile(file, JSON.stringify(record, null, 2), {flag:"wx", mode:0o600}); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      const prior = JSON.parse(await readFile(file, "utf8"));
      if (Object.entries(normalized).some(([key,value]) => prior[key] !== value)) return NextResponse.json({error:"Please refresh the form and try again."},{status:409});
    }
    return NextResponse.json({success:true, id:data.requestId, status:"pending"}, {status:201, headers:{"Cache-Control":"no-store"}});
  } catch { return NextResponse.json({error:"We couldn’t save your submission. Please try again."},{status:503}); }
}
