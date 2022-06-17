<template>
  <div class="noteContainerBox">
    <div v-if="loading" class="notes-loading">
      <div class="loading">
        <div class="loader"></div>
      </div>
    </div>
    <div v-else class="note-container">
      <NoteSlide :isShow="isEdit" @newnote="newNote" @clicknote="clickNote"></NoteSlide>
      <NoteArea :isShow="isEdit" ref="area" @editchange="editChange" @savedone="saveDone"></NoteArea>
    </div>
    <!-- 是否需要保存 -->
    <CheckSave v-if="showCheck" ref="checksave" :toUrl="toUrl" @close="close" @save="checkSave" />
  </div>
</template>

<script>
import _ from 'lodash';
import NoteSlide from './NoteSlide.vue';
import NoteArea from './NoteArea.vue';
import CheckSave from './components/CheckSave.vue';
import NoteCurrent from './components/NoteCurrent.vue';
import { GetNoteBookStatus, GetCurNoteBook, SetCurNoteBook } from '../../utils/notes/notes';
import { LoadNotes, GetCurNote, GetNoteData, SetCurNote, LoadNoteStat } from '../../utils/notes/notebook';
export default {
  name: 'NoteContainer',
  data() {
    return {
      loading: true,
      curnote: GetCurNoteBook(),
      editnote: GetCurNote(),
      showCheck: false, //控制提示弹窗显隐
      isEdit: false, //note页面是否进行了编辑
      isEditChange: false,
      isLoadNote: false,
      toUrl: '',
    };
  },
  components: {
    NoteCurrent,
    NoteSlide,
    NoteArea,
    CheckSave,
  },
  // beforeRouteLeave(to, from, next) {
  //   if (this.isEdit) {
  //     this.showCheck = true
  //     next(false)
  //   } else {
  //     this.showCheck = false
  //     next()
  //   }
  //   this.toUrl = to.path
  // },
  mounted() {
    if (!this.$route.query || !this.$route.query.id) {
      this.$router.replace({ name: 'home' });
      return;
    }

    this.$watch(
      () => _.cloneDeep(this.curnote),
      (n, o) => {
        if (n.getID() !== o.getID()) {
          if (n.getCanisterID().isAnonymous()) {
            return;
          }
          this.initNoteBook(n.getID());
        }
      },
      { deep: true }
    );

    this.$watch(
      () => _.cloneDeep(this.editnote),
      (n, o) => {
        if (n.id !== o.id) {
          if (n.id != 0) {
            this.isEdit = true;
          }
          this.isLoadNote = true;
          this.$nextTick(async () => {
            if (this.$refs.area) {
              await this.$refs.area.loadnote(n.id);
            }
            this.isLoadNote = false;
          });
        }
      },
      { deep: true }
    );

    let cid = this.$route.query.id;
    if (this.curnote.getID() != cid) {
      SetCurNoteBook(cid);
    } else {
      this.initNoteBook(cid);
    }

    this.$bus.on('back', () => {
      if (this.isEditChange) {
        this.showCheck = true;
      } else {
        if (this.isEdit) {
          this.isEdit = false;
          SetCurNote(0);
        } else {
          this.$router.go(-1);
        }
      }
    });

    // setTimeout(() => {
    //   this.isEdit = true;
    // }, 2000);
  },
  methods: {
    initNoteBook(cid) {
      this.loading = true;
      this.$nextTick(async () => {
        setTimeout(async () => {
          await GetNoteBookStatus(cid);
        }, 100);
        SetCurNote(0);
        await LoadNoteStat();
        await LoadNotes(true, '', 'TimeDesc');
        this.loading = false;
      });
    },
    close(state) {
      this.showCheck = false;
      if (state) {
        this.isEdit = false;
        SetCurNote(0);
      }
    },
    checkSave(data) {
      if (this.$refs.area) {
        console.log('save save save', data);
        this.$refs.area.saveNote();
      }
    },
    saveDone(data) {
      if (this.$refs.checksave) {
        this.$refs.checksave.saveDone(data);
      }
    },
    newNote(data) {
      if (this.editnote.id == 0) {
        this.$refs.area.focusTitle();
      }
      this.isEdit = true;
      SetCurNote(0);
    },
    clickNote(note) {
      if (this.editnote.id == note.id) {
        return;
      }
      if (this.isLoadNote) {
        return;
      }
      SetCurNote(note.id);
    },
    editChange(data) {
      this.isEditChange = data;
    },
  },
};
</script>

<style scoped lang="less">
.noteContainerBox {
  display: flex;
  width: calc(100% - 85px);
  height: calc(100% - 75px);
  padding: 0;
  margin: 75px 0 0 85px;

  .notes-loading {
    display: flex;
    width: 100%;
    height: 100%;
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

  .note-container {
    display: flex;
    width: 100%;
    height: 100%;
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .noteContainerBox {
    width: 100%;
    height: calc(100% - 15vw);
    left: 0;
    top: 0;
    margin: 15vw 0 0 0;
  }

  .hide {
    display: none;
  }

  .show {
    display: block;
  }
}
</style>
