<template>
  <div>
    <div class="modal-header">
      {{ $t('congratulations.title') }}<i># {{ userinfo ? userinfo.id : '' }}</i>
    </div>
    <div class="congrations">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-ok" />
      </svg>
    </div>
    <div class="pid ellipsis"><span>Principal ID</span>{{ userinfo ? userinfo.pid : '' }}</div>

    <div class="createnotes-addexits-btn btn-50 active" @click="clickSee()">{{ $t('congratulations.btnName') }}</div>
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

<style scoped>
.pid {
  width: 100%;
  background-color: #f6f6f6;
  padding: 15px;
  border-radius: 8px;
  color: #3c6dd8;
  margin-top: 30px;
  display: block;
  text-align: center;
}
.pid span {
  border-radius: 4px;
  color: #333;
  margin-right: 10px;
  padding-bottom: 10px;
  display: block;
  font-size: 16px;
  font-weight: bold;
}
.btn-50 {
  width: 50%;
  margin-top: 40px;
}
.congrations {
  width: 15%;
  margin: 20px auto 0 auto;
}
.congrations svg {
  font-size: 80px;
  margin: auto;
}
.btn {
  width: 100%;
  text-align: center;
  padding-top: 40px;
  font-size: 18px;
  color: #3c6dd8;
  font-weight: bold;
}
</style>