<template>
  <transition name="fade" mode="out-in">
    <CreateNote @steps="steps" @closeChild="closeChild"></CreateNote>
  </transition>
</template>

<script>
import CreateNote from './CreateNote.vue'
export default {
  name: 'Create',
  data() {
    return {
      step: 1,
    }
  },
  components: {
    CreateNote,
  },
  methods: {
    steps(data) {
      this.step = data
    },
    closeChild(data) {
      this.$emit('close', data)
    },
  },
}
</script>

<style scoped lang="less">
@media screen and (min-width: 0) and (max-width: 750px) {
}
</style>
