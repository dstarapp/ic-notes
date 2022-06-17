<template>
  <div class="modal-con" v-if="!isLoginout && !accountInit">
    <!-- <div class="modal-header">{{ $t('backup.title') }}</div>
    <div class="close" @click="clickLogout"> -->
    <div class="modal-header">{{ $t('backup.newTitle') }}</div>
    <div v-if="isBack" class="goback" @click="back">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-arrow-left" />
      </svg>
    </div>
    <div v-else class="close" @click="clickLogout">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-close" />
      </svg>
    </div>

    <div class="btabs">
      <span :class="{ cur: options === 1 }" @click="options = 1">{{ $t('backup.setPwd.title') }}</span>
      <span :class="{ cur: options === 2 }" @click="options = 2">{{ $t('seedphrase.title') }}</span>
    </div>
    <div class="content" v-if="options === 1">
      <p class="modal-content">{{ $t('backup.setPwd.tips') }}</p>
      <div class="setpwd relative">
        <input :type="isShowPwd ? 'text' : 'password'" class="pwd-input" :placeholder="$t('backup.setPwd.placeholder1')" v-model="pwd1" @blur="checkPwd" />
        <div class="testpwd">
          <div class="left">
            {{ $t('backup.setPwd.pwdstrong.title') }}：
            <div class="pwdsafe">
              <div>
                <span :class="{ low: pwdlevel >= 1 }"></span>
                <i :class="{ low: pwdlevel >= 1 }">{{ $t('backup.setPwd.pwdstrong.level.one') }}</i>
              </div>
              <div>
                <span :class="{ mid: pwdlevel >= 2 }"></span>
                <i :class="{ mid: pwdlevel >= 2 }">{{ $t('backup.setPwd.pwdstrong.level.two') }}</i>
              </div>
              <div>
                <span :class="{ hight: pwdlevel == 3 }"></span>
                <i :class="{ hight: pwdlevel == 3 }">{{ $t('backup.setPwd.pwdstrong.level.three') }}</i>
              </div>
            </div>
          </div>

          <p v-show="isShowError">
            {{ $t('backup.setPwd.pwdlevel') }}
          </p>
        </div>
        <svg class="icon" aria-hidden="true" @click="isShowPwd = !isShowPwd">
          <use :xlink:href="isShowPwd ? '#icon-hidepwd' : '#icon-showpwd'" />
        </svg>
      </div>
      <div class="setpwd relative">
        <input :type="isShowPwd ? 'text' : 'password'" class="pwd-input" :placeholder="$t('backup.setPwd.placeholder2')" v-model="pwd2" />
        <svg class="icon" aria-hidden="true" @click="isShowPwd = !isShowPwd">
          <use :xlink:href="isShowPwd ? '#icon-hidepwd' : '#icon-showpwd'" />
        </svg>
      </div>
      <div class="phrase-btn" :class="setStatus == 1 ? '' : setStatus == 2 ? 'success' : pwd1.length > 6 && pwd2.length > 6 && pwd1 === pwd2 && pwdlevel >= 2 ? 'active' : ''" @click="setPassword">
        <div v-if="setStatus == 1" class="la-timer la-sm">
          <div></div>
        </div>
        <svg class="icon" aria-hidden="true" v-if="setStatus == 2">
          <use xlink:href="#icon-success" />
        </svg>
        {{ setStatus == 1 ? $t('BtnName.clickTxt') : setStatus == 2 ? '' : $t('BtnName.confirm') }}
      </div>
    </div>
    <div class="content" v-if="options === 2">
      <div class="phrase-box">
        <span class="phrase-item" v-for="(i, s) in phraseseed()" :key="s">
          {{ i }}<i>{{ s + 1 }}</i>
        </span>
      </div>
      <div class="contain">
        <div v-for="(item, index) in conditions" class="phrase-condition" @click="handleClick(index, item)" :key="index">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="selected.indexOf(item) == -1 ? '#icon-nocheck' : '#icon-checked'" />
          </svg>
          <p :class="{ checked: selected.indexOf(item) != -1 }" v-html="item.content"></p>
        </div>
      </div>
      <div :class="checkstatus ? 'phrase-btn active' : 'phrase-btn'" @click="haveDone">
        {{ $t('seedphrase.btnName') }}
      </div>
    </div>
  </div>
  <Loginout v-if="isLoginout" @close="closeLogout"></Loginout>
  <InitAccount v-if="accountInit" @closeInit="closeInit" />
</template>

<script>
import { GetDeviceMnemonic } from '../../../utils/identity';
import { UpdateCurrentLocalKey } from '../../../utils/local';
import Loginout from '../../../components/Loginout.vue';
import InitAccount from './InitAccount.vue';
import { AesShaEncrypt, SetPassSecret } from '../../../utils/aes';

