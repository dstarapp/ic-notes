<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('transfer.title') }}
        </div>
        <div v-show="doStatus != 1" class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <p class="change-controller-tips">
          {{ $t('transfer.tips') }}
        </p>
        <div class="change-controller-pid">
          <input v-model="pid" type="text" placeholder="Principal ID" />
        </div>
        <span class="error" v-show="doStatus == 2">
          {{ $t('transfer.error') }}
        </span>
        <div class="internet-identity-btn" :class="status ? 'active' : ''" @click="transfer">
          <div v-if="doStatus == 1" class="la-timer la-sm">
            <div></div>
          </div>
          {{ doStatus == 1 ? $t('BtnName.clickTxt') : $t('transfer.btn') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validatePrincipalId } from '../../../utils/ic/constant';
import { GetUserInfo } from '../../../utils/notes/sync';
import { ChangeNoteBookOwner, SetCurNoteBook } from '../../../utils/notes/notes';
import { Principal } from '@dfinity/principal';
import router from '../../../router';
import { NotesIdentity } from '../../../utils/identity';
export default {
  name: 'Transfer',
  components: {},
  data() {
    return {
      pid: '',
      status: false,
      doStatus: 0,
    };
  },
  watch: {
    pid: {
      handler() {
        let user = GetUserInfo();
        if (this.pid == user.pid) {
          this.status = false;
          return;
        }
        if (validatePrincipalId(this.pid)) {
          this.status = true;
        } else {
          this.status = false;
        }
        console.log(this.pid);
      },
      deep: true,
    },
  },
  methods: {
    transfer() {
      if (this.doStatus == 1) {
        return;
      }
      this.doStatus = 1;
      this.$nextTick(async () => {
        let ret = await NotesIdentity.login();
        if (ret) {
          ret = await ChangeNoteBookOwner(Principal.fromText(this.pid));
          console.log(ret);
          if (!ret) {
            this.doStatus = 2;
          } else {
            SetCurNoteBook('');
            this.$router.replace({ name: 'home' });
          }
        } else {
          this.close();
        }
      });
    },
    close() {
      this.$emit('close', false);
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
  z-index: 11;
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

    .change-controller-tips {
      width: 80%;
      line-height: 22px;
      color: #333;
      display: block;
      font-size: 14px;
      margin: 25px 0 0 0;
    }

    .change-controller-pid {
      width: 80%;
      margin: 25px 0;
      padding: 0;

      input {
        width: 100%;
        line-height: 45px;
        border: 2px solid #ddd;
        text-indent: 15px;
        box-sizing: border-box;
        border-radius: 6px;
        outline: none;
        font-size: 14px;
        &::placeholder {
          color: #999;
          font-size: 16px;
        }
      }
    }

    .error {
      display: flex;
      width: 60%;
      color: #fd6464;
      margin-top: -20px;
      padding-top: 5px;
      margin-bottom: 25px;
      display: block;
      background-size: 12px;
    }

    .internet-identity-btn {
      width: 50%;
      margin: auto;
      padding: 18px 0;
      text-align: center;
      border-radius: 8px;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      transition: all 0.3s linear;
      opacity: 0.5;
      background: linear-gradient(120deg, #2aabe2, #532886, #ee1e79, #fbb03b);
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      margin-bottom: 6vh;

      &.active {
        opacity: 1;
        transition: all 0.3s linear;
        pointer-events: auto;

        &:hover {
          cursor: pointer;
          transition: all 0.3s linear;
          box-shadow: 0 0 15px #ee1e7980;
        }
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-bg {
    .modal-container {
      width: 90vw;
    }
  }
}
</style>
