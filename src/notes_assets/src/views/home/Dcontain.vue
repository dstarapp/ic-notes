<template>
  <div class="container">
    <div class="contain">
      <strong class="title">{{ $t('public.title.notesTitle') }}</strong>
      <div class="notebook-box">
        <div class="notebook shadow" v-for="note in notes" :key="note.id">
          <div class="notebookTitle">
            <div class="notetitle" @click="gotonote(note)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-inotebook" />
              </svg>
              {{ note.name }}
            </div>
            <div class="noteinto" @click="gotonote(note)">
              <svg class="icon noteinto" aria-hidden="true">
                <use xlink:href="#icon-arrow-right" />
              </svg>
            </div>
          </div>
          <div class="loadingBox" v-if="note.loadingNote">
            <div class="loading">
              <div class="loader"></div>
            </div>
          </div>
          <div v-else>
            <div class="notecon">
              <dl v-for="con in note.lastNotes" :key="con.id" class="flex">
                <dt>{{ format_date(con.updateTime) }}</dt>
                <dd class="ellipsis">
                  <a href="#">{{ con.title }}</a>
                </dd>
              </dl>
            </div>
            <div class="noteitems" v-if="!note.loading && !note.loadingStat">
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-note" />
                </svg>
                {{ note.stat.noteCount }}
              </div>
              <div>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-key" />
                </svg>
                {{ note.stat.boxCount }}
              </div>
              <div v-if="note.canControll">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-canister" />
                </svg>
                {{ memory_size(note) }}
              </div>
              <div class="canister" v-else>{{ $t('note.nocontroller') }}</div>
              <div v-if="note.canControll">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fuel" />
                </svg>
                {{ cycles(note) }}
              </div>
            </div>
          </div>
        </div>
        <!-- 新建笔记本 -->
        <div class="notebook createnotebook shadow" @click="showCreate = true">
          <div class="create">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-create" />
            </svg>
            {{ $t('public.create') }}
          </div>
        </div>
      </div>
    </div>

    <div class="contain">
      <strong class="title wallet">{{ $t('public.title.walletTitle') }}</strong>
      <div class="notebook-box flex">
        <div class="wallet shadow">
          <div class="wallet-top">
            <span>{{ $t('balance.btitle') }}</span>
            <div :class="isrefresh ? 'refresh rotate' : 'refresh'" @click="refresh_wallet()">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-refresh" />
              </svg>
            </div>
          </div>
          <div class="icp ellipsis"><i>ICP</i>{{ wallet_balance() }}</div>
          <div class="icpaddress">
            <span>Address</span>
            <p>{{ wallet_address() }}</p>
            <button class="copy" :class="{ copytips: isCopy }" @click="copy">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-copy" />
              </svg>
            </button>
          </div>
          <div class="wallet-into">
            <router-link to="/home/wallet">
              <svg class="img" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="user-wallet-into" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="user" transform="translate(-611.000000, -883.000000)" fill-rule="nonzero">
                    <g transform="translate(0.000000, -1.000000)" id="center">
                      <g transform="translate(101.000000, 101.000000)">
                        <g id="wallet" transform="translate(53.000000, 514.000000)">
                          <g id="into" transform="translate(457.000000, 269.000000)">
                            <path d="M22,0 C9.85191793,0 0,9.85191793 0,22 C0,34.1480821 9.85191793,44 22,44 C34.1480821,44 44,34.1480821 44,22 C44,9.85191793 34.1480821,0 22,0 Z" fill="#3C6DD8"></path>
                            <polygon id="p" fill="#FFFFFF" points="18.8318503 33 15.6486652 29.8803128 22.8741945 22.7989174 15 15.0817963 18.1445229 12 29 22.8199679 18.8318503 33"></polygon>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="item-into">
          <div class="usercenter shadow">
            <span class="img">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-user" />
              </svg>
            </span>
            <div class="user-con">{{ $t('public.usercenter') }}</div>
            <router-link to="/home/user">
              <div class="user-into">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-arrow-into" />
                </svg>
              </div>
            </router-link>
          </div>
        </div>
        <div class="item-into"></div>
      </div>
    </div>
    <!-- 创建笔记 -->
    <Create v-if="showCreate" @close="close"></Create>
  </div>
