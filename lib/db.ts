import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const DB_PATH = path.join(process.cwd(), "posters.json");

interface PosterData {
  id: string;
  title: string;
  time: string;
  location: string;
  organizer: string;
  description?: string;
  join_url?: string;
  poster_base64?: string;
  copies?: string;
  is_ecnu: boolean;
  created_at: string;
}

function readDb(): Record<string, PosterData> {
  if (!fs.existsSync(DB_PATH)) {
    return {};
  }
  try {
    const content = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function writeDb(data: Record<string, PosterData>): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getDb(): Record<string, PosterData> {
  return readDb();
}

export function createPoster(data: Omit<PosterData, "id" | "created_at">): string {
  const db = readDb();
  const id = nanoid(8);
  
  db[id] = {
    ...data,
    id,
    created_at: new Date().toISOString(),
  };
  
  writeDb(db);
  return id;
}

export function getPoster(id: string): PosterData | null {
  const db = readDb();
  return db[id] || null;
}

export function updatePosterBase64(id: string, base64: string): void {
  const db = readDb();
  if (db[id]) {
    db[id].poster_base64 = base64;
    writeDb(db);
  }
}

export function updatePosterCopies(id: string, copies: string): void {
  const db = readDb();
  if (db[id]) {
    db[id].copies = copies;
    writeDb(db);
  }
}

export function getAllPosters(): PosterData[] {
  const db = readDb();
  return Object.values(db).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
