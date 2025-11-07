// Placeholder S3 client wrapper (use AWS SDK v3 or @aws-sdk/client-s3)
export interface UploadedFileMeta {
  url: string;
  filename: string;
  mime: string;
  size: number;
}

export async function uploadBuffer(_key: string, _buffer: Buffer, _mime: string): Promise<UploadedFileMeta> {
  // Implement with S3-compatible client
  throw new Error('Not implemented');
}




