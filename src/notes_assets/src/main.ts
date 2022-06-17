import { createApp } from 'vue'
import 'normalize.css'
import './assets/css/global.less'
import './assets/js/iconfont.js'
import './assets/js/avatar.js'
import App from './App.vue'
import router from './router/index'
import VueClipboard from 'vue-clipboard2'
import i18n from './utils/i18n'
import 'lib-flexible'
import mitt from "mitt"

const app = createApp(App)
app.config.globalProperties.$bus = mitt();
app.use(VueClipboard)
app.use(i18n)
app.use(router).mount('#app')
