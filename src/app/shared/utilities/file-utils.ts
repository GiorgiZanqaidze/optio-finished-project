export function fileReader(file: File | undefined | any) {
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }
  return file
}
