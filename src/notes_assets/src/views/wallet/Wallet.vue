<template>
  <div class="walletBox">
    <WalletList ref="wlist"></WalletList>
    <WalletSidebar @refresh="refresh"></WalletSidebar>
  </div>
</template>

<script>
import WalletSidebar from './components/WalletSidebar.vue'
import WalletList from './components/WalletList.vue'
export default {
  name: 'Wallet',
  data() {
    return {
      isrefresh: false,
      depositstatus: false,
      widthdrawstatus: false,
    }
  },
  components: {
    WalletSidebar,
    WalletList,
  },
  methods: {
    refresh(data) {
      if (this.$refs.wlist) {
        this.$refs.wlist.refresh()
      }
    },
  },
}
</script>
 
 <style scoped lang="less">
.walletBox {
  display: flex;
  position: fixed;
  width: calc(100% - 80px);
  height: calc(100% - 70px);
  left: 80px;
  top: 70px;
  overflow-y: auto;
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .walletBox {
    flex-direction: column;
    width: 100%;
    margin-top: 13vw;
    height: calc(100% - 13vw);
    padding-top: 5vw;
    left: 0;
    top: 0;
    background: linear-gradient(135deg, #f2f6ff, #fff3e1, #e1eafd);
    overflow-y: scroll;
  }
}
</style>