<template>
  <router-view />
</template>

<script>
import { NotesIdentity } from './utils/identity';
export default {
  name: 'App',
  async mounted() {
    await NotesIdentity.init();
    this.checkLang();
  },
  methods: {
    checkLang() {
      let lang = navigator.language || navigator.userLanguage;
      lang = lang.substr(0, 2);
      if (localStorage.getItem('locale') == null) {
        switch (lang) {
          case 'zh':
            localStorage.setItem('locale', 'zh');
            break;
          case 'ja':
            localStorage.setItem('locale', 'ja');
            break;
          case 'ko':
            localStorage.setItem('locale', 'ko');
            break;
          default:
            localStorage.setItem('locale', 'en');
            break;
        }
        this.$i18n.locale = localStorage.getItem('locale');
      } else {
        this.$i18n.locale = localStorage.getItem('locale');
      }
    },
  },
};
</script>
