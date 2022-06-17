<template>
  <div class="language" @mouseenter="showLang = true" @mouseleave="showLang = false">
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="langIcon" />
    </svg>
    {{ langName }}
    <Transition name="fade">
      <ul v-show="showLang">
        <li @click="changeLang('en', 'En')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-en" />
          </svg>
          English
        </li>
        <li @click="changeLang('zh', '中文')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zh" />
          </svg>
          中文
        </li>
        <li @click="changeLang('ja', 'Jp')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-japan" />
          </svg>
          Japan
        </li>
        <li @click="changeLang('ko', 'Kr')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-korean" />
          </svg>
          Korean
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLang: false,
      isLang: this.$i18n.locale,
    };
  },
  computed: {
    langIcon: function () {
      switch (this.isLang) {
        case 'zh':
          return '#icon-zh';
          break;
        case 'en':
          return '#icon-en';
          break;
        case 'ja':
          return '#icon-japan';
          break;
        case 'ko':
          return '#icon-korean';
          break;
      }
    },
    langName: function () {
      switch (this.isLang) {
        case 'zh':
          return '中文';
          break;
        case 'en':
          return 'En';
          break;
        case 'ja':
          return 'Jp';
          break;
        case 'ko':
          return 'Kr';
          break;
      }
    },
  },
  methods: {
    changeLang(lang, lname) {
      switch (lang) {
        case 'zh':
          localStorage.setItem('locale', 'zh');
          break;
        case 'en':
          localStorage.setItem('locale', 'en');
          break;
        case 'ja':
          localStorage.setItem('locale', 'ja');
          break;
        case 'ko':
          localStorage.setItem('locale', 'ko');
          break;
      }
      this.$i18n.locale = localStorage.getItem('locale');
      this.isLang = localStorage.getItem('locale');
      this.showLang = false;
    },
  },
};
</script>

<style scoped lang="less">
.language {
  display: flex;
  align-items: center;
  color: #999;
  width: 80px;
  height: 50px;
  position: relative;
  font-size: 14px;
  svg {
    font-size: 20px;
    margin-right: 6px;
  }

  ul {
    position: absolute;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px #0000001a;
    top: 50px;
    z-index: 9999;
    left: 50%;
    transform: translate(-50%);
    overflow: hidden;
    margin: 0;
    padding: 0;

    li {
      width: 80px;
      display: inline-flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #e8e8e8;

      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background-color: #f6f6f6;
      }
    }
  }

  &::after,
  &:hover::after {
    content: '';
    width: 0;
    height: 0;
    border: 5px solid transparent;
    margin-left: 5px;
  }
  &::after {
    border-top: 5px solid #ccc;
    margin-top: 8px;
  }
  &:hover::after {
    border-bottom: 5px solid #ccc;
    margin-top: -4px;
  }
}
</style>
