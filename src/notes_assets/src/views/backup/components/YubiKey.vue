<template>
  <div class="modal-con">
    <div class="modal-header">
      {{ $t('yubikey.title') }}
    </div>
    <div class="goback" @click="back">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-arrow-left" />
      </svg>
    </div>
    <div class="close" @click="$emit('close', false)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-close" />
      </svg>
    </div>

    <div class="yubikeytips" v-if="!isShow">
      <p>
        <i18n-t keypath="yubikey.tips" scope="global">
          <template #action>
            <a href="https://fortifyapp.com/#download" target="_blank">{{ $t('yubikey.linktxt') }}</a>
          </template>
        </i18n-t>
      </p>
      <div class="note-notesubmit active" @click="isShow = true">{{ $t('yubikey.btnName') }}</div>
    </div>

    <transition name="slidetop">
      <div v-if="isShow">
        <div class="yubikey">
          <div class="yubikeyimg">
            <div v-show="isInserted" class="hand">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-hand" />
              </svg>
            </div>
            <svg class="icon" aria-hidden="true" :class="{ linear: isInsert == false }">
              <use xlink:href="#icon-yubikey" />
            </svg>
          </div>
        </div>
        <div class="backup-btn">
          <div class="la-timer la-sm">
            <div />
          </div>
          {{ isInserted ? $t('yubikey.btnClickTxt') : $t('yubikey.btnWaitTxt') }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'YubiKey',
  components: {},
  data() {
    return {
      isInsert: false,
      isInserted: false,
      second: 10,
      isShow: false,
    }
  },
  watch: {
    isShow: {
      handler(newValue) {
        if (newValue) {
          this.insert()
        }
      },
      deep: true,
    },
  },
  methods: {
    insert() {
      const timer = setInterval(() => {
        this.second -= 1
        if (this.second == 5) {
          this.isInsert = true
          this.isInserted = true
        }
        if (this.second == 1) {
          clearInterval(timer)
          this.second = 10
        }
      }, 1000)
    },
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped lang="less">
.modal-con {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .modal-header {
    width: 90%;
    line-height: 150%;
    color: #000;
    font-size: (26 * 2/75rem);
    text-align: center;
    font-weight: bold;
    font-family: 'GothicB';
    margin-top: 4vh;
  }

  .close {
    position: absolute;
    top: 2vh;
    right: 2vh;
    font-size: (20 * 2/75rem);
    cursor: pointer;
  }

  .goback {
    position: absolute;
    top: 2vh;
    left: 2vh;
    font-size: (20 * 2/75rem);
    cursor: pointer;
  }

  .yubikeytips {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      width: 90%;
      display: block;
      color: #999;
      line-height: 150%;
      text-align: left;
      font-size: (14 * 2/75rem);

      a {
        color: #3c6dd8;
        font-weight: bold;
      }
    }

    .note-notesubmit {
      width: 50%;
      margin: auto;
      padding: 16px 0;
      text-align: center;
      border-radius: 6px;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      transition: all 0.3s linear;
      opacity: 0.5;
      background: linear-gradient(135deg, #6a95f1, #3c6dd8);
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      margin-top: 1vh;
      margin-bottom: 4vh;

      &.success {
        background: #5AB668;
        transition: all .3s linear;
        opacity: 1;
      }

      &.active {
        opacity: 1;
        transition: all 0.3s linear;
        pointer-events: auto;
      }
    }

  }

  .backup-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    margin: auto;
    font-weight: bold;
    height: 10vw;
    max-height: 60px;
    width: 50%;
    min-width: 250px;
    color: #fff;
    background-color: #8eb0fa;
    font-size: (14 * 2/75rem);
    border-radius: 6px;
    transition: all 0.3s linear;
    cursor: pointer;
    margin-bottom: 4vh;
  }

  .yubikey {
    display: flex;
    width: 100%;
    padding: 2vh 0;

    .yubikeyimg {
      display: flex;
      width: 100%;
      align-items: center;

      svg {
        font-size: (80 * 2/75rem);
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {}
</style>
