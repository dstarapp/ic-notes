<template>
  <div class="notearea-container" :class="isShow ? 'show' : 'hide'">
    <div class="notearea-toptool" id="notearea-toptool">
      <div class="notearea-save-box">
        <div class="notearea-save-more">
          <div class="notearea-save" :class="isSaving == 1 ? 'cur' : isSaving == 2 ? 'saved' : ''">
            <button @click="saveNote">
              <img src="../../assets/svg/loading.svg" v-show="isSave" />
              {{ isSave ? '' : isSaving == 2 ? $t('note.btnName.saved') : $t('note.btnName.save') }}
            </button>
            <div class="autosave-down" @mouseenter="showAutoSave" @mouseleave="hideAutoSave">
              <div class="setautosave" ref="setautosave">
                <span>{{ $t('note.btnName.autosave') }}</span>
                <div class="switch-seconds">
                  <div @click.stop="checksecond(20)" @mouseenter="autoSaveHover = 20" @mouseleave="autoSaveHover = 0">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="saveSeconds == 20 || autoSaveHover == 20 ? '#icon-checked' : '#icon-nocheck'" />
                    </svg>
                    <span :class="{ checked: saveSeconds == 20 }">20{{ $t('note.saveoption.s') }}</span>
                  </div>
                  <div @click.stop="checksecond(90)" @mouseenter="autoSaveHover = 90" @mouseleave="autoSaveHover = 0">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="saveSeconds == 90 || autoSaveHover == 90 ? '#icon-checked' : '#icon-nocheck'" />
                    </svg>
                    <span :class="{ checked: saveSeconds == 90 }">90{{ $t('note.saveoption.s') }}</span>
                  </div>
                  <div @click.stop="checksecond(300)" @mouseenter="autoSaveHover = 300" @mouseleave="autoSaveHover = 0">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="saveSeconds == 300 || autoSaveHover == 300 ? '#icon-checked' : '#icon-nocheck'" />
                    </svg>
                    <span :class="{ checked: saveSeconds == 300 }">300{{ $t('note.saveoption.s') }}</span>
                  </div>
                </div>
                <div class="setauto-foot">
                  <div class="switch" :class="isAutoSave ? 'on' : 'off'" @click="autoSave"><i></i>{{ isAutoSave ? $t('note.saveoption.on') : $t('note.saveoption.off') }}</div>
                  <svg class="icon" aria-hidden="true" @click="showAboutAutoSave = true">
                    <use xlink:href="#icon-care" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="btn-save" :class="isSave ? 'load' : ''" @click="saveNote">
      <img src="../../assets/svg/loading.svg" v-show="isSave && isSaving !== 2" />
      <img src="../../assets/svg/icon-success.svg" v-show="isSave && isSaving === 2" />
      Save
    </div>

    <div class="editor-container">
      <QuillEditor ref="qeditor" @textChange="textChange" @ready="editorReady" v-model:content="content" contentType="html" theme="snow" toolbar="#notearea-toolbar" :options="options" :modules="modules">
        <template #toolbar>
          <div id="notearea-toolbar" class="notearea-toolbar">
            <!-- <span class="ql-formats"> -->
            <select class="ql-header">
              <option value="1" />
              <option value="2" />
              <option value="3" />
              <option value="4" />
              <option value="5" />
              <option value="6" />
              <option selected />
            </select>
            <select class="ql-size">
              <option value="small"></option>
              <option selected="selected"></option>
              <option value="large"></option>
              <option value="huge"></option>
            </select>
            <!-- </span> -->
            <!-- <span class="ql-formats"> -->
            <button class="ql-bold" />
            <button class="ql-italic" />
            <button class="ql-underline" />
            <button class="ql-strike" />
            <button class="ql-blockquote" />
            <button class="ql-code-block" />
            <select class="ql-color">
              <option selected="selected" />
              <option value="#e60000" />
              <option value="#ff9900" />
              <option value="#ffff00" />
              <option value="#008a00" />
              <option value="#0066cc" />
              <option value="#9933ff" />
              <option value="#ffffff" />
              <option value="#facccc" />
              <option value="#ffebcc" />
              <option value="#ffffcc" />
              <option value="#cce8cc" />
              <option value="#cce0f5" />
              <option value="#ebd6ff" />
              <option value="#bbbbbb" />
              <option value="#f06666" />
              <option value="#ffc266" />
              <option value="#ffff66" />
              <option value="#66b966" />
              <option value="#66a3e0" />
              <option value="#c285ff" />
              <option value="#888888" />
              <option value="#a10000" />
              <option value="#b26b00" />
              <option value="#b2b200" />
              <option value="#006100" />
              <option value="#0047b2" />
              <option value="#6b24b2" />
              <option value="#444444" />
              <option value="#5c0000" />
              <option value="#663d00" />
              <option value="#666600" />
              <option value="#003700" />
              <option value="#002966" />
              <option value="#3d1466" />
            </select>
            <select class="ql-background">
              <option value="#000000"></option>
              <option value="#e60000"></option>
              <option value="#ff9900"></option>
              <option value="#ffff00"></option>
              <option value="#008a00"></option>
              <option value="#0066cc"></option>
              <option value="#9933ff"></option>
              <option selected="selected"></option>
              <option value="#facccc"></option>
              <option value="#ffebcc"></option>
              <option value="#ffffcc"></option>
              <option value="#cce8cc"></option>
              <option value="#cce0f5"></option>
              <option value="#ebd6ff"></option>
              <option value="#bbbbbb"></option>
              <option value="#f06666"></option>
              <option value="#ffc266"></option>
              <option value="#ffff66"></option>
              <option value="#66b966"></option>
              <option value="#66a3e0"></option>
              <option value="#c285ff"></option>
              <option value="#888888"></option>
              <option value="#a10000"></option>
              <option value="#b26b00"></option>
              <option value="#b2b200"></option>
              <option value="#006100"></option>
              <option value="#0047b2"></option>
              <option value="#6b24b2"></option>
              <option value="#444444"></option>
              <option value="#5c0000"></option>
              <option value="#663d00"></option>
              <option value="#666600"></option>
              <option value="#003700"></option>
              <option value="#002966"></option>
              <option value="#3d1466"></option>
            </select>
            <!-- </span> -->
            <!-- <span class="ql-formats"> -->
            <button class="ql-list" value="ordered" />
            <button class="ql-list" value="bullet" />
            <select class="ql-align">
              <option selected="selected"></option>
              <option value="center"></option>
              <option value="right"></option>
              <option value="justify"></option>
            </select>
            <!-- </span> -->
            <!-- <span class="ql-formats"> -->
            <button class="ql-link" />
            <button class="ql-image" />
            <button class="ql-script" value="sub" />
            <button class="ql-script" value="super" />
            <button class="ql-clean" />
            <!-- </span> -->
          </div>
          <div class="notearea-notetitle">
            <input v-model="title" type="text" :placeholder="$t('note.notePlaceholder')" ref="notetitle" />
          </div>
        </template>
      </QuillEditor>
    </div>

    <div class="notearea-notetags-time-box">
      <div class="notearea-notetags-box">
        <div class="notetag-ok" v-for="(tag, idx) in tags" :key="idx">
          #{{ tag }}
          <button @click="removeTag(idx)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-close" />
            </svg>
          </button>
        </div>
        <div class="notetags" :class="tagactive ? 'active' : ''">
          <div class="relative">
            <span></span>
            <input type="text" :placeholder="$t('note.tag.tagName')" v-model="inputw" maxlength="20" @focus="tagactive = true" @blur="addTag" @keydown.enter="addTag" />
          </div>
        </div>
        <p v-show="tagError" class="tag-error">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-warning" />
          </svg>
          {{ tagErrorTips }}
        </p>
      </div>
    </div>
    <DeleteNote v-if="showDeleteNote" @close="close"></DeleteNote>
    <!--  -->
    <AboutAutoSave v-if="showAboutAutoSave" @close="close" />
  </div>