</template>

<script>
import moment from 'moment';
import Create from './components/Create.vue';
import { GetAddress, GetBalance, LoadBalance } from '../../utils/wallet';
import { GetNoteBooks, SetCurNoteBook, HumanMemorySize, HumanCycle } from '../../utils/notes/notes';
export default {
  name: 'Dcontain',
  components: {
    Create,
  },
  data() {
    return {
      showCreate: false,
      isCopy: false,
      notes: GetNoteBooks(),
      isrefresh: false,
    };
  },
  computed: {},
  methods: {
    format_date(t) {
      return moment(t).format('HH:mm');
    },
    gotonote(note) {
      SetCurNoteBook(note.getID());
      this.$router.push({ name: 'notes', query: { id: note.getID() } });
    },
    memory_size(note) {
      return note.status ? HumanMemorySize(note.status.memory_size) : '0M';
    },
    cycles(note) {
      return note.status ? HumanCycle(note.status.cycles) : '0T';
    },
    close(data) {
      this.showCreate = data;
    },
    copy() {
      var self = this;
      this.$copyText(this.wallet_address()).then(
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
    refresh_wallet() {
      this.isrefresh = true;
      this.$nextTick(async () => {
        await LoadBalance();
        this.isrefresh = false;
      });
    },
    wallet_address() {
      return GetAddress();
    },
    wallet_balance() {
      return GetBalance();
    },
  },
};
</script>

<style scoped lang="less">
.container {
  width: calc(100% - 80px);
  height: calc(100% - 70px);
  margin-left: 80px;
  margin-top: 70px;
  overflow-y: auto;
  padding: 30px 40px;
  background-color: #eef3ff;
  min-width: 1100px;
  .title {
    padding-bottom: 30px;
    color: #000;
    font-size: 28px;
    display: block;

    &.wallet {
      margin-top: 0;
    }
  }

  .notebook-box {
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
    .notebook {
      display: flex;
      width: 31%;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 30px;
      flex-direction: column;

      .flex {
        display: flex;
      }

      .loadingBox {
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

      .notebookTitle {
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;
        align-items: center;

        .notetitle {
          height: 35px;
          line-height: 35px;
          font-size: 20px;
          font-weight: bold;
          color: #000;
          display: flex;
          align-items: center;
          flex-shrink: 0;

          svg {
            font-size: 35px;
            margin-right: 8px;
          }
        }

        .noteinto {
          font-size: 20px;
          cursor: pointer;
        }
      }

      .notecon {
        width: 100%;
        padding: 10px 0;
        min-height: 84px;

        dl {
          display: flex;
          width: 100%;
          justify-content: flex-start;
          margin: 0;

          dt {
            color: #999;
            width: 50px;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
          }

          dd {
            height: 32px;
            line-height: 32px;
            flex: 1;
            font-size: 14px;
            margin-left: 0;

            a {
              transition: all 0.3s linear;
              color: #555;
              text-decoration: none;

              &:hover {
                font-size: 15px;
                transition: all 0.3s linear;
              }
            }
          }
        }
      }

      &:last-child:nth-child(3n + 2) {
        margin-right: calc((100% - 31%) / 2);
      }
    }

    .wallet {
      display: flex;
      flex-direction: column;
      width: 31%;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 30px;
      margin-right: 30px;

      .wallet-top {
        width: 100%;
        height: 25px;
        position: relative;
        color: #555;
        font-family: Gothic;
        font-size: 14px;

        span {
          display: block;
          line-height: 25px;
          position: absolute;
          left: 0;
        }

        .refresh {
          width: 24px;
          height: 24px;
          position: absolute;
          right: 0;
          top: 3px;

          svg {
            font-size: 24px;
            cursor: pointer;
          }
        }
      }

      .icp {
        height: 35px;
        line-height: 35px;
        font-size: 34px;
        color: #000;
        font-weight: bold;
        margin: 20px 0;
        position: relative;
        padding-left: 40px;

        i {
          border-radius: 4px;
          width: 30px;
          height: 20px;
          line-height: 20px;
          background-color: #6a95f1;
          font-size: 12px;
          color: #fff;
          font-style: normal;
          margin-right: 8px;
          position: absolute;
          top: 50%;
          margin-top: -10px;
          left: 0;
          text-align: center;
        }
      }

      .icpaddress {
        display: flex;
        width: 100%;
        margin-bottom: 20px;

        span {
          font-size: 12px;
          margin-right: 15px;
          color: #999;
        }

        p {
          word-break: break-all;
          font-size: 12px;
          flex: 1;
          margin: 0;
        }
      }

      .wallet-into {
        width: 100%;
        height: 38px;

        .img {
          width: 35px;
          float: right;
          transition: all 0.3s linear;

          &:hover {
            width: 38px;
            opacity: 0.8;
            transition: all 0.3s linear;
            cursor: pointer;
          }
        }
      }
    }

    .item-into {
      width: 31%;
      display: flex;
      justify-content: space-between;

      .usercenter,
      .notice {
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 30px;
        width: 45%;
        position: relative;

        span.img {
          width: 40px;
          height: 40px;
          border-radius: 40px;
          display: block;
          background-color: #fff;

          svg {
            font-size: 24px;
            margin: 8px;
          }
        }

        .user-into {
          position: absolute;
          right: 20px;
          bottom: 30px;
          transition: all 0.3s linear;

          svg {
            font-size: 35px;
          }

          &:hover {
            bottom: 35px;
            transition: all 0.3s linear;
            cursor: pointer;
          }
        }

        &.notice {
          background-image: linear-gradient(135deg, #ffdf7d, #f2bf20);

          .notice-con {
            width: 100px;
            color: #000;
            margin-top: 30px;
            font-size: 18px;
            line-height: 30px;

            i {
              font-size: 28px;
              font-weight: bold;
              font-style: normal;
            }
          }
        }

        &.usercenter {
          background-image: linear-gradient(135deg, #1ce59e, #0fd280);

          .user-con {
            font-style: 30px;
            color: #fff;
            margin-top: 30px;
            font-size: 28px;
            line-height: 36px;
          }
        }
      }
    }

    .noteitems {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 25px;
      font-size: 12px;
      color: #999;
      line-height: 25px;

      div {
        margin-left: 25px;
        display: inline-flex;
        align-items: center;
      }

      svg {
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.createnotebook {
  width: 31%;
  padding: 20px 0;
  margin-bottom: 30px;
  border-radius: 10px;
  background-image: linear-gradient(45deg, #92b4ff, #bacfff);
  display: flex;
  align-items: center;
  transition: all 0.3s linear;
  min-height: 160px;

  .create {
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 18px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    svg {
      font-size: 60px;
      display: block;
      margin: 0 0 10px 0;
    }
  }

  &:hover {
    cursor: pointer;
    opacity: 0.9;
    box-shadow: 0 0 15px #92b4ff;
    transition: all 0.3s linear;
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .container {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 13vw;
    height: calc(100% - 13vw) !important;
    padding-top: 5vw;
    left: 0;
    top: 0;
    background: linear-gradient(135deg, #f2f6ff, #fff3e1, #e1eafd);
    overflow-y: scroll;
    max-width: 100%;
    min-width: 100%;
    overflow-x: hidden;

    .contain {
      width: 90vw;
      margin: 0 5vw;
    }

    .title {
      // margin-top: 18vw;
      font-size: (20 * 2/75rem);
      padding-bottom: 20px;
    }

    .notebook-box {
      flex-direction: column;

      .notebook {
        width: 100%;
        padding: 20px;
        margin-bottom: 2.5vh;

        .notecon {
          min-height: 0;
        }

        &.createnotebook {
          height: 100%;
          justify-content: center;
          align-items: center;
        }
      }

      .wallet {
        width: 100%;
        padding: 20px;
      }

      .item-into {
        display: none;
      }
    }
  }
}
</style>
