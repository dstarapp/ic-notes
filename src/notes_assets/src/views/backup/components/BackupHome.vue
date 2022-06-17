<template>
  <div class="layer">
    <div class="modal-container">
      <div class="loading" v-if="isLoading">
        <div class="loader"></div>
      </div>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import { InitUser } from '../../../utils/notes/sync';
export default {
  name: 'BackupDialog',
  data() {
    return {
      isLoading: true,
    };
  },
  components: {},
  mounted() {
    this.$nextTick(async () => {
      try {
        await InitUser();
        this.isLoading = false;
      } catch (e) {
        window.location.reload();
      }
    });
  },
  methods: {},
};
</script>

<style scoped lang="less">
.layer {
  background: url(../images/layer-bg.png) no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .modal-container {
    display: flex;
    width: 50vw;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.1);
    max-width: 1000px;

    .loading {
      width: 100%;
      padding: 5vh 0;
      text-align: center;
      font-size: (22 * 2/75rem);
      display: inline-block;

      .loader {
        background: currentcolor;
        position: relative;
        -webkit-animation: loader 1s ease-in-out infinite;
        animation: loader 1s ease-in-out infinite;
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
        width: 0.25em;
        height: 0.5em;
        border-radius: 0.5em;
        color: #6a95f1;

        &:after,
        &:before {
          content: '';
          position: absolute;
          width: inherit;
          height: inherit;
          background: inherit;
          -webkit-animation: inherit;
          animation: inherit;
          border-radius: 0.5em;
        }

        &:before {
          right: 0.5em;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
          border-radius: 0.5em;
          color: #f2bf20;
        }

        &:after {
          left: 0.5em;
          -webkit-animation-delay: 0.6s;
          animation-delay: 0.6s;
          color: #8aa7e7;
        }

        @-webkit-keyframes loader {
          0%,
          100% {
            box-shadow: 0 0 0 currentcolor, 0 0 0 currentcolor;
          }

          50% {
            box-shadow: 0 -0.25em 0 currentcolor, 0 0.25em 0 currentcolor;
          }
        }

        @keyframes loader {
          0%,
          100% {
            box-shadow: 0 0 0 currentcolor, 0 0 0 currentcolor;
          }

          50% {
            box-shadow: 0 -0.25em 0 currentcolor, 0 0.25em 0 currentcolor;
          }
        }
      }
    }

    [class*='loader'] {
      display: inline-block;
      width: 1em;
      height: 1em;
      color: inherit;
      vertical-align: middle;
      pointer-events: none;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .layer {
    .modal-container {
      margin: 0 5vw;
      width: 90vw;
    }
  }
}
</style>
