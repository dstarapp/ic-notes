<template>
  <div class="balance-deposit-box">
    <div class="deposit-info">
      <strong>{{ $t('balance.title') }}</strong>
      <div class="balance-deposit-add">{{ wallet_address() }}</div>
    </div>
    <div class="balance-deposit-btnbox">
      <div class="icpbalance">
        <div>
          {{ $t('balance.btitle') }}: <i> {{ wallet_balance() }} </i>ICP
        </div>
        <div class="balance-refresh" :class="showBalance ? 'rotate' : ''" @click="refresh_wallet">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-refresh" />
          </svg>
        </div>
      </div>
      <div class="depositbtn" :class="{ success: isCopy }" @click="copy">{{ isCopy ? $t('balance.btnName.copied') : $t('balance.btnName.copy') }}</div>
    </div>
  </div>
</template>

<script>
import { LoadBalance, GetBalance, GetAddress } from '../../../utils/wallet';
export default {
  name: 'Balance',
  data() {
    return {
      showBalance: false,
      isCopy: false,
    };
  },
  methods: {
    refresh_wallet() {
      this.showBalance = true;
      this.$nextTick(async () => {
        await LoadBalance();
        this.showBalance = false;
        this.$emit('refresh', true);
      });
    },
    wallet_address() {
      return GetAddress();
    },
    wallet_balance() {
      return GetBalance();
    },
    copy() {
      var self = this;
      this.$copyText(this.wallet_address()).then(
        () => {
          self.isCopy = true;
          setTimeout(() => {
            self.isCopy = false;
          }, 3000);
        },
        (e) => {
          console.log('copy failed', e);
        }
      );
    },
  },
};
</script>

<style scoped lang="less">
.balance-deposit-box {
  width: 100%;
  background: #f1f1f1;
  border-radius: 6px;
  margin-top: 20px;
  display: flex;

  .deposit-info {
    display: flex;
    flex: 7;
    flex-direction: column;
    margin: 30px 30px 30px 30px;

    strong {
      width: 100%;
      color: #999;
      font-size: 16px;
      padding-bottom: 10px;
      display: block;
    }

    .balance-deposit-add {
      color: #000;
      width: 100%;
      word-break: break-all;
      font-size: 14px;
    }
  }

  .balance-deposit-btnbox {
    margin-left: 30px;
    display: flex;
    flex: 3;
    flex-direction: column;
    margin: 30px 30px 30px 0;
    color: #555;
    font-family: Gothic;
    font-size: 14px;

    .icpbalance {
      width: 100%;
      margin-bottom: 10px;
      display: inline-flex;
      align-items: center;
      i {
        color: #3c6dd8;
        font-weight: bold;
        font-style: normal;
      }

      .balance-refresh {
        width: 15px;
        height: 15px;
        margin-left: 8px;
        svg {
          font-size: 15px;
          cursor: pointer;
        }
      }
    }

    .depositbtn {
      width: 100%;
      line-height: 35px;
      text-align: center;
      color: #fff;
      background-color: #6a95f1;
      border-radius: 6px;
      transition: all 0.3s linear;
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 10px rgba(170, 197, 255, 0.8);
        background-color: #578bfc;
        transition: all 0.3s linear;
      }

      &.success {
        background-color: #5ab668;
        transition: all 0.3s linear;

        &:hover {
          box-shadow: none;
        }
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .balance-deposit-box {
    flex-direction: column;
    .deposit-info {
      margin: 1.5vh;
      .balance-deposit-add {
        font-size: (12 * 2/75rem);
      }
    }
    .balance-deposit-btnbox {
      margin: 0 1.5vh 1.5vh 1.5vh;
    }
  }
}
</style>
