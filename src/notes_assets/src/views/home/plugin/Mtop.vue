<template>
  <div class="header-box">
    <div class="header">
      <img v-show="!isBackShow" src="../images/icon-login-logo.svg" alt="logo" />
      <svg @click="backFun" v-show="isBackShow" class="icon backIcon" aria-hidden="true">
        <use xlink:href="#icon-arrow-left"></use>
      </svg>

      <div class="topmenu" @click="isShow = true">
        <svg viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="linearGradient-1">
              <stop stop-color="#6A95F1" offset="0%"></stop>
              <stop stop-color="#B6C8F0" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-375.000000, -17.000000)" fill="url(#linearGradient-1)" fill-rule="nonzero">
              <g transform="translate(375.000000, 13.000000)">
                <g transform="translate(0.000000, 4.000023)">
                  <path
                    d="M8.69663823,11.9788103 C9.38670922,11.9788103 9.94685054,12.5431366 9.94685054,13.2383634 L9.94685054,20.7404242 C9.94540687,21.4371054 9.38670922,21.9999773 8.69663823,21.9999773 L1.25021231,21.9999773 C0.560141311,21.9999773 0,21.4356509 0,20.7404242 L0,13.2383634 C0,12.5431366 0.560141311,11.9788103 1.25021231,11.9788103 L8.69663823,11.9788103 Z M20.7497877,11.9788103 C21.4398587,11.9788103 22,12.5431366 22,13.2383634 L22,20.7404242 C22,21.4371054 21.4398587,21.9999773 20.7497877,21.9999773 L13.3033618,21.9999773 C12.6132908,21.9999773 12.0531495,21.4356509 12.0531495,20.7404242 L12.0531495,13.2383634 C12.0531495,12.5431366 12.6132908,11.9788103 13.3033618,11.9788103 L20.7497877,11.9788103 Z M8.69663823,0 C9.38670922,0 9.94685054,0.564326326 9.94685054,1.25955309 L9.94685054,8.7616139 C9.94540687,9.45684066 9.38670922,10.0197125 8.69663823,10.0197125 L1.25021231,10.0197125 C0.560141311,10.0197125 0,9.45536349 0,8.76013673 L0,1.25955309 C0,0.564326326 0.560141311,0 1.25021231,0 L8.69663823,0 Z M20.7497877,0 C21.4398587,0 22,0.564326326 22,1.25955309 L22,8.7616139 C22,9.45684066 21.4398587,10.0197125 20.7497877,10.0197125 L13.3033618,10.0197125 C12.6132908,10.0197125 12.0531495,9.45536349 12.0531495,8.76013673 L12.0531495,1.25955309 C12.0531495,0.564326326 12.6132908,0 13.3033618,0 L20.7497877,0 Z"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>

  <transition name="slide">
    <div class="menu" v-show="isShow" @click="isShow = false">
      <div class="btnBox">
        <!-- <i class="menu-quit" @click="logout">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-quit"></use>
          </svg>
          Logout
        </i> -->
        <i class="menu-close" @click="isShow = false">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close"></use>
          </svg>
        </i>
      </div>
      <ul>
        <router-link to="/home">
          <li class="menu-home">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-menu-home"></use>
            </svg>
            Home
          </li>
        </router-link>
        <router-link to="/home/wallet">
          <li class="menu-wallet">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-menu-wallet"></use>
            </svg>
            My Wallet
          </li>
        </router-link>
        <router-link to="/home/user">
          <li class="menu-user">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-menu-user"></use>
            </svg>
            User Center
          </li>
        </router-link>
        <li class="menu-user" @click="logout">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-logout"></use>
          </svg>
          Logout
        </li>

        <!-- <router-link to="/home/notice">
          <li class="menu-notice">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-menu-notice"></use>
            </svg>
            Notice<i></i>
          </li>
        </router-link> -->
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Mtop',
  emits: ['logout'],
  data() {
    return {
      isShow: false,
      isBackShow: false,
    };
  },
  watch: {
    '$route.path'() {
      this.isBack();
    },
  },
  mounted() {
    this.isBack();
  },
  methods: {
    isBack() {
      if (this.$route.path === '/home/notes') {
        this.isBackShow = true;
      } else {
        this.isBackShow = false;
      }
    },
    backFun() {
      if (this.$route.path === '/home/notes') {
        this.$bus.emit('back');
      } else {
        this.$router.go(-1);
      }
    },
    logout() {
      this.$emit('logout', true);
    },
  },
};
</script>

<style scoped lang="less">
.header-box {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  background: white;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  justify-content: center;
  width: 100%;
  align-items: center;
  flex-direction: column;
  height: 13vw;
  max-width: 1565px;
  max-height: 70px;
  display: none;
  z-index: 1000;
  .header {
    display: flex;
    justify-content: space-between;
    width: 95vw;
    padding: 0 2.5vw;
    height: 13vw;
    max-width: 1565px;
    max-height: 70px;
    align-items: center;

    img {
      display: flex;
      width: 23vw;
      max-width: 160px;
      font-size: 0;
      max-height: 50px;
    }

    .backIcon {
      font-size: 30px;
    }

    .topmenu {
      height: 6vw;
      width: 6vw;
      display: flex;
      position: relative;

      svg {
        width: 18px;
      }
    }
  }
}

.menu {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  .btnBox {
    display: flex;
    width: 90%;
    margin-left: 5%;
    margin-top: (25 * 2/75rem);
    // justify-content: space-between;
    justify-content: flex-end;

    .menu-close {
      svg {
        font-size: (16 * 2/75rem);
      }
    }

    .menu-quit {
      color: #000;
      font-size: 0.16rem;
      font-style: normal;
      display: flex;
      align-items: center;
      font-size: (16 * 2/75rem);
      svg {
        font-size: (16 * 2/75rem);
        margin-right: 8px;
      }
    }
  }

  ul {
    display: flex;
    width: 95%;
    flex-direction: column;
    margin: (20 * 2/75rem) 0 0 5%;
    padding: 0;

    a {
      text-decoration: none;
      width: 100%;
    }

    li {
      list-style: none;
      margin: auto;
      color: #000;
      font-size: (14 * 2/75rem);
      position: relative;
      height: (50 * 2/75rem);
      display: flex;
      align-items: center;
      width: 100%;

      i {
        width: (4 * 2/75rem);
        height: (4 * 2/75rem);
        background-color: #f76464;
        display: inline-block;
        margin-left: (5 * 2/75rem);
        border-radius: 100%;
      }

      svg {
        display: flex;
        font-size: (18 * 2/75rem);
        margin-right: (10 * 2/75rem);
      }

      &:before {
        display: block;
        content: '';
        position: absolute;
        left: -50%;
        bottom: 0;
        width: 200%;
        pointer-events: none;
        height: 1px;
        background: rgba(51, 51, 51, 0.3);
        transform: scale(0.5);
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .header-box {
    display: block !important;
    height: 13vw;
    max-height: 70px;
    .header {
      .topmenu {
        svg {
          width: 5vw;
        }
      }
    }
  }
}
</style>
