<template>
  <div class="modal-con" v-if="!isLoginout && !accountInit">
    <div class="close close-current" @click="clickLogout">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-close" />
      </svg>
    </div>

    <div class="tab-box">
      <span class="tab" @click="showKeyPass" :class="{ current: options === 2 }">
        {{ $t('requestotherdevice.option3') }}
      </span>
      <span class="tab" @click="showKeySync" :class="{ current: options === 0 }">
        {{ $t('requestotherdevice.option1') }}
      </span>
      <span class="tab" @click="showKeyPhrase" :class="{ current: options === 1 }">
        {{ $t('requestotherdevice.option2') }}
      </span>
    </div>
    <div class="w100" v-show="options === 0">
      <div class="center" v-if="!isShowSync">
        <p class="modal-content">
          {{ $t('requestotherdevice.tips1') }}
        </p>
        <div class="register-box">
          <transition class="tipsBox" name="fade">
            <div v-show="showTips">
              <i class="arrow-down" />
              <div class="tips">
                {{ $t('requestotherdevice.tips2') }}
              </div>
            </div>
          </transition>
          <div class="item">
            <input v-model="deviceAlias" type="text" :class="registerStatus ? 'register-input current' : 'register-input'" :placeholder="$t('requestotherdevice.placehoder')" @click="focus" />
            <div :class="registerStatus ? 'register-btn current' : 'register-btn'" @click="dealRegister">
              <div v-if="registerStatus" class="la-timer la-sm">
                <div />
              </div>
              {{ registerStatus ? $t('BtnName.clickTxt') : $t('BtnName.keysync') }}
            </div>
          </div>
        </div>
      </div>
      <div class="w100" v-else>
        <transition name="slideleft">
          <div class="center">
            <p class="modal-content">{{ $t('requestotherdevice.tips3') }}</p>
            <div class="device-all">
              <div v-for="(item, index) in devices" :key="index" class="device-box">
                <div class="authbtn" v-if="item.current">{{ $t('requestotherdevice.btnName.authorize') }}</div>
                <div class="handclick" v-if="item.current">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-hand" />
                  </svg>
                </div>
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="'#icon-' + item.imgtag" />
                </svg>
                <p class="ellipsis">
                  {{ item.name }}
                </p>
              </div>
            </div>
            <div v-if="isAuth != 1" class="sync-btn" @click="isAuthorized">{{ $t('requestotherdevice.btnName.authorized') }}</div>
            <div v-if="isAuth == 1" class="sync-btn" :class="clickstatus == 1 ? 'current' : clickstatus == 2 ? 'sync-success' : clickstatus == 3 ? 'request-failed' : ''" @click="syncing">
              <div v-if="clickstatus == 1" class="la-timer la-sm">
                <div />
              </div>
              <svg class="icon" aria-hidden="true" v-if="clickstatus == 0">
                <use xlink:href="#icon-sync" />
              </svg>
              <svg class="icon" aria-hidden="true" v-if="clickstatus == 2">
                <use xlink:href="#icon-success" />
              </svg>
              {{
                clickstatus == 1
                  ? $t('requestotherdevice.btnName.response')
                  : clickstatus == 0
                  ? $t('requestotherdevice.btnName.request')
                  : clickstatus == 2
                  ? $t('requestotherdevice.btnName.success')
                  : $t('requestotherdevice.btnName.error')
              }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="center" v-show="options === 1">
      <p class="modal-content">
        {{ $t('requestotherdevice.tips4') }}
      </p>
      <div v-if="isValidated" class="register-box">
        <transition class="tipsBox" name="fade">
          <div v-show="showTips">
            <i class="arrow-down" />
            <div class="tips">
              {{ $t('requestotherdevice.tips2') }}
            </div>
          </div>
        </transition>
        <div class="item">
          <input v-model="deviceAlias" type="text" :class="registerStatus ? 'register-input current' : 'register-input'" :placeholder="$t('requestotherdevice.placehoder')" @focus="focus" />
          <div :class="registerStatus ? 'register-btn current' : 'register-btn'" @click="dealPhrase">
            <div v-if="registerStatus" class="la-timer la-sm">
              <div />
            </div>
            {{ registerStatus ? $t('BtnName.clickTxt') : $t('BtnName.apply') }}
          </div>
        </div>
      </div>
      <div class="from" v-else>
        <textarea v-model="phrasedata" class="textarea seedphrasetextarea" :class="errorstatus ? 'error' : ''" :placeholder="$t('requestotherdevice.spplacehoder')" />
        <div class="error-tip" v-show="errorstatus">
          <p>{{ $t('requestotherdevice.error') }}</p>
        </div>
        <div v-if="isshow" :class="!btnstate ? 'phrase-btn active' : 'phrase-btn'" @click="validate">
          {{ $t('BtnName.confirm') }}
          <div v-show="btnstate" class="dot"></div>
        </div>
      </div>
    </div>

    <div class="w100" v-show="options === 2">
      <div class="center">
        <p class="modal-content">
          {{ $t('requestotherdevice.pwdtips') }}
        </p>
        <div class="register-box" v-if="pwdStatus == 3">
          <div class="mb-20 flex">
            <transition name="fade">
              <div class="tipsBox" v-show="showTips">
                <i class="arrow-down" />
                <div class="tips">
                  {{ $t('requestotherdevice.tips2') }}
                </div>
              </div>
            </transition>
            <div class="item">
              <input v-model="deviceAlias" type="text" :class="registerStatus ? 'register-input current' : 'register-input'" :placeholder="$t('requestotherdevice.placehoder')" @focus="focus" />
              <div :class="registerStatus ? 'register-btn current' : 'register-btn'" @click="dealPhrase">
                <div v-if="registerStatus" class="la-timer la-sm">
                  <div />
                </div>
                {{ registerStatus ? $t('BtnName.clickTxt') : $t('BtnName.apply') }}
              </div>
            </div>
          </div>
        </div>
        <div class="w1002" v-else>
          <div class="vilidateibox relative">
            <input class="vilidateinput" :type="isShowPwd ? 'text' : 'password'" :placeholder="$t('requestotherdevice.pwdplaceholder')" v-model="password" />
            <svg class="icon" aria-hidden="true" @click="isShowPwd = !isShowPwd">
              <use :xlink:href="isShowPwd ? '#icon-hidepwd' : '#icon-showpwd'" />
            </svg>
            <p class="pwderror" v-show="pwdStatus == 4">
              {{ $t('requestotherdevice.pwdError') }}
            </p>
          </div>
          <div class="phrase-btn" :class="pwdStatus == 0 || pwdStatus == 2 ? '' : 'active'" @click="checkPwd">
            {{ $t('BtnName.confirm') }}
            <div v-show="pwdStatus == 2" class="dot"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 如果其他设备reject，则弹出该提示，可以重新请求 -->
    <transition name="fade">
      <div class="freeze" v-if="isReject">
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-warning" />
          </svg>
          {{ $t('reject.tips') }}
        </p>
        <button @click="restart">{{ $t('reject.btnName') }}</button>
      </div>
    </transition>

    <div v-if="!hasNote" class="initaccount" @click="accountInit = true">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-care" />
      </svg>
      {{ $t('backup.initAccount.title') }}
    </div>
  </div>
  <Loginout v-if="isLoginout" @close="closeLogout"></Loginout>
  <InitAccount v-if="accountInit" @closeInit="closeInit" />
</template>

<script>
// import Loginout from './Loginout.vue'
import Loginout from '../../../components/Loginout.vue';
import InitAccount from '../../backup/components/InitAccount.vue';
import { GetDevices, NotesSync } from '../../../utils/notes/sync';
import { GetDeviceIcon, GetDeviceIconTag } from '../../../utils/assets';
import { CreateMnemonicKey, SaveDeviceMnemonicKey, GetNotesKey } from '../../../utils/identity';
// import { HasAesKey, SyncCurrentAesKey, RegsiterCurrentDevice, ImportMnemonicCheck, ImportMnemonicSave } from '../../../utils/aes'
import { HasAesKey, SyncCurrentAesKey, RegsiterCurrentDevice, ImportMnemonicCheck, ImportMnemonicSave, GetPhraseByPass } from '../../../utils/aes';
import { HasNoteBooks } from '../../../utils/notes/notes';
import { NotesMnemonicKey } from '../../../utils/key';

export default {
  name: 'RequestOtherDevice',
  components: {
    Loginout,
    InitAccount,
  },
  data() {
    return {
      isLoginout: false,
      deviceAlias: '',
      clickstatus: 0,
      seconds: 10,
      devices: [],
      options: 2,
      isShowSync: false,
      showTips: false,
      registerStatus: false,
      status: false,
      phrasedata: '',
      errorstatus: false,
      successtatus: false,
      isshow: true,
      isInsert: false,
      isInserted: false,
      isValidated: false,
      btnstate: false,
      isReject: false,
      isAuth: 0, // 1-auth 2-reject
      isShowPwd: false,
      password: '',
      pwdStatus: 0, // 0-默认状态 1-激活 2-点击 3-成功 4-失败
      accountInit: false,
      hasNote: true,
    };
  },
  async mounted() {
    let local = GetNotesKey();
    if (local != null) {
      this.isShowSync = !HasAesKey();
    }
    HasNoteBooks()
      .then((ret) => {
        this.hasNote = ret;
      })
      .catch(() => {
        console.log(e);
      });
    let devices = await GetDevices(false);
    devices.forEach((ass, idx) => {
      if (local && local.getAlias() == ass.alias) {
        return;
      }
      this.devices.push({
        name: ass.alias,
        imgtag: GetDeviceIconTag(ass.agent),
        current: devices.length / 2 == idx,
      });
    });
  },
  methods: {
    showKeyPass() {
      this.options = 2;
      this.phrasedata = '';
      this.pwdStatus = 0;
      this.password = '';
    },
    showKeySync() {
      this.options = 0;
    },
    showKeyPhrase() {
      this.options = 1;
      this.phrasedata = '';
      this.isValidated = false;
    },
    syncing() {
      this.clickstatus = 1;
      const time2 = setInterval(async () => {
        let ret = await SyncCurrentAesKey();
        if (ret != 'wait') {
          clearInterval(time2);
        }
        if (ret == 'success') {
          this.isAuth = 1;
          this.clickstatus = 2;
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else if (ret == 'restart') {
          this.isReject = true;
          this.clickstatus = 3;
          this.isAuth = 1;
        }
      }, 3000);
    },
    focus() {
      this.showTips = true;
    },
    dealRegister() {
      if (!this.deviceAlias) {
        return;
      }

      if (this.registerStatus) {
        return;
      }
      this.registerStatus = true;
      this.isAuth = 0;
      setTimeout(async () => {
        let ok = await RegsiterCurrentDevice(this.deviceAlias);
        this.registerStatus = false;
        if (!ok) {
          alert('device alias name has exist! Please use other name.');
          return;
        }
        this.isShowSync = true;
      }, 200);
    },
    validate() {
      if (this.phrasedata == '') {
        this.errorstatus = false;
        return;
      }
      let str = this.phrasedata.trim().split(' ');
      if (str.length != 12) {
        this.errorstatus = true;
        return;
      }
      if (this.btnstate) {
        return;
      }
      this.btnstate = true;
      setTimeout(async () => {
        this.isValidated = await ImportMnemonicCheck(this.phrasedata);
        if (!this.isValidated) {
          this.errorstatus = true;
        }
        this.btnstate = false;
      }, 100);
    },
    dealPhrase() {
      if (!this.deviceAlias) {
        return;
      }

      if (this.registerStatus) {
        return;
      }
      this.registerStatus = true;
      setTimeout(async () => {
        let ok = await ImportMnemonicSave(this.phrasedata, this.deviceAlias);
        this.registerStatus = false;
        if (!ok) {
          alert('device alias name has exist! Please use other name.');
          return;
        }
        window.location.reload();
      }, 100);
    },
    insert() {
      const timer = setInterval(() => {
        this.seconds -= 1;
        if (this.seconds == 5) {
          this.isInsert = true;
          this.isInserted = true;
        }
        if (this.seconds == 1) {
          clearInterval(timer);
          this.seconds = 10;
        }
      }, 1000);
    },
    restart() {
      this.isReject = false;
      this.isShowSync = false;
      this.isAuth = 0;
      this.registerStatus = false;
    },
    isAuthorized() {
      this.isAuth = 1;
    },
    clickLogout() {
      this.isLoginout = true;
    },
    closeLogout(data) {
      this.isLoginout = data;
    },
    checkPwd() {
      //0-默认状态 1-激活 2-点击 3-成功 4-失败
      this.pwdStatus = 2;
      this.$nextTick(async () => {
        let phrase = await GetPhraseByPass(this.password);
        if (!phrase) {
          this.pwdStatus = 4;
          return;
        }

        let ok = await ImportMnemonicCheck(phrase);
        if (!ok) {
          this.pwdStatus = 4;
          return;
        }
        this.pwdStatus = 3;
        this.phrasedata = phrase;
      });
    },
    closeInit() {
      this.accountInit = false;
    },
  },
  watch: {
    phrasedata() {
      let str = this.phrasedata.trim().split(' ');
      if (str.length != 12 && this.phrasedata != '') {
        this.errorstatus = true;
      } else {
        this.errorstatus = false;
      }
    },
    password(newVal) {
      if (newVal.length > 6) {
        this.pwdStatus = 1;
      } else {
        this.pwdStatus = 0;
      }
    },
  },
};
</script>

<style scoped lang="less">
.modal-con {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  position: relative;

  .close {
    position: absolute;
    top: 4vh;
    right: 4vh;
    font-size: (16 * 2/75rem);
    cursor: pointer;
  }

  .tab-box {
    width: 80%;
    border-radius: 8px;
    background-color: #f8f8f8;
    display: flex;
    justify-content: center;
    padding: 1.5vh 0;
    margin-top: 7vh;

    .tab {
      display: flex;
      flex: 1;
      margin: 0 5%;
      height: 4vw;
      max-height: 60px;
      min-height: 50px;
      text-align: center;
      border-radius: 6px;
      color: #333;
      font-weight: bold;
      font-size: (14 * 2/75rem);
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &.current {
        background-color: #333;
        color: #fff;
      }
    }
  }
  .center {
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    flex-direction: column;
    margin-bottom: 4vh;
    .modal-content {
      width: 80%;
      margin: 3vh 0;
      line-height: 150%;
      color: #999;
      text-align: left;
      font-size: (10 * 2/75rem);

      a {
        color: #3c6dd8;
      }
    }

    .device-all {
      width: 90%;
      overflow-x: scroll;
      margin: 2vh 0;
      text-align: center;
      white-space: nowrap;
      display: flex;
      justify-content: center;

      .device-box {
        margin: 0 2.5vw;
        min-height: 80px;
        text-align: center;
        position: relative;
        cursor: pointer;
        display: inline-block;

        svg {
          font-size: (100 * 2/75rem);
        }

        p {
          width: 100%;
          text-align: center;
          // height: 40px;
          line-height: 150%;
          color: #333;
          margin: 0;
          font-size: (12 * 2/75rem);
          position: relative;
          top: -1vh;
        }

        .handclick {
          width: 30px;
          position: absolute;
          left: 50%;
          top: 1.2rem;
          animation: hand 2s infinite;

          svg {
            font-size: (15 * 2/75rem);
          }
        }

        .authbtn {
          position: absolute;
          padding: 6px;
          border-radius: 4px;
          background-color: #6a95f1;
          color: #fff;
          left: 50%;
          top: 0.9rem;
          transform: translateX(-50%);
          font-size: (10 * 2/75rem);
          animation: auth 1.5s linear;
        }
      }
    }

    .sync-btn,
    .phrase-btn,
    .sync-success {
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
      background-color: #3c6dd8;
      font-size: (14 * 2/75rem);
      border-radius: 6px;
      transition: all 0.3s linear;
      cursor: pointer;

      img {
        width: 25px;
        margin-right: 20px;
      }

      &.sync-btn {
        svg {
          font-size: (14 * 2/75rem);
          margin-right: 0.5em;
        }

        &:hover {
          box-shadow: 0 0 18px rgba(60, 109, 216, 0.6);
          transition: all 0.3s linear;
        }

        &.current {
          background-color: #8eb0fa;
          color: #d5e2fe;

          &:hover {
            cursor: none;
            box-shadow: none;
          }
        }
      }

      &.phrase-btn {
        background-color: #8eb0fa;
        margin-top: 4vh;
        margin-bottom: 2vh;
      }

      &.sync-success {
        background-color: #5ab668;
      }

      &.request-failed {
        background: #ffeaea;
        color: #ffb3b3;
      }

      &.active {
        background-color: #3c6dd8;
        pointer-events: auto;

        &:hover {
          box-shadow: 0 0 18px rgba(60, 109, 216, 0.6);
          transition: all 0.3s linear;
        }
      }
    }
  }

  .register-box {
    position: relative;
    width: 90%;
    margin-bottom: 6vh;
    height: auto;

    .tipsBox {
      position: absolute;
      width: 100%;
      left: 5%;
      .tips {
        display: flex;
        padding: 7px 15px;
        background-color: #333;
        border-radius: 4px;
        color: #fff;
        position: absolute;
        top: -40px;
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
        top: -15px;
      }
    }

    .item {
      display: flex;
      width: 90%;
      margin: auto;
      .register-input {
        border: 2px solid #ddd;
        line-height: 3.8vw;
        height: 10vw;
        max-height: 60px;
        margin-right: 2vw;
        flex: 2.5;
        border-radius: 5px;
        font-size: (12 * 2/75rem);
        box-sizing: border-box;
        text-indent: 0.6em;
        outline: none;

        &.current {
          background-color: #ddd;
        }

        ::placeholder {
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
        flex: 1;
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

  .from {
    display: flex;
    justify-content: center;
    width: 80%;
    align-items: center;
    flex-direction: column;
    margin-top: 2vh;

    .seedphrasetextarea {
      margin-top: 0;
      height: 100px;
      box-shadow: none;
      border: 1px solid #e8e8e8;
      width: 100%;
      padding: 20px;
      background-color: #f8f8f8;
      border-radius: 8px;
      height: 205px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1) inset;
      border: none;
      font-family: 'Gothic';
      box-sizing: border-box;
      font-weight: bold;
      font-size: (14 * 2/75rem);
      resize: none;
      outline: none;

      &.error {
        background-color: #fff5f5;
        border: 1px solid #ffdbdb;
        box-shadow: 0px 0px 10px rgb(253, 100, 100, 0.2) inset;
        color: #fd6464;
      }

      &::placeholder {
        color: #999;
      }
    }

    .error-tip {
      width: 100%;
      padding: 10px 0;
      color: #fd6464;
    }
  }

  .w1002 {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .vilidateibox {
    width: 80%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    svg {
      font-size: 22px;
      position: absolute;
      height: 4.5vh;
      right: 12px;
      top: 1vh;
    }

    .vilidateinput {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 8px;
      height: 6.5vh;
      text-indent: 15px;
      outline: none;
      font-size: 14px;
      padding: 0;

      &::placeholder {
        color: #999;
      }
    }

    .pwderror {
      color: #fd6464;
      width: 100%;
      padding-top: 10px;
      margin: 0;
    }
  }

  .initaccount {
    position: absolute;
    bottom: 25px;
    color: #fff;
    right: 30px;
    cursor: pointer;
    font-size: 14px;
    color: #999;
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-con {
    .tab-box {
      .tab {
        min-height: 35px;
        font-size: 0.3rem;
        margin: 0 2%;
      }
    }
    .center {
      .phrase-btn {
        width: 80%;
        height: 5.5vh;
        margin-top: 3vh !important;
      }
    }
    .vilidateibox {
      .vilidateinput {
        height: 5.5vh;
      }
      svg {
        top: 0.5vh;
      }
    }
  }
}
</style>
