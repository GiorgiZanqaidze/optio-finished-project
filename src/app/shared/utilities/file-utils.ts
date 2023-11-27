
export function dataUrlToBlob(dataUrl: string, fileName: string, fileType: string) {
  const parts = dataUrl.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }
  const byteArray = new Uint8Array(byteArrays);
  const blob =  new Blob([byteArray], { type: contentType });
  return new File([blob], fileName, { type: fileType });
}


export function fileReader(file: File | undefined | any) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl: any = e.target?.result;
      if (dataUrl) {
        localStorage.setItem('fileDataUrl', dataUrl.toString());
        localStorage.setItem('fileName', file.name)
        localStorage.setItem('fileType', file.type)
      }
    };
    reader.readAsDataURL(file);
  }
  return file

}
