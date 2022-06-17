<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('pwd.title') }}
        </div>
        <div v-if="!iscreate" class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <div class="passwordbox-contain">
          <div class="passwordbox">
            <span
              >{{ $t('pwd.items.item1') }}<i>{{ $t('pwd.items.item1_sub') }}</i></span
            >
            <input type="text" :placeholder="$t('pwd.items.placehoder1')" v-model="website" ref="webtitle" />
            <i>*</i>
          </div>
          <div class="passwordbox">
            <span>{{ $t('pwd.items.item2') }}</span>
            <input type="text" :placeholder="$t('pwd.items.placehoder2')" v-model="account" />
            <i></i>
          </div>
          <div class="passwordbox">
            <span
              >{{ $t('pwd.items.item3') }}<i>{{ $t('pwd.items.item3_sub') }}</i></span
            >
            <textarea :class="passerror ? 'error' : ''" cols="30" rows="10" :placeholder="$t('pwd.items.placehoder3')" v-model="pwd"></textarea>
            <i>*</i>
          </div>
        </div>
        <div class="passwordboxbtn-top note-notesubmit" :class="status ? 'active' : ''" @click="check">
          <div v-if="iscreate" class="la-timer la-sm">
            <div></div>
          </div>
          {{ iscreate ? $t('BtnName.clickTxt') : $t('BtnName.add') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CreateNote, NTYPE_BOXITEM } from '../../../utils/notes/notebook';
export default {
  name: 'PasswordBox',
  data() {
    return {
      iscreate: false,
      status: false,
      // tips: '',
      website: '',
      account: '',
      pwd: '',
      // errorstatus: false,
      passerror: false,
    };
  },
  mounted() {
    this.$refs.webtitle.focus();
  },
  methods: {
    close() {
      this.$emit('close', false);
    },
    // 出错样式 文本框填 1
    check() {
      if (this.pwd && this.pwd.trim() == '') {
        this.passerror = true;
      } else {
        this.passerror = false;
      }
      if (this.website && this.website.trim() == '') {
        return;
      }
      // let regex = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
      // if (!regex.test(this.website)) {
      //   this.errorstatus = true
      //   return
      // } else {
      //   this.errorstatus = false
      // }
      if (this.iscreate) {
        return;
      }
      this.iscreate = true;
      this.$nextTick(async () => {
        let ret = await CreateNote({
          title: this.website.trim(),
          ntype: NTYPE_BOXITEM,
          content: JSON.stringify({
            user: this.account.trim(),
            pass: this.pwd.trim(),
          }),
          tags: [],
        });
        if (ret) {
          this.iscreate = false;
          this.$emit('close', false);
        }
      });
    },
  },
  watch: {
    pwd: function (newVal) {
      let all = '';
      if (this.website != '') {
        all = newVal + this.website;
      }
      // console.log(this.all)
      if (all.indexOf(this.pwd) != -1 && all.indexOf(this.website) != -1) {
        this.status = true;
      } else {
        this.status = false;
      }
    },
  },
  components: {},
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
          padding-right: 15px;
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
          width: 11vw;
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
    }

    .note-notesubmit {
      width: 50%;
      margin: auto;
      padding: 16px 0;
      text-align: center;
      border-radius: 8px;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      transition: all 0.3s linear;
      opacity: 0.5;
      background: linear-gradient(135deg, #6a95f1, #3c6dd8);
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      margin-top: 4vh;
      margin-bottom: 6vh;

      &.success {
        background: #5ab668;
        transition: all 0.3s linear;
        opacity: 1;
      }

      &.active {
        opacity: 1;
        transition: all 0.3s linear;
        pointer-events: auto;
        cursor: pointer;
        &:hover {
          transition: all 0.3s linear;
          box-shadow: 0 0 15px rgba(60, 109, 216, 0.5);
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

      .note-notesubmit {
        width: 80%;
        margin-bottom: 4vh;
        margin-top: 3vh;
      }
    }
  }
}
</style>
