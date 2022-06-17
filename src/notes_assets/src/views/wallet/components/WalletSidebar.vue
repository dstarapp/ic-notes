<template>
  <div class="wallet-box">
    <div class="contain">
      <h3>{{ $t('wallet.stitle.st1') }}</h3>
      <div class="icp-box">
        <div class="icp-balance ellipsis"><i>ICP</i>{{ wallet_balance() }}</div>
        <div :class="isrefresh ? 'refresh rotate' : 'refresh'" @click="refresh_wallet()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-refresh" />
          </svg>
        </div>
      </div>
      <div class="flex btnBox">
        <div class="wallet-btns wallet-deposit" @click="deposit">
          {{ $t('wallet.btnName.deposit') }}
        </div>
        <div class="wallet-btns wallet-withdraw" @click="withdraw">
          {{ $t('wallet.btnName.withdraw') }}
        </div>
      </div>

      <div class="wallet-deposit-box" v-if="depositstatus">
        <i></i>
        <h4>{{ $t('balance.title') }}</h4>
        <div class="deposit-address">{{ wallet_address() }}</div>
        <div class="copy-address" :class="copystatus ? 'success' : ''" @click="copy">{{ copystatus ? $t('balance.btnName.copied') : $t('balance.btnName.copy') }}</div>
        <div class="deposit-tips">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-care" />
          </svg>
          {{ $t('wallet.dtips') }}
        </div>
      </div>

      <div class="wallet-withdraw-box" v-if="widthdrawstatus">
        <i></i>
        <div class="the-input-box">
          <textarea v-model="withdraw_address" :placeholder="$t('wallet.placehoder1')" cols="30" rows="10" class="receive-textarea"></textarea>
        </div>
        <div class="the-input-box withdraw-icp flex">
          <input v-model.number="withdraw_icp" type="number" :placeholder="$t('wallet.placehoder2')" />
          <div class="right">
            <span class="txt">ICP</span>
            <button class="withdrawbtn" @click="clickAll">{{ $t('wallet.btnName.all') }}</button>
          </div>
        </div>
        <div class="withdraw-tips" :class="isError ? 'error' : ''">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="isError ? '#icon-warning' : '#icon-care'" />
          </svg>
          {{ isError ? $t('BtnName.nobalance') : $t('wallet.wtips') }}
        </div>
        <div class="withdraw-send" :class="sendStatus == 1 ? 'disabled' : sendStatus == 2 ? 'success' : ''" @click="transfer">
          {{ sendStatus == 1 ? $t('BtnName.clickTxt') : sendStatus == 2 ? '' : $t('BtnName.send') }}
          <span v-if="sendStatus == 1" class="dot"></span>
          <svg class="icon" aria-hidden="true" v-if="sendStatus == 2">
            <use xlink:href="#icon-success" />
          </svg>
        </div>
      </div>
    </div>

    <div class="contain addressBox">
      <h3>{{ $t('wallet.stitle.st2') }}</h3>
      <div class="wallet-address">
        <span>{{ wallet_address() }}</span>
        <div class="copys" :class="copystatus ? 'success' : ''" @click="copy"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetAddress } from '../../../utils/wallet';
