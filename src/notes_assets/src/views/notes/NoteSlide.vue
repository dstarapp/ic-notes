<template>
  <div class="noteslide-container" :class="isShow ? 'hide' : 'show'">
    <div class="noteslide-addbtn-box">
      <div class="noteslide-addbtn add-note" @click="newNote">
        {{ $t('note.btnName.newNote') }}
      </div>
      <div class="noteslide-addbtn add-password" @click="showPasswordBox = true">
        {{ $t('note.btnName.newPwd') }}
      </div>
    </div>
    <div class="noteslide-screening">
      <div class="screening-box">
        <div @click="typeClick('')" class="screening-items" :class="ntype == '' ? 'current' : ''">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-allnote" />
          </svg>
          {{ curnote.stat.noteCount + curnote.stat.boxCount }}
        </div>
        <div @click="typeClick('Note')" class="screening-items" :class="ntype == 'Note' ? 'current' : ''">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-note" />
          </svg>
          {{ curnote.stat.noteCount }}
        </div>
        <div @click="typeClick('BoxItem')" class="screening-items" :class="ntype == 'BoxItem' ? 'current' : ''">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-key" />
          </svg>
          {{ curnote.stat.boxCount }}
        </div>
      </div>
      <div class="note-filter" @mouseover="filterstatus = true" @mouseleave="filterstatus = false">
        <svg width="20px" height="16px" viewBox="0 0 28 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-481.000000, -207.000000)" fill="#CCCCCC" fill-rule="nonzero">
              <g transform="translate(329.000000, 207.609756)">
                <g transform="translate(152.529449, 0.000000)">
                  <path
                    d="M21.9728685,0.2914615 L21.9728685,17.0170658 L25.3099344,13.7053681 C25.4244443,13.5918112 25.6098665,13.5918112 25.7243776,13.7053681 L27.384835,15.3551986 C27.4991233,15.4689756 27.4991233,15.6532112 27.384835,15.7669894 C23.6884965,19.9223037 21.7871652,22 21.6795442,22 L19.3301432,22 C19.1681366,22 19.0368012,21.8695114 19.0368012,21.7085416 L19.0368012,0.291465379 C19.0368012,0.131027928 19.1686723,0 19.3301431,0 L21.6795442,0 C21.8410005,0 21.9728685,0.131024049 21.9728685,0.2914615 Z M15,18.9851116 L15,21.1242763 C15,21.2719547 14.9160535,21.3916722 14.8124999,21.3916722 L0.187500092,21.3916722 C0.0839468068,21.3916722 0,21.2719551 0,21.1242763 L0,18.9851116 C0,18.8380438 0.084374999,18.7177157 0.187500089,18.7177157 L14.8124999,18.7177157 C14.915625,18.7177157 15,18.8380438 15,18.9851116 Z M15,10.963239 L15,13.1024037 C15,13.2500822 14.9160535,13.3697996 14.8124999,13.3697996 L0.187500092,13.3697996 C0.0839468068,13.3697996 0,13.2500826 0,13.1024037 L0,10.963239 C0,10.8161712 0.084374999,10.6958431 0.187500089,10.6958431 L14.8124999,10.6958431 C14.915625,10.6958431 15,10.8161712 15,10.963239 Z M9.37500007,2.94136646 L9.37500007,5.08053117 C9.37500007,5.22820961 9.29105354,5.34792705 9.18749998,5.34792705 L0.187500092,5.34792705 C0.0839468068,5.34792705 0,5.22821 0,5.08053117 L0,2.94136646 C0,2.79429866 0.084374999,2.67397058 0.187500089,2.67397058 L9.18749998,2.67397058 C9.29062507,2.67397058 9.37500007,2.79429866 9.37500007,2.94136646 Z"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <transition name="slidedown">
          <ul v-show="filterstatus">
            <li @click="sortClick('TimeDesc')">{{ $t('note.sort.timedesc') }}</li>
            <li @click="sortClick('TimeAsc')">{{ $t('note.sort.timeasc') }}</li>
            <li @click="sortClick('Like')">{{ $t('note.sort.collection') }}</li>
          </ul>
        </transition>
      </div>
    </div>

    <!-- 没有数据 -->
    <div v-if="notelist.length <= 0" class="no-note">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-no-note" />
      </svg>
      {{ $t('note.empty') }}
    </div>

    <!-- 列表 -->
    <div v-else class="noteslide-list-box" @scroll="scrollList">
      <div class="noteslide-list" v-for="(thenote, index) in notelist" :key="index" :class="isCurrent(thenote) ? 'current' : ''" @mouseover="Check(thenote.id)" @mouseleave="Hide(thenote.id)" @click="clickNote(thenote)">
        <div class="contain">
          <div class="noteslide-list-title">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="isNote(thenote) ? '#icon-note' : '#icon-key'" />
            </svg>
            <span :class="isNote(thenote) ? 'note' : 'password'">{{ thenote.title }}</span>
          </div>
          <div v-if="thenote.like" class="noteslide-list-collection"></div>
          <transition name="slideleft">
            <div v-if="thenote.id == show" class="noteslide-list-operation hide">
              <span class="note-collection" @click.stop="collection(thenote)">
                <svg v-if="thenote.like" width="16px" height="15px" viewBox="0 0 19 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g transform="translate(-493.000000, -270.000000)" fill="#FFBC00" fill-rule="nonzero">
                      <g id="list" transform="translate(125.000000, 260.000000)">
                        <g id="收藏" transform="translate(368.000000, 10.000000)">
                          <path
                            d="M9.5,0 C8.96942539,0 8.48582627,0.292826095 8.25922485,0.75138891 L6.10927624,5.11602933 L1.1655069,5.83149906 C0.657035126,5.90332232 0.23423061,6.24586433 0.0711896927,6.70719 C-0.0918526531,7.17127853 0.0297381935,7.68509032 0.388984044,8.03315723 L4.01183883,11.5745928 L3.1717575,16.4806634 C3.08609126,16.9751393 3.30440214,17.472376 3.73549618,17.762431 C3.97315098,17.9198896 4.24949363,18 4.52583627,18 C4.75796336,18 4.98456478,17.9447514 5.18905944,17.8370165 L9.5,15.566291 L13.8109402,17.8370165 C14.0154349,17.941989 14.2420343,18 14.4741634,18 C14.7532699,18 15.0296126,17.9198896 15.2645035,17.762431 C15.6928357,17.472376 15.9111456,16.9779001 15.8282422,16.4806634 L14.9881609,11.5745928 L18.6110157,8.03591192 C18.9702617,7.68784502 19.091853,7.17403323 18.92881,6.7099447 C18.7657677,6.24585617 18.3429625,5.90607783 17.8344928,5.83425376 L12.8907235,5.11602117 L10.7407748,0.751380748 C10.5169373,0.292817933 10.0333382,0 9.5,0"
                            id="路径"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>

                <svg v-if="!thenote.like" width="16px" height="15px" viewBox="0 0 19 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g transform="translate(-381.000000, -284.000000)" fill="#333333" fill-rule="nonzero">
                      <g transform="translate(125.000000, 260.000000)">
                        <path
                          d="M270.341139,42 C270.083219,42 269.823771,41.9382065 269.584183,41.8131123 L265.556504,39.7056016 C265.501508,39.6764632 265.4348,39.6764632 265.381078,39.7045968 L261.337104,41.7832203 C260.789183,42.065059 260.138908,42.0168299 259.640127,41.6561165 C259.140836,41.2959055 258.897174,40.6988194 259.003601,40.0979653 L259.791111,35.667169 C259.801804,35.6068827 259.781945,35.5445868 259.737897,35.5021351 L256.483979,32.3499121 C256.042994,31.9226325 255.8887,31.2974127 256.081949,30.7181613 C256.275198,30.1381562 256.775762,29.7251947 257.3881,29.639789 L261.901829,29.0092941 C261.963954,29.0005024 262.017168,28.9630746 262.04492,28.9083145 L264.077728,24.8814368 C264.352452,24.3376036 264.904957,24 265.520604,24 L265.526715,24 C266.145163,24.0022607 266.698176,24.3441346 266.969591,24.8924893 L268.972355,28.932429 C268.999598,28.9876915 269.053066,29.0261241 269.114936,29.0356694 L273.624083,29.6988194 C274.234893,29.7884953 274.732401,30.2047224 274.921322,30.7849786 C275.110752,31.3657372 274.952385,31.9904547 274.50809,32.4149711 L271.231002,35.5430796 L271.231002,35.5430796 C271.186204,35.5859849 271.165643,35.6478729 271.176006,35.7086159 L271.930416,40.1446873 C272.03226,40.7465461 271.784015,41.3413715 271.282942,41.6978146 C271.001343,41.898518 270.672387,42 270.341139,42 L270.341139,42 Z M265.467136,38.2798292 C265.727093,38.2798292 265.986795,38.3416227 266.223074,38.4654609 L270.251262,40.5729716 C270.33732,40.617684 270.406829,40.5908063 270.450876,40.559156 C270.494414,40.528008 270.543045,40.4714896 270.52675,40.3762874 L269.77234,35.9404672 C269.684754,35.4250188 269.859926,34.8990203 270.241077,34.5342879 L273.518165,31.4064305 C273.588183,31.3396132 273.583091,31.26526 273.566287,31.214519 C273.549992,31.1642803 273.510272,31.1012308 273.414284,31.0869128 L268.903864,30.4237629 L268.903864,30.4237629 C268.379151,30.3461188 267.926681,30.0189023 267.693702,29.5486059 L265.690938,25.5086661 C265.648418,25.4222557 265.575091,25.4036674 265.521368,25.4036674 L265.520349,25.4036674 C265.467136,25.4036674 265.394317,25.4215021 265.351288,25.5069078 L263.31848,29.5337855 C263.081693,30.0025119 262.62645,30.3265511 262.100425,30.3993971 L257.587205,31.029892 C257.490962,31.0432052 257.450479,31.1062547 257.43342,31.1564933 C257.41687,31.2072343 257.411269,31.2813363 257.480778,31.3484049 L260.734187,34.5001256 C261.112538,34.866114 261.28389,35.3931173 261.19274,35.9088169 L260.40523,40.3398643 C260.388681,40.4345642 260.436802,40.491585 260.48034,40.5229841 C260.523879,40.5546345 260.593897,40.5822657 260.679446,40.5380557 L264.72291,38.4594323 L264.72291,38.4594324 C264.952712,38.3413274 265.208021,38.2797137 265.467136,38.2798293 L265.467136,38.2798292 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span class="note-settop">
                <svg width="14px" height="14px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" v-if="!thenote.topTime" @click.stop="settop(thenote)">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g fill-rule="nonzero">
                      <path
                        d="M3.43506,10.1176276 C3.14448006,10.4189824 3.36040996,10.9177837 3.78157606,10.9177837 L6.35546034,10.9177837 C6.84554101,10.9173344 7.24319749,11.3098073 7.24365197,11.7943969 L7.24365233,16.5371777 C7.24365225,17.0214503 7.64043892,17.4141552 8.13019875,17.4146067 L10.4686166,17.4146067 C10.9586972,17.4149413 11.3562612,17.0223776 11.3566025,16.537788 L11.3566027,11.7950076 C11.3566028,11.3104179 11.7538912,10.9175809 12.2439718,10.9175809 L14.8217634,10.9175809 C15.2425182,10.9175809 15.4592707,10.419593 15.1688964,10.1180348 L9.94915119,4.68531036 C9.61458532,4.33707268 9.0578646,4.32295252 8.70568295,4.65376999 C8.69519116,4.6636253 8.68494689,4.67373512 8.67495962,4.68409033 L3.43506,10.1176276 Z"
                        stroke="#333333"
                        stroke-width="1.11428571"
                      ></path>
                      <polygon fill="#333333" points="0 0 18 0 18 2.09992486 0 2.09992486"></polygon>
                    </g>
                  </g>
                </svg>
                <svg width="14px" height="14px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" v-else @click.stop="settop(thenote)">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g transform="translate(-422.000000, -284.000000)" fill="#6A95F1" fill-rule="nonzero">
                      <g transform="translate(125.000000, 260.000000)">
                        <g transform="translate(297.000000, 24.000000)">
                          <path
                            d="M0,0 L18,0 L18,2.09992486 L0,2.09992486 L0,0 Z M8.31599945,3.91364974 L2.58299983,9.92587435 C2.26507485,10.2593243 2.50132484,10.8112493 2.96212481,10.8112493 L5.77822462,10.8112493 L5.77822463,10.8112493 C6.31442435,10.8107522 6.74950232,11.2450245 6.74999957,11.7812242 C6.74999978,11.7814494 6.74999991,11.7816745 6.74999996,11.7818997 L6.74999996,17.0291243 L6.74999996,17.0291246 C6.74999988,17.5649733 7.18412618,17.9995023 7.71997489,17.9999998 L10.2784497,17.9999998 L10.2784497,17.9999998 C10.8146494,18.0003722 11.2496261,17.5659993 11.2499996,17.0297996 C11.2499998,17.0295746 11.2499998,17.0293496 11.2499998,17.0291246 L11.2499998,11.7819 L11.2499998,11.7818998 C11.2499999,11.2457001 11.6846751,10.8110249 12.2208748,10.8110249 L15.0412496,10.8110249 C15.5015996,10.8110249 15.7387496,10.2599999 15.4210496,9.92632493 L9.71009995,3.91500032 L9.71009997,3.91500035 C9.34404974,3.52967437 8.73493878,3.51405037 8.34961506,3.88010082 C8.33813594,3.89100574 8.32692763,3.90219229 8.31600051,3.91365035 L8.31599945,3.91364974 Z"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span class="note-delete" @click.stop="notedelete(thenote)">
                <svg width="14px" height="14px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g transform="translate(-671.000000, -185.000000)" fill="#333333" fill-rule="nonzero">
                      <g transform="translate(650.000000, 49.500000)">
                        <g transform="translate(0.000000, 20.500000)">
                          <g transform="translate(21.000000, 115.000000)">
                            <path
                              d="M7.36243492,14.935883 C7.81417701,14.935883 8.18181818,14.5939258 8.18181818,14.1687289 L7.36243492,6.51068616 C7.36243492,6.08773903 6.99719664,5.74353206 6.54305166,5.74353206 C6.08890669,5.74353206 5.7236684,6.08548931 5.7236684,6.51068616 L6.54305166,14.1687289 C6.54545455,14.591676 6.91069283,14.935883 7.36243492,14.935883 Z M17.1782139,1.91451069 L11.4545455,1.91451069 L11.4545455,1.53205849 C11.4545455,0.686164229 10.721666,0 9.81818182,0 L8.18181818,0 C7.278334,0 6.54545455,0.686164229 6.54545455,1.53205849 L6.54545455,1.91451069 L0.81938326,1.91451069 C0.367641169,1.91451069 0,2.25646794 0,2.68166479 C0,3.10461192 0.365238286,3.4488189 0.81938326,3.4488189 L17.1806167,3.4488189 C17.6323588,3.4488189 18,3.10686164 18,2.68166479 C18,2.25646794 17.6323588,1.91451069 17.1782139,1.91451069 Z M9.81818182,1.91451069 L8.18181818,1.91451069 L8.18181818,1.53205849 L9.81818182,1.53205849 L9.81818182,1.91451069 Z M15.628354,4.22497188 C15.1525831,4.22497188 14.763316,4.57592801 14.74169,5.01687289 L12.927513,16.4679415 L5.07729275,16.4679415 L3.25590709,4.98087739 L3.24629555,4.98087739 C3.20304365,4.55793026 2.82338807,4.22497188 2.36443732,4.22497188 C1.90068082,4.22497188 1.52102523,4.55568054 1.48257909,4.98087739 L1.45134161,4.98087739 L3.12855427,16.920135 C3.13576292,16.8571429 3.13095715,16.7874016 3.11653985,16.7109111 C3.2390869,17.4420697 3.91670004,18 4.73127753,18 L13.2903484,18 C14.1097317,18 14.7873448,17.4375703 14.9050861,16.7064117 C14.8954746,16.7559055 14.8930717,16.8008999 14.8930717,16.848144 L16.555867,4.97862767 L16.5126151,4.97862767 C16.4669604,4.55568054 16.0897076,4.22497188 15.628354,4.22497188 L15.628354,4.22497188 Z M11.4545455,14.1687289 L12.2739287,6.51068616 C12.2739287,6.08773903 11.9086904,5.74353206 11.4545455,5.74353206 C11.0004005,5.74353206 10.6351622,6.08548931 10.6351622,6.51068616 L9.81577893,14.1687289 C9.81577893,14.591676 10.1810172,14.935883 10.6351622,14.935883 C11.0869043,14.935883 11.4545455,14.591676 11.4545455,14.1687289 Z"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </div>
          </transition>
          <span class="note-delete isM" @click.stop="notedelete(thenote)">
            <svg width="14px" height="14px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-671.000000, -185.000000)" fill="#333333" fill-rule="nonzero">
                  <g transform="translate(650.000000, 49.500000)">
                    <g transform="translate(0.000000, 20.500000)">
                      <g transform="translate(21.000000, 115.000000)">
                        <path
                          d="M7.36243492,14.935883 C7.81417701,14.935883 8.18181818,14.5939258 8.18181818,14.1687289 L7.36243492,6.51068616 C7.36243492,6.08773903 6.99719664,5.74353206 6.54305166,5.74353206 C6.08890669,5.74353206 5.7236684,6.08548931 5.7236684,6.51068616 L6.54305166,14.1687289 C6.54545455,14.591676 6.91069283,14.935883 7.36243492,14.935883 Z M17.1782139,1.91451069 L11.4545455,1.91451069 L11.4545455,1.53205849 C11.4545455,0.686164229 10.721666,0 9.81818182,0 L8.18181818,0 C7.278334,0 6.54545455,0.686164229 6.54545455,1.53205849 L6.54545455,1.91451069 L0.81938326,1.91451069 C0.367641169,1.91451069 0,2.25646794 0,2.68166479 C0,3.10461192 0.365238286,3.4488189 0.81938326,3.4488189 L17.1806167,3.4488189 C17.6323588,3.4488189 18,3.10686164 18,2.68166479 C18,2.25646794 17.6323588,1.91451069 17.1782139,1.91451069 Z M9.81818182,1.91451069 L8.18181818,1.91451069 L8.18181818,1.53205849 L9.81818182,1.53205849 L9.81818182,1.91451069 Z M15.628354,4.22497188 C15.1525831,4.22497188 14.763316,4.57592801 14.74169,5.01687289 L12.927513,16.4679415 L5.07729275,16.4679415 L3.25590709,4.98087739 L3.24629555,4.98087739 C3.20304365,4.55793026 2.82338807,4.22497188 2.36443732,4.22497188 C1.90068082,4.22497188 1.52102523,4.55568054 1.48257909,4.98087739 L1.45134161,4.98087739 L3.12855427,16.920135 C3.13576292,16.8571429 3.13095715,16.7874016 3.11653985,16.7109111 C3.2390869,17.4420697 3.91670004,18 4.73127753,18 L13.2903484,18 C14.1097317,18 14.7873448,17.4375703 14.9050861,16.7064117 C14.8954746,16.7559055 14.8930717,16.8008999 14.8930717,16.848144 L16.555867,4.97862767 L16.5126151,4.97862767 C16.4669604,4.55568054 16.0897076,4.22497188 15.628354,4.22497188 L15.628354,4.22497188 Z M11.4545455,14.1687289 L12.2739287,6.51068616 C12.2739287,6.08773903 11.9086904,5.74353206 11.4545455,5.74353206 C11.0004005,5.74353206 10.6351622,6.08548931 10.6351622,6.51068616 L9.81577893,14.1687289 C9.81577893,14.591676 10.1810172,14.935883 10.6351622,14.935883 C11.0869043,14.935883 11.4545455,14.591676 11.4545455,14.1687289 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </span>
        </div>
        <div class="noteslide-list-other">
          <div class="current-note-tagbox">
            <div v-for="(tag, idx) in thenote.tags" :key="idx" class="current-note-tag" :class="isNote(thenote) ? 'note' : 'password'">
              <a href="javascript:void()">#{{ tag }}</a>
            </div>
          </div>
          <div class="current-note-date">{{ format_date(thenote.updateTime) }}</div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="loader"></div>
    </div>
  </div>
  <!-- 删除笔记 -->
  <DeleteNote v-if="showDeleteNote" :did="deleteId" @close="close"></DeleteNote>
  <!-- 密码箱 -->
  <PasswordBox v-if="showPasswordBox" @close="close"></PasswordBox>
  <ViewPassword v-if="showPwd" @close="close"></ViewPassword>
  <DeletePassword v-if="showDeletePassword" :did="deleteId" @close="closePass"></DeletePassword>
