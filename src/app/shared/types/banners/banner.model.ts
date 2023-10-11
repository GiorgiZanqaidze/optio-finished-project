export interface BannerModel {
  id: number,
  name: string,
  active: boolean,
  startDate: string,
  endDate: string,
  labels: string[],
  zoneId: string,
  url: string,
  fileId: number
}
