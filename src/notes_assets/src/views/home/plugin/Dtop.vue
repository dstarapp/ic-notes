<template>
  <div class="top-bar" :class="{ active: showCurrentNote }">
    <!-- <div class="searchbtn" @click="showSearch" v-if="isShowbtn"></div>
        <transition name="slide-fade">
            <input type="text" class="searchbox" v-if="isShow" v-focus placeholder="Input keywords" />
        </transition> -->
    <WalletCurrent v-if="showCurrentWallet"></WalletCurrent>
    <UserCurrent v-if="showCurrentUser"></UserCurrent>
    <NoteCurrent v-if="showCurrentNote"></NoteCurrent>
    <div />
    <div class="topr">
      <router-link active-class="active" to="/home/airdrop"><div class="item airdrop">AirDrop</div></router-link>
      <router-link active-class="active" to="/home/user">
        <div class="item top-user flex">
          <div class="top-user-img">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="user_avatar()" />
            </svg>
          </div>
          <span>{{ userinfo ? userinfo.nick : '' }}</span>
        </div>
      </router-link>

      <router-link active-class="active" to="/home/wallet">
        <div class="item">
          <svg class="top-wallet" width="32px" height="30px" viewBox="0 0 40 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>wallet</title>
            <g id="user-wallet" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="user" transform="translate(-1850.000000, -31.000000)" fill="#3C6DD8" fill-rule="nonzero">
                <g transform="translate(0.000000, -1.000000)" id="topbar">
                  <g transform="translate(101.000000, 0.000000)">
                    <g transform="translate(1749.000000, 32.000000)">
                      <path
                        d="M40,34.0568698 C40,34.6082838 39.9065299,35.1180816 39.714397,35.5966673 C39.5222641,36.070051 39.2522394,36.4914146 38.8991302,36.8555559 C38.546021,37.2144952 38.1357913,37.5006062 37.6632481,37.6982829 C37.1958977,37.9011616 36.6818123,38 36.1209918,38 L4.14384006,38 C3.58821238,38 3.05854862,37.9011616 2.56004154,37.6982829 C2.06153447,37.4954042 1.62014799,37.2144952 1.23588212,36.8555559 C0.851616253,36.4966166 0.550434895,36.0752531 0.33233805,35.5966673 C0.114241205,35.1180816 0,34.6082838 0,34.0568698 L0,12.4216738 C0,11.3240479 0.389458652,10.3928865 1.16837596,9.62298775 C1.94729326,8.85829099 2.89237959,8.47334161 4.00882773,8.47334161 L35.9911723,8.47334161 C37.1076204,8.47334161 38.0527067,8.85829099 38.831624,9.62298775 C39.6105413,10.3876845 40,11.3188459 40,12.4216738 L40,18.3155611 L29.9987018,18.3155611 C28.8822537,18.3155611 27.9371673,18.6901064 27.15825,19.4443991 C26.3793327,20.1986919 25.9898741,21.1194492 25.9898741,22.2170751 C26.0210308,22.9713678 26.182007,23.6320242 26.4728028,24.2094483 C26.706478,24.6984381 27.0959366,25.1458117 27.6411788,25.5515691 C28.1864209,25.9573266 28.970531,26.1602053 29.9987018,26.1602053 L40,26.1602053 L40,34.0568698 Z M34.0075295,6.48617044 L14.0101259,6.48617044 C15.5939244,5.67465552 17.0946385,4.89435271 18.5018824,4.14526201 C19.7221862,3.51581774 20.9424899,2.88117145 22.1576009,2.23612113 C23.3623264,1.60147484 24.3022199,1.10728306 24.9772816,0.763949826 C26.0054524,0.212535839 26.9245748,-0.0371610611 27.7294561,0.00445508889 C28.5343373,0.0460712388 29.2197845,0.186525745 29.7754122,0.41541457 C30.4193171,0.732737713 30.9801376,1.15410123 31.447488,1.67430311 L34.0075295,6.48617044 L34.0075295,6.48617044 Z M28.0150591,22.2222771 C28.0150591,21.6708632 28.207192,21.2078835 28.5862651,20.8333381 C28.9653382,20.4587928 29.4378813,20.2715201 29.993509,20.2715201 C30.5491367,20.2715201 31.0216799,20.4587928 31.400753,20.8333381 C31.7850188,21.2078835 31.971959,21.6708632 31.971959,22.2222771 C31.971959,22.7736911 31.779826,23.2418728 31.400753,23.6320242 C31.0216799,24.0221756 30.5491367,24.2198523 29.993509,24.2198523 C29.4326886,24.2198523 28.9653382,24.0221756 28.5862651,23.6320242 C28.207192,23.2418728 28.0150591,22.7684891 28.0150591,22.2222771 Z"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </router-link>

      <div class="item">
        <!-- <div class="language" @mouseenter="showLang = true" @mouseleave="showLang = false">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="$i18n.locale == 'zh' ? '#icon-zh' : '#icon-en'" />
          </svg>
          {{ $i18n.locale == 'zh' ? '中文' : 'En' }}
          <Transition name="fade">
            <ul v-show="showLang">
              <li @click="changeLang('en')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-en" />
                </svg>
                English
              </li>
              <li @click="changeLang('zh')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zh" />
                </svg>
                中文
              </li>
            </ul>
          </Transition>
        </div> -->
        <Lang />
      </div>
    </div>
  </div>
