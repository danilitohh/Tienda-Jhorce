import { Readable } from "node:stream";
import { GridFSBucket, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getMongoDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

// Stream a catalog image from GridFS without loading it into the page bundle or exposing database access.
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const id = (await context.params).id;
  if (!ObjectId.isValid(id)) return new NextResponse("Not found", { status: 404 });
  const database = await getMongoDatabase();
  if (!database) return new NextResponse("Media unavailable", { status: 503 });

  const bucket = new GridFSBucket(database, { bucketName: process.env.MONGODB_MEDIA_BUCKET ?? "media" });
  const file = await bucket.find({ _id: new ObjectId(id) }).limit(1).next();
  if (!file) return new NextResponse("Not found", { status: 404 });

  const stream = bucket.openDownloadStream(new ObjectId(id));
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, { headers: { "Content-Type": file.metadata?.contentType ?? "application/octet-stream", "Content-Length": String(file.length), "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
}
