import { createRouter, createWebHashHistory } from 'vue-router';

// 登录相关
import Login from '../views/login/login.vue';
import Home from '../views/home/home.vue';
// 助记词相关
import BackupView from '../views/backup/backup.vue';
// 选择助记词备份方式
import BackupHome from '../views/backup/components/Backup.vue';
// 生成助记词
// import BackbyPhrase from '../views/backup/components/BackbyPhrase.vue'
// 验证助记词
import ValidatePhrase from '../views/backup/components/ValidatePhrase.vue';
// 登录成功 - 助记词备份成功
import LoginSucceed from '../views/backup/components/LoginSucceed.vue';
// YubiKey 备份
import YubiKey from '../views/backup/components/YubiKey.vue';

// import Index from '../views/home/index.vue'
// import Notes from '../views/home/notes.vue'
import NoteContainer from '../views/notes/NoteContainer.vue';
import Dcontain from '../views/home/Dcontain.vue';
import Wallet from '../views/wallet/Wallet.vue';
import User from '../views/user/User.vue';
import Airdrop from '../views/home/nft/Index.vue';

// import BackbyDevice from '../components/login/BackbyDevice.vue'
import { NotesIdentity } from '../utils/identity';
import { GetCurrentLocalKey } from '../utils/local';

const routes = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/backup',
    name: 'backup',
    component: BackupView,
    redirect: { name: 'backuphome' },
    children: [
      {
        path: '',
        name: 'backuphome',
        component: BackupHome,
      },
      {
        path: 'success',
        name: 'info',
        component: LoginSucceed,
      },
      // {
      //   path: 'device',
      //   name: 'device',
      //   component: BackbyDevice
      // },
      // {
      //   path: 'phrase',
      //   name: 'phrase',
      //   component: BackbyPhrase,
      // },
      {
        path: 'validatephrase',
        name: 'validatephrase',
        component: ValidatePhrase,
      },
      {
        path: 'yubikey',
        name: 'yubikey',
        component: YubiKey,
      },
    ],
  },
  {
    path: '/home',
    component: Home,
    redirect: { name: 'home' },
    children: [
      {
        path: '',
        name: 'home',
        component: Dcontain,
      },
      {
        path: 'notes',
        name: 'notes',
        component: NoteContainer,
      },
      {
        path: 'wallet',
        name: 'wallet',
        component: Wallet,
      },
      {
        path: 'user',
        name: 'user',
        component: User,
      },
      {
        path: 'airdrop',
        name: 'airdrop',
        component: Airdrop,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && (!NotesIdentity.isLogin() || !NotesIdentity.isRegister())) {
    router.replace({ name: 'login' });
  } else if (to.path === '/login' && NotesIdentity.isLogin() && NotesIdentity.isRegister()) {
    let key = GetCurrentLocalKey();
    if (localStorage.getItem('_backup') && (!key || !key.bk)) {
      router.replace({ name: 'backup' });
    } else {
      router.replace({ name: 'home' });
    }
  } else {
    next();
  }
});

export default router;