</template>

<script>
import WalletCurrent from '../components/WalletCurrent.vue';
import NoteCurrent from '../../notes/components/NoteCurrent.vue';
import UserCurrent from '../components/UserCurrent.vue';
// import AvatarImg from './Img.vue'
import Lang from './Lang.vue';
import { GetUserInfo } from '../../../utils/notes/sync';
import { GetAvatar } from '../../../utils/assets';

export default {
  name: 'Dtop',
  data() {
    return {
      isShow: false,
      isShowbtn: true,
      showCurrentNote: false,
      showCurrentWallet: false,
      showCurrentUser: false,
      showNotice: false,
      userinfo: GetUserInfo(),
      showLang: false,
    };
  },
  methods: {
    showSearch() {
      (this.isShow = true), (this.isShowbtn = false);
    },
    user_avatar() {
      if (this.userinfo && this.userinfo.avatar) {
        return '#icon-' + this.userinfo.avatar;
      }
      return '#icon-avatar-2';
    },
    checkTop() {
      const route = this.$route;
      if (route.name == 'wallet') {
        this.showCurrentNote = false;
        this.showCurrentWallet = true;
        this.showCurrentUser = false;
        this.showNotice = false;
      } else if (route.name == 'notes') {
        this.showCurrentNote = true;
        this.showCurrentWallet = false;
        this.showCurrentUser = false;
        this.showNotice = false;
      } else if (route.name == 'user') {
        this.showCurrentNote = false;
        this.showCurrentWallet = false;
        this.showCurrentUser = true;
        this.showNotice = false;
      } else {
        this.showCurrentNote = false;
        this.showCurrentWallet = false;
        this.showCurrentUser = false;
        this.showNotice = false;
      }
    },
  },
  directives: {
    focus: {
      inserted: function (e1) {
        e1.focus();
      },
    },
  },
  components: {
    WalletCurrent,
    NoteCurrent,
    UserCurrent,
    // AvatarImg,
    Lang,
  },
  mounted() {
    this.checkTop();
  },
  watch: {
    $route() {
      this.checkTop();
    },
  },
};
</script>

<style scoped lang="less">
.top-bar {
  height: 70px;
  position: fixed;
  background-color: #fff;
  left: 81px;
  top: 0;
  right: 0;
  align-items: center;
  z-index: 2;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  &.active {
    z-index: 20;
  }
  .topr {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    a {
      background-color: transparent;
      cursor: pointer;
      text-decoration: none;
      color: #555;
      font-family: Gothic;
      font-size: 14px;
    }

    .item {
      padding: 0 30px;
      border-left: 1px solid #e8e8e8;
      height: 69px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &.top-user {
        align-items: center;
        span {
          margin-left: 15px;
        }
        .top-user-img {
          width: 40px;
          height: 40px;
          border-radius: 40px;
          overflow: hidden;
          svg {
            font-size: 40px;
          }
        }
      }

      &.top-wallet {
        margin-top: 20px;
      }

      &:hover {
        background-color: #f8f8f8;
        transition: all 0.3s linear;
      }

      .language {
        display: flex;
        align-items: center;
        color: #999;
        width: 80px;
        height: 50px;
        position: relative;
        svg {
          font-size: 20px;
          margin-right: 6px;
        }
        ul {
          position: absolute;
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          top: 40px;
          z-index: 15;
          left: 50%;
          transform: translateX(-50%);
          overflow: hidden;
          padding: 0;
          li {
            width: 80px;
            display: inline-flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #e8e8e8;
            svg {
              font-size: 20px;
              margin-right: 6px;
            }
            &:last-child {
              border-bottom: none;
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
      &.airdrop {
        line-height: 69px;
        font-size: 16px;
        font-weight: bold;
        color: #3c6dd8;
      }
    }

    .active {
      .item {
        background-color: #f8f8f8 !important;
      }
    }
  }
}
</style>
