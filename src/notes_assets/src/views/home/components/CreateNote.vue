<template>
  <div class="modal-bg">
    <div class="modal-container">
      <div class="modal-con" v-if="!isCreate">
        <div class="modal-header">{{ $t('createnote.title') }}</div>
        <div class="close" @click="close" v-show="paystatus != 1">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
        <div class="register-box">
          <input v-model="notename" type="text" class="register-input" :class="paystatus !== 0 ? 'current' : ''" :placeholder="$t('createnote.placehoder')" />
          <div class="createnotes-pay-btn" :class="[paystatus == 1 ? 'current' : '', paystatus == 2 ? 'createnotes-fail-btn' : '']" @click="deal">
            <div v-if="paystatus == 1" class="la-timer la-sm">
              <div></div>
            </div>
            <span v-if="paystatus == 1">{{ $t('BtnName.clickTxt') }}…</span>
            <span v-else-if="paystatus == 2">{{ $t('BtnName.nobalance') }}</span>
            <span class="column" v-else>
              <p>{{ $t('public.pay') }} {{ amount }} ICP</p>
              <p>
                <i>≈</i> <i class="dollar">${{ icp() }}</i>
              </p>
            </span>
          </div>
        </div>
        <!-- 余额不足 -->
        <div class="nobalancebox">
          <transition name="walletfade" mode="out-in">
            <Balance v-if="paystatus == 2" @refresh="refresh" />
          </transition>
        </div>
        <p class="care-box">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-care" />
          </svg>
          {{ $t('createnote.tips') }}
        </p>
      </div>
      <!-- 创建进度 -->
      <CreateProgress v-else @close="close"></CreateProgress>
    </div>
  </div>
</template>

<script>
import CreateProgress from './CreateProgress.vue';
import Balance from './Balance.vue';
import { GetBalance, GetAddress, LoadBalance, DepositCycles, GetIcpCycleRate, GetSdr2Usd } from '../../../utils/wallet';
import { CreateNoteBook, CREATE_MIN_ICP } from '../../../utils/notes/notes';
export default {
  name: 'CreateNote',
  components: {
    CreateProgress,
    Balance,
  },
  data() {
    return {
      notename: '',
      status: false,
      copystatus: false,
      paystatus: 0,
      // 创建笔记本步骤
      isCreate: false,
      createStatus: 0,
      amount: CREATE_MIN_ICP,
    };
  },
  methods: {
    icp() {
      let rate = GetIcpCycleRate();
      let sdr = GetSdr2Usd();
      return (this.amount * rate * sdr).toFixed(2);
    },
    deal() {
      if (!this.notename) {
        alert(this.$i18n.t('public.inputnotename'));
        return;
      }
      if (this.paystatus == 1) {
        return;
      }
      this.paystatus = 1;
      this.$nextTick(async () => {
        if (GetBalance() < CREATE_MIN_ICP) {
          // if (GetBalance() < 0) {
          this.paystatus = 2;
        } else {
          this.isCreate = true;
          await CreateNoteBook(this.notename);
          this.$emit('closeChild', false);
        }
      });
    },
    refresh() {
      if (GetBalance() >= CREATE_MIN_ICP) {
        this.paystatus = 0;
      }
    },
    close() {
      this.$emit('closeChild', false);
    },
    nextstep() {
      this.$emit('steps', 2);
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
  z-index: 9999999;
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

    .register-box {
      position: relative;
      width: 80%;
      height: 60px;
      margin-top: 40px;
      display: flex;

      .register-input {
        border: 2px solid #ddd;
        line-height: 3.8vw;
        height: 10vw;
        max-height: 60px;
        flex: 2.3;
        border-radius: 5px;
        font-size: (12 * 2/75rem);
        box-sizing: border-box;
        outline: none;
        text-indent: 0.6em;
        flex-shrink: 0;

        &.current {
          background-color: #ddd;
        }

        ::placeholder {
          color: #999;
        }
      }

      .createnotes-pay-btn {
        border-radius: 6px;
        background-color: #3c6dd8;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        margin-left: 20px;
        flex: 1;
        height: 10vw;
        max-height: 60px;
        text-align: center;
        border: none;
        display: flex;
        justify-content: center;
        cursor: pointer;
        align-items: center;
        &:hover {
          box-shadow: 0 0 15px rgba(60, 109, 216, 0.5);
          transition: 0.3s all linear;
        }
        svg {
          font-size: 26px;
        }

        i {
          font-style: normal;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: normal;
          font-size: 14px;

          &.dollar {
            font-family: 'Gothic';
          }
        }

        .column {
          flex-direction: column;

          p {
            margin: 0;
          }
        }

        &.current {
          background-color: #8eb0fa;
          color: #d5e2fe;
          font-size: 14px;
          transition: all 0.3s linear;
        }

        &.createnotes-fail-btn {
          background: #ffeaea;
          color: #ffb3b3;
        }
      }
    }
    .nobalancebox {
      width: 80%;
    }
    .care-box {
      width: 80%;
      margin-top: 30px;
      margin-bottom: 50px;
      color: #999;
      flex-shrink: 0;
      font-size: 14px;
      line-height: 20px;
      svg {
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-bg {
    .modal-container {
      width: 90vw;

      .modal-con {
        .modal-header {
          margin-top: 4vh;
        }
        .register-box {
          width: 85%;
          height: auto;
          flex-direction: column;
          margin-top: 30px;
          .register-input {
            text-indent: 1em;
            flex: none;
            height: 11vw;
          }

          .createnotes-pay-btn {
            flex: none;
            width: 100%;
            margin-left: 0;
            margin-top: 1.5vh;

            .column {
              display: flex;
              flex-direction: unset;
              width: 100%;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              height: 11vw;
              p {
                display: flex;

                i {
                  margin-left: 10px;
                }
              }
            }
          }
        }
        .care-box {
          width: 85%;
          margin-bottom: 30px;
        }
        .nobalancebox {
          width: 85%;
        }
      }
    }
  }
}
</style>
