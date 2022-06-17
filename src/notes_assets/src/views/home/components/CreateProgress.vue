<template>
  <div class="create-progress-box">
    <div class="modal-header progress-title">
      {{ $t('progress.title.t1') }}<br />
      {{ $t('progress.title.t2') }}…
    </div>
    <div class="create-progress">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressWidth + '%' }"></div>
      </div>
      <div class="progress-init">
        <div class="progress-step" :class="{ success: status >= 1 }">
          <i><img src="../../../assets/svg/icon-progress-loading.svg" class="progress-loading" v-if="status == 0" /></i>
          {{ $t('progress.state.one') }}
        </div>
        <div class="progress-step" :class="{ success: status >= 2 }">
          <i><img src="../../../assets/svg/icon-progress-loading.svg" class="progress-loading" v-if="status == 1" /></i>
          {{ $t('progress.state.two') }}
        </div>
        <div class="progress-step" :class="{ success: status >= 3 }">
          <i><img src="../../../assets/svg/icon-progress-loading.svg" class="progress-loading" v-if="status == 2" /></i>
          {{ $t('progress.state.three') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { GetCreateState } from '../../../utils/notes/notes';
export default {
  name: 'CreateProgress',
  data() {
    return {
      status: GetCreateState(),
      progressWidth: 0,
    };
  },
  methods: {},
  mounted() {
    // this.$watch(
    //   () => _.cloneDeep(this.state),
    //   (n, o) => {
    //     this.status = this.state.status
    //     if (this.status == 2) {
    //       this.progressWidth = 50
    //     } else if (this.status == 3) {
    //       this.progressWidth = 100
    //     }
    //   },
    //   { deep: true }
    // )
  },
  watch: {
    status() {
      if (this.status == 2) {
        this.progressWidth = 50;
      } else if (this.status == 3) {
        this.progressWidth = 100;
      }
      console.log(this.progressWidth);
    },
  },
};
</script>

<style scoped lang="less">
.create-progress-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px) saturate(100%);

  .progress-title {
    width: 90%;
    line-height: 150%;
    color: #000;
    font-size: (18 * 2/75rem);
    text-align: center;
    font-weight: bold;
    font-family: 'GothicB';
    margin-top: 6vh;
    padding-bottom: 20px;
  }

  .create-progress {
    width: 90%;
    padding-top: 30px;
    position: relative;
    height: 100%;
    margin-bottom: 12vh;

    .progress-bar {
      background-color: #ccc;
      left: 75px;
      right: 75px;
      height: 6px;
      border-radius: 6px;
      position: absolute;
      .progress {
        background-color: #5787f1;
        float: left;
        box-shadow: 0 2px 8px rgba(60, 109, 216, 0.6);
        height: 6px;
        border-radius: 6px;
      }
    }

    .progress-init {
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 8px;
      .progress-step {
        font-size: 16px;
        color: #999;
        width: 150px;
        text-align: center;

        i {
          width: 50px;
          height: 50px;
          border-radius: 50px;
          display: block;
          margin: auto;
          background: url(../../../assets/svg/icon-progress.svg) no-repeat center center;
          background-size: 15px;
        }

        &.success {
          color: #3c6dd8;

          i {
            background: url(../../../assets/svg/icon-progress-success.svg) no-repeat center center;
            background-size: 30px;
            transition: background 0.3s linear;
          }
        }
      }

      .progress-loading {
        width: 22px;
        height: 22px;
        border-radius: 22px;
        border: 2px solid #fff;
        margin: 12px auto;
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .create-progress-box {
    .create-progress {
      .progress-bar {
        left: 50px;
        right: 50px;
      }
    }
  }
}
</style>
