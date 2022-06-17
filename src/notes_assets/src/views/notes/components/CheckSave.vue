<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('checksave.title') }}
        </div>
        <p>{{ $t('checksave.tips') }}</p>
        <div class="flex">
          <button class="submit" :class="status == 0 ? 'active' : status == 2 ? 'error' : ''" @click="saving">
            {{ status == 1 ? $t('checksave.btnName.saving') : status == 2 ? $t('checksave.btnName.failed') : status == 3 ? $t('checksave.btnName.saved') : $t('checksave.btnName.save') }}
            <img v-if="status == 1" src="../../../assets/svg/loading.svg" />
          </button>
          <button class="submit cancel" @click="goUrl">{{ $t('checksave.btnName.throw') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckSave',
  props: ['toUrl'],
  emits: ['close', 'save'],
  data() {
    return {
      status: 0, // 0-默认 1-点击状态 2-出错样式 3-成功
    };
  },
  methods: {
    saving() {
      this.status = 1;
      this.$emit('save', true);
      // let seconds = 10;
      // const timer = setInterval(() => {
      //   seconds -= 1;
      //   if (seconds == 8) {
      //     this.status = 2;
      //   }
      //   if (seconds == 6) {
      //     this.status = 3;
      //   }
      //   if (seconds == 5) {
      //     clearInterval(timer);
      //     this.$emit('close', false);
      //   }
      // }, 1000);
    },
    goUrl(data = true) {
      this.$emit('close', data);
    },
    saveDone(data) {
      this.status = data ? 3 : 2;
      setTimeout(() => {
        this.goUrl(data);
      }, 500);
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
  z-index: 1001;
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

    p {
      padding: 4vh 0;
      margin: 0;
      font-size: 16px;
    }

    .flex {
      display: flex;
      width: 90%;
      margin-bottom: 4vh;

      .submit {
        border: none;
        flex: 1;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 6px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        background-color: #6a95f1;
        cursor: pointer;
        transition: all 0.3s linear;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          box-shadow: 0 0 15px rgba(60, 109, 216, 0.5);
          transition: box-shadow 0.3s linear;
        }

        &.active {
          background-color: #3c6dd8;
          transition: background-color 0.3s linear;
        }

        &.error {
          background-color: #ffd7d7;
          color: #fd6464;
          transition: all 0.3s linear;

          &:hover {
            box-shadow: none;
          }
        }

        &.cancel {
          background-color: #bbbbbb;
          transition: box-shadow 0.3s linear;
          margin-left: 5%;

          &:hover {
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            transition: box-shadow 0.3s linear;
          }
        }

        img {
          width: 20px;
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
