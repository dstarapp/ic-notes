<!-- <template>
  <div class="modal-con">
    <div class="modal-header">{{ $t('seedphrase.title') }}</div>
    <div class="goback" @click="back">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-arrow-left" />
      </svg>
    </div>
    <div class="close" @click="back">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-close" />
      </svg>
    </div>
    <div class="phrase-box">
      <span class="phrase-item" v-for="(i, s) in phraseseed()" :key="s">
        {{ i }}<i>{{ s + 1 }}</i>
      </span>
    </div>
    <div class="contain">
      <div v-for="(item, index) in conditions" class="phrase-condition" @click="handleClick(index, item)" :key="index">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="selected.indexOf(item) == -1 ? '#icon-nocheck' : '#icon-checked'" />
        </svg>
        <p :class="{ checked: selected.indexOf(item) != -1 }" v-html="item.content"></p>
      </div>
    </div>
    <div :class="checkstatus ? 'phrase-btn active' : 'phrase-btn'" @click="haveDone">
      {{ $t('seedphrase.btnName') }}
    </div>
  </div>
</template>

<script>
import { GetDeviceMnemonic } from '../../../utils/identity'
import { UpdateCurrentLocalKey } from '../../../utils/local'
export default {
  name: 'BackbyPhrase',
  data() {
    return {
      checkstatus: false,
      conditions: [
        { id: '1', content: this.$i18n.t('seedphrase.condition.one') + '<i>' + this.$i18n.t('seedphrase.condition.one2') + '</i>' },
        { id: '2', content: this.$i18n.t('seedphrase.condition.two') },
      ],
      selected: [],
    }
  },
  methods: {
    phraseseed() {
      let str = GetDeviceMnemonic()
      if (str == null) {
        return ['', '', '', '', '', '', '', '', '', '', '', '']
        // return ['grape', 'happy', 'silent', 'silent', 'silent', 'silent', 'silent', 'silent', 'silent', 'silent', 'silent', 'silent']
      }
      return str.split(' ')
    },
    haveDone() {
      this.$router.push({ name: 'validatephrase' })
    },
    handleClick(index, item) {
      if (this.selected.indexOf(item) !== -1) {
        this.selected.splice(this.selected.indexOf(item), 1)
      } else {
        this.selected.push(item)
      }
      this.checkstatus = this.selected.length == 2
      // console.log(JSON.parse(JSON.stringify(this.selected)))
    },
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped lang="less">
.modal-con {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .center {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .modal-header {
    width: 90%;
    line-height: 150%;
    color: #000;
    font-size: (26 * 2/75rem);
    text-align: center;
    font-weight: bold;
    font-family: 'GothicB';
    margin-top: 4vh;
  }

  .close {
    position: absolute;
    top: 2vh;
    right: 2vh;
    font-size: (20 * 2/75rem);
    cursor: pointer;
  }

  .goback {
    position: absolute;
    top: 2vh;
    left: 2vh;
    font-size: (20 * 2/75rem);
    cursor: pointer;
  }

  .phrase-box {
    width: 90%;
    background-color: #eef3ff;
    border: 1px solid #d2dfff;
    border-radius: 8px;
    margin: 2.5vh 0;

    .phrase-item {
      width: 25%;
      border-right: 1px solid #d2dfff;
      border-bottom: 1px solid #d2dfff;
      line-height: 5vh;
      height: 5vh;
      position: relative;
      text-align: center;
      font-size: (16 * 2/75rem);
      display: inline-block;
      box-sizing: border-box;

      i {
        position: absolute;
        top: 0.8vw;
        right: 0.8vw;
        color: #8eb0fa;
        font-size: (10 * 2/75rem);
        font-style: normal;
        line-height: 100%;
        // 禁止复制
        user-select: none;
      }

      &:nth-child(4n) {
        border-right: none;
      }

      &:nth-child(n + 9) {
        border-bottom: none;
      }
    }
  }
}

.contain {
  display: flex;
  width: 90%;
  flex-direction: column;
  margin-bottom: 1vh;

  .phrase-condition {
    display: flex;
    margin-bottom: 1.2vh;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    outline: none;

    svg {
      font-size: (14 * 2/75rem);
      margin-right: 0.8vh;
    }

    p {
      color: #999;
      flex: 1;
      margin: 0;
      font-size: (10 * 2/75rem);

      :deep(i) {
        display: inline-flex;
        margin-left: 5px;
        color: #3c6dd8;
        font-style: normal;
      }

      &.checked {
        color: #333;
      }
    }
  }
}

.phrase-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  margin: auto;
  font-weight: bold;
  height: 10vw;
  max-height: 60px;
  width: 50%;
  min-width: 250px;
  color: #fff;
  background-color: #8eb0fa;
  font-size: (14 * 2/75rem);
  border-radius: 6px;
  transition: all 0.3s linear;
  cursor: pointer;
  margin-bottom: 4vh;
  pointer-events: none;

  &.active {
    background-color: #3c6dd8;
    color: #fff;
    pointer-events: auto;

    &:hover {
      box-shadow: 0 0 18px rgba(60, 109, 216, 0.6);
      transition: all 0.3s linear;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .modal-con {
    .phrase-box {
      .phrase-item {
        width: 33.3333%;

        &:nth-child(4n) {
          border-right: 1px solid #d2dfff;
        }

        &:nth-child(n + 9) {
          border-bottom: 1px solid #d2dfff;
        }

        &:nth-child(3n) {
          border-right: 0;
        }

        &:nth-child(n + 10) {
          border-bottom: none;
        }
      }
    }
  }
}
</style> -->
