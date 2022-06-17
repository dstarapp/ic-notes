<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('user.del.title') }}
        </div>
        <div v-show="delstatus != 1" class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <div class="deletenotebox">
          <p class="modal-content">
            {{ $t('user.del.tips') }}
          </p>
          <div class="deletenote-btn-box">
            <div class="deletenote-btn deletenote" :class="delstatus == 0 ? 'active' : ''" @click="del">
              {{ delstatus == 0 ? $t('BtnName.delete') : $t('BtnName.clickTxt') }}
            </div>
            <div class="deletenote-btn cancel" @click="close">
              {{ $t('BtnName.cancel') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RemoveDevice } from '../../../utils/notes/sync';
export default {
  name: 'DeleteNote',
  components: {},
  props: {
    alias: String,
  },
  data() {
    return {
      delstatus: 0, //1-点击 2-删除成功
      isCheck: false,
    };
  },
  methods: {
    close() {
      if (this.delstatus == 1) {
        return;
      }
      this.$emit('close', false);
    },
    del() {
      if (this.alias == '') {
        return;
      }
      this.delstatus = 1;
      this.$nextTick(async () => {
        await RemoveDevice(this.alias);
        this.delstatus = 0;
        this.$emit('close', true);
      });
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
    box-shadow: 0 0 18px rgb(0 0 0 / 10%);
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
      margin-bottom: 2vh;
    }

    .close {
      position: absolute;
      top: 4vh;
      right: 4vh;
      font-size: (16 * 2/75rem);
      cursor: pointer;
    }

    .deletenotebox {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .modal-content {
        width: 90%;
        margin: 3vh 0 0 0;
        line-height: 150%;
        color: #999;
        text-align: center;
        font-size: (14 * 2/75rem);
      }

      .deletenote-btn-box {
        width: 100%;
        margin-top: 4vh;
        display: flex;
        justify-content: center;
        margin-bottom: 6vh;

        .deletenote-btn {
          width: 40%;
          padding: 2.5vh 0;
          text-align: center;
          border-radius: 8px;
          color: #fff;
          font-size: (12 * 2/75rem);
          font-weight: bold;
          transition: all 0.3s linear;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s linear;
          cursor: pointer;

          &.deletenote {
            background-color: #3c6dd8;
            opacity: 0.5;
            pointer-events: none;
            margin-right: 5%;

            &.active {
              opacity: 1;
              pointer-events: auto;
            }

            &:hover {
              box-shadow: 0 0 15px rgb(60, 109, 216, 0.5);
              transition: all 0.3s linear;
            }
          }

          &.cancel {
            background-color: #bbbbbb;

            &:hover {
              transition: all 0.3s linear;
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            }
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
    }
    .modal-con {
      .modal-header {
        margin-top: 4vh;
      }
      .deletenotebox {
        p {
          margin-top: 0;
        }
        .deletenote-btn-box {
          margin-bottom: 4vh;
        }
        .deletenote-btn {
          padding: 2vh 0 !important;
        }
      }
    }
  }
}
</style>
