<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('changecontrol.title') }}
        </div>
        <div class="close" @click="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <p class="change-controller-tips">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-care" />
          </svg>
          {{ $t('changecontrol.tips') }}
        </p>
        <div class="change-controller-pid">
          <input type="text" placeholder="Principal ID" v-model="pid" />
        </div>

        <div class="note-notesubmit" :class="[paystatus == 3 ? 'active' : '', paystatus == 2 ? 'success' : '']" @click="deal">
          <svg class="icon" aria-hidden="true" v-if="paystatus == 2">
            <use xlink:href="#icon-success" />
          </svg>
          <div v-if="paystatus == 1" class="la-timer la-sm">
            <div></div>
          </div>
          <!-- {{ paystatus == 1 ? $t('BtnName.clickTxt') : paystatus == 2 ? '' : $t('public.pay') + ' 0.1 ICP ' + $t('changecontrol.btn') }}
        </div>
        <div v-for="(item, index) in conditions" class="change-controller-top note-condition" @click="handleClick(index, item)" :key="index">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="selected.indexOf(item) == -1 ? '#icon-nocheck' : '#icon-checked'" />
            <p :class="{ checked: selected.indexOf(item) != -1 }" v-html="item.content"></p>
          </svg> -->
          {{ paystatus == 1 ? $t('BtnName.clickTxt') : paystatus == 2 ? '' : $t('changecontrol.btn') }}
        </div>
        <div v-for="(item, index) in conditions" class="change-controller-top note-condition" @click="handleClick(index, item)" :key="index">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="selected.indexOf(item) == -1 ? '#icon-nocheck' : '#icon-checked'" />
          </svg>
          <p :class="{ checked: selected.indexOf(item) != -1 }" v-html="item.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateCanisterId, validatePrincipalId } from '../../../utils/ic/constant';
import { ChangeNoteBookController, SetCurNoteBook } from '../../../utils/notes/notes';
import { Principal } from '@dfinity/principal';
import { NotesIdentity } from '../../../utils/identity';

export default {
  name: 'ChangeController',
  data() {
    return {
      pid: '',
      selected: [],
      conditions: [{ id: '1', content: this.$i18n.t('changecontrol.condition') }],
      paystatus: 0,
      second: 30,
    };
  },
  methods: {
    close() {
      this.$emit('close', false);
    },
    handleClick(index, item) {
      if (this.selected.indexOf(item) !== -1) {
        this.selected.splice(this.selected.indexOf(item), 1);
      } else {
        this.selected.push(item);
      }
      this.checkStatus();
    },
    deal() {
      if (this.paystatus == 1) {
        return;
      }
      this.paystatus = 1;
      this.$nextTick(async () => {
        let ret = await NotesIdentity.login();
        if (ret) {
          ret = await ChangeNoteBookController(this.getPid());
          if (!ret) {
            this.paystatus = 2;
          } else {
            SetCurNoteBook('');
            this.$router.replace({ name: 'home' });
          }
        } else {
          this.close();
        }
      });
    },
    checkStatus() {
      let isValid = this.pid.length > 0;
      let pids = this.pid.trim(',').split(',');
      pids.forEach((p) => {
        if (p && !(validateCanisterId(p) || validatePrincipalId(p))) {
          console.log(p);
          isValid = false;
        }
      });
      if (this.selected.length > 0 && isValid) {
        this.paystatus = 3;
      } else {
        this.paystatus = 0;
      }
    },
    getPid() {
      let pids = this.pid.trim(',').split(',');
      let res = [];
      pids.forEach((p) => {
        if (p) {
          res.push(Principal.fromText(p));
        }
      });
      return res;
    },
  },
  watch: {
    pid(n, o) {
      this.checkStatus();
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
    box-shadow: 0 0 18px rgba(0 0 0 / 10%);
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
      width: 80%;
      line-height: 150%;
      color: #000;
      font-size: (20 * 2/75rem);
      text-align: center;
      font-weight: bold;
      font-family: 'GothicB';
      margin-top: 5vh;
    }

    .close {
      position: absolute;
      top: 4vh;
      right: 4vh;
      font-size: (16 * 2/75rem);
      cursor: pointer;
    }

    .modal-content {
      width: 80%;
      margin: 5vh 0 0 0;
      line-height: 150%;
      color: #333;
      text-align: left;
      font-size: (14 * 2/75rem);
    }
  }
}

.change-controller-tips {
  width: 80%;
  margin-top: 25px;
  margin-bottom: 0;
  line-height: 22px;
  color: #333;
  display: block;
  font-size: 14px;
  svg {
    font-size: 18px;
    margin-right: 5px;
  }
}

.change-controller-pid {
  margin: 25px 0;
  width: 80%;

  input {
    width: 100%;
    line-height: 45px;
    border: 2px solid #ddd;
    border-radius: 6px;
    text-indent: 15px;
    font-size: 16px;
    &::placeholder {
      color: #999;
      font-size: 16px;
    }
  }
}

.note-condition {
  display: block;
  padding: 10px 0 40px 0 !important;
  display: flex;
  color: #999;
  width: 80%;
  svg {
    font-size: 18px;
    margin-right: 8px;
  }

  p {
    font-size: 14px;
    color: #999;
    margin: 0;

    &.checked {
      color: #333;
    }
  }

  .error {
    color: #fd6464;
  }
}

.change-controller-top {
  margin-top: 10px;
  cursor: pointer;

  margin: 0;
  padding: 0;
}

.note-notesubmit {
  width: 50%;
  margin: auto;
  padding: 16px 0;
  text-align: center;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s linear;
  opacity: 0.5;
  background: linear-gradient(135deg, #6a95f1, #3c6dd8);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  margin-top: 1vh;
  margin-bottom: 3vh;

  &.success {
    background: #5ab668;
    transition: all 0.3s linear;
    opacity: 1;
  }

  &.active {
    opacity: 1;
    transition: all 0.3s linear;
    pointer-events: auto;
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
}
</style>
