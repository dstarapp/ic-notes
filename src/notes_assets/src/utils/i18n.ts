import { createI18n } from "vue-i18n"

import en_us from "../lang/en_us"
import zh_cn from "../lang/zh_cn"
import ja_jp from "../lang/ja_jp"
import ko_kr from "../lang/ko_kr"

const msg = {
  zh: zh_cn,
  en: en_us,
  ja: ja_jp,
  ko: ko_kr
}

export default createI18n({
  locale: 'en',
  messages: msg
})