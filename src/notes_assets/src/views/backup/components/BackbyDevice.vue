<template>
  <div class="modal-con">
    <!-- <div class="modal-header">{{ title }}</div>
    <div class="goback" @click="back"></div>
    <p class="warning">Do not close or refresh this page until the backup is complete !</p>
    <p class="modal-content">Please log in to Dstar Note with the same Internet Identity in your new device. An follow the steps to complete the operation.</p>
    <transition name="fade" mode="out-in">
      <div v-show="isSync">
        <div class="contain">
          <div class="mydevice"><img src="../../assets/icon-macbook.svg" /><i></i></div>
          <p class="deviceinfo">Recived the public Key form Macbook M1</p>
        </div>
        <div v-if="isShowSync" :class="clickstatus ? 'sync-btn current' : 'sync-btn'" @click="syncing">
          <div v-if="clickstatus" class="la-timer la-sm"><div></div></div>
          <img src="../../assets/icon-sync.svg" v-if="!clickstatus" />{{ clickstatus ? 'Syncing Shared key' : 'Sync Shared key' }}
        </div>
      </div>
    </transition>
    <div v-show="isShow" class="backup-btn">
      <div class="la-timer la-sm"><div></div></div>
      Watting for Device's public key Upload
      <div class="dot"></div>
    </div>
    <div class="sync-success" v-if="successtatus"><img src="../../assets/icon-success.svg" />Sync successed</div> -->
  </div>
</template>

<script>
// export default {
//   name: 'BackbyDevice',
//   data() {
//     return {
//       title: 'Backup by other device',
//       isSync: false,
//       isShow: true,
//       seconds: 10,
//       clickstatus: false,
//       successtatus: false,
//       isShowSync: true,
//     }
//   },
//   mounted() {
//     const timer = setInterval(() => {
//       this.seconds -= 1
//       if (this.seconds == 8) {
//         this.isSync = true
//         this.isShow = false
//         clearInterval(timer)
//         this.seconds = 10
//       }
//     }, 1000)
//   },
//   methods: {
//     syncing() {
//       this.clickstatus = true
//       const time2 = setInterval(() => {
//         this.seconds -= 1
//         if (this.seconds == 8) {
//           this.successtatus = true
//           this.isShowSync = false
//           clearInterval(time2)
//         }
//       }, 1000)
//     },
//     back() {
//       this.$router.go(-1)
//     },
//   },
// }
</script>

<style scoped lang="less">
/* .backup-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  margin: auto;
  font-weight: bold;
  height: 60px;
  margin-bottom: 15px;
}
.backup-btn {
  background-color: #8eb0fa;
  color: #d5e2fe;
  width: 80%;
  text-align: center;
  border: none;
  font-size: 14px;
}
.backup-btn:hover {
  cursor: none;
}
.backup-btn .dot {
  border-left: 2px solid #d5e2fe;
  border-right: 2px solid #d5e2fe;
  background-color: #d5e2fe;
}
.mydevice {
  width: 100px;
  margin: 0 auto;
  position: relative;
}
.mydevice img {
  width: 100%;
}
.mydevice i {
  width: 24px;
  height: 24px;
  background: url(../../assets/icon-ok.svg) no-repeat center center;
  background-size: 24px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -12px;
  margin-top: -12px;
}
.deviceinfo {
  width: 100%;
  padding: 15px;
  color: #3c6dd8;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
} */
</style>
