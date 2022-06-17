<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">{{ $t('backup.initAccount.title') }}</div>
        <div class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <p class="tips">{{ $t('backup.initAccount.tips') }}</p>
        <div class="flex">
          <button class="submit" :class="{ active: state != 1 }" @click="deal">
            <div v-if="state == 1" class="la-timer la-sm">
              <div></div>
            </div>
            {{ state == 1 ? $t('BtnName.clickTxt') : state == 2 ? $t('BtnName.successTxt') : $t('BtnName.confirm') }}
          </button>
          <button class="submit cancel" @click="close">{{ $t('BtnName.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ResetAllDevices } from '../../../utils/notes/sync';
export default {
  name: 'InitAccount',
  data() {
    return {
      state: 0, // 0-默认 1-点击
    };
  },
  components: {},
  methods: {
    close() {
      if (this.state > 0) {
        return;
      }
      this.$emit('closeInit');
    },
    deal() {
      this.state = 1;
      this.$nextTick(async () => {
        let ret = await ResetAllDevices();
        if (ret) {
          this.state = 2;
          setTimeout(() => {
            window.location.reload();
          }, 500);
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
      margin-top: 6vh;
    }

    .close {
      position: absolute;
      top: 4vh;
      right: 4vh;
      font-size: (16 * 2/75rem);
      cursor: pointer;
    }

    .modal-content {
      width: 90%;
      margin: 3vh 0 0 0;
      line-height: 150%;
      color: #333;
      text-align: left;
      font-size: (12 * 2/75rem);
    }
  }
}

.tips {
  margin: 10px 0;
  width: 90%;
  padding: 25px 0 10px 0;
  color: #666;
  line-height: 22px;
  text-align: center;
  font-size: (12 * 2/75rem);
}

.flex {
  display: flex;
  justify-content: center;
  width: 90%;
  margin-bottom: 6vh;
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    margin: 20px auto 0 auto;
    font-weight: bold;
    height: 55px;
    width: 45%;
    color: #fff;
    font-size: 16px;
    transition: all 0.3s linear;
    background-color: #8eb0fa;
    border: none;
    cursor: pointer;

    &.active {
      background-color: #3c6dd8;
      transition: all 0.3s linear;

      &:hover {
        box-shadow: 0 0 18px rgb(60, 109, 216, 0.6);
        transition: all 0.3s linear;
      }
    }

    &.cancel {
      background-color: #bbbbbb;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-bg {
    .modal-container {
      width: 90vw;
    }
  }

  .modal-con {
    .tips {
      margin: 0;
    }
    .modal-header {
      margin-top: 4vh !important;
    }
    .flex {
      margin-bottom: 4vh;
    }
  }
}
</style>
