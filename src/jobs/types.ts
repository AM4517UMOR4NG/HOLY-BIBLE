export type ImportVersionJobData = {
  uploadId?: string;
  versionCode: string;
  filename?: string;
  jsonPayload?: any;
};

export type IndexVersesJobData = {
  versionCode: string;
  verseIds?: string[];
};


