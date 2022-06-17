// export const get_assets_icon = (asset: string) => {
//   try {
//     return import(`../assets/${asset}`)
//   } catch {
//     return import(`../assets/logo.svg`)
//   }
// }

import IconMac from '../assets/svg/icon-macbook.svg'
import IconComputer from '../assets/svg/icon-computer.svg'
import IconPhone from '../assets/svg/icon-phone.svg'

export { IconMac }

export const GetDeviceIcon = (agent: string) => {
  if (/(android|ios|ipad)/i.test(agent)) {
    return IconPhone
  } else if (/(mac)/i.test(agent)) {
    return IconMac
  }
  return IconComputer
}

export const GetDeviceIconTag = (agent: string) => {
  if (/(android|ios|ipad)/i.test(agent)) {
    return 'phone'
  } else if (/(mac)/i.test(agent)) {
    return 'macbook'
  }
  return 'computer'
}

export const GetAvatar = (name: string) => {
  // return new URL(`../assets/avatar/${name}.jpg`, import.meta.url).href
  const path = `../assets/avatar/${name}.jpg`
  const modules = import.meta.globEager('../assets/avatar/*.jpg')
  return modules[path].default
}

export const GetAsset = (name: string) => {
  const path = `../assets/${name}`
  const modules = import.meta.globEager('../assets/*')
  return modules[path].default
}

export const PreloadAssets = (names: string[]) => {
  const modules = import.meta.globEager('../assets/svg/*')
  names.forEach((name) => {
    let path = `../assets/svg/${name}`
    let src = modules[path].default
    let image = new Image()
    image.src = src
  })
  return
}

export const PreloadAvatars = (names: string[]) => {
  const modules = import.meta.globEager('../assets/avatar/*.jpg')
  names.forEach((name) => {
    let path = `../assets/avatar/${name}`
    let src = modules[path].default
    let image = new Image()
    image.src = src
  })
  return
}
