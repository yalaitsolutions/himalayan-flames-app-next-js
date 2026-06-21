// ============================================================
//  Image helper — resolve a stored `img` value to a usable src.
//  Uploaded images are stored as a 24-char MongoDB ObjectId and
//  served as raw bytes from /api/images/[id]. Everything else
//  (external URLs, legacy data: URIs) is returned unchanged.
// ============================================================
export function resolveImg(img) {
  if (!img) return "";
  // 24-char hex string => a stored Image document id
  if (/^[0-9a-f]{24}$/.test(img)) return `/api/images/${img}`;
  return img;
}

export default resolveImg;
