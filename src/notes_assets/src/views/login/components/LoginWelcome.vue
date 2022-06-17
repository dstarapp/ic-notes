<template>
  <div class="modal-con" v-if="!isLoginout">
    <div class="modal-header">{{ $t('welcome.title') }}</div>
    <div class="close" @click="clickLogout">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-close" />
      </svg>
    </div>

    <div class="register-box flex">
      <transition class="tipsBox" name="fade">
        <div v-show="showTips">
          <i class="arrow-down"></i>
          <div class="tips">{{ $t('welcome.ptips') }}</div>
        </div>
      </transition>
      <div class="item">
        <input v-model="deviceAlias" type="text" :class="registerStatus ? 'register-input current' : 'register-input'" :placeholder="$t('welcome.placehoder')" @focus="focus" />
        <div :class="registerStatus ? 'register-btn current' : 'register-btn'" @click="deal">
          <div v-if="registerStatus" class="la-timer la-sm">
            <div></div>
          </div>
          {{ registerStatus ? $t('BtnName.clickTxt') : $t('BtnName.Register') }}
        </div>
      </div>
    </div>
    <div class="care-box">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-care" />
      </svg>
      <div>
        <i18n-t keypath="welcome.tips" scope="global">
          <template #action>
            <a href="https://github.com/timohanke/icvault" target="_blank">{{ $t('welcome.linktxt') }}</a>
          </template>
        </i18n-t>
      </div>
    </div>
  </div>
  <Loginout v-if="isLoginout" @close="closeLogout"></Loginout>
</template>

<script>
import { SeedAesKey, RegsiterCurrentDevice } from '../../../utils/aes';
// import Loginout from './Loginout.vue'
import Loginout from '../../../components/Loginout.vue';

export default {
  name: 'LoginWelcome',
  components: {
    Loginout,
  },
  data() {
    return {
      deviceAlias: '',
      showTips: false,
      registerStatus: false,
      // 首次登录：1，全新设备2
      logintimes: 2,
      isLoginout: false,
    };
  },
  methods: {
    focus() {
      this.showTips = true;
    },
    deal() {
      console.log('device', this.deviceAlias);
      if (!this.deviceAlias) {
        alert('Please input device name!');
        return;
      }

      this.registerStatus = true;
      setTimeout(async () => {
        let ok = await RegsiterCurrentDevice(this.deviceAlias);
        if (!ok) {
          this.registerStatus = false;
          alert(this.$i18n.t('welcome.tipstxt'));
          return;
        }
        // retry 3 times
        for (let i = 0; i < 3; i++) {
          ok = await SeedAesKey();
          console.log('seedkey', ok);
          if (ok) {
            localStorage.setItem('_backup', '1');
            this.$router.push({ name: 'backup' });
            break;
          }
        }
      }, 200);
    },
    clickLogout() {
      this.isLoginout = true;
    },
    closeLogout(data) {
      this.isLoginout = data;
    },
  },
  // mounted() {
  //   // this.$router.push({
  //   //   path: '/otherdevice',
  //   // })
  // },
};
</script>

<style scoped lang="less">
.modal-con {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .close {
    position: absolute;
    top: 4vh;
    right: 4vh;
    font-size: (16 * 2/75rem);
    cursor: pointer;
  }

  .modal-header {
    width: 80%;
    line-height: 150%;
    color: #000;
    font-size: (20 * 2/75rem);
    text-align: center;
    font-weight: bold;
    font-family: 'GothicB';
    margin-top: 5vh;
  }

  .register-box {
    position: relative;
    width: 85%;
    margin-top: 5vh;

    .tipsBox {
      position: absolute;
      width: 100%;

      .tips {
        display: flex;
        padding: 5px 15px;
        background-color: #333;
        border-radius: 4px;
        color: #fff;
        position: absolute;
        top: -35px;
        left: 0;
        font-weight: normal;
        font-size: (10 * 2/75rem);
        display: block;
      }

      .arrow-down {
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #333;
        position: absolute;
        left: 50px;
        top: -14px;
      }
    }

    .item {
      display: flex;
      width: 100%;

      .register-input {
        border: 2px solid #ddd;
        line-height: 3.8vw;
        height: 10vw;
        max-height: 60px;
        margin-right: 2vw;
        flex: 2.3;
        border-radius: 5px;
        font-size: (12 * 2/75rem);
        box-sizing: border-box;
        outline: none;
        text-indent: 0.6em;

        &.current {
          background-color: #ddd;
        }

        &::placeholder {
          color: #999;
        }
      }

      .register-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        background-color: #3c6dd8;
        border: 2px solid #3c6dd8;
        box-sizing: border-box;
        font-size: (12 * 2/75rem);
        font-weight: bold;
        color: #fff;
        flex: 1.2;
        max-width: 250px;
        height: 10vw;
        max-height: 60px;
        text-align: center;
        border: none;
        cursor: pointer;

        &.current {
          background-color: #8eb0fa;
          color: #d5e2fe;
          transition: all 0.3s linear;
        }
      }
    }
  }

  .care-box {
    width: 85%;
    margin: 3vw 0 5vh 0;
    color: #999;
    display: flex;
    line-height: 150%;

    svg {
      font-size: (14 * 2/75rem);
    }

    div {
      margin-left: 5px;
      font-size: 14px;
      a {
        display: inline-flex;
        color: #3c6dd8;
      }
    }

    &.error {
      color: #fc7e7e;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-con {
    .register-box {
      .tipsBox {
        .arrow-down {
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #333;
          top: -18px;
        }
      }
    }

    .care-box {
      svg {
        font-size: (30 * 2/75rem);
      }

      div {
        margin-left: 10px;
      }
    }
  }
}
</style>
