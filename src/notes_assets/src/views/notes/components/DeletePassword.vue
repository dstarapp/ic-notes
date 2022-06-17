<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('pwd.deltitle') }}
        </div>
        <!-- v-show="status"  -->
        <div class="close" @click="close(false)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <div class="deletenotebox">
          <div v-for="(item, index) in conditions" class="note-condition" @click="handleClick(index, item)" :key="index">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="selected.indexOf(item) == -1 ? '#icon-nocheck' : '#icon-checked'" />
            </svg>
            <p :class="{ checked: selected.indexOf(item) != -1 }" v-html="item.content"></p>
          </div>
          <div class="deletenote-btn-box flex">
            <div class="internet-identity-btn" :class="checkstatus ? 'active' : ''" style="width: 61%" @click="useDelete">
              <div v-if="status" class="la-timer la-sm">
                <div></div>
              </div>
              {{ status ? $t('BtnName.clickTxt') : $t('pwd.delbtn') }}
            </div>
            <div class="deletenote-btn cancel" @click="close(false)" style="width: 35%">
              {{ $t('BtnName.cancel') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DeleteNote } from '../../../utils/notes/notebook';
import { NotesIdentity } from '../../../utils/identity';
export default {
  name: 'DeletePassword',
  components: {},
  props: {
    did: Number,
  },
  data() {
    return {
      title: 'Delete Password',
      status: false,
      conditions: [
        { id: '1', content: this.$i18n.t('deletenote.condition.one') },
        { id: '2', content: this.$i18n.t('deletenote.condition.two') },
      ],
      checkstatus: false,
      selected: [],
    };
  },
  watch: {
    selected: {
      handler(newval) {
        if (newval.length == 2) {
          this.checkstatus = true;
        } else {
          this.checkstatus = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    handleClick(index, item) {
      if (this.selected.indexOf(item) !== -1) {
        this.selected.splice(this.selected.indexOf(item), 1);
      } else {
        this.selected.push(item);
      }
      if (this.selected.length == 2) {
        this.checkstatus = true;
      } else {
        this.checkstatus = false;
      }
    },
    close(data = false) {
      if (this.status) {
        return;
      }
      this.$emit('close', data);
    },
    useDelete() {
      if (this.status) {
        return;
      }
      console.log(this.checkstatus, 'selected');
      this.status = true;
      this.$nextTick(async () => {
        let ret = await NotesIdentity.login();
        if (ret) {
          await DeleteNote(Number(this.did));
          this.status = false;
          this.close(true);
        } else {
          this.status = false;
          this.close();
        }
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
      width: 90%;
      line-height: 150%;
      color: #000;
      font-size: (20 * 2/75rem);
      text-align: center;
      font-weight: bold;
      font-family: 'GothicB';
      margin-top: 4vh;
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
      display: flex;
      flex-direction: column;
      width: 80%;

      .note-condition {
        display: flex;
        color: #999;
        margin: 15px 0 0 0;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        svg {
          font-size: 18px;
          margin-right: 8px;
        }

        p {
          margin: 0;

          &.checked {
            color: #333;
          }
        }

        .error {
          color: #fd6464;
        }
      }

      .deletenote-btn-box {
        display: flex;
        width: 100%;
        margin-top: 4vh;
        margin-bottom: 6vh;

        .internet-identity-btn {
          width: 100%;
          padding: 16px 0;
          text-align: center;
          border-radius: 6px;
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
          &.active {
            pointer-events: auto;
            cursor: pointer;
            opacity: 1;
            &:hover {
              box-shadow: 0 0 15px rgba(226, 54, 157, 0.5);
            }
          }
        }

        .deletenote-btn {
          flex: 1;
          padding: 12px 0;
          text-align: center;
          border-radius: 6px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s linear;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          &.deletenote {
            background-color: #3c6dd8;

            &.active {
              opacity: 1;
              pointer-events: auto;

              &:hover {
                transition: all 0.3s linear;
                box-shadow: 0 0 15px rgba(60, 109, 216, 0.5);
              }
            }
          }

          &.cancel {
            background-color: #bbbbbb;
            margin-left: 20px;

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
      .deletenotebox {
        .deletenote-btn-box {
          margin-bottom: 4vh;
        }
      }
    }
  }
}
</style>
