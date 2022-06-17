<template>
  <div class="current-box">
    <div class="current-title">
      <span>{{ $t('public.usercenter') }}</span>
    </div>
    <div class="return-pre" @click="back()">
      <svg class="icon" aria-hidden="true" @mouseenter="isHover = true" @mouseleave="isHover = false">
        <use :xlink:href="isHover ? '#icon-backto-active' : '#icon-backto'" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHover: false,
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="less">
.current-box {
  width: 100%;
  height: 70px;
  margin-left: 20px;
  display: inline-flex;
  position: relative;
  .current-title {
    width: 150px;
    height: 70px;
    background: url(../../../assets/svg/icon-title-bline.svg) no-repeat center bottom;
    background-size: 60px;
    span {
      max-width: 100%;
      line-height: 70px;
      font-size: 22px;
      color: #000;
      font-weight: bold;
      display: block;
      text-align: center;
    }
  }

  .return-pre {
    height: 70px;
    width: 70px;
    transition: all 0.3s linear;

    svg {
      font-size: 30px;
      margin: 19px 0 19px 10px;
      cursor: pointer;
    }
  }
}
</style>
