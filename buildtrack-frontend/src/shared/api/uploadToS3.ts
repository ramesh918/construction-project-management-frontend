export async function uploadFileDirectToS3(file: File, uploadUrl: string): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  if (!res.ok) {
    throw new Error('Upload to storage failed');
  }
}