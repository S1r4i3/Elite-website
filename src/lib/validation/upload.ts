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
    "application/zip": [".zip"],
    "application/x-zip-compressed": [".zip"],
  } as Record<string, string[]>,
};

export const acceptedExtensions = [...new Set(Object.values(UPLOAD_LIMITS.accept).flat())];

/** Human-readable list shown in the upload UI and in error messages. */
export const acceptedLabel = "PDF, JPG, PNG, HEIC, DOC(X), XLS(X), CSV or ZIP";
