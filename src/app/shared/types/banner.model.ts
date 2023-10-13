export interface BannerModel {
  id: number,
  name: string,
  active: null | undefined,
  startDate: string,
  endDate: string,
  labels: string[],
  zoneId: string,
  url: string,
  fileId: number,
  channelId: string,
  language: string,
  priority: string
}
