<template>
  <div class="current-box">
    <div class="current-title">
      <span class="ellipsis" v-if="showTitle" @click="edit">{{ curnote.name }}</span>
      <div class="edit-box" v-show="!showTitle">
        <input type="text" v-model="newnotename" placeholder="new name" @blur="editName" @keydown.enter="editName" ref="newNoteName" />
        <div class="editing" v-if="isUpdateName">
          <img src="../../../assets/svg/loading.svg" width="20" />
        </div>
      </div>
    </div>
    <div class="note-controller">
      <svg class="icon" aria-hidden="true">
        <use :xlink:href="curnote.canControll ? '#icon-controller' : '#icon-nocontroller'" />
      </svg>
    </div>

    <div class="currentnoteitems flex" v-if="!isLoading()">
      <div class="canister" @mouseenter="enter(1)" @mouseleave="leave">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-canister" />
        </svg>
        {{ curnote.canControll ? memory_size() : $t('note.nocontroller') }}
        <div class="currentnote-canister flex">
          <p>
            {{ $t('note.noteTopbar.canisterID') }}: <strong>{{ curnote.getID() }} </strong>
          </p>
          <button class="copy" :class="{ copytips: isCopy }" @click="copy">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-copy" />
            </svg>
          </button>
        </div>
      </div>
      <div class="fuel">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fuel" />
        </svg>
        {{ curnote.canControll ? cycles() : $t('note.nocontroller') }}
      </div>

      <div v-if="curnote.canControll" class="ran" @mouseenter="enter(2)" @mouseleave="leave">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-remain" />
        </svg>
        {{ cycles_month() }} {{ $t('note.noteTopbar.months') }}
        <div class="rantips">
          <h5>{{ $t('note.noteTopbar.rantips.h') }}</h5>
          <p>{{ $t('note.noteTopbar.rantips.p') }}</p>
          <pre>({{ $t('note.noteTopbar.rantips.cycles') }}(T) * CHF/USD) / <br>(0.467 USD * ({{ $t('note.noteTopbar.rantips.storage') }}(M) / 1024(M))) {{ $t('note.noteTopbar.rantips.inmonths') }}</pre>
          <p>{{ $t('note.noteTopbar.rantips.fe') }}</p>
          <pre>(10 * 1.42) / (0.467 * (10 / 1024)) = 3113.6 {{ $t('note.noteTopbar.months') }}</pre>
          <p>{{ $t('note.noteTopbar.rantips.n') }}</p>
        </div>
      </div>
    </div>

    <div v-if="!isLoading()" class="currentnote-more">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-more" />
      </svg>
      <ul :style="!curnote.canControll ? 'left:-48' + 'px' : ''">
        <li @click="showAddCycles = true">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-addcycles" />
          </svg>
          <span>{{ $t('note.btnName.addcycles') }}</span>
        </li>

        <li v-show="curnote.canControll" @click="showTransfer = true">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-transfer" />
          </svg>
          <span>{{ $t('note.btnName.transfer') }}</span>
        </li>

        <li v-show="curnote.canControll" @click="showChangeController = true">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-change-controller" />
          </svg>
          <span>{{ $t('note.btnName.changecontroller') }}</span>
        </li>
      </ul>
    </div>

    <!-- 添加燃料 移动端不需要-->
    <AddCycles v-if="showAddCycles" @close="close" />
    <!-- 变更笔记控制器 移动端不需要 暂未适配-->
    <ChangeController v-if="showChangeController" @close="close" />
    <!-- 内部转移 移动端不需要-->
    <Transfer v-if="showTransfer" @close="close" />
  </div>
</template>