import { GetBalance, LoadBalance, TransferICP } from '../../../utils/wallet';
import { validatePrincipalId, validateAccountId } from '../../../utils/ic/constant';
export default {
  name: 'WalletSidebar',
  data() {
    return {
      isrefresh: false,
      depositstatus: false,
      widthdrawstatus: false,
      copystatus: false,
      withdraw_address: '',
      withdraw_icp: '',
      sendStatus: 0,
      isError: false,
    };
  },
  methods: {
    clickAll() {
      // this.withdraw_icp = Number(GetBalance() - 0.0001).toFixed(5)
      this.withdraw_icp = Number(GetBalance() - 0.0001).toFixed(4);
    },
    deposit() {
      if (this.depositstatus === true) {
        this.depositstatus = false;
        return;
      }
      this.depositstatus = true;
      if (this.widthdrawstatus) {
        this.widthdrawstatus = false;
      }
    },
    withdraw() {
      if (this.widthdrawstatus === true) {
        this.widthdrawstatus = false;
        return;
      }
      this.widthdrawstatus = true;
      if (this.depositstatus) {
        this.depositstatus = false;
      }
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
      this.$emit('refresh', true);
    },
    wallet_address() {
      return GetAddress();
    },
    wallet_balance() {
      return GetBalance();
    },
    transfer() {
      var self = this;
      if (this.sendStatus != 0) {
        return;
      }
      let addr = this.withdraw_address;
      if (addr == '' || (!validatePrincipalId(addr) && !validateAccountId(addr))) {
        return;
      }
      this.sendStatus = 1;
      this.$nextTick(async () => {
        let addr = this.withdraw_address;
        // if (addr == '' || (!validatePrincipalId(addr) && !validateAccountId(addr))) {
        //   return
        // }
        let amount = parseFloat(this.withdraw_icp);
        if (isNaN(amount)) {
          return;
        }
        // let icp = BigInt(amount * 100 * 1_000_000)
        let icp = BigInt(amount.toFixed(4) * 100 * 1_000_000);
        let height = await TransferICP(addr, icp);
        console.log('transfer success', height);

        self.sendStatus = 2;
        self.refresh_wallet();

        setTimeout(() => {
          self.sendStatus = 0;
        }, 2000);
      });
    },
  },
  watch: {
    withdraw_icp(icp, oldicp) {
      if (icp < 0.01 || icp + 0.0001 > GetBalance()) {
        this.isError = true;
      } else {
        this.isError = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.wallet-box {
  display: flex;
  width: 310px;
  flex-direction: column;
  padding: 20px 25px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: #f5f5f5;
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background-color: #f5f5f5;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
    background-color: #ddd;
  }

  .contain {
    width: 100%;
    position: relative;
    h3 {
      margin: 0;
      padding: 0;
    }
  }

  .flex {
    display: flex;
  }

  h3 {
    width: 100%;
    color: #333;
    font-size: 18px;
    font-family: 'GothomB';
    line-height: 60px;
    margin: 30px 0 0 0;
  }

  .icp-box {
    margin: 20px 0 10px 0;
    align-items: center;
    display: flex;
    .icp-balance {
      font-size: 24px;
      padding-left: 38px;
      font-family: 'GothicB';
      color: #000;
      margin-right: 8px;
      position: relative;
      i {
        padding: 2px 4px;
        border-radius: 4px;
        background-color: #6a95f1;
        color: #fff;
        font-size: 12px;
        font-style: normal;
        font-family: 'Gothic';
        position: absolute;
        top: 6px;
        left: 0;
      }
    }
    .refresh {
      width: 22px;
      height: 22px;
      svg {
        font-size: 18px;
        cursor: pointer;
      }
    }
  }

  .btnBox {
    display: flex;
    margin-top: 40px;
    margin-bottom: 30px;
    width: 100%;

    .wallet-btns {
      // width: 47%;
      display: flex;
      flex: 1;
      height: 45px;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      border-radius: 6px;
      cursor: pointer;
      justify-content: center;
      align-items: center;

      &.wallet-deposit {
        background: linear-gradient(45deg, #6a95f1, #3c6dd8);
        transition: all 0.3 linear;
        &:hover {
          box-shadow: 0 0 15px rgba(106, 149, 241, 0.6);
          transition: all 0.3s linear;
        }
      }

      &.wallet-withdraw {
        background: linear-gradient(45deg, #f3ca49, #f0bc1a);
        transition: all 0.3 linear;
        margin-left: 30px;
        &:hover {
          box-shadow: 0 0 15px rgba(243, 202, 73, 0.8);
          transition: all 0.3s linear;
        }
      }
    }
  }

  .wallet-deposit-box,
  .wallet-withdraw-box {
    width: calc(100% - 40px);
    position: relative;
    margin-top: 25px;
    padding: 20px;
    border-radius: 6px;
    i {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      position: absolute;
      top: -10px;
      &::after {
        content: '';
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        position: absolute;
        top: 2px;
      }
    }
  }

  .wallet-deposit-box {
    background-color: #f3f6ff;
    border: 1px solid #e3eaff;
    i {
      border-bottom: 10px solid #e3eaff;
      left: 20%;
      &::after {
        border-bottom: 8px solid #f3f6ff;
        left: -8px;
      }
    }
    h4 {
      font-size: 16px;
      color: #000;
      width: 100%;
      line-height: 30px;
      font-weight: bold;
    }

    .wallet-address {
      width: 100%;
      padding: 10px;
      background-color: #f1f1f1;
      color: #666;
      font-size: 14px;
      border-radius: 8px;
      align-items: center;
      span {
        word-break: break-all;
        flex: 1;
      }
    }

    .deposit-address {
      padding: 15px;
      background-color: #e3eaff;
      color: #333;
      font-size: 12px;
      margin-top: 10px;
      margin-bottom: 10px;
      word-break: break-all;
      border-radius: 6px;
    }
  }

  .wallet-address {
    display: flex;
    width: calc(100% - 20px);
    padding: 10px;
    background-color: #f1f1f1;
    color: #666;
    font-size: 14px;
    border-radius: 8px;
    align-items: center;
    word-break: break-all;
  }
}

.wallet-deposit-box .copy-address,
.wallet-withdraw-box .withdraw-send {
  width: 50%;
  padding: 10px 0;
  text-align: center;
  color: #fff;
  margin: 20px auto 20px auto;
  border-radius: 6px;
  transition: all 0.3s linear;

  &:hover {
    cursor: pointer;
    transition: all 0.3s linear;
  }

  &.copy-address {
    background-color: #6a95f1;
    &:hover {
      box-shadow: 0 0 10px rgba(170, 197, 255, 0.8);
      background-color: #578bfc;
    }
  }
}

.wallet-deposit-box {
  .deposit-tips {
    color: #999;
    font-size: 12px;
    svg {
      font-size: 14px;
    }
  }
}
.wallet-withdraw-box {
  background-color: #fdfaf3;
  border: 1px solid #ffeaaa;
  i {
    border-bottom: 10px solid #ffeaaa;
    right: 20%;
    &::after {
      border-bottom: 8px solid #fdfaf3;
      right: -8px;
    }
  }
  .the-input-box {
    width: 100%;
    border-radius: 6px;
    background-color: #f6ebd2;
    .receive-textarea {
      width: 100%;
      padding: 10px;
      border: none;
      background: none;
      height: 90px;
      font-family: 'Gothic';
      color: #a9832b;
      box-sizing: border-box;
      outline: none;
      resize: none;
    }
  }

  ::placeholder {
    color: #e9c36c;
    font-size: 14px;
  }

  .withdraw-icp {
    margin-top: 20px;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
    height: 45px;
    display: flex;

    input {
      border: none;
      margin-left: 10px;
      font-size: 16px;
      color: #a9832b;
      background: none;
      outline: none;
      display: flex;
      flex: 1;
      height: 100%;
      width: 0;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    /* Firefox浏览器 */
    input[type='number'] {
      -moz-appearance: textfield;
    }
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
    }
    .txt {
      width: 30px;
      color: #a9832b;
      line-height: 50px;
      font-size: 16px;
    }
    .withdrawbtn {
      width: 45px;
      height: 30px;
      padding: 8px 0;
      text-align: center;
      color: #fff;
      background: linear-gradient(45deg, #f3ca49, #fc6f5a);
      box-shadow: 0 0 5px rgba(248, 70, 70, 0.3);
      border: none;
      cursor: pointer;
      border-radius: 6px;
    }
  }

  .withdraw-tips.error {
    color: #fd6464;
  }

  .withdraw-send {
    background-color: #f2bf20;
    margin-bottom: 0;
    border: none;

    &.disabled {
      background-color: #ccc;
      transition: all 0.2s linear;
      color: #666;
    }

    &:hover {
      background-color: #f8c114;
      box-shadow: 0 0 10px rgba(239, 200, 79, 0.8);
    }
  }
}

.wallet-withdraw-box .withdraw-send.success,
.wallet-deposit-box .copy-address.success {
  background-color: #5ab668;
  transition: all 0.2s linear;
}
.wallet-withdraw-box .withdraw-send.success svg {
  font-size: 20px;
  margin: auto;
}
.wallet-withdraw-box .withdraw-send.disabled:hover,
.wallet-withdraw-box .withdraw-send.success:hover,
.wallet-deposit-box .copy-address.success:hover {
  box-shadow: none;
}
.walletfade-enter-active {
  transition: all 0.3s;
}
.walletfade-leave-active {
  opacity: 0;
  transform: translateY(-10px);
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .wallet-box {
    flex-direction: column;
    order: 1;
    padding: 0;
    width: 80vw;
    // margin-top: 18vw;
    margin-left: 5vw;
    background: url(../../../assets/svg/walletbg.png) no-repeat center center;
    background-size: 100% 100%;
    border-radius: 2px;
    padding: 0 5vw;
    padding-bottom: 4vh;
    flex-shrink: 0;

    h3 {
      color: #fff;
      margin-top: 10px;
    }

    .icp-box {
      color: #fff;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      margin-top: 0px;
      .icp-balance {
        color: #fff;
        display: flex;
        padding: 0;
        i {
          position: relative;
          left: auto;
          top: auto;
          display: flex;
          background-color: #85acff;
          justify-content: center;
          align-items: center;
          padding: 0 8px;
          margin-right: 10px;
        }
      }
    }

    .btnBox {
      margin-top: 20px;
      .wallet-btns {
        height: 40px;
        &.wallet-deposit {
          background: linear-gradient(120deg, #45e8cc, #2dcb92) !important;
        }
        &.wallet-withdraw {
          background: linear-gradient(120deg, #fed657, #f2bf20) !important;
        }
      }
    }
    .addressBox {
      h3 {
        margin: 0;
        line-height: 18px;
        margin-top: 3vh;
      }
      .wallet-address {
        background-color: rgba(241, 241, 241, 0.3);
        margin-top: 1.5vh;
        span {
          color: #fff;
        }
      }
    }

    .wallet-deposit-box,
    .wallet-withdraw-box {
      position: fixed;
      z-index: 999;
      width: 80vw;
      left: 5vw;
      margin-top: 0px;

      .withdraw-icp {
        width: 70vw;

        input {
          border: 0;
          padding: 0;
        }
        .right {
          button {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
