<template>
  <!-- 1 -->
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con">
        <div class="modal-header">
          {{ $t('addcycles.title') }}
        </div>
        <div class="close" @click="close" v-if="paystatus != 1">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <div class="dialog-loading" v-if="loading">
          <div class="loading">
            <div class="loader"></div>
          </div>
        </div>
        <div class="addcycles-box" v-else>
          <div class="contain flex">
            <div class="cycles-change-box flex">
              <input type="number" v-model.number="icp" />
              <i class="icps">ICP</i>
            </div>
            <div class="cycleschange">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-cycles-change" />
              </svg>
            </div>
            <div class="cycles-change-box flex">
              <span>{{ Number((icp * rate * 100) / 100).toFixed(4) }} T</span>
              <i class="cycles">{{ $t('addcycles.cycles') }}</i>
            </div>
          </div>
          <!-- <p class="cycle-change-tips">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-care" />
                </svg>
          5% {{$t('addcycles.charge')}}<span><i>≈</i> {{ Math.round((icp * 0.05 + Number.EPSILON) * 100) / 100 }} icp</span>
        </p> -->
          <transition name="walletfade" mode="out-in">
            <Balance v-if="paystatus == 2" style="width: 85%" />
          </transition>
        </div>

        <div v-if="!loading" class="note-notesubmit" :class="[paystatus == 1 ? '' : 'active']" @click="deal">
          <div v-if="paystatus == 1" class="la-timer la-sm">
            <div></div>
          </div>
          {{ paystatus == 1 ? $t('BtnName.clickTxt') : paystatus == 2 ? $t('BtnName.nobalance') : $t('public.pay') + icp + ' ICP' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Balance from '../../home/components/Balance.vue';
import { LoadIcpCycleRate, LoadBalance, GetAddress, GetBalance, DepositCycles } from '../../../utils/wallet';
import { GetCurNoteBook, GetNoteBookStatus } from '../../../utils/notes/notes';
export default {
  name: 'AddCycles',
  components: {
    Balance,
  },
  data() {
    return {
      icp: 0.3,
      rate: 0,
      paystatus: 0,
      loading: true,
      isrefresh: false,
      copystatus: false,
    };
  },
  watch: {
    icp() {
      if (this.paystatus == 2 && this.icp < GetBalance()) {
        this.paystatus = 0;
      }
    },
  },
  mounted() {
    this.$nextTick(async () => {
      this.rate = await LoadIcpCycleRate();
      this.loading = false;
    });
  },
  methods: {
    close() {
      this.$emit('close', false);
    },
    deal() {
      if (this.paystatus == 1) {
        return;
      }
      this.paystatus = 1;
      this.$nextTick(async () => {
        // if (GetBalance() - 0.0001 < this.icp) {
        if (GetBalance() - 0.0002 < this.icp) {
          this.paystatus = 2;
          return;
        }
        let note = GetCurNoteBook();
        if (!note) {
          this.paystatus = 0;
          return;
        }
        let amount = BigInt(this.icp * 100 * 1_000_000);
        await DepositCycles(note.getCanisterID(), amount);
        GetNoteBookStatus(note.id);
        this.paystatus = 0;
        this.$emit('close', false);
      });
    },
    copy() {
      var self = this;
      this.$copyText(this.wallet_address()).then(
        () => {
          self.copystatus = true;
          setTimeout(() => {
            self.copystatus = false;
          }, 3000);
        },
        (e) => {
          console.log('copy failed', e);
        }
      );
    },
    refresh_wallet() {
      this.isrefresh = true;
      this.$nextTick(async () => {
        await LoadBalance();
        this.isrefresh = false;
      });
    },
    wallet_address() {
      return GetAddress();
    },
    wallet_balance() {
      return GetBalance();
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
  z-index: 11;
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

    .dialog-loading {
      margin-top: 30px;
      margin-bottom: 30px;

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

    .addcycles-box {
      display: flex;
      padding: 40px 0;
      align-items: center;
      flex-direction: column;

      .contain {
        width: 85%;
        display: flex;
      }

      .cycles-change-box {
        display: flex;
        padding: 0 15px;
        height: 55px;
        border-radius: 8px;
        background-color: #f8f8f8;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1) inset;
        align-items: center;
        justify-content: space-between;
        flex: 1;

        span {
          padding-right: 15px;
          font-size: 24px;
          font-family: 'GothicB';
          color: #000;
        }

        input {
          line-height: 55px;
          border: none;
          font-size: 24px;
          background: none;
          max-width: 100%;
          width: 80%;
          font-family: 'GothicB';
        }

        i.icps,
        i.cycles {
          padding: 8px 10px;
          border-radius: 6px;
          color: #fff;
          font-style: normal;
          font-weight: bold;

          &.icps {
            background-color: #3c6dd8;
          }

          &.cycles {
            background-color: #f79e23;
          }
        }
      }

      .balance-deposit-box {
        width: 100%;
      }

      .cycleschange {
        width: 60px;
        height: 50px;

        svg {
          font-size: 30px;
          display: block;
          margin: 12px auto 0 auto;
        }
      }
    }

    .note-notesubmit {
      width: 50%;
      margin: auto;
      padding: 18px 0;
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
      margin-bottom: 6vh;

      &.success {
        background: #5ab668;
        transition: all 0.3s linear;
        opacity: 1;
      }

      &.active {
        opacity: 1;
        transition: all 0.3s linear;
        pointer-events: auto;
        &:hover {
          box-shadow: 0 0 15px rgba(60, 109, 216, 0.5);
          transition: 0.3s all linear;
          cursor: pointer;
        }
      }
    }
  }
}

.cycle-change-tips {
  width: 100%;
  margin-top: 15px;
  color: #333;
  display: block;

  svg {
    font-size: 16px;
    margin-right: 5px;
  }

  span {
    color: #999;
    font-style: 10px;
    margin-left: 5px;

    i {
      font-family: 'arial';
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
