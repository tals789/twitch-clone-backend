export interface ILocationInfo {
  country: string
  city: string
  latidute: number
  longitude: number
}

export interface IDeviceInfo {
  browser: string
  os: string
  type: string
}

export interface ISessionMetadata {
  location: ILocationInfo
  device: IDeviceInfo
  ip: string
}