</template>

<script>
import _ from 'lodash';
import DeleteNote from './components/DeleteNote.vue';
import PasswordBox from './components/PasswordBox.vue';
import ViewPassword from './components/ViewPassword.vue';
import DeletePassword from './components/DeletePassword.vue';
import moment from 'moment';
import { GetShowNotes, NTYPE_BOXITEM, NTYPE_NOTE, GetNoteData, SetCurNote, SetCurBox, LoadNotes, GetCurNote, LikeNote, TopingNote } from '../../utils/notes/notebook';
import { GetCurNoteBook } from '../../utils/notes/notes';
export default {
  name: 'NoteSlide',
  props: ['isShow'],
  emits: ['nextpage', 'newnote', 'clicknote'],
  data() {
    return {
      showDeleteNote: false,
      showPasswordBox: false,
      showPwd: false,
      showDeletePassword: false,
      filterstatus: false,
      tagstatus: false,
      show: 0,
      notelist: GetShowNotes(),
      // stat: GetNoteStat(),
      curnote: GetCurNoteBook(),
      loading: false,
      sort: 'TimeDesc',
      ntype: '',
      // notelist: [
      //   { id: 1, title: 'Learn Git and GitHub without any code!', tags: '#Dstar', notedate: '20:00 15/11', leixing: '0', collection: '1' },
      //   { id: 2, title: 'Discover interesting projects and people to populate your personal news feed.', tags: '#github', notedate: '19:56 15/11', leixing: '0', collection: '0' },
      //   { id: 3, title: 'developers superpower', tags: '#developers', notedate: '9:48 13/11', leixing: '0', collection: '0' },
      //   { id: 4, title: 'https://github.com/coolmanj/Dstar', tags: '#web', notedate: '12:24 12/11', leixing: '1', collection: '0' },
      //   { id: 5, title: 'Your news feed helps you keep up with recent activity on repositories', tags: '#mynotes', notedate: '19:56 15/11', leixing: '0', collection: '0' },
      //   { id: 6, title: 'https://twitter.com/DstarApp', tags: '#imporant', notedate: '12:24 12/11', leixing: '1', collection: '0' },
      // ],
      cstatus: false,
      deleteId: 0,
    };
  },
  mounted() {
    this.$watch(
      () => _.cloneDeep(this.curnote),
      (n, o) => {
        if (n.id !== o.id) {
          this.ntype = '';
          this.sort = 'TimeDesc';
        }
      },
      { deep: true }
    );
  },
  methods: {
    format_date(t) {
      return moment(t).format('HH:mm DD/MM');
    },
    isNote(note) {
      return note && note.ntype == NTYPE_NOTE;
    },
    isCurrent(note) {
      let cur = GetCurNote();
      return cur && cur.id == note.id;
    },
    Check(id) {
      if (this.show != id) {
        this.show = id;
      }
    },
    Hide(id) {
      if (this.show == id) {
        this.show = 0;
      }
    },
    scrollList({ target: { scrollTop, clientHeight, scrollHeight } }) {
      console.log('scroll bottom, load more!', scrollTop, clientHeight, scrollHeight);
      if (scrollTop + clientHeight < scrollHeight - 1) {
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$emit('nextpage', true);
      this.$nextTick(async () => {
        await LoadNotes(false, this.ntype, this.sort);
        this.loading = false;
      });
    },
    typeClick(ntype) {
      this.loading = true;
      this.$nextTick(async () => {
        this.ntype = ntype;
        await LoadNotes(true, this.ntype, this.sort);
        this.loading = false;
      });
    },
    sortClick(sort) {
      this.loading = true;
      this.$nextTick(async () => {
        this.sort = sort;
        await LoadNotes(true, this.ntype, this.sort);
        this.loading = false;
      });
    },
    close(data) {
      this.showDeleteNote = data;
      this.showPasswordBox = data;
      this.showPwd = data;
    },
    closePass(data) {
      this.showDeletePassword = false;
    },
    newNote() {
      console.log('click new note');
      this.$emit('newnote', true);
    },
    clickNote(note) {
      if (note.ntype == NTYPE_BOXITEM) {
        this.showPassword(note);
        return;
      } else {
        this.$emit('clicknote', note);
      }
    },
    showPassword(note) {
      SetCurBox(note.id);
      this.showPwd = true;
    },
    collection(note) {
      note.like = !note.like;
      this.$nextTick(async () => {
        await LikeNote(note.id, note.like);
      });
    },
    settop(note) {
      console.log(note.id, 'settop', note.topTime);
      let top = note.topTime ? false : true;
      this.$nextTick(async () => {
        await TopingNote(note.id, top);
      });
    },
    notedelete(note) {
      this.deleteId = note.id;
      if (note.ntype == NTYPE_BOXITEM) {
        this.showDeletePassword = true;
      } else {
        this.showDeleteNote = true;
      }
    },
  },
  components: {
    DeleteNote,
    PasswordBox,
    ViewPassword,
    DeletePassword,
  },
};
</script>

<style scoped lang="less">
.noteslide-container {
  width: 300px;
  border-right: 1px solid #e8e8e8;
  padding: 0 20px;
  height: 100%;
  min-width: 300px;

  .noteslide-addbtn-box {
    width: 100%;
    margin-bottom: 15px;
    display: flex;
    margin-top: 20px;

    .noteslide-addbtn {
      flex: 1;
      height: 40px;
      border-radius: 6px;
      text-align: center;
      font-weight: bold;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s linear;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;

      &.add-note {
        background-color: #6a95f1;
        &:hover {
          transition: all 0.3s linear;
          background-color: #3c6dd8;
          box-shadow: 0 0 10px #bcd1ff;
        }
      }

      &.add-password {
        background-color: #f2bf20;
        margin-left: 20px;
        &:hover {
          transition: all 0.3s linear;
          background-color: #e9b001;
          box-shadow: 0 0 10px #ffd964;
        }
      }
    }
  }

  .noteslide-screening {
    width: 100%;
    margin-bottom: 15px;
    display: flex;

    .screening-box {
      display: flex;
      height: 25px;
      flex: 1;
      .screening-items {
        display: flex;
        border-radius: 30px;
        padding: 0 8px;
        line-height: 25px;
        margin-right: 3px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: #999;
        transition: all 0.3s linear;
        position: relative;
        font-size: 14px;

        svg {
          font-size: 18px;
          margin-right: 5px;
        }

        &.current,
        &:hover {
          cursor: pointer;
          background-color: #eeeeee;
          color: #333;
          transition: all 0.3s linear;
        }
      }
    }

    .note-filter {
      width: 40px;
      position: relative;
      height: 25px;
      text-align: right;
      ul {
        margin: 0;
        position: absolute;
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid #ddd;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        top: 25px;
        z-index: 99;
        padding: 5px 0;
        right: 0;
        li {
          line-height: 32px;
          padding-left: 15px;
          padding-right: 15px;
          white-space: nowrap;
          transition: all 0.3s linear;
          font-size: 12px;
          list-style: none;

          &:hover {
            background-color: #d5e2ff;
            transition: all 0.3s linear;
            cursor: pointer;
          }
        }
      }
      svg {
        margin-top: 4px;
      }

      &:hover svg g {
        fill: #333;
      }
    }
  }

  .no-note {
    color: #999;
    height: auto;
    max-height: calc(100% - 130px);
    display: block;
    text-align: center;
    padding-top: 40%;
    color: #999;
    font-size: 14px;

    svg {
      display: block;
      margin: 10px auto;
      font-size: 80px;
    }
  }

  .noteslide-list-box {
    width: 100%;
    height: auto;
    max-height: calc(100% - 130px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .noteslide-list {
      padding: 10px;
      margin-bottom: 5px;

      p {
        width: 100%;
        max-height: 45px;
        overflow: hidden;
        color: #999;
        font-size: 12px;
        margin: 8px 0;
      }

      .isM {
        display: none;
      }

      .contain {
        display: flex;
        position: relative;
        width: 100%;

        .noteslide-list-title {
          line-height: 16px;
          color: #333;
          padding-right: 5px;
          // flex: 1;
          display: inline-flex;
          svg {
            font-size: 18px;
            margin-right: 5px;
            width: 18px;
          }
          span {
            flex: 1;
            line-height: 16px;
            color: #333;
            font-size: 14px;
            word-break: break-word;
          }
        }

        .noteslide-list-collection {
          width: 16px;
          height: 16px;
          background: url('../../assets/icon-collection-active.svg') no-repeat right top;
          background-size: 14px;
        }

        .noteslide-list-operation {
          position: absolute;
          right: 0;
          height: 18px;
          background-color: #f5f8ff;
          top: 0;

          .note-delete {
            cursor: pointer;
            margin-left: 10px;

            &:hover {
              svg {
                g {
                  fill: #f19c8e;
                }
              }
            }
          }

          .note-settop {
            cursor: pointer;
            margin-left: 10px;

            &:hover {
              svg {
                g {
                  path {
                    stroke: #6a95f1;
                  }

                  polygon {
                    fill: #6a95f1;
                  }
                }
              }
            }
          }

          .note-collection {
            cursor: pointer;
            margin-left: 5px;
            &:hover {
              svg {
                g {
                  fill: #f2bf20;
                }
              }
            }
          }
        }
      }

      .noteslide-list-other {
        display: flex;
        width: 100%;
        margin-top: 10px;
        .current-note-tagbox {
          flex: 1;
          .current-note-tag {
            float: left;
            font-weight: bold;
            font-size: 12px;
            word-break: break-all;

            &.note {
              a {
                color: #6a95f1;
                padding-right: 8px;
              }
            }

            &.password {
              a {
                color: #edba1c;
                padding-right: 5px;
              }
            }
          }
        }

        .current-note-date {
          width: 80px;
          color: #999;
          font-size: 12px;
          text-align: right;
        }
      }

      &:hover,
      &.current {
        border-radius: 8px;
        background-color: #f5f8ff;
        transition: background-color 0.3s linear;
        cursor: pointer;
        border-top: none;
      }
    }
  }

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

@media screen and (min-width: 0) and (max-width: 750px) {
  .noteslide-container {
    width: 100%;
    padding: 0;
    // padding: 0 5vw;
    margin: 0;
    border-right: none;
    background: #f8faff;

    .noteslide-screening {
      margin: 0 5vw;
      width: 90vw;
    }

    .noteslide-addbtn-box {
      margin: 5vw;
      width: 90vw;
    }

    .noteslide-list-box {
      display: flex;
      flex-direction: column;
      height: 100%;

      .noteslide-list {
        background-color: #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        padding: 10px;
        margin: 5vw 5vw 0 5vw;
        border-radius: 8px;
        .contain {
          justify-content: space-between;
        }
        .isM {
          display: flex;
        }

        &:hover,
        &.current {
          background-color: white;
        }
      }
    }
  }

  .hide {
    display: none !important;
  }

  .show {
    display: block !important;
  }
}
</style>
