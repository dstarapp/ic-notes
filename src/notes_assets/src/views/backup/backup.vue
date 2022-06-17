<template>
  <BackupDialog />
</template>

<script>
import BackupDialog from './components/BackupHome.vue';
import { CheckAesKey } from '../../utils/aes';
export default {
  name: 'BackupView',
  components: {
    BackupDialog,
  },
  async mounted() {
    if (!localStorage.getItem('_backup')) {
      this.$router.replace({ name: 'home' });
      return;
    }
    await CheckAesKey();
  },
};
</script>

<style scoped lang="less">
</style>
