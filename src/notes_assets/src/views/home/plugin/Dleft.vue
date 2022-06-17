<template>
  <div class="left flex" :class="{ active: showCreate }">
    <div class="top">
      <div class="logo">
        <router-link to="/">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-logo" />
          </svg>
        </router-link>
      </div>
      <div class="left-note-bar-box" v-if="notes.length > 0">
        <div ref="menuScroll" class="left-note-bar">
          <div v-for="(note, index) in notes" :key="note.id" :class="iscur(note) ? 'note-bar cur' : 'note-bar'" @click="gotonote(note)" @mouseenter="ShowName(index)">
            <svg width="30px" height="29px" viewBox="0 0 41 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="user-notebook" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="user" transform="translate(-31.000000, -298.000000)" fill="#CCCCCC" fill-rule="nonzero">
                  <g transform="translate(0.000000, -1.000000)">
                    <g transform="translate(0.000000, 1.000000)">
                      <g id="notebook" transform="translate(31.000000, 298.000000)">
                        <path
                          d="M4.55555556,26.4150943 L8.35185185,26.4150943 L8.35185185,23.3962264 L11.3888889,23.3962264 L11.3888889,19.6226415 L0,19.6226415 L0,23.3962264 L4.55555556,23.3962264 L4.55555556,26.4150943 Z M4.55555556,16.6037736 L8.35185185,16.6037736 L8.35185185,13.5849057 L11.3888889,13.5849057 L11.3888889,9.81132075 L0,9.81132075 L0,13.5849057 L4.55555556,13.5849057 L4.55555556,16.6037736 Z M4.55555556,0.00150943396 L4.55555556,6.79245283 L8.35185185,6.79245283 L8.35185185,3.76377358 L37.2037037,3.76226415 L37.2037037,36.2264151 L8.35185185,36.2264151 L8.35185185,33.2075472 L11.3888889,33.2075472 L11.3888889,29.4339623 L0,29.4339623 L0,33.2075472 L4.55555556,33.2075472 L4.55555556,40 L41,40 L41,0 L4.55555556,0.00150943396 Z M15.1851852,9.81132075 L15.1851852,23.3962264 L31.1296296,23.3962264 L31.1296296,9.81132075 L15.1851852,9.81132075 Z M27.3333333,19.6226415 L18.9814815,19.6226415 L18.9814815,13.5849057 L27.3333333,13.5849057 L27.3333333,19.6226415 Z"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <p>{{ index + 1 }}</p>
          </div>
        </div>
        <i v-show="isShow == menu.index" :style="{ top: `${menu.top}px` }">{{ notes[menu.index] ? notes[menu.index].name : '' }}</i>
      </div>
      <div class="addnotes" @click="showCreate = true" @mouseenter="isShow = -1">
        <svg width="70px" height="70px" viewBox="0 0 70 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <filter x="-50.0%" y="-50.0%" width="200.0%" height="200.0%" filterUnits="objectBoundingBox" id="filter-1">
              <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
              <feGaussianBlur stdDeviation="5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
              <feColorMatrix values="0 0 0 0 0.541176471   0 0 0 0 0.654901961   0 0 0 0 0.905882353  0 0 0 1 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix>
              <feMerge>
                <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <g id="" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="" transform="translate(-16.000000, -648.000000)">
              <g id="" filter="url(#filter-1)" transform="translate(31.000000, 663.000000)">
                <circle id="" fill="#FFFFFF" cx="20" cy="20" r="15"></circle>
                <path
                  d="M20.0015046,-1.42108547e-14 C9.00031085,-1.42108547e-14 0,9.0006998 0,19.9979276 C0,30.9995273 9.00036763,40 20.0015046,40 C30.9998027,40 40,30.9995273 40,19.9979276 C40,9.00081336 30.9998595,-1.42108547e-14 20.0015046,-1.42108547e-14 M30.0006387,21.9989978 L21.999719,21.9989978 L21.999719,30.001746 L18.0005536,30.001746 L18.0005536,21.9989978 L9.9993499,21.9989978 L9.9993499,18.0011952 L18.0005536,18.0011952 L18.0005536,9.99816319 L21.999719,9.99816319 L21.999719,18.0011952 L30.0006387,18.0011952 L30.0006387,21.9989978 L30.0006387,21.9989978 Z"
                  fill="#3C6DD8"
                  fill-rule="nonzero"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <div class="logout" @click="logout">
        <svg width="35px" height="35px" viewBox="0 0 41 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="user-logout" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="user" transform="translate(-31.000000, -987.000000)" fill="#CCCCCC" fill-rule="nonzero">
              <g transform="translate(0.000000, -1.000000)" id="leftbar">
                <g transform="translate(0.000000, 1.000000)">
                  <g id="logout" transform="translate(31.390677, 987.500000)">
                    <path
                      d="M29.5237929,19.0476133 L29.5237924,19.0476133 C35.3096419,19.0476133 40,23.7379651 40,29.5238066 C40,35.3096482 35.3096419,40 29.5237924,40 L29.523792,40 C23.7379425,40 19.0475844,35.3096482 19.0475844,29.5238066 C19.0475844,23.7379651 23.7379425,19.0476133 29.523792,19.0476133 L29.5237929,19.0476133 Z M19.0475853,5.90532572e-07 L19.0475849,5.90532572e-07 C24.8302647,-0.00191891119 29.5196407,4.68432617 29.521561,10.4669981 C29.5221177,12.1454382 29.1191612,13.7994184 28.3466539,15.2895372 L28.3466533,15.2895373 C20.4863838,15.9335499 14.6364272,22.8276536 15.2804452,30.6879125 C15.4993073,33.3591594 16.4655169,35.9149154 18.0685753,38.0628594 C16.5257178,38.0704785 14.7638112,38.0952403 12.9619224,38.0952403 L11.9733508,38.0933355 C6.04192093,38.057145 0,37.6742882 0,35.5219099 C0,29.782854 5.7714298,24.921922 13.6742886,23.3790667 C14.3523825,23.0400193 14.6914317,22.4514472 14.6914317,21.6152607 C14.6914317,20.7676411 14.2190521,19.9619277 13.2761948,19.2019286 L13.2761948,19.2019286 C10.3374665,17.2678192 8.56922952,13.9847917 8.57141702,10.4667154 L8.57141695,10.4669067 C8.57341418,4.68423472 13.2628465,-0.00192063025 19.0455263,5.90532572e-07 C19.0461621,5.90532572e-07 19.0467979,5.90532572e-07 19.0474337,5.90532572e-07 L19.0475853,5.90532572e-07 Z M29.508525,24.4533214 L29.3104299,24.5866547 L29.1313821,24.7466545 L29.1313822,24.7466544 C28.5151946,25.3603546 28.3929178,26.3134785 28.8342393,27.0628437 L28.9675728,27.2609386 L30.3428097,29.0380794 L24.761871,29.0380794 L24.5390138,29.0514127 L24.5390137,29.0514127 C23.4944064,29.1756657 22.7483124,30.1232151 22.8725669,31.167821 C22.9764911,32.0415209 23.6653171,32.730346 24.5390182,32.83427 L24.7618754,32.8476033 L34.2228149,32.8476033 L34.4342435,32.8361747 L34.4342436,32.8361747 C35.4797706,32.7199182 36.2330922,31.778109 36.1168377,30.7325834 C36.0864368,30.4591801 35.9971765,30.1956063 35.8551965,29.9599905 L35.7294822,29.7790385 L31.9828163,24.9295351 L31.8247211,24.7504876 L31.8247211,24.7504875 C31.2110201,24.1343007 30.2578949,24.0120241 29.5085286,24.453345 L29.508525,24.4533214 Z"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <span>{{ $t('public.logout') }}</span>
      </div>
    </div>
    <div class="icBox">
      <img src="../../../assets/svg/ic.svg" class="ic" />
    </div>
    <Create v-if="showCreate" @close="close"></Create>
    <!-- <KeySyncRequest @close="closeKeySync"></KeySyncRequest> -->
    <!-- <KeySyncRequest v-if="showKeySync" @close="closeKeySync"></KeySyncRequest> -->
  </div>
