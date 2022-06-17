<template>
  <div class="layer" v-if="isWelcomeShow">
    <div class="modal-container">
      <div class="loading" v-if="isLoading">
        <div class="loader"></div>
      </div>
      <LoginWelcome v-else-if="isFirstDevice"></LoginWelcome>
      <RequestOtherDevice v-else></RequestOtherDevice>
    </div>
  </div>
  <div class="login-bg" v-else>
    <div class="left">
      <div class="w500 pr">
        <div class="contain">
          <div class="login-logo">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-login-newlogo"></use>
            </svg>
          </div>
        </div>
        <div class="svgs">
          <img src="../../../assets/svg/login-note.svg" class="svg-note" />
          <img src="../../../assets/svg/login-pen.svg" class="svg-pen" />
          <img src="../../../assets/svg/login-key.svg" class="svg-key" />
        </div>
        <div class="count-box">
          <dl>
            <dt>
              <count-to :start-val="startFee" :end-val="endFee" :decimals="2" :duration="duration" />
            </dt>
            <dd>{{ $t('login.data.Fee') }}<i>(ICP)</i></dd>
          </dl>
          <dl>
            <dt>
              <count-to :start-val="startCanisters" :end-val="endCanisters" :duration="duration" />
            </dt>
            <dd>{{ $t('login.data.Canisters') }}</dd>
          </dl>
          <dl>
            <dt>
              <count-to :start-val="startUser" :end-val="endUser" :duration="duration" />
            </dt>
            <dd>{{ $t('login.data.Users') }}</dd>
          </dl>
          <!-- <dl>
            <dt>
              <count-to
                :start-val="startCycles"
                :end-val="endCycles"
                :duration="duration"
              />
            </dt>
            <dd>{{$t('login.data.MAU')}}</dd>
          </dl> -->
        </div>
      </div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
      <div id="dstars"></div>
    </div>
    <div class="right">
      <div class="change-lang">
        <Lang />
      </div>
      <div class="w500 pl">
        <div class="login-box">
          <h1>Dstar Note</h1>
          <div class="slogan">{{ $t('login.slogan.s1') }}&nbsp;-&nbsp;{{ $t('login.slogan.s2') }}&nbsp;-&nbsp;{{ $t('login.slogan.s3') }}</div>
          <p>{{ $t('login.description.p1') }}</p>
          <p>{{ $t('login.description.p2') }}</p>
          <div class="login-btn" @click="clickLogin" :class="{ disabled: !isChrome }">
            {{ $t('login.loginbtntxt') }}
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="!isChrome ? '#icon-login-arrow-right-disabled' : '#icon-login-arrow-right'" />
            </svg>
            <div class="browserTips" v-if="!isChrome">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-warning"></use>
              </svg>
              {{ $t('login.tips') }}
            </div>
          </div>
          <!-- <div class="login-btn" :class="{ disabled: !isChrome }">
            <div class="signup">{{$t('login.sign')}}</div>
          </div> -->
        </div>
      </div>
      <svg class="poweredby" width="204" height="27" viewBox="0 0 204 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M39.3702 2C36.4633 2 33.2945 3.51655 29.9452 6.50368C28.3563 7.91913 26.9841 9.43567 25.955 10.6489C25.955 10.6489 25.955 10.6489 25.964 10.6581V10.6489C25.964 10.6489 27.589 12.4504 29.3855 14.3805C30.3515 13.2133 31.7418 11.6232 33.3397 10.1894C36.3188 7.5331 38.2598 6.97243 39.3702 6.97243C43.5501 6.97243 46.9445 10.3456 46.9445 14.4908C46.9445 18.6085 43.541 21.9816 39.3702 22.0092C39.1806 22.0092 38.9369 21.9816 38.6299 21.9173C39.8487 22.4504 41.1577 22.8364 42.4035 22.8364C50.0591 22.8364 51.5577 17.7537 51.657 17.3861C51.8827 16.4577 52.0001 15.4835 52.0001 14.4816C52.0001 7.60663 46.3306 2 39.3702 2Z"
          fill="url(#paint0_linear_1724_115)"
        />
        <path
          d="M12.6298 26.9999C15.5368 26.9999 18.7055 25.4834 22.0548 22.4962C23.6437 21.0808 25.0159 19.5642 26.0451 18.351C26.0451 18.351 26.0451 18.351 26.0361 18.3418V18.351C26.0361 18.351 24.4111 16.5495 22.6145 14.6194C21.6486 15.7867 20.2583 17.3767 18.6604 18.8106C15.6812 21.4668 13.7403 22.0275 12.6298 22.0275C8.44999 22.0183 5.05555 18.6451 5.05555 14.4999C5.05555 10.3822 8.45901 7.00908 12.6298 6.9815C12.8194 6.9815 13.0632 7.00908 13.3701 7.07342C12.1514 6.54033 10.8423 6.1543 9.59651 6.1543C1.94097 6.1543 0.451388 11.237 0.343055 11.5955C0.117361 12.533 0 13.4981 0 14.4999C0 21.3933 5.66944 26.9999 12.6298 26.9999Z"
          fill="url(#paint1_linear_1724_115)"
        />
        <path
          d="M42.3856 22.7261C38.4675 22.625 34.396 19.4816 33.5654 18.7004C31.4168 16.6783 26.4606 11.2096 26.0724 10.7776C22.4432 6.63236 17.5231 2 12.63 2H12.621H12.612C6.67172 2.02757 1.67937 6.12684 0.343262 11.5956C0.442567 11.2371 2.40159 6.05332 9.58769 6.23714C13.5057 6.33824 17.5953 9.52759 18.4349 10.3088C20.5835 12.3309 25.5398 17.7997 25.9279 18.2316C29.5571 22.3677 34.4772 27 39.3703 27H39.3793H39.3883C45.3286 26.9725 50.33 22.8732 51.6571 17.4044C51.5487 17.7629 49.5807 22.9008 42.3856 22.7261Z"
          fill="#29ABE2"
        />
        <path
          d="M61.0301 23.827C61.3063 23.827 61.5301 23.6032 61.5301 23.327V16.6622C61.5301 16.386 61.3063 16.1622 61.0301 16.1622H60.5C60.2239 16.1622 60 16.386 60 16.6622V23.327C60 23.6032 60.2239 23.827 60.5 23.827H61.0301Z"
          fill="#161617"
        />
        <path
          d="M71.2018 23.827C71.478 23.827 71.7018 23.6032 71.7018 23.327V16.6622C71.7018 16.386 71.478 16.1622 71.2018 16.1622H70.6936C70.4174 16.1622 70.1936 16.386 70.1936 16.6622V21.2324L67.264 16.6256C67.0805 16.337 66.7622 16.1622 66.4202 16.1622H65.5895C65.3133 16.1622 65.0895 16.386 65.0895 16.6622V23.327C65.0895 23.6032 65.3133 23.827 65.5895 23.827H66.0978C66.3739 23.827 66.5978 23.6032 66.5978 23.327V18.3892L69.9693 23.5987C70.0614 23.7411 70.2195 23.827 70.389 23.827H71.2018Z"
          fill="#161617"
        />
        <path
          d="M80.4535 17.5784C80.7297 17.5784 80.9535 17.3545 80.9535 17.0784V16.6622C80.9535 16.386 80.7297 16.1622 80.4535 16.1622H75.0379C74.7617 16.1622 74.5379 16.386 74.5379 16.6622V17.0784C74.5379 17.3545 74.7617 17.5784 75.0379 17.5784H76.9861V23.327C76.9861 23.6032 77.21 23.827 77.4861 23.827H78.0053C78.2814 23.827 78.5053 23.6032 78.5053 23.327V17.5784H80.4535Z"
          fill="#161617"
        />
        <path
          d="M88.1385 23.827C88.4146 23.827 88.6385 23.6032 88.6385 23.327V22.9216C88.6385 22.6455 88.4146 22.4216 88.1385 22.4216H85.2941V20.6486H87.8215C88.0977 20.6486 88.3215 20.4248 88.3215 20.1486V19.8189C88.3215 19.5428 88.0977 19.3189 87.8215 19.3189H85.2941V17.5676H88.1385C88.4146 17.5676 88.6385 17.3437 88.6385 17.0676V16.6622C88.6385 16.386 88.4146 16.1622 88.1385 16.1622H84.2858C84.0096 16.1622 83.7858 16.386 83.7858 16.6622V23.327C83.7858 23.6032 84.0096 23.827 84.2858 23.827H88.1385Z"
          fill="#161617"
        />
        <path
          d="M95.5496 23.5559C95.6353 23.7224 95.8069 23.827 95.9941 23.827H96.5415C96.9184 23.827 97.1598 23.4259 96.9833 23.0929L95.711 20.6919C96.7275 20.4 97.3614 19.5892 97.3614 18.5189C97.3614 17.1892 96.3996 16.1622 94.8913 16.1622H92.3638C92.0877 16.1622 91.8638 16.386 91.8638 16.6622V23.327C91.8638 23.6032 92.0877 23.827 92.3638 23.827H92.883C93.1592 23.827 93.383 23.6032 93.383 23.327V20.8757H94.1699L95.5496 23.5559ZM93.383 19.5892V17.4595H94.6071C95.3722 17.4595 95.8203 17.8811 95.8203 18.5297C95.8203 19.1568 95.3722 19.5892 94.6071 19.5892H93.383Z"
          fill="#161617"
        />
        <path
          d="M106.609 23.827C106.885 23.827 107.109 23.6032 107.109 23.327V16.6622C107.109 16.386 106.885 16.1622 106.609 16.1622H106.101C105.825 16.1622 105.601 16.386 105.601 16.6622V21.2324L102.671 16.6256C102.488 16.337 102.17 16.1622 101.828 16.1622H100.997C100.721 16.1622 100.497 16.386 100.497 16.6622V23.327C100.497 23.6032 100.721 23.827 100.997 23.827H101.505C101.781 23.827 102.005 23.6032 102.005 23.327V18.3892L105.377 23.5987C105.469 23.7411 105.627 23.827 105.796 23.827H106.609Z"
          fill="#161617"
        />
        <path
          d="M115.03 23.827C115.306 23.827 115.53 23.6032 115.53 23.327V22.9216C115.53 22.6455 115.306 22.4216 115.03 22.4216H112.186V20.6486H114.713C114.989 20.6486 115.213 20.4248 115.213 20.1486V19.8189C115.213 19.5428 114.989 19.3189 114.713 19.3189H112.186V17.5676H115.03C115.306 17.5676 115.53 17.3437 115.53 17.0676V16.6622C115.53 16.386 115.306 16.1622 115.03 16.1622H111.178C110.901 16.1622 110.678 16.386 110.678 16.6622V23.327C110.678 23.6032 110.901 23.827 111.178 23.827H115.03Z"
          fill="#161617"
        />
        <path
          d="M123.939 17.5784C124.215 17.5784 124.439 17.3545 124.439 17.0784V16.6622C124.439 16.386 124.215 16.1622 123.939 16.1622H118.523C118.247 16.1622 118.023 16.386 118.023 16.6622V17.0784C118.023 17.3545 118.247 17.5784 118.523 17.5784H120.471V23.327C120.471 23.6032 120.695 23.827 120.971 23.827H121.491C121.767 23.827 121.991 23.6032 121.991 23.327V17.5784H123.939Z"
          fill="#161617"
        />
        <path
          d="M134.823 23.9892C136.998 23.9892 138.113 22.5622 138.408 21.3838L136.998 20.9622C136.79 21.6757 136.146 22.5297 134.823 22.5297C133.577 22.5297 132.419 21.6324 132.419 20C132.419 18.2595 133.643 17.4378 134.801 17.4378C136.146 17.4378 136.747 18.2486 136.932 18.9838L138.353 18.5405C138.047 17.2973 136.943 16 134.801 16C132.725 16 130.856 17.5568 130.856 20C130.856 22.4432 132.659 23.9892 134.823 23.9892Z"
          fill="#161617"
        />
        <path
          d="M142.428 19.9892C142.428 18.2595 143.653 17.4378 144.844 17.4378C146.046 17.4378 147.27 18.2595 147.27 19.9892C147.27 21.7189 146.046 22.5405 144.844 22.5405C143.653 22.5405 142.428 21.7189 142.428 19.9892ZM140.866 20C140.866 22.4649 142.745 23.9892 144.844 23.9892C146.953 23.9892 148.833 22.4649 148.833 20C148.833 17.5243 146.953 16 144.844 16C142.745 16 140.866 17.5243 140.866 20Z"
          fill="#161617"
        />
        <path
          d="M160.077 23.827C160.354 23.827 160.577 23.6032 160.577 23.327V16.6622C160.577 16.386 160.354 16.1622 160.077 16.1622H158.858C158.655 16.1622 158.472 16.2846 158.395 16.4722L156.249 21.6973L154.05 16.4683C153.972 16.2828 153.79 16.1622 153.589 16.1622H152.432C152.156 16.1622 151.932 16.386 151.932 16.6622V23.327C151.932 23.6032 152.156 23.827 152.432 23.827H152.875C153.151 23.827 153.375 23.6032 153.375 23.327V18.4973L155.476 23.52C155.554 23.706 155.736 23.827 155.937 23.827H156.528C156.73 23.827 156.912 23.7053 156.989 23.5187L159.091 18.4541V23.327C159.091 23.6032 159.315 23.827 159.591 23.827H160.077Z"
          fill="#161617"
        />
        <path
          d="M165.66 19.6541V17.4595H166.851C167.605 17.4595 168.065 17.8811 168.065 18.5622C168.065 19.2216 167.605 19.6541 166.851 19.6541H165.66ZM167.037 20.9405C168.567 20.9405 169.584 19.9459 169.584 18.5514C169.584 17.1676 168.567 16.1622 167.037 16.1622H164.641C164.365 16.1622 164.141 16.386 164.141 16.6622V23.327C164.141 23.6032 164.365 23.827 164.641 23.827H165.149C165.425 23.827 165.649 23.6032 165.649 23.327V20.9405H167.037Z"
          fill="#161617"
        />
        <path
          d="M175.414 24C177.076 24 178.398 22.9946 178.398 21.1135V16.6622C178.398 16.386 178.174 16.1622 177.898 16.1622H177.39C177.114 16.1622 176.89 16.386 176.89 16.6622V21.0054C176.89 22.0108 176.332 22.5405 175.414 22.5405C174.518 22.5405 173.95 22.0108 173.95 21.0054V16.6622C173.95 16.386 173.726 16.1622 173.45 16.1622H172.941C172.665 16.1622 172.441 16.386 172.441 16.6622V21.1135C172.441 22.9946 173.764 24 175.414 24Z"
          fill="#161617"
        />
        <path
          d="M187.081 17.5784C187.357 17.5784 187.581 17.3545 187.581 17.0784V16.6622C187.581 16.386 187.357 16.1622 187.081 16.1622H181.666C181.389 16.1622 181.166 16.386 181.166 16.6622V17.0784C181.166 17.3545 181.389 17.5784 181.666 17.5784H183.614V23.327C183.614 23.6032 183.838 23.827 184.114 23.827H184.633C184.909 23.827 185.133 23.6032 185.133 23.327V17.5784H187.081Z"
          fill="#161617"
        />
        <path
          d="M194.766 23.827C195.042 23.827 195.266 23.6032 195.266 23.327V22.9216C195.266 22.6455 195.042 22.4216 194.766 22.4216H191.922V20.6486H194.449C194.725 20.6486 194.949 20.4248 194.949 20.1486V19.8189C194.949 19.5428 194.725 19.3189 194.449 19.3189H191.922V17.5676H194.766C195.042 17.5676 195.266 17.3437 195.266 17.0676V16.6622C195.266 16.386 195.042 16.1622 194.766 16.1622H190.913C190.637 16.1622 190.413 16.386 190.413 16.6622V23.327C190.413 23.6032 190.637 23.827 190.913 23.827H194.766Z"
          fill="#161617"
        />
        <path
          d="M202.177 23.5559C202.263 23.7224 202.435 23.827 202.622 23.827H203.169C203.546 23.827 203.787 23.4259 203.611 23.0929L202.339 20.6919C203.355 20.4 203.989 19.5892 203.989 18.5189C203.989 17.1892 203.027 16.1622 201.519 16.1622H198.492V23.327C198.492 23.6032 198.715 23.827 198.992 23.827H199.511C199.787 23.827 200.011 23.6032 200.011 23.327V20.8757H200.798L202.177 23.5559ZM200.011 19.5892V17.4595H201.235C202 17.4595 202.448 17.8811 202.448 18.5297C202.448 19.1568 202 19.5892 201.235 19.5892H200.011Z"
          fill="#161617"
        />
        <path
          d="M61.002 6.941V4.026H62.652C63.653 4.026 64.269 4.609 64.269 5.5C64.269 6.358 63.653 6.941 62.652 6.941H61.002ZM62.795 7.766C64.236 7.766 65.193 6.798 65.193 5.489C65.193 4.191 64.236 3.201 62.795 3.201H60.078V11H61.002V7.766H62.795ZM68.301 5.577C66.783 5.577 65.661 6.743 65.661 8.36C65.661 9.988 66.783 11.154 68.301 11.154C69.819 11.154 70.941 9.988 70.941 8.36C70.941 6.743 69.819 5.577 68.301 5.577ZM68.301 6.369C69.247 6.369 70.061 7.084 70.061 8.36C70.061 9.647 69.247 10.362 68.301 10.362C67.355 10.362 66.541 9.647 66.541 8.36C66.541 7.084 67.355 6.369 68.301 6.369ZM75.3143 5.731L73.8623 9.9L72.5753 5.731H71.6293L73.3783 11H74.3133L75.7653 6.798L77.2393 11H78.1633L79.8793 5.731H78.9443L77.6903 9.9L76.2273 5.731H75.3143ZM81.4952 7.854C81.5502 7.073 82.1662 6.358 83.0792 6.358C84.0802 6.358 84.6192 7.018 84.6412 7.854H81.4952ZM84.7622 9.229C84.5532 9.856 84.0692 10.362 83.1782 10.362C82.2322 10.362 81.4732 9.647 81.4732 8.646V8.602H85.5322C85.5432 8.525 85.5542 8.404 85.5542 8.294C85.5542 6.688 84.6632 5.577 83.0682 5.577C81.7372 5.577 80.5712 6.688 80.5712 8.349C80.5712 10.12 81.7702 11.154 83.1782 11.154C84.3992 11.154 85.2242 10.417 85.5212 9.504L84.7622 9.229ZM89.7123 5.698C89.6353 5.676 89.4813 5.654 89.3383 5.654C88.7553 5.654 88.0843 5.907 87.7433 6.677V5.731H86.8853V11H87.7653V8.272C87.7653 7.084 88.3703 6.578 89.2503 6.578C89.4043 6.578 89.5693 6.589 89.7123 6.633V5.698ZM91.1954 7.854C91.2504 7.073 91.8664 6.358 92.7794 6.358C93.7804 6.358 94.3194 7.018 94.3414 7.854H91.1954ZM94.4624 9.229C94.2534 9.856 93.7694 10.362 92.8784 10.362C91.9324 10.362 91.1734 9.647 91.1734 8.646V8.602H95.2324C95.2434 8.525 95.2544 8.404 95.2544 8.294C95.2544 6.688 94.3634 5.577 92.7684 5.577C91.4374 5.577 90.2714 6.688 90.2714 8.349C90.2714 10.12 91.4704 11.154 92.8784 11.154C94.0994 11.154 94.9244 10.417 95.2214 9.504L94.4624 9.229ZM100.403 10.241C100.403 10.582 100.436 10.879 100.458 11H101.316C101.294 10.89 101.261 10.538 101.261 10.01V3.047H100.381V6.578C100.205 6.138 99.6875 5.577 98.6755 5.577C97.2015 5.577 96.2335 6.831 96.2335 8.36C96.2335 9.922 97.1575 11.154 98.6755 11.154C99.5885 11.154 100.161 10.615 100.403 10.098V10.241ZM98.7525 10.362C97.7625 10.362 97.1135 9.526 97.1135 8.36C97.1135 7.194 97.7515 6.369 98.7525 6.369C99.7535 6.369 100.403 7.194 100.403 8.36C100.403 9.526 99.7425 10.362 98.7525 10.362ZM106.639 11V10.131C106.947 10.703 107.563 11.154 108.443 11.154C109.972 11.154 110.863 9.933 110.863 8.36C110.863 6.82 110.027 5.577 108.465 5.577C107.519 5.577 106.903 6.094 106.661 6.589V3.047H105.781V11H106.639ZM108.311 10.362C107.299 10.362 106.639 9.526 106.639 8.36C106.639 7.194 107.288 6.369 108.311 6.369C109.334 6.369 109.983 7.194 109.983 8.36C109.983 9.526 109.323 10.362 108.311 10.362ZM113.364 13.09L116.741 5.731H115.784L114.145 9.46L112.407 5.731H111.395L113.661 10.373L112.385 13.09H113.364Z"
          fill="black"
        />
        <defs>
          <linearGradient id="paint0_linear_1724_115" x1="32.7957" y1="3.6484" x2="50.2864" y2="21.4386" gradientUnits="userSpaceOnUse">
            <stop offset="0.21" stop-color="#F15A24" />
            <stop offset="0.6841" stop-color="#FBB03B" />
          </linearGradient>
          <linearGradient id="paint1_linear_1724_115" x1="19.2044" y1="25.3515" x2="1.71361" y2="7.56137" gradientUnits="userSpaceOnUse">
            <stop offset="0.21" stop-color="#ED1E79" />
            <stop offset="0.8929" stop-color="#522785" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script>
