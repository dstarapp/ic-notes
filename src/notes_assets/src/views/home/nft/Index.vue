<template>
  <div>
    <div class="nft-loading" v-if="isLoading">
      <div class="loading">
        <div class="loader"></div>
      </div>
    </div>
    <div v-else class="nft-box">
      <div v-if="NFTS.length <= 0" class="no-nft"></div>
      <div v-else class="nft" v-for="(item, index) in NFTS" :key="index">
        <div class="nft-img">
          <img :src="item.metadata && item.metadata.thumb ? item.metadata.thumb : item.url" />
          <i class="nft-tag">NFT</i>
        </div>
        <div class="nft-con">
          <span>{{ $t('nft.name') }} #{{ item.index }}</span>
          <button @click="handleClick(2, item)">
            {{ $t('nft.title') }}
          </button>
          <!-- <button v-else @click="handleClick(1)">Claim</button> -->
        </div>
      </div>
    </div>
    <SendNft v-if="isShow == 2" @close="close" :index="sendIndex" />
    <!-- <Claim v-else-if="isShow == 1" @close="close" /> -->
  </div>
</template>

<script>
import SendNft from './SendNft.vue';
import { GetMyPlanetNFT } from '../../../utils/nft';
export default {
  name: 'Airdrop',
  components: { SendNft },
  data() {
    return {
      isLoading: true,
      isShow: 0, // 1-claim 2-send
      sendIndex: 0,
      NFTS: [],
    };
  },
  mounted() {
    this.refresh();
  },
  activated() {
    this.refresh();
  },
  methods: {
    handleClick(num, item) {
      this.isShow = num;
      this.sendIndex = Number(item.index);
    },
    refresh() {
      this.isLoading = true;
      this.$nextTick(async () => {
        let nfts = await GetMyPlanetNFT();
        this.NFTS.length = 0;
        this.NFTS.push(...nfts);
        this.isLoading = false;
      });
    },
    close(data) {
      this.isShow = 0;
      if (data) {
        this.refresh();
      }
    },
  },
};
</script>

<style scoped lang="less">
.nft-box {
  position: fixed;
  left: 80px;
  top: 70px;
  right: 0;
  bottom: 0;
  padding: 50px;
  overflow-y: auto;
  background: linear-gradient(135deg, #f2f6ff, #fff3e1, #e1eafd);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;

  .no-nft {
    width: 100%;
    height: 100%;
    background: url(../../../assets/svg/nonft.svg) no-repeat center center;
  }

  .nft {
    width: 22%;
    background-color: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    margin: 0 0 50px 0;
    padding: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    transition: all 0.2s linear;
  }
  .nft:hover {
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
    transition: all 0.2s linear;
  }
  .nft:last-child:nth-child(4n + 2) {
    margin-right: calc((100% - 22%) / 3 * 2);
  }
  .nft:last-child:nth-child(4n + 3) {
    margin-right: calc((100% - 22%) / 3 * 1);
  }
  .nft-img {
    width: 100%;
    position: relative;
  }
  .nft-img img {
    width: 100%;
  }
  .nft-img .nft-tag {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #ffffff;
    font-weight: bold;
    padding: 2px 4px;
    border: 2px solid #ffffff;
    font-size: 12px;
  }
  .nft-con {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 20px;
    box-sizing: border-box;
  }
  .nft-con span {
    color: #000;
    padding-right: 15px;
    flex: 1;
    font-size: 16px;
  }
  .nft-con button {
    width: 100px;
    background-color: #3c6dd8;
    border-radius: 4px;
    text-align: center;
    color: #ffffff;
    padding: 10px 0;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: opacity 0.2s linear;
  }
  .nft-con button:hover {
    opacity: 0.9;
    transition: opacity 0.2s linear;
  }
}
.nft-loading {
  position: fixed;
  left: 80px;
  top: 70px;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f2f6ff, #fff3e1, #e1eafd);
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