</template>

<script>
import { NotesIdentity, GetNotesKey } from '../../../utils/identity';
import { GetNoteBooks, GetCurNoteBook, SetCurNoteBook } from '../../../utils/notes/notes';
import { GetDevices, CheckUnsyncList } from '../../../utils/notes/sync';
import Create from '../components/Create.vue';
import KeySyncRequest from './KeySyncRequest.vue';
export default {
  name: 'Dleft',
  data() {
    return {
      menu: {
        top: 0,
        index: 0,
      },
      isShow: -1,
      showCreate: false,
      isLoginout: false,
      showKeySync: false,
      showNoteID: '',
      notes: GetNoteBooks(),
      curnote: GetCurNoteBook(),
    };
  },
  methods: {
    logout() {
      this.$emit('logout', true);
    },
    iscur(note) {
      return this.curnote.getID() == note.getID();
    },
    gotonote(note) {
      SetCurNoteBook(note.getID());
      this.$router.push({ name: 'notes', query: { id: note.getID() } });
    },
    close(data) {
      this.showCreate = data;
    },
    closeLogout(data) {
      this.isLoginout = data;
    },
    closeKeySync(data) {
      this.$emit('keySync', data);
      // this.showKeySync = data
    },
    clickLogout() {
      this.isLoginout = true;
    },
    ShowName(index) {
      let dom = this.$refs.menuScroll;
      if (this.isShow != index) {
        this.isShow = index;
        this.menu.index = index;
        this.menu.top = 15 + index * 90 - dom.scrollTop;
      }
    },
  },
  mounted() {
    // this.$nextTick(async () => {
    //   // this.showKeySync = await CheckUnsyncList()
    //   // this.showKeySync = true
    //   this.$emit('keySync', true)
    // })
  },
  components: {
    Create,
    KeySyncRequest,
  },
};
</script>