import LoginWelcome from './LoginWelcome.vue';
import RequestOtherDevice from './RequestOtherDevice.vue';
import LoginSucceed from './LoginSucceed.vue';
import { CountTo } from 'vue3-count-to';
import Lang from '../../home/plugin/Lang.vue';

import { NotesIdentity } from '../../../utils/identity';
import { GetDevices, GetUserStat, CheckDeviceOnlyLocal, HasLocalDevice } from '../../../utils/notes/sync';
import { GetCurrentLocalKey } from '../../../utils/local';
import { GetNotesStat } from '../../../utils/notes/notes';
import { CheckAesKey, CheckIsSeed } from '../../../utils/aes';

export default {
  name: 'Login',
  data() {
    return {
      startUser: 0,
      endUser: 0,
      startCanisters: 0,
      endCanisters: 0,
      startCycles: 0,
      endCycles: 0,
      startFee: 0,
      endFee: 0,
      duration: 2000,
      dlwidth: 0,
      isCountShow: false,
      isWelcomeShow: false,
      isFirstDevice: true,
      isLoading: true,
      isChrome: false,
    };
  },
  components: {
    CountTo,
    LoginWelcome,
    RequestOtherDevice,
    LoginSucceed,
    Lang,
  },
  async mounted() {
    this.checkBrowser();
    if (await NotesIdentity.init()) {
      if (NotesIdentity.isLogin() && NotesIdentity.isRegister()) {
        this.$router.replace({ name: 'home' });
        return;
      }
    }
    this.playDstar();
    this.isWelcomeShow = NotesIdentity.isLogin();

    let devices = await GetDevices(true);

    if (devices.length > 0 && HasLocalDevice()) {
      // check device is registed, but aes not seed.
      if (await CheckAesKey()) {
        window.location.reload();
        return;
      }
      this.isFirstDevice = false;
    } else if (devices.length > 0) {
      let ret = await CheckIsSeed();
      if (ret) {
        this.isFirstDevice = false;
      }
    }
    this.isLoading = false;
    // this.isFirstDevice = false
    if (!this.isWelcomeShow) {
      this.$nextTick(async () => {
        let stat = await GetNotesStat();
        this.endUser = await GetUserStat();
        this.endCanisters = stat.notesNum;
        this.endFee = stat.feeTotal;
        this.isCountShow = true;
      });
    }
  },
  methods: {
    checkBrowser() {
      let userAgent = navigator.userAgent;
      // alert(userAgent);
      if (userAgent.indexOf('Chrome') > -1 || userAgent.indexOf('Safari') > -1) {
        this.isChrome = true;
      } else {
        this.isChrome = false;
      }
      // let isIos = /(iphone|ipad|ipod)/i.test(userAgent);
      // let isAndroid = /(android)/i.test(userAgent);

      // if (isIos || isAndroid) {
      //   this.isChrome = false;
      // }
    },
    async clickLogin() {
      let ok = NotesIdentity.isLogin();
      if (!ok) {
        ok = await NotesIdentity.login();
      }
      console.log('login', ok);
      if (ok) {
        if (await NotesIdentity.init()) {
          let data = GetCurrentLocalKey();
          if (data && data.bk) {
            this.$router.replace({ name: 'home' });
          } else {
            localStorage.setItem('_backup', '1');
            this.$router.replace({ name: 'backup' });
          }
          return;
        }
        window.location.reload();
      }
    },
    playDstar() {
      const stars = document.querySelectorAll('div#dstars');
      stars.forEach((star, i) => {
        let x = `${Math.random() * 200}vmax`;
        let y = `${Math.random() * 100}vh`;
        let z = `${Math.random() * 200 - 100}vmin`;
        let rx = `${Math.random() * 360}deg`;
        star.style.setProperty('--x', x);
        star.style.setProperty('--y', y);
        star.style.setProperty('--z', z);
        star.style.setProperty('--rx', rx);
        let delay = `${Math.random() * 900}ms`;
        star.style.animationDelay = delay;
      });
    },
  },
};
</script>

