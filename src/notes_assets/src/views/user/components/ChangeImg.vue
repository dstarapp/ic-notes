<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('user.changevtitle') }}
        </div>
        <div v-show="upstatus != 1" class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <div class="contain">
          <div v-for="(item, index) in avatars" :key="index" class="avatar" @click="change(index)">
            <div class="imgbox" :class="{ checked: isCheck == index }">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#icon-' + item.name" />
              </svg>
            </div>
          </div>
        </div>
        <div class="mt-30 note-notesubmit" :class="[upstatus == 1 ? '' : 'active', upstatus == 2 ? 'success' : '']"
          @click="update">
          <svg class="icon" aria-hidden="true" v-if="upstatus == 2">
            <use xlink:href="#icon-success" />
          </svg>
          <div v-if="upstatus == 1" class="la-timer la-sm">
            <div />
          </div>
          {{ upstatus == 1 ? $t('BtnName.clickTxt') : upstatus == 2 ? '' : $t('BtnName.update') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChangeAvatar, GetUserInfo } from '../../../utils/notes/sync'
export default {
  name: 'ChangeImg',
  data() {
    return {
      upstatus: 0,
      second: 30,
      avatars: [
        { name: 'avatar-1', isCheck: false },
        { name: 'avatar-2', isCheck: false },
        { name: 'avatar-3', isCheck: false },
        { name: 'avatar-4', isCheck: false },
        { name: 'avatar-5', isCheck: false },
        { name: 'avatar-6', isCheck: false },
        { name: 'avatar-7', isCheck: false },
        { name: 'avatar-8', isCheck: false },
        // { name: GetAvatar('avatar-9'), isCheck: false },
      ],
      isCheck: -1,
    }
  },
  methods: {
    close() {
      this.$emit('close', false)
    },
    update() {
      if (this.isCheck == -1) {
        return
      }
      let name = 'avatar-' + (this.isCheck + 1)
      let user = GetUserInfo()
      if (user.avatar == name) {
        return
      }
      this.upstatus = 1
      this.$nextTick(async () => {
        await ChangeAvatar(name)
        this.upstatus = 2
        setTimeout(() => {
          this.close()
        }, 500)
      })
    },
    change(index) {
      if (this.isCheck == index) {
        this.isCheck = -1
      } else {
        this.isCheck = index
      }
    },
  },
}
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
    width: 60vw;
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
      font-size: (26 * 2/75rem);
      text-align: center;
      font-weight: bold;
      font-family: 'GothicB';
      margin-top: 4vh;
    }

    .close {
      position: absolute;
      top: 2vh;
      right: 2vh;
      font-size: (20 * 2/75rem);
      cursor: pointer;
    }

    .note-notesubmit {
      width: 50%;
      margin: auto;
      padding: 16px 0;
      text-align: center;
      border-radius: 6px;
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
      margin-top: 1vh;
      margin-bottom: 4vh;

      &.success {
        background: #5AB668;
        transition: all .3s linear;
        opacity: 1;
      }

      &.active {
        opacity: 1;
        transition: all 0.3s linear;
        pointer-events: auto;
      }
    }


    .avatar {
      width: 25%;
      display: inline-flex;
      margin-top: 1.5vh;
      cursor: pointer;

      .imgbox {
        display: block;
        margin: auto;
        border: 3px solid #fff;
        border-radius: 50%;
        background-color: #fff;

        svg {
          font-size: (70 * 2/75rem);
          opacity: 0.6;
        }

        &.checked {
          border: 3px solid #6a95f1;
          transition: border 0.2s linear;

          svg {
            opacity: 1;
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

      .modal-con {
        .avatar {
          width: 33.333%;
        }
      }
    }
  }
}
</style>
