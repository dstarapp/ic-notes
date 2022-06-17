<template>
  <div class="layer">
    <div class="modal-con">
      <div class="modal-header">
        {{ $t('keyrequest.title') }}
      </div>
      <div class="close" @click="reject">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-close" />
        </svg>
      </div>
      <div class="device-all other-request-device">
        <div class="device-box" v-for="(device, index) in devices" :key="index" @click="device.select = !device.select">
          <i v-show="device.select"></i>
          <img :src="device.imgurl" :style="!device.select ? 'opacity:.2' : ''" />
          <p class="ellipsis cur">{{ device.name }}</p>
        </div>
      </div>
      <p class="other-request-tips">
        {{ $t('keyrequest.tips') }}
      </p>
      <div class="other-request-box">
        <div class="btn-authorize" :class="{ ok: status === 1 }" @click="authorize">
          <svg class="icon" aria-hidden="true" v-if="status === 0">
            <use xlink:href="#icon-authorize"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-if="status === 1">
            <use xlink:href="#icon-success"></use>
          </svg>
          {{ status === 0 ? $t('keyrequest.btnName.authorize') : $t('keyrequest.btnName.authorized') }}
        </div>
        <div class="btn-reject" @click="reject">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-reject"></use>
          </svg>
          {{ rejectstatus === 0 ? $t('keyrequest.btnName.reject') : $t('keyrequest.btnName.rejected') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetUnsyncDevices, RemoveDevice } from '../../../utils/notes/sync';
import { GetDeviceIcon } from '../../../utils/assets';
import { SubmitKeySync } from '../../../utils/aes';
export default {
  name: 'KeySyncRequest',
  components: {},
  data() {
    return {
      status: 0,
      rejectstatus: 0,
      devices: [
        // {
        //   name: 1,
        //   pkey: 1,
        //   imgurl: '',
        //   select: true,
        // },
      ],
    };
  },
  mounted() {
    setTimeout(() => {
      let devices = GetUnsyncDevices();
      let first = true;
      devices.forEach((ass) => {
        this.devices.push({
          name: ass.alias,
          pkey: ass.pkey,
          imgurl: GetDeviceIcon(ass.agent),
          select: first,
        });
        first = false;
      });
    }, 100);
  },
  methods: {
    authorize() {
      if (this.status == 1) {
        return;
      }
      this.status = 1;
      this.$nextTick(async () => {
        let pkeys = [];
        this.devices.forEach((dv) => {
          if (dv.select) {
            pkeys.push(dv.pkey);
          }
        });
        await SubmitKeySync(pkeys);
        console.log('SubmitKeySync success!');
        this.$emit('close', false);
      });
    },
    reject() {
      if (this.rejectstatus == 1) {
        return;
      }
      this.rejectstatus = 1;
      setTimeout(async () => {
        let devices = this.devices;
        devices.forEach(async (dv) => {
          if (dv.select) {
            await RemoveDevice(dv.name);
            console.log('RemoveDevice', dv.name, 'success');
          }
        });
      }, 100);
      this.$emit('close', false);
    },
  },
  watch: {},
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
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99999;
}

.modal-con {
  margin: 0 5vw;
  width: 50vw;
  display: flex;
  z-index: 999;
  background: #fff;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  border-radius: 20px;

  .modal-header {
    width: 90%;
    line-height: 150%;
    color: #000;
    font-size: (20 * 2/75rem);
    text-align: center;
    font-weight: bold;
    font-family: 'GothicB';
    margin-top: 4vh;
  }

  .close {
    position: absolute;
    top: 4vh;
    right: 4vh;
    font-size: (16 * 2/75rem);
    cursor: pointer;
  }
}

.device-all {
  width: 90%;
  overflow-x: scroll;
  margin: 2vh 0;
  text-align: center;
  white-space: nowrap;
  display: flex;
  justify-content: center;

  .device-box {
    margin: 0 2.5vw;
    min-height: 80px;
    text-align: center;
    position: relative;
    cursor: pointer;
    display: inline-block;

    svg {
      font-size: (100 * 2/75rem);
    }

    p {
      width: 100%;
      text-align: center;
      line-height: 150%;
      color: #333;
      margin: 0;
      font-size: (12 * 2/75rem);
      position: relative;
      margin-top: 1vh;
    }
  }
}

.other-request-tips {
  width: 90%;
  text-align: center;
  color: #333333;
  font-size: 0.37333333rem;
  margin: 0 0 2.5vh 0;
}

.other-request-box {
  display: flex;
  width: 90%;
  margin: 3vh 0 4vh 0;
}

.btn-authorize,
.btn-reject {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: (14 * 2/75rem);
  font-weight: bold;
  color: #fff;
  flex: 1;
  height: 10vw;
  max-height: 60px;
  text-align: center;
  border: none;
  cursor: pointer;
  text-decoration: none;

  svg {
    font-size: (18 * 2/75rem);
    margin-right: 1vw;
  }

  margin-left: 3.5vw;

  &.btn-reject {
  }
}

.btn-authorize {
  background-color: #3c6dd8;

  &.ok {
    background-color: #5ab668;
    transition: all 0.3s linear;

    &:hover {
      box-shadow: none;
    }
  }

  &:hover {
    box-shadow: 0 0 18px rgba(60, 109, 216, 0.6);
  }
}

.btn-reject {
  background-color: #f19c8e;

  &:hover {
    box-shadow: 0 0 18px rgba(241, 156, 142, 0.6);
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-container {
    width: 90vw;
  }
}
</style>
