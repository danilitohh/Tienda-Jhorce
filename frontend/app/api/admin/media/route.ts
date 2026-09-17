import { Readable } from "node:stream";
import { GridFSBucket, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { fail, ok } from "@backend/http/api-response";
import { adminDataError, requireAdminSession } from "@/lib/admin-route";
import { hasTrustedOrigin } from "@/lib/auth-route";
import { getMongoDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const supportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

// Accept only real browser image entries so text fields cannot be persisted as media.
function isFile(value: FormDataEntryValue | null): value is File { return value !== null && typeof value === "object" && typeof value.arrayBuffer === "function"; }

// Check the binary signature as well as the declared MIME type before exposing a file publicly.
function hasSupportedSignature(buffer: Buffer, type: string) {
  if (type === "image/jpeg") return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (type === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
}

// Store one image in MongoDB GridFS and return a stable public URL for the product document.
async function uploadImage(file: File, bucket: GridFSBucket) {
  if (!supportedImageTypes.has(file.type)) throw new Error("Solo aceptamos imágenes JPG, PNG o WebP.");
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Cada imagen debe pesar máximo 4 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasSupportedSignature(buffer, file.type)) throw new Error("El archivo seleccionado no parece ser una imagen válida.");

  const id = new ObjectId();
  const upload = bucket.openUploadStreamWithId(id, file.name.slice(0, 120), { metadata: { contentType: file.type } });
  await new Promise<void>((resolve, reject) => { upload.once("finish", resolve); upload.once("error", reject); Readable.from(buffer).pipe(upload); });
  return { id: id.toHexString(), url: `/api/media/${id.toHexString()}`, name: file.name, size: file.size, contentType: file.type };
}

// Upload media only from the authenticated admin workspace and never expose MongoDB credentials to the browser.
export async function POST(request: NextRequest) {
  const access = await requireAdminSession();
  if (access.response) return access.response;
  if (!hasTrustedOrigin(request)) return NextResponse.json(fail({ code: "INVALID_ORIGIN", message: "No pudimos validar el origen de la solicitud." }), { status: 403 });
  const database = await getMongoDatabase();
  if (!database) return NextResponse.json(fail({ code: "MEDIA_UNAVAILABLE", message: "MongoDB no está configurado para almacenar imágenes." }), { status: 503 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!isFile(file)) return NextResponse.json(fail({ code: "INVALID_MEDIA", message: "Selecciona una imagen para continuar." }), { status: 400 });
    const bucket = new GridFSBucket(database, { bucketName: process.env.MONGODB_MEDIA_BUCKET ?? "media" });
    return NextResponse.json(ok({ file: await uploadImage(file, bucket) }), { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Solo aceptamos") || error.message.includes("Cada imagen") || error.message.includes("no parece"))) return NextResponse.json(fail({ code: "INVALID_MEDIA", message: error.message }), { status: 400 });
    return adminDataError(error);
  }
}
