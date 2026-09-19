import type { Request } from 'express'
import { ISessionMetadata } from '../types/session-metadata.type'
import { IS_DEV_ENV } from './is-dev.util'
import DeviceDetector from 'device-detector-js'
import { lookup } from 'geoip-lite'
import countries from 'i18n-iso-countries'

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

export const getSessionMetadata = (
  req: Request,
  userAgent: string,
): ISessionMetadata => {
  const ip = IS_DEV_ENV
    ? '173.166.164.121'
    : Array.isArray(req.headers['cf-connecting-ip'])
      ? req.headers['cf-connecting-ip'][0]
      : req.headers['cf-connecting-ip'] ||
        (typeof req.headers['x-forwarded-for'] === 'string'
          ? req.headers['x-forwarded-for'].split(',')[0]
          : req.ip!)

  const location = lookup(ip)
  const device = new DeviceDetector().parse(userAgent)

  return {
    location: {
      country: countries.getName(location?.country || 'Страна неизвестна', 'en') || 'Неизвестно',
      city: location?.city || 'Неизвестный город',
      latidute: location?.ll[0] || 0,
      longitude: location?.ll[1] || 0
    },

    device: {
      browser: device.client?.name || 'Неизвестный браузер',
      os: device.os?.name || 'Неизвестна ОС',
      type: device.device?.type || 'Неизвестный тип устройства'
    },
    ip
  }
}
