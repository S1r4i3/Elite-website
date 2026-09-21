/** Upload constraints shared by client and server (no zod, keeps client bundles small). */
export const UPLOAD_LIMITS = {
  maxFiles: 10,
  maxBytes: 15 * 1024 * 1024,
  accept: {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/heic": [".heic"],
    "image/heif": [".heif"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "text/csv": [".csv"],
  } as Record<string, string[]>,
};

export const acceptedExtensions = Object.values(UPLOAD_LIMITS.accept).flat();
