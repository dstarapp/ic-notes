<template>
  <div class="wallet-container isPC">
    <div class="contain">
      <h2>
        {{ $t('wallet.title') }}<i>{{ trxs.length }}</i>
      </h2>
    </div>
    <div class="wallet-list-con">
      <div class="wallet-list">
        <div v-if="loading" class="trx-loading">
          <div class="loading">
            <div class="loader"></div>
          </div>
        </div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>{{ $t('wallet.items.item1') }}</th>
              <th>{{ $t('wallet.items.item2') }}</th>
              <th>{{ $t('wallet.items.item3') }}</th>
              <th>{{ $t('wallet.items.item4') }}</th>
              <th>{{ $t('wallet.items.item5') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in trxs" :key="item.hash" @mouseenter="showAddress(index)" @mouseleave="hideAddress(index)">
              <td class="color-9">{{ format_date(item.timestamp) }}</td>
              <td>
                <span class="tag" :class="format_tag(item)">{{ format_type(item) }} </span>
              </td>
              <td>
                <div class="txt" :class="isShow == index ? '' : 'ellipsis'">
                  {{ item.account1Address }}
                  <i :class="{ copied: isFromCopy == true }" @click="copyFrom(item)">
                    {{ isFromCopy ? $t('balance.btnName.copied') : $t('balance.btnName.copys') }}
                  </i>
                </div>
              </td>
              <td>
                <div class="txt" :class="isShow == index ? '' : 'ellipsis'">
                  {{ item.account2Address }}
                  <i :class="{ copied: isToCopy == true }" @click="copyTo(item)">
                    {{ isToCopy ? $t('balance.btnName.copied') : $t('balance.btnName.copys') }}
                  </i>
                </div>
              </td>
              <td>{{ format_amount(item) }} ICP</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="wallet-container isM">
    <div class="contain">
      <h2>
        {{ $t('wallet.title') }}<i>{{ trxs.length }}</i>
      </h2>
    </div>
    <div class="list-box">
      <div class="list" v-for="(item, index) in trxs" :key="item.hash" @mouseenter="showAddress(index)" @mouseleave="hideAddress(index)">
        <div class="contain">
          <span class="date">
            {{ format_date(item.timestamp) }}
          </span>
          <span class="icps">
            <i>{{ format_amount(item) }}</i> ICP
          </span>
        </div>
        <div v-show="isShow == index">
          <div class="translist">
            <span>From</span>
            <div class="address">{{ item.account1Address }}</div>
            <button class="copy" @click="copyFrom(item)">
              <svg class="icon" aria-hidden="true"><use xlink:href="#icon-copy"></use></svg>
            </button>
          </div>
          <div class="translist">
            <span>To</span>
            <div class="address">{{ item.account2Address }}</div>
            <button class="copy" @click="copyTo(item)">
              <svg class="icon" aria-hidden="true"><use xlink:href="#icon-copy"></use></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LoadTransaction, GetAddress, CheckCycleAddress, CheckNotesFeeAddress } from '../../../utils/wallet'
import moment from 'moment'

export default {
  name: 'WalletList',
  data() {
    return {
      loading: true,
      selectstatus: false,
      isShow: -1,
      isFromCopy: false,
      isToCopy: false,
      trxs: [],
    }
  },
  methods: {
    menuShow() {
      this.selectstatus = true
    },
    menuHide() {
      this.selectstatus = false
    },
    showAddress(index) {
      if (this.isShow == index) {
        this.isShow = -1
      } else {
        this.isShow = index
      }
    },
    hideAddress(index) {
      this.isShow = -1
      this.isFromCopy = false
      this.isToCopy = false
    },
    copyFrom(item) {
      var self = this
      this.$copyText(item.account1Address).then(
        () => {
          self.isFromCopy = true
          setTimeout(() => {
            self.isFromCopy = false
          }, 3000)
        },
        (e) => {
          console.log('copy failed', e)
        }
      )
    },
    copyTo(item) {
      var self = this
      this.$copyText(item.account2Address).then(
        () => {
          self.isToCopy = true
          setTimeout(() => {
            self.isToCopy = false
          }, 3000)
        },
        (e) => {
          console.log('copy failed', e)
        }
      )
    },
    format_date(t) {
      return moment(t).format('HH:mm:ss DD/MM/YYYY')
    },
    format_amount(item) {
      let me = GetAddress()
      if (me == item.account2Address) {
        return '+' + item.amount.div(100_000_000)
      } else {
        return '-' + item.amount.div(100_000_000)
      }
    },
    format_type(item) {
      let tag = this.format_tag(item)
      switch (tag) {
        case 'tag-1':
          return 'Deposit'
        case 'tag-2':
          return 'Add Cycles'
        case 'tag-4':
          return 'Note Fees'
        default:
          return 'Withdraw'
      }
    },
    format_tag(item) {
      let me = GetAddress()
      if (me == item.account2Address) {
        return 'tag-1'
      } else {
        if (CheckCycleAddress(item.account2Address)) {
          return 'tag-2'
        } else if (CheckNotesFeeAddress(item.account2Address)) {
          return 'tag-4'
        }
        return 'tag-3'
      }
    },
    refresh() {
      this.loading = true
      this.$nextTick(async () => {
        this.trxs = await LoadTransaction()
        this.loading = false
      })
    },
  },
  async mounted() {
    this.trxs = await LoadTransaction()
    this.loading = false
  },
}
</script>

<style scoped lang="less">
.wallet-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px 30px;
  overflow-y: auto;
  background: linear-gradient(45deg, #f2f6ff, #fff3e1, #e1eafd);

  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .contain {
    display: flex;
    width: 90%;
    flex-direction: column;
    margin-bottom: 1vh;

    h2 {
      font-size: 24px;
      width: auto;
      padding: 0;
      display: flex;
      align-items: center;
      margin: 0;
      i {
        margin-left: 8px;
        padding: 3px 8px;
        background-color: #6a95f1;
        color: #fff;
        font-size: 14px;
        font-style: normal;
        border-radius: 20px;
      }
    }
  }

  .wallet-list-con {
    .wallet-list {
      width: 100%;
      background: #fff;
      border-radius: 6px;
      margin-top: 20px;
      padding: 20px 0;

      .trx-loading {
        position: absolute;
        top: 50%;
        left: 50%;
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

      .table {
        font-size: 14px;
        width: 100%;
        border-collapse: collapse;
        border-radius: 3px;
        border-spacing: 0;
        tr {
          padding: 5px;
          transition: all 0.1s linear;
          &:hover {
            background: #e9f0fe;
            transition: all 0.3s linear;
          }
        }
        th {
          line-height: 18px;
          text-align: center;
          text-transform: none;
          padding: 10px 0;
          color: #000;
        }
        td {
          line-height: 18px;
          text-align: center;
          padding: 10px;
          font-size: 12px;
          max-width: 200px;
          .txt {
            padding: 0 5px;
            word-break: break-all;
            text-align: left;

            i {
              margin-left: 10px;
              color: #999;
              font-weight: bold;
              cursor: pointer;
              border: 1px solid #ddd;
              border-radius: 3px;
              padding: 0 4px 2px 4px;
              font-style: normal;
              background-color: #fff;
              white-space: nowrap;
              &.copied {
                border: 1px solid #3c6dd8;
                background: #3c6dd8;
                color: #fff;
              }
            }
          }

          .tag {
            padding: 2px 6px;
            color: #fff;
            border-radius: 3px;
            float: left;

            &.tag-1 {
              background: linear-gradient(to right, #1ce59e, #0fd280);
            }
            &.tag-2 {
              background: linear-gradient(to right, #6a95f1, #3c6dd8);
            }
            &.tag-3 {
              background: linear-gradient(to right, #ffcc6f, #ff734f);
            }
            &.tag-4 {
              background: linear-gradient(to right, #82ec76, #64d652);
            }
            &.tag-5 {
              background: linear-gradient(to right, #52b3d1, #58c6e7);
            }
            &.tag-6 {
              background: linear-gradient(to right, #9a68d3, #b47ef1);
            }
          }
        }
      }
    }
  }

  .list-box {
    display: flex;
    width: 100%;
    border-radius: 8px;
    flex-direction: column;
    background: #fff;

    .list {
      flex-direction: column;
      display: flex;
      border-bottom: 1px solid #e8e8e8;
      padding: 1.5vh;
      .contain {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        flex-direction: unset !important;
        margin-bottom: 0;
        .date {
          color: #999;
          font-size: (14 * 2/75rem);
        }
        .icps {
          display: flex;
          font-size: (14 * 2/75rem);
          i {
            color: #3c6dd8;
            font-style: normal;
          }
        }
      }

      .translist {
        display: flex;
        width: 100%;
        font-size: (14 * 2/75rem);
        word-break: break-all;
        padding: 0.05rem 0;
        display: flex;
        align-items: center;
        margin: 5px 0;
        span {
          color: #999;
          display: flex;
          width: 40px;
        }
        div {
          display: flex;
          flex: 1;
          margin: 0 10px;
          color: #333;
          font-size: (12 * 2/75rem);
        }
        button {
          width: 25px;
          height: 25px;
          border: 1px solid #ddd;
          border-radius: 2px;
          position: relative;
          background: transparent;
          padding: 0;
          margin: 0;
        }
      }
    }
  }

  &.isM {
    display: none;
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .wallet-container {
    flex-direction: column;
    order: 2;
    background: #fff;
    width: 90vw;
    margin-left: 5vw;
    margin-top: 1.5vh;
    padding: 0;
    border-radius: 0px;
    flex: none;
    margin-bottom: 5vh;

    .contain {
      width: 100%;
      h2 {
        margin-top: 3vh;
      }
    }

    .wallet-list-con {
      .wallet-list {
        margin-top: 0;
        padding-top: 0;
      }
    }

    &.isPC {
      display: none;
    }

    &.isM {
      display: flex;
      background: none;
    }
  }
}
</style>
