<template>
  <div class="modal-con">
    <div class="modal-header">{{ $t('vseedphrase.title') }}</div>
    <div class="goback" @click="back">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-arrow-left" />
      </svg>
    </div>
    <p class="tips">{{ $t('vseedphrase.tips') }}</p>
    <div class="contain">
      <div class="phrase" :class="[newPhrasedata.indexOf(item) !== -1 ? 'cur' : '', isNotRight(item) ? 'error' : '']" v-for="(item, index) in phrasedata" :key="index" @click="chosePhrase(item)">
        {{ item.val }}
        <i>{{ newPhrasedata.indexOf(item) !== -1 ? newPhrasedata.indexOf(item) + 1 : 0 }}</i>
      </div>
    </div>
    <!-- 出错提示 -->
    <div class="error-tip">
      <p class="p-10" v-if="isError">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-warning" />
        </svg>
        {{ $t('vseedphrase.error') }}
      </p>
    </div>

    <div :class="vstatus == 1 ? 'phrase-btn active' : 'phrase-btn'" @click="validate">
      {{ $t('vseedphrase.btnName') }}
      <div v-if="vstatus == 2" class="dot">
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetCurrentLocalKey, UpdateCurrentLocalKey } from '../../../utils/local';
import { GetDeviceMnemonic } from '../../../utils/identity';
export default {
  name: 'Validate',
  components: {},
  data() {
    return {
      vstatus: 0, // 0-默认 1-激活 2-点击 3-成功 4-出错
      // phrasedata: [
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      //   { val: 'happy' },
      // ],
      phrasedata: [],
      errorstatus: false,
      newPhrasedata: [],
      rightData: [],
      isError: false,
    };
  },
  mounted() {
    let str = GetDeviceMnemonic();
    // str = 'a b c d e f g h i j k a'
    let data = str.trim().split(' ');
    for (let i = 0; i < data.length; i++) {
      let it = {
        idx: i + 1,
        val: data[i],
      };
      this.phrasedata.push(it);
      this.rightData.push(it);
    }

    for (let i = this.phrasedata.length - 1; i >= 0; i--) {
      let ridx = Math.floor(Math.random() * (i + 1));
      let v = this.phrasedata[ridx];
      this.phrasedata[ridx] = this.phrasedata[i];
      this.phrasedata[i] = v;
    }
  },
  watch: {
    newPhrasedata: {
      handler() {
        let str1 = this.genStr(this.rightData);
        let str2 = this.genStr(this.newPhrasedata);
        if (str2 === str1) {
          this.vstatus = 1;
        } else {
          this.vstatus = 0;
        }
        let res = this.newPhrasedata.every((item, index) => {
          if (this.rightData[index]) {
            let it = this.rightData[index];
            return it.val == item.val;
          }
        });
        this.isError = !res;
      },
      deep: true,
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    validate() {
      let str = GetDeviceMnemonic();
      let str2 = this.genStr(this.newPhrasedata);
      if (str && str2 && str2 == str) {
        let data = GetCurrentLocalKey();
        if (data && data.bk) {
          this.$router.replace({ name: 'home' });
        } else {
          UpdateCurrentLocalKey({ bk: 1 });
          this.$router.replace({ name: 'info' });
        }
      } else {
      }
    },
    chosePhrase(item) {
      let idx = this.newPhrasedata.findIndex((v) => {
        return v == item;
      });
      if (idx !== -1) {
        this.newPhrasedata.splice(idx, this.newPhrasedata.length - idx);
      } else {
        this.newPhrasedata.push(item);
      }
    },
    genStr(items) {
      let str = '';
      items.forEach((it) => {
        str += ' ' + it.val;
      });
      return str.trim();
    },
    isNotRight(item) {
      let idx = this.newPhrasedata.indexOf(item);
      if (idx !== -1 && this.rightData[idx]) {
        let it = this.rightData[idx];
        return it.val != item.val;
      }
      return false;
    },
  },
};
</script>

<style scoped lang="less">
.modal-con {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .modal-header {
    width: 90%;
    line-height: 150%;
    color: #000;
    font-size: (20 * 2/75rem);
    text-align: center;
    font-weight: bold;
    font-family: 'GothicB';
    margin-top: 6vh;
  }

  .goback {
    position: absolute;
    top: 4vh;
    left: 4vh;
    font-size: (16 * 2/75rem);
    cursor: pointer;
  }

  .tips {
    padding: 2.5vh 0;
    font-size: (12 * 2/75rem);
    display: block;
    text-align: center;
    margin: 0;
  }
  .contain {
    width: 80%;

    .phrase {
      width: 23.4%;
      display: inline-flex;
      background-color: #f1f1f1;
      border: 1px solid #f1f1f1;
      border-radius: 6px;
      justify-content: center;
      align-items: center;
      height: 6vh;
      text-align: center;
      box-sizing: border-box;
      font-size: (10 * 2/75rem);
      margin-right: 2%;
      position: relative;
      margin-top: 2vh;
      cursor: pointer;

      &:nth-child(4n) {
        margin-right: 0;
      }

      i {
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 2px solid #fff;
        position: absolute;
        left: 50%;
        top: -11px;
        margin-left: -11px;
        background-color: #3c6dd8;
        color: #fff;
        font-style: normal;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        display: none;
      }

      &:hover,
      &.cur {
        transition: all 0.2s linear;
      }

      &.cur {
        color: #fff;
        font-weight: bold;
        background-color: #8eb0fa;
        border: 1px solid #8eb0fa;
        box-shadow: 0 0 10px rgba(60, 109, 216, 0.4);

        i {
          display: block;
        }
      }

      &.error {
        border: 1px solid #ffdbdb;
        color: #fd6464;
        background-color: #fff;
        box-shadow: none;

        i {
          background-color: #ffdbdb;
          color: #fd6464;
        }
      }
    }
  }
  .error-tip {
    width: 80%;
    height: 30px;
    color: #fd6464;
  }
}

.phrase-btn {
  background-color: #8eb0fa;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin: auto;
  font-weight: bold;
  height: 10vw;
  max-height: 60px;
  width: 50%;
  min-width: 250px;
  color: #fff;
  font-size: (14 * 2/75rem);
  border-radius: 6px;
  transition: all 0.3s linear;
  cursor: pointer;
  pointer-events: none;
  margin-bottom: 6vh;
  margin-top: 1.5vh;

  &.active {
    background-color: #3c6dd8;
    pointer-events: auto;

    &:hover {
      box-shadow: 0 0 18px rgba(60, 109, 216, 0.6);
      transition: all 0.3s linear;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-con {
    .contain {
      width: 85%;
      padding-bottom: 0;
      .phrase {
        width: 32%;

        &:nth-child(4n) {
          margin-right: 2%;
        }

        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
    .error-tip {
      padding: 0;
    }
  }
  .phrase-btn {
    width: 85%;
  }
}
</style>