</template>

<script>
import '../../assets/css/vue-quill.snow.css';
import DeleteNote from './components/DeleteNote.vue';
import AboutAutoSave from './components/AboutAutoSave.vue';
import { QuillEditor } from '@vueup/vue-quill';
import ImageCompress from 'quill-image-compress';
import { toRaw } from 'vue';
import { CreateNote, UpdateNote, NTYPE_NOTE, GetNoteData, GetCurNote, SetCurNote } from '../../utils/notes/notebook';
import { GetCurNoteBook, GetNoteBooks } from '../../utils/notes/notes';
import { GetLocalAutoSave, SetLocalAutoSave } from '../../utils/local';

export default {
  name: 'NoteArea',
  props: ['isShow'],
  emits: ['editchange', 'savedone'],
  data() {
    return {
      showDeleteNote: false,
      showSendNote: false,
      showAboutAutoSave: false,
      status: false,
      tagactive: false,
      inputw: '',
      initwith: 60,
      cstatus: false,
      // options: {
      //   placeholder: this.$i18n.t('note.noteAreaPlaceholder'),
      // },
      modules: [
        {
          name: 'imageCompress',
          module: ImageCompress,
          options: {
            quality: 0.7,
            debug: false,
            maxWidth: 800,
            maxHeight: 600,
          },
        },
      ],
      id: 0,
      title: '',
      content: '',
      tags: [],
      ready: false,
      isSave: false,
      isSaving: 0,
      isAutoSave: true, // 是否自动保存
      saveSeconds: 20, // 自动保存时间
      autoSaveHover: 0, // 自动保存hover效果
      tagError: false,
      tagErrorTips: '',
      isEdit: false,
      isLoadContent: false,
      autoTimer: null,
    };
  },
  computed: {
    options() {
      return {
        placeholder: this.$i18n.t('note.noteAreaPlaceholder'),
      };
    },
  },
  mounted() {
    this.$refs.notetitle.focus();
    window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e));
    this.saveSeconds = GetLocalAutoSave();
    if (this.saveSeconds == 0) {
      this.isAutoSave = false;
    }
    this.startAutoSave();
  },
  activated() {
    this.startAutoSave();
  },
  deactivated() {
    this.stopAutoSave();
  },
  methods: {
    beforeunloadHandler(e) {
      if (!this.isEdit) {
        return false;
      }
      e = e || window.event;
      if (e) {
        e.returnValue = this.$i18n.t('checksave.leaveTips');
      }
      return this.$i18n.t('checksave.leaveTips');
    },
    collection() {
      this.cstatus = !this.cstatus;
    },
    close(data) {
      this.showDeleteNote = data;
      this.showSendNote = data;
      this.showAboutAutoSave = data;
    },
    editorReady() {
      this.ready = true;
    },
    textChange() {
      if (!this.isLoadContent) {
        this.editChange(true);
      }
    },
    addTag() {
      if (this.inputw != '') {
        if (this.tags.length >= 3) {
          this.tagError = true;
          this.tagErrorTips = this.$i18n.t('note.tag.tagError');
        } else {
          if (this.tags.indexOf(this.inputw) != -1) {
            this.tagError = true;
            this.tagErrorTips = this.$i18n.t('note.tag.tagError2');
          } else {
            this.tags.push(this.inputw);
            this.inputw = '';
            this.editChange(true);
          }
        }
      } else {
        this.tagactive = false;
        this.tagError = false;
      }
    },
    removeTag(idx) {
      if (idx >= 0) {
        this.tags.splice(idx, 1);
        if (this.tags.length < 3) {
          this.tagError = false;
        }
      }
    },
    focusTitle() {
      this.$refs.notetitle.focus();
    },
    async loadnote(id) {
      let note = GetCurNote();
      this.$refs.notetitle.focus();
      if (note.id != id || note.id == this.id) {
        return;
      }
      this.stopAutoSave();
      this.editChange(false);
      this.isLoadContent = true;
      this.id = note.id;
      this.title = note.title;
      this.tags.length = 0;
      if (note.tags.length > 0) {
        this.tags.push(...toRaw(note.tags));
      }
      if (id != 0) {
        this.$refs.qeditor.setHTML(this.$i18n.t('note.areacontent'));
        let ret = await GetNoteData(id);
        if (ret) {
          this.$refs.qeditor.setHTML(ret);
        }
      } else {
        this.$refs.qeditor.setHTML('');
      }
      setTimeout(() => {
        this.isLoadContent = false;
        this.startAutoSave();
      }, 200);
    },
    saveNote() {
      if (this.title == '') {
        this.editChange(false);
        if (this.$i18n) {
          alert(this.$i18n.t('note.inputnotetitle'));
        }
        this.$emit('savedone', false);
        return;
      }
      if (this.content == '') {
        this.editChange(false);
        if (this.$i18n) {
          alert(this.$i18n.t('note.inputnotecontent'));
        }
        this.$emit('savedone', false);
        return;
      }
      if (this.isSave) {
        return;
      }
      this.isSaving = 1;
      this.isSave = true;
      this.title = this.title.trim();

      if (this.id == 0) {
        this.$nextTick(async () => {
          let ret = await CreateNote({
            title: this.title,
            ntype: NTYPE_NOTE,
            content: this.content,
            tags: [...toRaw(this.tags)],
          });
          if (ret) {
            this.id = Number(ret);
            this.isSave = false;
            this.isSaving = 2;
            SetCurNote(this.id);
            console.log('save success', ret);
            this.$emit('savedone', true);
            // }
          } else {
            this.isSave = false;
            this.isSaving = 0;
          }

          setTimeout(() => {
            this.isSaving = 0;
          }, 2000);
        });
      } else {
        let note = GetCurNote();
        if (note.id != this.id) {
          this.isSaving = 0;
          this.isSave = false;
          return;
        }
        this.$nextTick(async () => {
          let ret = await UpdateNote({
            id: this.id,
            title: this.title,
            ntype: NTYPE_NOTE,
            content: this.content,
            tags: [...toRaw(this.tags)],
            like: note.like,
            topTime: note.topTime,
          });
          this.isSave = false;

          if (ret) {
            // this.isSave = false
            this.isSaving = 2;
            console.log('save success', ret);
            this.$emit('savedone', true);
          } else {
            this.isSaving = 0;
          }

          setTimeout(() => {
            this.isSaving = 0;
          }, 2000);
        });
      }
      this.editChange(false);
    },
    stopAutoSave() {
      if (this.autoTimer) {
        clearInterval(this.autoTimer);
        this.autoTimer = null;
      }
    },
    startAutoSave() {
      this.stopAutoSave();
      if (this.isAutoSave) {
        this.autoTimer = setInterval(() => {
          if (this.isLoadContent || !this.isEdit) {
            return;
          }
          console.log('autosave doing!!!');
          this.saveNote();
        }, this.saveSeconds * 1000);
      }
    },
    autoSave() {
      this.isAutoSave = !this.isAutoSave;
      if (this.isAutoSave) {
        this.saveSeconds = 20;
      } else {
        this.saveSeconds = 0;
        this.$refs.setautosave.style.display = 'none';
      }
      SetLocalAutoSave(this.saveSeconds);
      this.startAutoSave();
    },
    checksecond(data) {
      let old = this.saveSeconds;
      this.saveSeconds = data;
      this.isShowSeconds = false;
      this.$refs.setautosave.style.display = 'none';
      SetLocalAutoSave(this.saveSeconds);
      if (old != data) {
        this.startAutoSave();
      }
    },
    showAutoSave() {
      this.$refs.setautosave.style.display = 'block';
    },
    hideAutoSave() {
      this.$refs.setautosave.style.display = 'none';
    },
    editChange(data) {
      this.isEdit = data;
      this.$emit('editchange', data);
    },
  },
  components: {
    DeleteNote,
    AboutAutoSave,
    QuillEditor,
  },
  watch: {
    content() {
      if (this.inputw.length > 8) {
        this.initwith += 5;
      }
    },
    options(n, o) {
      let quill = this.$refs.qeditor.getQuill();
      quill.root.setAttribute('data-placeholder', n.placeholder);
    },
    title() {
      let note = GetCurNote();
      if (this.title && this.title != note.title) {
        this.editChange(true);
      }
    },
  },
};
</script>

