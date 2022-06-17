<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ showTitle }}
        </div>
        <div class="close" @click="closelayer(false)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <div class="internet-identity-btn active internet-identity-checkbtn" @click="clickUse">
          {{ $t('pwd.btn') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NotesIdentity } from '../../../utils/identity';
import { GetUserInfo } from '../../../utils/notes/sync';

export default {
  name: 'UseIdentity',
  components: {},
  props: {
    title: String,
  },
  data() {
    return {
      showTitle: this.title ? this.title : 'Use Internet Identity ',
      isLogin: false,
      isUpdate: false,
    };
  },
  methods: {
    clickUse() {
      if (this.isLogin) {
        return;
      }
      let user = GetUserInfo();
      this.isLogin = true;
      this.$nextTick(async () => {
        let ret = await NotesIdentity.login();
        if (ret) {
          this.isLogin = false;
          let identity = NotesIdentity.getIdentity();
          if (identity && identity.getPrincipal().toString() !== user.pid) {
            await NotesIdentity.logout();
            window.location.reload();
            return;
          }
          this.closelayer(true);
        }
      });
    },
    closelayer(data = false) {
      if (this.isLogin) {
        return;
      }
      this.$emit('close', data);
    },
  },
};
</script>

<style scoped lang="less">
.modal-bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
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
    border-radius: 15px;
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
      width: 80%;
      margin: 5vh 0 0 0;
      line-height: 150%;
      color: #333;
      text-align: left;
      font-size: (14 * 2/75rem);
    }

    .internet-identity-btn.active {
      opacity: 1;
      transition: all 0.3s linear;
      pointer-events: auto;
    }

    .internet-identity-checkbtn {
      width: 60%;
      padding: 20px 0;
      text-align: center;
      border-radius: 8px;
      color: #fff;
      font-size: (12 * 2/75rem);
      font-weight: bold;
      transition: all 0.3s linear;
      opacity: 0.5;
      background: linear-gradient(120deg, #2aabe2, #532886, #ee1e79, #fbb03b);
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      margin-bottom: 6vh;
      margin-top: 4vh;
      cursor: pointer;

      &:hover {
        transition: all 0.3s linear;
        box-shadow: 0 0 15px rgba(238, 30, 121, 0.5);
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-bg {
    .modal-container {
      width: 90vw;
    }
    .modal-con {
      .modal-header {
        margin-top: 4vh;
      }
      .internet-identity-checkbtn {
        width: 85%;
        margin-bottom: 5vh;
      }
    }
  }
}
</style>
