<template>
  <div class="user-container">
    <div class="contain">
      <div class="userbox user-info-box">
        <div class="user-imgbox">
          <div class="userimg">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="user_avatar()" />
            </svg>
            <div class="user-change-img" @click="showChangeImg = true">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-canmer" />
              </svg>
            </div>
          </div>
          <div class="user-id">
            <i>{{ userinfo ? userinfo.id : '' }}</i>
          </div>
        </div>
        <div class="user-info">
          <!-- <div class="user-id">
            <i>{{ userinfo ? userinfo.id : '' }}</i>
          </div> -->

          <!-- <div class="user-item">
            <span class="d">Last login time : </span>
            <span class="txt">{{ userinfo ? format_date(userinfo.last_time) : '' }}</span>
          </div> -->

          <div class="user-item">
            <span class="d">{{ $t('user.registerTime') }} : </span>
            <span class="txt">{{ userinfo ? format_date(userinfo.register_time) : '' }}</span>
          </div>

          <div class="user-item">
            <span class="d">Principal ID : </span>
            <span class="txt">{{ userinfo.pid ? userinfo.pid : 'pqnwp-3vl7v-youya-pogc4-ct7oq-5bjx2-xyfxc-pej73-ybaov-63nmr-5qe' }}</span>
            <button class="copy" :class="{ copytips: isCopy }" @click="copy">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-copy" />
              </svg>
            </button>
          </div>

          <div class="user-item isM">
            <span class="d">{{ $t('user.publickey') }} : </span>
            <span class="txt">{{ pkey }}</span>
            <button class="copy" :class="{ copytips: isPubCopy }" @click="copyPub">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-copy" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="userbox user-backup">
        <h2>{{ $t('user.title.t1') }}</h2>
        <div class="box">
          <div class="user-backup-btn" @click="backupPhrase">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-backup-seedphrase" />
            </svg>
            {{ $t('user.btnName.seed') }}
          </div>
          <div class="user-backup-btn" @click="backupYubikey">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-authorize" />
            </svg>
            <!-- {{ $t('user.btnName.yubikey') }} -->
            {{ userinfo.has_secret ? $t('user.btnName.changepwd') : $t('user.btnName.setpwd') }}
          </div>
        </div>
      </div>
    </div>
    <div class="userbox user-devices">
      <h2>{{ $t('user.title.t2') }}</h2>
      <div class="user-devices-box">
        <div v-if="isLoading" class="loading">
          <div class="loader"></div>
        </div>
        <!-- {{ devices.toString() }} -->
        <div v-else class="device-box" v-for="(item, index) in devices" :key="index">
          <div class="deviceimgbox">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-' + item.imgtag" />
            </svg>
            <div class="current-device" v-show="item.current">
              <svg id="svgDom" width="40" height="40">
                <circle cx="20" cy="20" r="4" stroke="#6A95F1" stroke-width="5" fill-opacity="0">
                  <animate attributeName="r" id="ani1" begin="0" from="0" to="15" dur="1.5s" repeatCount="indefinite"></animate>
                  <animate attributeName="opacity" begin="0" from="1" to="0" dur="1.5s" repeatCount="indefinite"></animate>
                </circle>
                <circle cx="20" cy="20" r="4" stroke="#6A95F1" stroke-width="5" fill-opacity="0">
                  <animate attributeName="r" begin="ani1.begin + 0.5s" from="0" to="15" dur="1.5s" repeatCount="indefinite"></animate>
                  <animate attributeName="opacity" begin="ani1.begin + 0.5s" from="1" to="0" dur="1.5s" repeatCount="indefinite"></animate>
                </circle>
                <circle cx="20" cy="20" r="4" stroke="#6A95F1" stroke-width="5" fill-opacity="0">
                  <animate attributeName="r" begin="ani1.begin + 1s" from="0" to="15" dur="1.5s" repeatCount="indefinite"></animate>
                  <animate attributeName="opacity" begin="ani1.begin + 1s" from="1" to="0" dur="1.5s" repeatCount="indefinite"></animate>
                </circle>
              </svg>
            </div>
          </div>
          <p class="ellipsis">{{ item.name }}</p>
          <i @click="deleteDevice(item)" v-if="!item.current">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-delete-device" />
            </svg>
          </i>
        </div>
      </div>
    </div>

    <ChangeImg v-if="showChangeImg" @close="close"></ChangeImg>
    <!-- 删除设备 -->
    <DeleteDevice v-if="showDelete" @close="closeDelete" :alias="deleteAlias" />
    <!-- 助记词备份 -->
    <!-- <UseIdentity v-if="showUseIdentity" @close="closeUseIdentity" :title="$t('backup.backupBySeed')" /> -->
    <UseIdentity v-if="showUseIdentity" @close="closeUseIdentity" :title="isUsePhrase ? $t('backup.backupBySeed') : $t('backup.backupByPass')" />
  </div>
