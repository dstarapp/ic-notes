<template>
  <div class="layer">
    <div class="modal-container" v-if="isLoading">
      <div class="loading">
        <div class="loader"></div>
      </div>
    </div>
    <div v-if="!isLoading && !isLoginout" class="notes-view">
      <Dleft @logout="logout" class="isPC" />
      <Dtop class="isPC" />
      <Mtop @logout="logout" />

      <router-view class="router" v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>

    <Loginout v-if="isLoginout" @close="logout" />
    <KeySyncRequest v-if="showKeySync" @close="keySync" />
  </div>
</template>

<script>
import Dleft from './plugin/Dleft.vue';
import Dtop from './plugin/Dtop.vue';
import Mtop from './plugin/Mtop.vue';
import { CheckAesKey } from '../../utils/aes';
import { InitWallet, LoadBalance, LoadIcpCycleRate, LoadSdr2Usd } from '../../utils/wallet';
import { InitUser, GetDevices, NotesSync, CheckUnsyncList } from '../../utils/notes/sync';
import { LoadNoteBooks, LoadingAllNoteBooks } from '../../utils/notes/notes';
import { GetCurrentLocalKey } from '../../utils/local';
import { GetNotesKey } from '../../utils/identity';
import { GetAsset, PreloadAssets, PreloadAvatars } from '../../utils/assets';
import Loginout from '../../components/Loginout.vue';
import KeySyncRequest from './plugin/KeySyncRequest.vue';

export default {
  name: 'Home',
  data() {
    return {
      isLoading: true,
      loading: true,
      isLoginout: false,
      showKeySync: false,
    };
  },
  components: {
    Dleft,
    Dtop,
    Mtop,
    Loginout,
    KeySyncRequest,
  },
  mounted() {
    let self = this;
    if (localStorage.getItem('_backup')) {
      localStorage.removeItem('_backup');
    }
    this.$nextTick(async () => {
      PreloadAssets([
        'icon-progress-loading.svg',
        'icon-progress-success.svg',
        'icon-progress.svg',
        // 'icon-canister.svg',
        // 'icon-key.svg',
        // 'icon-fuel.svg',
        // 'icon-control-active.svg',
        // 'icon-radio-checked.svg',
        // 'icon-radio-nocheck.svg',
        // 'icon-remind.svg',
        // 'icon-arrow-right.svg',
        // 'icon-create.svg',
        // 'icon-refresh.svg',
        // 'icon-copy.svg',
        // 'icon-arrow-right.svg',
        // 'icon-user.svg',
      ]);
      // PreloadAvatars(['avatar-1.jpg', 'avatar-2.jpg', 'avatar-3.jpg', 'avatar-4.jpg', 'avatar-5.jpg', 'avatar-6.jpg', 'avatar-7.jpg', 'avatar-8.jpg', 'avatar-9.jpg'])

      await CheckAesKey();
      let ret = await InitUser();
      if (!ret) {
        window.location.reload();
        return;
      }
      await InitWallet();
      await LoadNoteBooks();
      LoadingAllNoteBooks();
      await LoadIcpCycleRate();
      await LoadSdr2Usd();

      self.loading = false;
      self.isLoading = false;

      this.showKeySync = await CheckUnsyncList();
    });
  },
  methods: {
    logout(data) {
      this.isLoginout = data;
    },
    keySync(data) {
      this.showKeySync = data;
    },
  },
};
</script>

<style scoped lang="less">
.layer {
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url(./images/layer-bg.png) no-repeat;
  background-size: cover;
  background-attachment: fixed;

  .modal-container {
    display: flex;
    width: 50vw;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.1);
    max-width: 1000px;

    .loading {
      width: 100%;
      padding: 5vh 0;
      text-align: center;
      font-size: (22 * 2/75rem);
      display: inline-block;

      .loader {
        background: currentcolor;
        position: relative;
        -webkit-animation: loader 1s ease-in-out infinite;
        animation: loader 1s ease-in-out infinite;
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
        width: 0.25em;
        height: 0.5em;
        border-radius: 0.5em;
        color: #6a95f1;

        &:after,
        &:before {
          content: '';
          position: absolute;
          width: inherit;
          height: inherit;
          background: inherit;
          -webkit-animation: inherit;
          animation: inherit;
          border-radius: 0.5em;
        }

        &:before {
          right: 0.5em;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
          border-radius: 0.5em;
          color: #f2bf20;
        }

        &:after {
          left: 0.5em;
          -webkit-animation-delay: 0.6s;
          animation-delay: 0.6s;
          color: #8aa7e7;
        }

        @-webkit-keyframes loader {
          0%,
          100% {
            box-shadow: 0 0 0 currentcolor, 0 0 0 currentcolor;
          }

          50% {
            box-shadow: 0 -0.25em 0 currentcolor, 0 0.25em 0 currentcolor;
          }
        }

        @keyframes loader {
          0%,
          100% {
            box-shadow: 0 0 0 currentcolor, 0 0 0 currentcolor;
          }

          50% {
            box-shadow: 0 -0.25em 0 currentcolor, 0 0.25em 0 currentcolor;
          }
        }
      }
    }

    [class*='loader'] {
      display: inline-block;
      width: 1em;
      height: 1em;
      color: inherit;
      vertical-align: middle;
      pointer-events: none;
    }
  }

  .notes-view {
    display: flex;
    width: 100vw;
    height: 100%;
    background: #fff;
  }
}

.isPC {
  display: flex !important;
}

.isM {
  display: none !important;
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .layer {
    .notes-view {
      flex-direction: column;
    }

    .modal-container {
      margin: 0 5vw;
      width: 90vw;
    }
  }

  .isPC {
    display: none !important;
  }
}
</style>