<style scoped lang="less">
.left {
  width: 80px;
  position: fixed;
  border-right: 1px solid #e8e8e8;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  &.active {
    z-index: 25;
  }
  svg {
    font-size: 40px;
    margin: auto;
    margin-top: 20px;
    display: block;
  }

  .logo,
  .logout {
    width: 100%;
    height: 80px;
    cursor: pointer;
  }

  .left-note-bar-box {
    height: auto;
    position: relative;
    .left-note-bar {
      text-align: center;
      -webkit-overflow-scrolling: touch;
      max-height: calc(100vh - 345px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
    }

    .note-bar {
      position: relative;
      width: 100%;
      cursor: pointer;
      padding: 15px 0;
      p {
        display: block;
        margin: 8px 20px;
        padding: 1px 10px;
        background-color: #ccc;
        text-align: center;
        color: #fff;
        border-radius: 25px;
        font-size: 12px;
      }
      svg {
        margin-top: 0;
      }
      &.cur {
        p,
        svg g {
          background-color: #6a95f1;
          fill: #6a95f1;
        }
      }

      &:hover {
        p {
          background-color: #6a95f1;
          transition: background-color 0.3s linear;
        }
        svg g {
          fill: #6a95f1;
          transition: all 0.1s linear;
        }
      }
    }

    i {
      position: absolute;
      border-radius: 3px;
      background-color: #333;
      color: #fff;
      padding: 3px 6px;
      white-space: nowrap;
      z-index: 9;
      font-style: normal;
      font-size: 12px;
      left: 60px;
      margin-top: 5px;
      display: none;

      &::after {
        content: ' ';
        width: 0;
        height: 0;
        border-right: 6px solid #333;
        border-bottom: 6px solid transparent;
        border-top: 6px solid transparent;
        position: absolute;
        left: -4px;
      }
    }

    &:hover {
      i {
        display: block;
      }
    }
  }

  .logout {
    margin-top: 20px;
    margin-bottom: 40px;
    height: 40px;
    text-align: center;
    span {
      width: 100%;
      line-height: 22px;
      text-align: center;
      display: block;
      color: #999;
      font-size: 12px;
    }

    &:hover {
      span {
        color: #6a95f1;
      }
      svg g {
        fill: #6a95f1;
        transition: all 0.1s linear;
        cursor: pointer;
      }
    }
  }

  .addnotes {
    cursor: pointer;

    svg g path {
      transition: all 0.3s linear;
    }

    &:hover {
      svg g path {
        fill: #6a95f1;
        transition: all 0.3s linear;
      }
    }
  }

  .top {
    display: flex;
    flex-direction: column;
    flex: 4;
    justify-content: space-between;
  }

  .icBox {
    flex: 2;
    display: flex;
    align-items: flex-end;
    .ic {
      width: 35px;
      margin: 0 auto 10px auto;
    }
  }
}
</style>
