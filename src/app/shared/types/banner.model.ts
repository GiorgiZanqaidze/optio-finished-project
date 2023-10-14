export interface BannerModel {
  id: number,
  name: string,
  active: null | undefined,
  startDate: string,
  endDate: string,
  labels: string[],
  zoneId: string,
  url: string,
  fileId: string | null | undefined,
  channelId: string,
  language: string,
  priority: string
}