<script>
import AddCycles from './AddCycles.vue';
// import Remove from './Remove.vue'
import ChangeController from './ChangeController.vue';
import Transfer from './Transfer.vue';
import { GetCurNoteBook, HumanMemorySize, HumanCycle, ChangeNoteBookName } from '../../../utils/notes/notes';
import { GetIcpCycleRate, GetSdr2Usd } from '../../../utils/wallet';
export default {
  name: 'NoteCurrent',
  data() {
    return {
      curnote: GetCurNoteBook(),
      showAddCycles: false,
      showRemoveNotes: false,
      showChangeController: false,
      canister: 15,
      fuel: 100,
      showcaniser: false,
      showcurrentmore: false,
      isShow: false,
      showTitle: true,
      showAddController: false,
      showTransfer: false,
      isCopy: false,
      isShowSlideDown: 0,
      newnotename: '',
      isUpdateName: false,
    };
  },
  methods: {
    edit() {
      this.showTitle = false;
      this.$nextTick(() => {
        this.$refs.newNoteName.focus();
      });
    },
    copy() {
      var self = this;
      this.$copyText(this.curnote.getID()).then(
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
    close(data) {
      this.showAddCycles = data;
      this.showRemoveNotes = data;
      this.showChangeController = data;
      this.showAddController = data;
      this.showTransfer = data;
    },
    isLoading() {
      return this.curnote && this.curnote.loading;
    },
    memory_size() {
      return this.curnote.status ? HumanMemorySize(this.curnote.status.memory_size) : '0M';
    },
    cycles() {
      return this.curnote.status ? HumanCycle(this.curnote.status.cycles) : '0T';
    },
    cycles_month() {
      if (this.curnote.status) {
        let sdr = GetSdr2Usd();
        let cycles = Number(this.curnote.status.cycles / BigInt(1000 ** 3)) / 1000;
        let size = Number(this.curnote.status.memory_size / BigInt(1024)) / 1024;
        return ((cycles * sdr) / (0.467 * (size / 1024))).toFixed(1);
      }
      return '0';
    },
    enter(index) {
      this.isShowSlideDown = index;
    },
    leave() {
      this.isShowSlideDown = 0;
    },
    editName() {
      if (this.isUpdateName) {
        return;
      }
      if (this.newnotename.trim() !== '') {
        this.isUpdateName = true;
        this.$refs.newNoteName.blur();
        this.$nextTick(async () => {
          await ChangeNoteBookName(this.newnotename.trim());
          this.isUpdateName = false;
          this.showTitle = true;
        });
      } else {
        this.showTitle = true;
      }
    },
  },
  components: {
    AddCycles,
    ChangeController,
    Transfer,
  },
};
</script>

<style scoped lang="less">
.current-box {
  min-width: 800px;
  height: 70px;
  margin-left: 20px;
  width: auto;
  display: inline-flex;
  position: relative;
  align-items: center;
  .current-title {
    width: 150px;
    height: 70px;
    background: url(../../../assets/svg/icon-title-bline.svg) no-repeat center bottom;
    background-size: 60px;

    span {
      max-width: 100%;
      line-height: 70px;
      height: 70px;
      font-size: 22px;
      color: #000;
      font-weight: bold;
      display: block;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .edit-box {
      display: flex;
      width: 100%;
      height: 40px;
      margin-top: 15px;
      position: relative;

      input {
        width: 100%;
        border: none;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        padding-left: 8px;
        outline: none;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .editing {
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        top: 0;
        text-align: center;

        img {
          width: 20px;
          margin: 10px auto;
        }
      }
    }
  }

  .note-controller {
    display: flex;
    width: 18px;
    height: 18px;
    margin-left: 12px;

    svg {
      font-size: 20px;
    }
  }

  .currentnoteitems {
    display: flex;
    justify-content: space-between;
    margin-left: 20px;

    svg {
      font-size: 20px;
      margin-right: 6px;
    }

    .canister,
    .fuel,
    .ran {
      display: flex;
      align-items: center;
      height: 35px;
      font-size: 14px;
      color: #999;
      line-height: 35px;
      position: relative;
      margin-left: 20px;

      &::before,
      &::after {
        width: 0;
        height: 0;
        content: '';
        border: 5px solid transparent;
        position: absolute;
        right: 0;
      }
      &.canister {
        padding-right: 15px;

        &::before {
          border-top: 5px solid #999;
          top: 15px;
        }

        &::after {
          border-top: 5px solid #fff;
          top: 13px;
        }

        &.arrowtop {
          &::after {
            border-bottom: 5px solid #fff;
            top: 12px;
          }

          &::before {
            border-bottom: 5px solid #999;
            top: 10px;
          }
        }

        &:hover {
          .currentnote-canister {
            animation: fade 0.5s cubic-bezier(0.39, 0.575, 0.565, 1) both;
            display: flex;
          }
        }
      }
      &.ran {
        position: relative;
        padding-right: 15px;

        &.arrowtop {
          &::after {
            border-bottom: 5px solid #fff;
            top: 12px;
          }

          &::before {
            border-bottom: 5px solid #999;
            top: 10px;
          }
        }

        &.low {
          color: #fd6464;
        }

        &::before {
          border-top: 5px solid #999;
          top: 15px;
        }

        &::after {
          border-top: 5px solid #fff;
          top: 13px;
        }

        &:hover {
          .rantips {
            animation: fade 0.5s cubic-bezier(0.39, 0.575, 0.565, 1) both;
            display: block;
          }
        }
      }
      &.fuel {
        width: auto;
      }
    }
    .ran {
      &::before {
        border-top: 5px solid #999;
        top: 15px;
      }
      &::after {
        border-top: 5px solid #fff;
        top: 13px;
      }
    }
    .rantips {
      position: absolute;
      background-color: #fff;
      border-radius: 8px;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 15;
      left: 50%;
      transform: translateX(-50%);
      top: 35px;
      width: 420px;
      padding: 12px 15px;
      font-size: 12px;
      line-height: 14px;
      display: none;

      h5 {
        font-size: 15px;
        padding: 15px 0;
        margin: 0;
        display: block;
        color: #333;
        font-weight: bold;
      }

      p {
        margin: 0;
        padding: 8px 0;
        color: #666;
      }

      pre {
        font-size: 12px;
        padding: 6px;
        background-color: #f3f3f3;
        border-radius: 4px;
        color: #999;
        margin: 0;
      }

      &::before {
        content: '';
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        position: absolute;
        left: 50%;
        margin-left: -2px;
        border-bottom: 5px solid #ddd;
        top: -5px;
      }

      &::after {
        content: '';
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        position: absolute;
        left: 50%;
        margin-left: -2px;
        border-bottom: 5px solid #fff;
        top: -4px;
      }
    }

    .currentnote-canister {
      padding: 0 12px;
      height: 45px;
      align-items: center;
      width: 370px;
      position: absolute;
      background-color: #fff;
      border-radius: 8px;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      top: 32px;
      z-index: 15;
      left: 50%;
      transform: translateX(-50%);
      display: none;

      p {
        color: #999;
        min-width: 300px;
        line-height: 14px;
        word-wrap: break-word;
        flex: 1;

        strong {
          color: #000;
        }
      }

      &::before {
        content: '';
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        position: absolute;
        left: 50%;
        margin-left: -2px;
        border-bottom: 5px solid #ddd;
        top: -5px;
      }

      &::after {
        content: '';
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        position: absolute;
        left: 50%;
        margin-left: -2px;
        border-bottom: 5px solid #fff;
        top: -4px;
      }
    }
  }

  .currentnote-more {
    width: 25px;
    height: 35px;
    margin: 0 20px;
    position: relative;

    svg {
      font-size: 20px;
      display: block;
      margin: 7px auto;
    }

    ul {
      position: absolute;
      background-color: #fff;
      border-radius: 8px;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      top: 32px;
      // z-index: 15;
      left: 50%;
      padding: 8px 0;
      transform: translateX(-50%);
      margin: 0;
      display: none;

      li {
        height: 38px;
        line-height: 38px;
        padding-left: 15px;
        padding-right: 15px;
        white-space: nowrap;
        transition: all 0.3s linear;
        display: flex;
        align-items: center;

        svg {
          font-size: 16px;
          margin-right: 8px;
          width: 18px;
        }

        span {
          flex: 1;
          font-size: 14px;
        }

        &:hover {
          transition: all 0.3s linear;
          cursor: pointer;
          background-color: #d2e5ff;
        }
      }

      &::before {
        content: '';
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        position: absolute;
        left: 50%;
        margin-left: -2px;
        border-bottom: 5px solid #ddd;
        top: -5px;
      }

      &::after {
        content: '';
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        position: absolute;
        left: 50%;
        margin-left: -2px;
        border-bottom: 5px solid #fff;
        top: -4px;
      }
    }

    &:hover {
      ul {
        animation: fade 0.5s cubic-bezier(0.39, 0.575, 0.565, 1) both;
        display: block;
      }
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
}
</style>
