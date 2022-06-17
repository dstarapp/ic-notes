<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('logout.title') }}
        </div>
        <div class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <p class="modal-content">
          {{ $t('logout.tips') }}
        </p>
        <div class="deletenotebox">
          <div class="deletenote-btn deletenote" :class="isWait ? '' : 'active'" @click="logout">
            <div v-if="isWait" class="la-timer la-sm">
              <div />
            </div>
            {{ isWait ? $t('BtnName.clickTxt') : $t('BtnName.logout') }}
          </div>
          <div class="deletenote-btn cancel" @click="close">
            {{ $t('BtnName.cancel') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Dialog from './Dialog.vue'
import { NotesIdentity } from '../utils/identity';
export default {
  name: 'DeleteNote',
  data() {
    return {
      isCheck: false,
      isWait: false,
    };
  },
  methods: {
    close() {
      this.$emit('close', false);
    },
    logout() {
      if (this.isWait) {
        return;
      }
      this.isWait = true;
      this.$nextTick(async () => {
        let ret = await NotesIdentity.logout();
        this.isWait = false;
        // this.$router.replace({ name: 'login' })
        if (this.$route.name == 'login') {
          window.location.reload();
        } else {
          this.$router.replace({ name: 'login' });
        }
      });
    },
  },
  // components: {
  //   Dialog,
  // },
};
</script>

<style scoped lang="less">
.modal-bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px) saturate(100%);

  .modal-container {
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 18px rgba(0 0 0 / 10%);
    display: flex;
    width: 50vw;
    border-radius: 20px;
    overflow: hidden;
    max-width: 1000px;
  }

  .modal-con {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

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

    .close {
      position: absolute;
      top: 4vh;
      right: 4vh;
      font-size: (16 * 2/75rem);
      cursor: pointer;
    }

    .modal-content {
      width: 85%;
      margin: 4vh 0 2vh 0;
      line-height: 150%;
      color: #333;
      text-align: left;
      font-size: (12 * 2/75rem);
    }

    .deletenotebox {
      display: flex;
      width: 85%;
      margin: 3vh 0 6vh 0;

      .deletenote-btn {
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
        text-decoration: none;

        &:hover {
          box-shadow: 0 0 10px rgb(60, 109, 216, 0.1);
          transition: all 0.3s linear;
        }
        &.cancel {
          background-color: #bbbbbb;
          margin-left: 3.5vw;
          &:hover {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-bg {
    .modal-container {
      width: 90vw;
      .modal-header {
        margin-top: 4vh;
      }
    }
    .modal-con {
      .deletenotebox {
        margin: 1vh 0 4vh 0;
      }
    }
  }

  .la-timer {
    transform: scale(0.8, 0.8);
  }
}
</style>