<style scoped lang="less">
.layer {
  background: url(../images/layer-bg.png) no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .modal-container {
    display: flex;
    width: 60vw;
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.1);
    max-width: 1000px;

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
}

.login-bg {
  width: 100%;
  height: 100%;

  display: flex;

  .w500 {
    width: 500px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &.pr {
      right: 80px;
    }

    &.pl {
      left: 60px;
    }
  }

  .left {
    width: 50%;
    min-width: 550px;
    height: 100vh;
    position: relative;
    background: linear-gradient(160deg, #001950, #00b886, #8aa7e7);
    perspective: 10vmin;
    overflow: hidden;

    #dstars {
      --unit: 1.5vmin;
      width: var(--unit);
      height: var(--unit);
      --rotate: rotateY(90deg);
      transform: translateZ(-100vmin) var(--rotate) rotateX(var(--rx)) translateZ(var(--x)) scaleX(1);
      position: absolute;
      top: 0%;
      left: 0%;
      animation: playDstart 1s infinite ease-in;
      background: rgb(146, 205, 253);
    }

    @keyframes dstar-note {
      0% {
        left: -20px;
        top: 70px;
      }

      100% {
        left: 5%;
        top: 100px;
      }
    }

    @keyframes dstar-pen {
      0% {
        right: 15%;
        top: 25%;
      }

      100% {
        right: 25%;
        top: 35%;
      }
    }

    @keyframes dstar-key {
      0% {
        bottom: 18%;
        right: 30%;
      }

      100% {
        bottom: 10%;
        right: 14%;
      }
    }

    @keyframes playDstart {
      0% {
        opacity: 1;
      }

      90% {
        opacity: 1;
      }

      100% {
        opacity: 0;
        transform: translateZ(0vmin) var(--rotate) rotateX(var(--rx)) translateZ(var(--x)) scaleX(6);
      }
    }

    .svgs {
      width: 100%;
      min-height: 480px;
      position: relative;

      .svg-note {
        position: absolute;
        left: 5%;
        top: 100px;
        width: 56%;
        animation: dstar-note 4s linear infinite;
        animation-direction: alternate;
      }

      .svg-pen {
        position: absolute;
        right: 25%;
        top: 35%;
        width: 22%;
        animation: dstar-pen 3s linear infinite;
        animation-direction: alternate;
      }

      .svg-key {
        position: absolute;
        right: 14%;
        bottom: 10%;
        width: 24%;
        animation: dstar-key 3s linear infinite;
        animation-direction: alternate;
      }
    }

    .contain {
      width: 100%;

      .login-logo {
        width: 250px;
        height: 50px;

        svg {
          font-size: 130px;
          height: 100%;
        }
      }
    }

    .count-box {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      padding: 15px 10px;
      margin-top: 30px;

      dl {
        padding: 0 5px;
        margin: 0;

        dt {
          width: auto;
          display: block;
          text-align: center;
          font-size: 22px;
          font-family: 'GothicB';
          color: #000;

          span {
            padding: 0;
          }
        }

        dd {
          width: auto;
          display: block;
          text-align: center;
          font-size: 12px;
          color: #666;
          padding-top: 2px;
          margin: 0;

          i {
            font-style: normal;
            color: #999;
            font-size: 10px;
            padding-left: 5px;
          }
        }
      }
    }
  }

  .right {
    width: 50%;
    min-width: 550px;
    height: 100%;
    background-color: #fff;
    position: relative;

    .login-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 8px;
      margin-right: 5vw;
      max-width: 400px;

      h1 {
        font-size: (32 * 2/75rem);
        font-weight: bold;
        font-family: 'GothicB';
        color: #000;
        padding: 0;
        margin: 0;
      }

      p {
        width: 100%;
        padding-top: 0.6rem;
        margin: 0;
        line-height: 150%;
        font-size: (11 * 2/75rem);
      }

      .slogan {
        background-color: #fff;
        margin: 3px;
        width: 100%;
        height: calc(3.1vw - 6px);
        min-height: (44 - 6px);
        border-radius: 6px;
        color: #000;
        display: flex;
        margin-top: 20px;
        // font-size: 18px;
        font-size: (14 * 2/75rem);
        word-break: break-all;
        text-align: left;
        // justify-content: start;

        span {
          padding: 0 5px;
          color: #ccc;
        }
      }

      .login-btn {
        width: 100%;
        height: 3.2vw;
        min-height: 50px;
        color: #fff;
        border-radius: 8px;
        font-weight: bold;
        font-size: (12 * 2/75rem);
        background: linear-gradient(to right, #2aabe2, #532886, #ee1e79, #fbb03b);
        transition: all 0.3s linear;
        opacity: 0.8;
        align-items: center;
        display: flex;
        justify-content: center;
        margin-top: 6vh;
        border: none;
        cursor: pointer;
        position: relative;

        svg {
          font-size: (16 * 2/75rem);
          margin-left: 2vw;

          &.disabled {
            .signup {
              background-color: #ddd;
              color: #999;
            }
          }
        }

        &:hover {
          opacity: 1;
          box-shadow: 0 0 10px #ccc;
          transition: all 0.3s linear;
        }

        &.disabled {
          background: #ddd;
          color: #999;
          cursor: not-allowed;
          pointer-events: none;
          opacity: 1;
        }

        .browserTips {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          width: 100%;
          background-color: #fef0f0;
          color: #f56c6c;
          padding: 10px;
          top: -6vh;
          border: 1px solid #ffe2e2;
          border-radius: 3px;
          font-weight: normal;
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;

          svg {
            font-size: 16px !important;
            margin-right: 8px;
            margin-left: 0;
          }
        }
      }
    }

    .change-lang {
      position: fixed;
      right: 50px;
      top: 20px;
      width: 80px;
      cursor: pointer;
      z-index: 2;
    }

    .poweredby {
      position: fixed;
      right: 50px;
      bottom: 50px;
    }
  }
}

@media screen and (min-width: 0) and (max-width: 750px) {
  .layer {
    .modal-container {
      margin: 0 5vw;
      width: 90vw;
    }
  }

  .login-bg {
    background: #fff;

    .left {
      display: none;
    }

    .right {
      background: linear-gradient(45deg, #f2f6ff, #fff3e1, #e1eafd);
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: auto;

      .change-lang {
        width: auto;
        right: 20px;
        top: 20px;

        :deep(.language) {
          width: auto;
          height: auto;
          margin-top: 0;

          ul {
            top: 30px;
            left: 30%;
          }
        }
      }

      .w500 {
        width: 100vw;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .login-box {
          margin-right: 0;
          max-width: none;
          width: 80vw;
          background: #fff;
          flex: none;
          padding: 6vw 5vw;

          p {
            padding-top: 0.3rem;
          }
        }
      }

      .poweredby {
        right: 0;
        width: 100%;
      }
    }
  }
}
</style>