<style scoped lang="less">
.notearea-container {
  display: flex;
  flex: 1;
  height: 100%;
  position: relative;
  flex-direction: column;

  .notearea-toptool {
    position: absolute;
    right: 30px;
    top: 7px;

    .notearea-save-box {
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      max-width: 150px;

      .notearea-save-more {
        height: 26px;
        display: flex;
        height: 26px;
        position: relative;

        svg {
          font-size: 16px;
          margin-top: 5px;
          margin-right: 10px;
        }

        .notearea-save {
          width: 100px;
          height: 26px;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s linear;
          background-color: #6a95f1;

          button {
            border: none;
            background-color: transparent;
            width: 75px;
            height: 26px;
            line-height: 26px;
            color: #fff;
            text-align: center;
            border-radius: 4px 0 0 4px;
            border-right: 1px solid #8fb3ff;
            cursor: pointer;
            font-size: 14px;

            img {
              width: 12px;
              margin-top: 6px;
            }
          }

          .autosave-down {
            width: 25px;
            height: 26px;
            border-radius: 0 4px 4px 0;
            position: relative;

            .setautosave {
              width: 100px;
              position: absolute;
              background-color: #fff;
              left: -75px;
              top: 26px;
              border: 1px solid #ddd;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              display: none;
              animation: slide-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;

              span {
                width: 100%;
                display: block;
                padding-top: 8px;
                text-align: center;
              }

              .switch-seconds {
                padding: 5px 15px;

                div {
                  display: flex;
                  align-items: center;
                  cursor: pointer;

                  svg {
                    font-size: 22px;
                    margin-right: 8px;
                  }
                }

                span {
                  width: 100%;
                  line-height: 30px;
                  color: #999;
                  text-align: left;
                  padding-top: 0;

                  &.checked {
                    color: #333;
                  }
                }
              }

              .setauto-foot {
                background-color: #f8f8f8;
                padding: 8px 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 0 0 5px 5px;

                .switch {
                  width: 42px;
                  height: 18px;
                  border-radius: 18px;
                  position: relative;
                  line-height: 18px;
                  cursor: pointer;
                  font-size: 12px;

                  &.off {
                    background-color: #e8e8e8;
                    padding-left: 18px;
                    transition: all 0.3s linear;

                    i {
                      width: 14px;
                      height: 14px;
                      border-radius: 14px;
                      float: left;
                      background-color: #fff;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                      position: absolute;
                      left: 2px;
                      top: 2px;
                    }
                  }

                  &.on {
                    background-color: #3c6dd8;
                    padding-left: 6px;
                    color: #fff;
                    transition: all 0.3s linear;

                    i {
                      width: 14px;
                      height: 14px;
                      border-radius: 14px;
                      float: left;
                      background-color: #fff;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                      position: absolute;
                      right: 2px;
                      top: 2px;
                    }
                  }
                }

                svg {
                  margin: 0;
                  font-size: 16px;
                  cursor: pointer;
                }
              }
            }

            &:hover {
              background-color: #3c6dd8;
            }

            &::before,
            &::after,
            &:hover::before,
            &:hover::after {
              content: '';
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              transition: all 0.3s linear;
            }

            &::before,
            &::after {
              border-bottom: 6px solid transparent;
            }

            &::before {
              border-top: 6px solid #fff;
              top: 11px;
            }

            &::after {
              border-top: 6px solid #6a95f1;
              top: 9px;
            }

            &:hover::before,
            &:hover::after {
              border-top: 6px solid transparent;
            }

            &:hover::before {
              border-bottom: 6px solid #fff;
              top: 4px;
            }

            &:hover::after {
              border-bottom: 6px solid #3c6dd8;
              top: 6px;
            }
          }
        }
      }
    }
  }

  .btn-save {
    width: 55px;
    height: 55px;
    background-color: #3c6dd8;
    box-shadow: 0 5px 10px rgb(138 167 231 / 80%);
    border-radius: 50%;
    position: fixed;
    bottom: 30px;
    right: 30px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: none;
    cursor: pointer;
    z-index: 2;

    &.load {
      font-size: 0;
    }

    img {
      width: 25px;
      height: 25px;
    }
  }

  .editor-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 30px;
    height: calc(100% - 36px);

    #notearea-toolbar {
      border: none;
      top: 0;
      right: 0;
      left: 0;
      background: #fff;
      padding: 8px 0;
    }

    .notearea-notetitle {
      margin-top: 10px;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;

      input {
        width: 100%;
        line-height: 45px;
        font-size: 22px;
        font-weight: bold;
        border: none;
        outline: none;

        &::placeholder {
          color: #999;
          font-size: 18px;
          font-weight: normal;
        }
      }
    }
  }

  .notearea-notetags-time-box {
    padding: 0;
    margin: 0 0 10px 30px;
    background: #fff;
    align-items: center;
    display: flex;
    flex-wrap: wrap;

    .notearea-notetags-box {
      width: 100%;
      display: flex;
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      p {
        &.tag-error {
          color: #fd6464;
          font-size: 12px;
          margin: 0;
        }
      }
      .notetag-ok {
        font-weight: bold;
        color: #6a95f1;
        margin-right: 8px;
        font-size: 12px;
        border-radius: 30px;
        display: flex;
        border: 1px solid #e8e8e8;
        justify-content: center;
        align-items: center;
        padding: 3px 8px 3px 12px;
        z-index: 1;

        button {
          border: none;
          width: 16px;
          height: 16px;
          border-radius: 16px;
          margin-left: 5px;
          cursor: pointer;
          background: none;

          svg {
            font-size: 8px;
            display: block;
            margin: 4px auto;
          }
        }
      }

      .notetags {
        padding: 3px;
        align-items: center;
        margin-right: 8px;
        overflow: hidden;
        display: flex;
        transition: all 0.3s linear;
        border: 1px solid #ddd;
        border-radius: 50px;
        z-index: 1;
        font-size: 12px;
        overflow: hidden;

        // span {
        //   display: inline-block;
        //   font-size: 12px;
        //   padding: 0 5px;
        // }

        input {
          width: 60px;
          border: none;
          display: inline-block;
          padding: 0 5px;
          font-size: 12px;
          color: #3c6dd8;
          outline: none;

          &::placeholder {
            color: #999;
          }
        }

        button {
          width: 16px;
          height: 16px;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          background: none;

          svg {
            font-size: 16px;
          }
        }

        &.active {
          border: 1px solid #6a95f1;
          transition: all 0.3s linear;
        }
      }
    }
  }
}

:deep {
  .ql-container {
    border: none !important;
    color: #383838;
    font-size: 14px;
    // height: 100%;
    font-family: 'Gothic';
    max-height: calc(100% - 105px);

    .ql-editor {
      max-height: 100%;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .notearea-container {
    .notearea-toptool {
      display: none;
    }

    .btn-save {
      display: flex;
    }

    .editor-container {
      width: 90vw;
      padding: 0 5vw;
      margin-top: 3vw;

      .notearea-notetitle {
        input {
          line-height: 40px;
          padding: 0;
        }
      }

      #notearea-toolbar {
        padding: 0;
      }
    }

    .notearea-notetags-time-box {
      width: 90vw;
      padding: 10px 5vw;
      margin-left: 0;
      margin-bottom: 0;
      position: fixed;
      bottom: 0;
      .notearea-notetags-box {
        .notetag-ok,
        .notetags {
          margin-bottom: 5px;
        }
      }
    }
  }

  .hide {
    display: none !important;
  }

  .show {
    display: flex !important;
  }
}
</style>
