<template>
  <div class="modal-con">
    <div class="modal-header">
      {{ $t('congratulations.title') }}<i># {{ userinfo ? userinfo.id : '' }}</i>
    </div>
    <div class="congrations">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-ok" />
      </svg>
    </div>
    <div class="pid">
      <span>Principal ID：</span>
      <em>{{ userinfo ? userinfo.pid : '' }}</em>
      <!-- <p>pqnwp-3vl7v-youya-pogc4-ct7oq-5bjx2-xyfxc-pej73-ybaov-63nmr-5qe</p> -->
    </div>

    <div class="createnotes-addexits-btn" @click="clickSee()">{{ $t('congratulations.btnName') }}</div>
  </div>
</template>

<script>
import { GetUserInfo } from '../../../utils/notes/sync';
export default {
  name: 'LoginSucceed',
  data() {
    return {
      userinfo: GetUserInfo(),
    };
  },
  methods: {
    clickSee() {
      this.$router.push({ name: 'home' });
    },
  },
};
</script>

<style scoped lang="less">
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

    i {
      font-style: normal;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 2px 6px;
      color: #3c6dd8;
      font-weight: bold;
      font-size: (12 * 2/75rem);
      margin-left: 1vh;
    }
  }

  .congrations {
    margin-top: 3vh;

    svg {
      font-size: 80px;
      margin: auto;
    }
  }

  .pid {
    background-color: #f6f6f6;
    border-radius: 8px;
    color: #3c6dd8;
    margin-top: 3vh;
    display: flex;
    text-align: center;
    font-size: (12 * 2/75rem);
    justify-content: center;
    align-items: center;
    padding: 2vh 0;
    flex-direction: column;
    width: 85%;

    span {
      border-radius: 4px;
      color: #333;
      font-weight: bold;
      padding-bottom: 15px;
    }

    em {
      display: inline-flex;
      font-style: normal;
      font-size: (10 * 2/75rem);
      padding: 0 15px;
      word-break: break-all; // 使中⽂和英⽂为⼀体，⼀起换⾏
      word-wrap: break-word; // 使中⽂和英⽂分开换⾏
    }
  }

  .createnotes-addexits-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    margin: auto;
    font-weight: bold;
    height: 10vw;
    max-height: 50px;
    width: 50%;
    min-width: 250px;
    color: #fff;
    background-color: #3c6dd8;
    font-size: (12 * 2/75rem);
    transition: all 0.3s linear;
    cursor: pointer;
    margin: 4vh 0 5vh 0;
    &:hover {
      opacity: 0.8;
      transition: 0.3s opacity linear;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-con {
    .pid {
      flex-direction: column;
      font-size: (14 * 2/75rem);

      em {
        margin-top: 1vh;
        font-size: (10 * 2/75rem);
      }
    }
    .createnotes-addexits-btn {
      width: 85%;
      height: 6vh;
      max-height: 50px;
    }
  }
}
</style>
