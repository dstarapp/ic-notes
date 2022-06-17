<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('nft.title') }}
        </div>
        <div class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <div class="nft-to">
          <span>{{ $t('nft.sub_t') }}</span>
          <input type="text" placeholder="Principal ID" v-model="pid" />
        </div>
        <button :class="valid && state == 0 ? 'active' : state == 2 ? 'success' : ''" @click="deal">
          <div v-if="state == 1" class="la-timer la-sm"><div></div></div>
          <svg class="icon" aria-hidden="true" v-if="state == 2">
            <use xlink:href="#icon-success" />
          </svg>
          {{ state == 1 ? $t('BtnName.clickTxt') : state == 2 ? $t('BtnName.successTxt') : $t('nft.title') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Principal } from '@dfinity/principal';
import { validatePrincipalId } from '../../../utils/ic/constant';
import { GetUserInfo } from '../../../utils/notes/sync';
import { TransferPlanetNFT } from '../../../utils/nft';
export default {
  name: 'SendNft',
  props: {
    index: Number,
  },
  emits: ['close'],
  data() {
    return {
      pid: '',
      valid: false,
      state: 0, // 0-默认 1-点击 2-成功 3-失败
    };
  },
  watch: {
    pid: {
      handler() {
        let user = GetUserInfo();
        if (this.pid == user.pid) {
          this.valid = false;
          return;
        }
        if (validatePrincipalId(this.pid)) {
          this.valid = true;
        } else {
          this.valid = false;
        }
        console.log(this.pid);
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.$emit('close', false);
    },
    deal() {
      this.state = 1;
      this.$nextTick(async () => {
        let to = Principal.fromText(this.pid);
        await TransferPlanetNFT(to, this.index);
        this.state = 2;

        setTimeout(() => {
          this.$emit('close', true);
        }, 1000);
      });
    },
  },
};
</script>

<style scoped>
.modal-bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px) saturate(100%);
}
.modal-container {
  padding: 50px 60px;
  width: 50%;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.1);
}
.modal-con {
  width: 100%;
  height: 100%;
  position: relative;
}
.modal-header {
  width: 100%;
  line-height: 45px;
  color: #000;
  font-size: 30px;
  text-align: center;
  font-weight: bold;
}
.modal-header i {
  font-style: normal;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2px 6px;
  color: #3c6dd8;
  font-weight: bold;
  font-size: 16px;
  margin-left: 15px;
}
.modal-content {
  width: 100%;
  margin: 30px 0;
  line-height: 22px;
  color: #999;
  text-align: center;
  font-size: 14px;
}
.modal-content a {
  color: #3c6dd8;
}
.close {
  width: 30px;
  height: 30px;
  position: absolute;
  background-size: 30px;
  top: -15px;
  right: -30px;
}
.close:hover {
  cursor: pointer;
}
.close svg {
  font-size: 24px;
}
.nft-to {
  width: 100%;
  display: flex;
  align-items: center;
}
.nft-to span {
  width: 100px;
  font-size: 16px;
}
.nft-to input {
  border: 1px solid #e8e8e8;
  flex: 1;
  width: 100%;
  border-radius: 6px;
  padding: 8px 15px;
  line-height: 40px;
  margin: 50px 0;
  font-size: 14px;
}
button {
  width: 55%;
  margin: auto;
  background-color: #3c6dd8;
  border-radius: 6px;
  text-align: center;
  color: #ffffff;
  padding: 18px 0;
  border: none;
  cursor: pointer;
  font-size: 20px;
  transition: opacity 0.2s linear;
  display: block;
  opacity: 0.7;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s linear;
}
button svg {
  margin-right: 10px;
}
button.active {
  opacity: 1;
  pointer-events: auto;
}
button.success {
  background-color: #5ab668;
  transition: background-color 0.3s linear;
}
</style>
