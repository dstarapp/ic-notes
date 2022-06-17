<template>
  <div class="modal-bg" v-if="step == 1 || step == 2">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('pwd.title') }}
        </div>
        <div class="close" @click="closelayer">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>

        <div v-if="step == 1" class="internet-identity-btn active viewpassword-checkbtn" @click="clickUse">
          {{ $t('pwd.btn') }}
        </div>

        <div v-else-if="step == 2" class="passwordbox-contain">
          <div class="passwordbox flex">
            <span
              >{{ $t('pwd.items.item1') }}<i>{{ $t('pwd.items.item1_sub') }}</i></span
            >
            <input v-model="website" type="text" :placeholder="$t('pwd.items.placehoder1')" />
            <div class="viewpassword-copy-noborder" />
          </div>
          <div class="passwordbox flex">
            <span>{{ $t('pwd.items.item2') }}</span>
            <input v-model="account" type="text" :placeholder="$t('pwd.items.placehoder2')" />
            <button class="copy" :class="{ copytips: isCopyUser }" @click="copyUser">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-copy" />
              </svg>
            </button>
          </div>
          <div class="passwordbox flex">
            <span
              >{{ $t('pwd.items.item3') }}<i>{{ $t('pwd.items.item3_sub') }}</i></span
            >
            <textarea id="" v-model="pwd" name="" cols="30" rows="10" :placeholder="$t('pwd.items.placehoder3')" />
            <button class="copy" :class="{ copytips: isCopyPass }" @click="copyPass">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-copy" />
              </svg>
            </button>
          </div>
          <div class="viewpassword-btn-box flex">
            <div class="viewpassword-btn update" @click="updateBox">
              <div v-if="isUpdate" class="la-timer la-sm">
                <div></div>
              </div>
              {{ isUpdate ? $t('BtnName.clickTxt') : $t('BtnName.update') }}
            </div>
            <div class="viewpassword-btn delete" @click="deleteBox">
              {{ $t('BtnName.delete') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DeletePassword v-else @close="cancel" :did="id" />
</template>

<script>
import DeletePassword from './DeletePassword.vue';
import { NotesIdentity } from '../../../utils/identity';
import { GetNoteData, GetCurBox, UpdateNote, NTYPE_BOXITEM } from '../../../utils/notes/notebook';
export default {
  name: 'ViewPassword',
  components: {
    DeletePassword,
  },
  data() {
    return {
      title: 'Show Password',
      isLogin: false,
      step: 1,
      isCopyUser: false,
      isCopyPass: false,
      isUpdate: false,
      // errorstatus: false,
      website: '',
      account: '',
      pwd: '',
      tag: '',
      id: 0,
    };
  },
  methods: {
    clickUse() {
      if (this.isLogin) {
        return;
      }
      this.isLogin = true;
      this.$nextTick(async () => {
        let ret = await NotesIdentity.login();
        if (ret) {
          let note = GetCurBox();
          if (note == null) {
            this.closelayer();
            return;
          }
          let ret = await GetNoteData(note.id);
          try {
            note.content = JSON.parse(ret);
            this.website = note.title;
            this.account = note.content.user;
            this.pwd = note.content.pass;
            this.id = note.id;
          } catch (e) {
            console.log(e);
            this.closelayer();
            return;
          }
          this.isLogin = false;
          this.step = 2;
        }
      });
    },
    closelayer() {
      if (this.isUpdate) {
        return;
      }
      this.$emit('close', false);
    },
    updateBox() {
      let note = GetCurBox();
      if (note.id != this.id) {
        return;
      }
      if (this.website && this.website.trim() == '') {
        return;
      }
      // let regex = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
      // if (!regex.test(this.website)) {
      //   this.errorstatus = true
      // } else {
      //   this.errorstatus = false
      // }
      if (this.isUpdate) {
        return;
      }
      this.isUpdate = true;
      this.$nextTick(async () => {
        let ret = await UpdateNote({
          id: note.id,
          title: this.website.trim(),
          ntype: NTYPE_BOXITEM,
          content: JSON.stringify({
            user: this.account,
            pass: this.pwd,
          }),
          like: note.like,
          topTime: note.topTime,
          tags: [],
        });
        if (ret) {
          this.isUpdate = false;
          this.$emit('close', false);
        }
      });
    },
    deleteBox() {
      if (this.isUpdate) {
        return;
      }
      this.title = 'Delete Password';
      this.step = 3;
    },
    cancel(data) {
      console.log('viewpassword cacel', data);
      if (data) {
        this.closelayer();
        return;
      }
      this.title = 'Show Password';
      this.step = 2;
      console.log(this.step, this.account, this.pwd);
    },
    copyUser() {
      this.$copyText(this.pwd).then(
        () => {
          this.isCopyUser = true;
          this.isCopyPass = false;
          setTimeout(() => {
            this.isCopyUser = false;
          }, 3000);
        },
        (e) => {
          console.log('copy failed', e);
        }
      );
    },
    copyPass() {
      this.$copyText(this.pwd).then(
        () => {
          this.isCopyPass = true;
          this.isCopyUser = false;
          setTimeout(() => {
            this.isCopyPass = false;
          }, 3000);
        },
        (e) => {
          console.log('copy failed', e);
        }
      );
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
  z-index: 9999;
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
      width: 90%;
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

    .internet-identity-btn {
      width: 60%;
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
      margin-top: 4vh;

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

    .passwordbox-contain {
      display: flex;
      flex-direction: column;
      // padding: 10px 30px 0 30px;
      width: 80%;

      .passwordbox {
        width: 100%;
        align-items: center;
        margin-top: 25px;
        display: flex;
        position: relative;

        input,
        textarea {
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
          flex: 1;
          font-size: 14px;
          &.error {
            border: 1px solid #ffd7d7;
            background-color: #fff5f5;
            color: #fd6464;
          }
        }

        i {
          color: red;
          font-size: 16px;
          width: 20px;
          text-align: right;
          font-style: normal;
        }

        input {
          line-height: 40px;
          padding-left: 15px;
          position: relative;
        }

        textarea {
          padding: 10px 15px;
          max-height: 30px;
          font-family: 'Gothic';
          resize: none;
        }

        span {
          text-align: right;
          font-weight: bold;
          max-width: 85px;
          width: 9vw;
          min-width: 35px;
          padding-right: 15px;
          font-size: 14px;

          i {
            display: block;
            width: 100%;
            color: #999;
            font-size: 12px;
            font-style: normal;
            font-weight: normal;
            text-align: right;
          }
        }
      }

      .passwordboxbtn-top {
        margin-top: 30px;
      }

      .copy {
        width: 30px;
        height: 30px;
        padding: 0;
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

    .viewpassword-btn-box {
      display: flex;
      width: 100%;
      margin-top: 30px;
      margin-bottom: 6vh;

      .viewpassword-btn {
        flex: 1;
        padding: 18px 0;
        text-align: center;
        border-radius: 8px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s linear;

        &.delete {
          background-color: #f19c8e;

          &:hover {
            box-shadow: 0 0 15px rgba(241, 156, 142, 0.4);
            background-color: #fb7f6a;
          }
        }

        &.update {
          background-color: #3c6dd8;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 20px;

          &:hover {
            box-shadow: 0 0 15px rgba(60, 109, 216, 0.5);
          }
        }
      }
    }
  }
}

// .viewpassword-checkbtn {
//   margin: 40px auto 20px auto;
//   width: 80%;
//   padding: 25px 0;
// }
// .viewpassword-copy,
// .viewpassword-copy-noborder {
//   width: 42px;
//   height: 42px;
//   text-align: center;
//   margin-left: 10px;
//   border-radius: 6px;

//   &.viewpassword-copy {
//     border: 1px solid #ddd;
//     display: flex;
//     align-items: center;
//     cursor: pointer;
//     transition: all 0.3s linear;
//     img {
//       width: 16px;
//       margin: auto;
//     }
//     &.success {
//       background-color: #5ab668;
//       border: 1px solid #5ab668;
//       transition: all 0.3s linear;
//     }
//   }

//   &.viewpassword-copy-noborder {
//     border: 1px solid #fff;
//   }
// }

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-bg {
    .modal-container {
      width: 90vw;
    }

    .modal-con {
      .modal-header {
        margin-top: 4vh;
      }
      .passwordbox-contain {
        .passwordbox {
          input {
            line-height: 30px !important;
          }
        }
      }
      .viewpassword-btn-box {
        margin-bottom: 4vh;
      }
      .internet-identity-btn {
        width: 80%;
        margin-bottom: 4vh;
      }
      .note-notesubmit {
        width: 70%;
      }
    }
  }
}
</style>
