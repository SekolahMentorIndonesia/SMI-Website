async function upload({
  url,
  buffer,
  base64
}) {
  const response = await fetch(`https://api.createanything.com/v0/upload`, {
    method: "POST",
    headers: {
      "Content-Type": buffer ? "application/octet-stream" : "application/json",
      "User-Agent": "Sekolah Mentor Indonesia Web App"
    },
    body: buffer ? buffer : JSON.stringify({ base64, url })
  });
  const data = await response.json();
  return {
    url: data.url,
    mimeType: data.mimeType || null
  };
}
export { upload };
export default upload;