export default {
  name: 'Backup',
  components: {
    Loginout,
    InitAccount,
  },
  data() {
    return {
      isBack: false,
      isLoginout: false,
      checkstatus: false,
      conditions: [
        { id: '1', content: this.$i18n.t('seedphrase.condition.one') + '<i>' + this.$i18n.t('seedphrase.condition.one2') + '</i>' },
        { id: '2', content: this.$i18n.t('seedphrase.condition.two') },
      ],
      selected: [],
      options: 1, //1-密码备份 2-助记词备份
      isShowPwd: false,
      pwd1: '',
      pwd2: '',
      pwdlevel: 0,
      setStatus: 0, // 0-默认 1-点击 2-成功
      accountInit: false,
      isShowError: false, // 密码强度不足显示
    };
  },
  beforeMount() {
    if (this.$route.query && this.$route.query.back) {
      this.isBack = true;
    }
    if (this.$route.query && this.$route.query.phrase === '1') {
      this.options = 2;
    } else {
      this.options = 1;
    }
  },
  methods: {
    phraseseed() {
      let str = GetDeviceMnemonic();
      if (str == null) {
        return ['', '', '', '', '', '', '', '', '', '', '', ''];
      }
      return str.split(' ');
    },
    haveDone() {
      this.$router.push({ name: 'validatephrase' });
    },
    handleClick(index, item) {
      if (this.selected.indexOf(item) !== -1) {
        this.selected.splice(this.selected.indexOf(item), 1);
      } else {
        this.selected.push(item);
      }
      this.checkstatus = this.selected.length == 2;
      // console.log(JSON.parse(JSON.stringify(this.selected)))
    },
    back() {
      this.$router.go(-1);
    },
    checkPwdLevel(sValue) {
      var level = 0;
      if (sValue.length < 6) return level;
      if (/\d/.test(sValue)) level++;
      if (/[a-z]/.test(sValue)) level++;
      if (/[A-Z]/.test(sValue)) level++;
      if (/\W/.test(sValue)) level++;
      switch (level) {
        case 1:
          return 1;
          break;
        case 2:
          return 2;
          break;
        case 3:
          return 3;
          break;
        case 4:
          return 4;
          break;
      }
      return level;
    },
    setPassword() {
      this.setStatus = 1;
      this.$nextTick(async () => {
        let ok = await SetPassSecret(this.pwd1);
        if (ok) {
          this.setStatus = 2;
          setTimeout(() => {
            if (this.isBack) {
              this.back();
            } else {
              UpdateCurrentLocalKey({ bk: 1 });
              this.$router.replace({ name: 'info' });
            }
          }, 1000);
        } else {
          this.setStatus = 0;
        }
      });
      // this.setStatus=0  // 0-默认 1-点击 2-成功
    },
    checkPwd() {
      if (this.pwdlevel <= 1) {
        this.isShowError = true;
      } else {
        this.isShowError = false;
      }
    },
    clickLogout() {
      this.isLoginout = true;
    },
    closeLogout(data) {
      this.isLoginout = data;
    },
    closeInit() {
      this.accountInit = false;
    },
  },
  watch: {
    pwd1(newVal) {
      let newpwd = this.checkPwdLevel(newVal);
      if (newpwd != 0) {
        if (newpwd == 2) {
          this.pwdlevel = 1;
        } else if (newpwd == 3) {
          this.pwdlevel = 2;
          this.isShowError = false;
        } else if (newpwd == 4) {
          this.pwdlevel = 3;
        }
      } else {
        this.pwdlevel = 0;
      }
    },
  },
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

  .center {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .modal-header {
    width: 90%;
    line-height: 150%;
    color: #000;
    font-size: (20 * 2/75rem);
    text-align: center;
    font-weight: bold;
    font-family: 'GothicB';
    margin-top: 5vh;
  }

  .goback {
    position: absolute;
    top: 2vh;
    left: 2vh;
    font-size: (20 * 2/75rem);
    cursor: pointer;
  }

  .close {
    position: absolute;
    top: 4vh;
    right: 4vh;
    font-size: (16 * 2/75rem);
    cursor: pointer;
  }

  .btabs {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0 0 0;

    span {
      font-size: 18px;
      padding: 10px 0;
      margin: 0 40px;
      text-align: center;
      cursor: pointer;

      &.cur,
      &:hover {
        font-weight: bold;
        color: #3c6dd8;
        border-bottom: 3px solid #3c6dd8;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;

    .modal-content {
      width: 85%;
      margin: 3vh 0 0 0;
      line-height: 150%;
      color: #999;
      text-align: center;
      font-size: (10 * 2/75rem);
    }

    .setpwd {
      width: 85%;
      display: block;
      overflow: hidden;
      margin-top: 2vh;
      position: relative;
      cursor: pointer;

      svg {
        font-size: 22px;
        position: absolute;
        right: 7%;
        top: 0;
        height: 6vh;
        max-height: 55px;
      }

      .pwd-input {
        width: 90%;
        display: block;
        border: 1px solid #ddd;
        border-radius: 8px;
        height: 6vh;
        max-height: 50px;
        padding-left: 15px;
        margin: auto;
        margin-bottom: 20px;
        box-sizing: border-box;
        outline: none;

        &::placeholder {
          color: #999;
        }
      }

      .testpwd {
        width: 90%;
        display: inline-flex;
        color: #666;
        margin: auto 5%;
        .left {
          display: flex;
          margin: auto;
        }

        p {
          flex: auto;
          text-align: right;
          margin: 0;
          color: #fd6464;
        }
      }

      .pwdsafe {
        display: flex;
        margin-left: 10px;

        span {
          height: 8px;
          width: 60px;
          display: block;
          background-color: #ddd;
          border-radius: none;
          transition: background-color 0.3s linear;

          &.low {
            background-color: #f14d3f;
          }

          &.mid {
            background-color: #ffc353;
          }

          &.hight {
            background-color: #59d455;
          }
        }

        div:first-child span {
          border-radius: 8px 0 0 8px;
          border-right: 1px solid #fff;
        }

        div:last-child span {
          border-radius: 0 8px 8px 0;
          border-left: 1px solid #fff;
        }

        i {
          width: 100%;
          font-style: normal;
          font-size: 12px;
          display: block;
          text-align: center;

          &.low {
            color: #f14d3f;
          }

          &.mid {
            color: #ffc353;
          }

          .hight {
            color: #59d455;
          }
        }
      }
    }

    .phrase-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      margin: auto;
      font-weight: bold;
      height: 10vw;
      max-height: 60px;
      width: 45%;
      min-width: 250px;
      color: #fff;
      background-color: #8eb0fa;
      font-size: (12 * 2/75rem);
      transition: all 0.3s linear;
      cursor: pointer;
      margin-bottom: 6vh;
      pointer-events: none;
      margin-top: 2vh;

      &.active {
        background-color: #3c6dd8;
        color: #fff;
        pointer-events: auto;

        &:hover {
          box-shadow: 0 0 18px rgba(60, 109, 216, 0.6);
          transition: all 0.3s linear;
        }
      }
    }

    .phrase-box {
      width: 85%;
      background-color: #eef3ff;
      border: 1px solid #d2dfff;
      border-radius: 8px;
      margin: 2.5vh 0;

      .phrase-item {
        width: 25%;
        border-right: 1px solid #d2dfff;
        border-bottom: 1px solid #d2dfff;
        line-height: 5.5vh;
        height: 5.5vh;
        position: relative;
        text-align: center;
        font-size: (10 * 2/75rem);
        display: inline-block;
        box-sizing: border-box;

        i {
          position: absolute;
          top: 0.8vw;
          right: 0.8vw;
          color: #8eb0fa;
          font-size: (10 * 2/75rem);
          font-style: normal;
          line-height: 100%;
          // 禁止复制
          user-select: none;
        }

        &:nth-child(4n) {
          border-right: none;
        }

        &:nth-child(n + 9) {
          border-bottom: none;
        }
      }
    }

    .contain {
      display: flex;
      width: 85%;
      flex-direction: column;
      margin-bottom: 1vh;

      .phrase-condition {
        display: flex;
        margin-bottom: 2vh;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        outline: none;

        svg {
          font-size: (14 * 2/75rem);
          margin-right: 0.8vh;
        }

        p {
          color: #999;
          flex: 1;
          margin: 0;
          font-size: (10 * 2/75rem);

          :deep(i) {
            display: inline-flex;
            margin-left: 5px;
            color: #3c6dd8;
            font-style: normal;
          }

          &.checked {
            color: #333;
          }
        }
      }
    }
  }
}

.backup-box {
  width: 90%;
  display: flex;
  justify-content: center;
  margin: 4vh 0;

  .backupbtn {
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
    font-family: 'GothicB';
    cursor: pointer;
    text-decoration: none;

    svg {
      font-size: (20 * 2/75rem);
      margin-right: 1vh;
    }

    &.seedphrase {
      margin-right: 3.5vw;
    }

    &:hover {
      background-size: 32px;
      box-shadow: 0 0 18px rgba(60, 109, 216, 0.6);
      transition: all 0.3s linear;
      cursor: pointer;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-con {
    .modal-header {
      margin-top: 4vh;
    }
    .phrase-box {
      .phrase-item {
        width: 33.3333% !important;

        &:nth-child(4n) {
          border-right: 1px solid #d2dfff !important;
        }

        &:nth-child(n + 9) {
          border-bottom: 1px solid #d2dfff !important;
        }

        &:nth-child(3n) {
          border-right: 0 !important;
        }

        &:nth-child(n + 10) {
          border-bottom: none !important;
        }
      }
    }

    .content {
      .setpwd {
        .testpwd {
          flex-direction: column;
          width: 85%;
          p {
            text-align: left;
          }
          .left {
            width: 100%;
          }
        }
        .pwd-input {
          width: 100%;
        }
      }
      .phrase-btn {
        width: 85%;
        height: 5.5vh;
        max-height: 50px;
        margin-bottom: 4vh;
      }
    }
  }
}
</style>