</template>

<script>
import ChangeImg from './components/ChangeImg.vue';
import DeleteDevice from './components/DeleteDevice.vue';
import UseIdentity from './components/UseIdentity.vue';
import { IconMac, GetAvatar, GetDeviceIconTag } from '../../utils/assets';
import { GetDevices, GetUserInfo } from '../../utils/notes/sync';
import { GetNotesKey } from '../../utils/identity';
import moment from 'moment';
import { AesEncrypt } from '../../utils/aes';

export default {
  name: 'User',
  data() {
    return {
      isLoading: true,
      showChangeImg: false,
      showDelete: false,
      showUseIdentity: false,
      isCopy: false,
      isPubCopy: false,
      userinfo: GetUserInfo(),
      pkey: '',
      alias: '',
      devices: [],
      deleteAlias: '',
      isPwd: false, // 已设置密码-修改密码， 未设置密码-设置密码
      isUsePhrase: true,
    };
  },
  mounted() {
    let key = GetNotesKey();
    if (!key) {
      return;
    }
    this.pkey = key.getPublickey();
    this.alias = key.getAlias();
    this.$nextTick(async () => {
      await this.init_device(true);
      this.isLoading = false;
    });
  },
  methods: {
    format_date(t) {
      return moment(t).format('HH:mm:ss DD/MM/YYYY');
    },
    user_avatar() {
      if (this.userinfo && this.userinfo.avatar) {
        return '#icon-' + this.userinfo.avatar;
      }
      return '#icon-avatar-2';
    },
    backupPhrase() {
      this.isUsePhrase = true;
      this.showUseIdentity = true;
    },
    backupYubikey() {
      // alert('In development. It is coming soon!')
      // localStorage.setItem('_backup', '1')
      // this.$router.push({ name: 'yubikey' })
      // alert('In development. It is coming soon!')
      this.isUsePhrase = false;
      this.showUseIdentity = true;
    },
    deleteDevice(item) {
      this.deleteAlias = item.name;
      this.$nextTick(() => {
        this.showDelete = true;
      });
    },
    copy() {
      this.isCopy = true;
      this.isPubCopy = false;
      this.$copyText(this.userinfo.pid).then(
        () => {
          setTimeout(() => {
            this.isCopy = false;
          }, 3000);
        },
        (e) => {
          console.log(e);
        }
      );
    },
    copyPub() {
      this.isPubCopy = true;
      this.isCopy = false;
      this.$copyText(this.pkey).then(
        () => {
          setTimeout(() => {
            this.isPubCopy = false;
          }, 3000);
        },
        (e) => {
          console.log(e);
        }
      );
    },
    close(data) {
      this.showChangeImg = data;
    },
    closeDelete(data) {
      this.showDelete = false;
      if (data) {
        this.init_device(false);
      }
    },
    closeUseIdentity(data) {
      this.showUseIdentity = false;
      if (data) {
        let ph = this.isUsePhrase ? 1 : 0;
        localStorage.setItem('_backup', '1');
        this.$router.push({ name: 'backup', query: { back: 1, phrase: ph } });
        // this.$router.push({ name: 'phrase' })
      }
    },
    async init_device(force) {
      // this.devices = [{ name: 'burning11', imgtag: 'macbook', current: true }]
      let devices = await GetDevices(force);
      this.devices.length = 0;
      devices.forEach((ass) => {
        this.devices.push({
          name: ass.alias,
          imgtag: GetDeviceIconTag(ass.agent),
          current: ass.alias == this.alias,
        });
      });
    },
  },
  components: {
    ChangeImg,
    DeleteDevice,
    UseIdentity,
  },
};
</script>

