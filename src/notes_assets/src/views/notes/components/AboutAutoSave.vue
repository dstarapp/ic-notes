<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('aboutas.title') }}
        </div>
        <div class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <p class="tips">
          {{ $t('aboutas.tips') }}
          <a
            href="https://smartcontracts.org/docs/developers-guide/computation-and-storage-costs.html">https://smartcontracts.org/docs/developers-guide/computation-and-storage-costs.html</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutAutoSave',
  components: {},
  methods: {
    close() {
      this.$emit('close', false)
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

    .close {
      position: absolute;
      top: 2vh;
      right: 2vh;
      font-size: (20 * 2/75rem);
      cursor: pointer;
    }

    .tips {
      width: 80%;
      padding: 25px 0 10px 0;
      color: #666;
      line-height: 22px;
      font-size: 16px;
      margin-bottom: 4vh;
      text-align: center;

      a {
        color: #3c6dd8;
        margin-top: 15px;
        display: block;

        &:hover {
          text-decoration: underline;
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