<style scoped lang="less">
.user-container {
  display: flex;
  flex-direction: column;
  margin-left: 80px;
  margin-top: 70px;
  padding: 3vh;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f2f6ff, #fff3e1, #e1eafd);
  position: relative;

  .userbox {
    background-color: #fff;
    border-radius: 10px;
    padding: 40px;
    margin-bottom: 30px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  }

  .contain {
    width: 100%;
    display: flex;

    .user-info-box {
      flex: 1;
      display: flex;
      .user-imgbox {
        // width: 100%;
        margin-right: 3vh;
        display: flex;
        position: relative;

        .userimg {
          border-radius: 50px;
          overflow: hidden;
          position: relative;
          svg {
            font-size: 100px;
          }
          .user-change-img {
            border-radius: 50%;
            width: 100px;
            height: 100px;
            background-color: #000;
            background-size: 25px;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
            transition: all 0.3s ease-out;

            svg {
              font-size: 32px;
              margin: 34px;
            }

            &:hover {
              opacity: 0.7;
              transition: all 0.3s ease-in;
            }
          }
        }

        .user-id {
          display: block;
          position: absolute;
          left: 120px;
          top: 0;
          background-color: #f2f6ff;
          border-radius: 6px;
          padding: 8px 15px;

          i {
            font-size: 20px;
            color: #3c6dd8;
            font-weight: bold;
            font-style: normal;
          }
        }

        .username {
          width: 100%;
          margin-top: 10px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          display: block;
          color: #333;
        }

        .edit-username {
          display: block;
          width: 25px;
          height: 30px;
          margin: 0 auto;
          cursor: pointer;
          background: url(../../assets/icon-edit.svg) no-repeat center center;
          background-size: 18px;
        }

        input {
          width: 100%;
          margin-top: 15px;
          border: none;
          padding: 0 8px;
          text-align: center;
          line-height: 30px;
          background-color: #f1f1f1;
          border-radius: 6px;
          &::placeholder {
            color: #999;
          }
        }
      }

      .user-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-top: 50px;

        .user-item {
          width: 100%;
          margin-bottom: 10px;
          display: flex;
          .d {
            color: #999;
            width: 140px;
            text-align: right;
            padding-right: 5px;
            line-height: 25px;
          }
          .txt {
            flex: 1;
            line-height: 20px;
            word-break: break-all;
          }
          .copy {
            width: 30px;
            height: 30px;
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            margin-left: 15px;
            position: relative;
            cursor: pointer;
            background-color: #fff;

            svg {
              font-size: 18px;
            }

            &:hover {
              background-color: #f3f3f3;
            }
          }
        }
      }
    }

    .user-backup {
      width: 270px;
      margin-left: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 40px;
      justify-content: space-between;

      h2 {
        color: #000;
        font-size: (17 * 2/75rem);
        width: 100%;
        text-align: center;
        padding: 0;
        margin: 5vh 0 2vh 0;
      }

      .box {
        width: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .user-backup-btn {
        width: 90%;
        border-radius: 8px;
        padding: 2.5vh 0;
        margin-bottom: 3.5vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: (12 * 2/75rem);
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s linear;
        background-color: #3c6dd8;

        svg {
          font-size: 24px;
          margin-right: 10px;
        }

        &:hover {
          transition: all 0.3s linear;
          box-shadow: 0 0 15px rgb(60, 109, 216, 0.5);
        }
      }
    }
  }

  .user-devices {
    h2 {
      color: #000;
      font-size: (17 * 2/75rem);
      width: 100%;
      text-align: center;
      padding: 0;
      margin: 2vh 0;
    }

    .user-devices-box {
      width: 100%;
      display: flex;
      justify-content: center;
      padding-top: 2vh;
      overflow-x: auto;
      .device-box {
        margin: 0 25px;
        text-align: center;
        .deviceimgbox {
          height: 80px;
          width: auto;
          position: relative;

          .current-device {
            width: 40px;
            height: 40px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -20px;
            margin-top: -20px;
          }

          svg {
            font-size: 120px;
            height: 100%;
            margin: auto;
          }
        }
      }
    }

    p {
      width: 100%;
      text-align: center;
      font-size: (12 * 2/75rem);
      margin: 0;
      display: block;
      margin-top: 1.5vh;
      margin-bottom: 2vh;
    }

    i {
      display: block;
      margin: auto;
      cursor: pointer;
      svg {
        font-size: 20px;
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .user-container {
    margin-left: -3vw;
    margin-top: 13vw;
    height: calc(100% - 13vw);
    width: calc(100% - 3vh);
    overflow-x: hidden;
    .userbox {
      flex-direction: column;
      padding: 1.5vh;
      margin-bottom: 1.5vh;
    }

    .contain {
      flex-direction: column;

      .user-info-box {
        .user-imgbox {
          .user-id {
          }
        }
        .user-info {
          margin-top: 2vh;
          .d {
            width: auto !important;
          }
        }
      }

      .user-backup {
        width: auto;
        margin-left: 0;
        h2 {
          margin-top: 2.5vh;
        }
        .user-backup-btn {
          width: 100%;
          padding: 1.5vh 0;
        }
      }
    }

    .user-devices {
    }
  }

  .isM {
    display: none !important;
  }
}
</style>
