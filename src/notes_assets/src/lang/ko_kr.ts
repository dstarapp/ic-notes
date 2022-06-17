export default {
  login: {
    data: {
      MAU: '월 액티브 사용자',
      Users: '사용자',
      Canisters: 'canister',
      Fee: '비용',
    },
    description: {
      p1: 'Dstar 노트는 100% 인터넷 컴퓨터에 설치되어 있습니다.',
      p2: 'Dstar 노트는 높은 안전성,영구적인 보유,낮은 비용,비교적 더 안전한 데이터 이전 등 기능을 포함한 블록체인의 모든 특성을 가지고 있습니다. ',
    },
    tips: 'chrome 브라우저로 로그인하세요',
    loginbtntxt: '인터넷 아이덴티티(ii)로 로그인하세요',
    sign: '인터넷 아이덴티티(ii)로 가입하세요',
    slogan: {
      s1: '안전',
      s2: '높은 효율성',
      s3: '무한한 가능성',
    },
  },
  welcome: {
    title: 'Dstar 노트를 즐기세요',
    ptips: '장치 이름，예시: iPhone 혹은 나의 Mac',
    placehoder: '장치 이름',
    linktxt: '시크릿 키를 Canister에 동기화하기',
    tips: 'Dstar 노트를 처음 사용하시는 경우에는, 여러 디바이스를 사용 할 수 있도록 디바이스를 {action}에 등록하세요',
    tipstxt: '이미 등록되어 있는 장치 이름입니다. 다른 이름으로 재시도하세요.',
  },
  backup: {
    title: '백업',
    tips: '이 브라우저에서 장치 등록이 완료되었습니다. 브라우저 캐시가 지워져 시크릿 키를 잃어버리는 것을 방지하려면 시크릿 키를 백업해주세요.시크릿 키는 여러장치에서 데이터를 암호화/복호화 할 수 있습니다. 시크릿 키를 분실한 경우 본인의 데이터를 읽어들일 수 없습니다.',
    backupBySeed: '니모닉 문구로 백업',
    backupByYubikey: 'yubikey로 백업',
    backupByPass: '암호로 백업',
    newTitle: '백업 방법을 선택하세요',
    setPwd: {
      title: '비밀번호',
      tips: '비밀번호를 설정하여 니모닉 문구를 잃어버리지 않도록 하십시오. 이 비밀번호는 SHA3 512 암호화 알고리즘에 의해 비밀번호를 생성하기 위하여 사용됩니다.이 비밀번호는 니모닉 문구의 암호화 및 복호화에 사용됩니다.비밀번호는 canister에 저장됩니다.',
      placeholder1: '비밀번호 입력',
      pwdlevel: '비밀번호가 충분히 강력하지 않습니다',
      placeholder2: '비밀번호 확인',
      pwdstrong: {
        title: '비밀번호 강도',
        level: {
          one: '낮음',
          two: '보통',
          three: '높음',
        },
      },
    },
    initAccount: {
      title: '계정 초기화',
      tips: '내용을 메모 하였는지 확인해주세요! 장치를 지우면 이 계정은 초기화 됩니다！',
    },
  },
  backupagain: {
    title: '백업을 확인해 주십시오',
    txt: '니모닉 문구를 백업하고 노트에 저장하지 않았는지 다시 확인해주세요.만약 브라우저 쿠키 제거로 인해 니모닉을 잃어버리면 노트 내용들을 해석할 수가 없기 때문에 관련 내용이 영원히 블록체인에 잠들어 있게 됩니다.\n  저희 팀은 사용자 여러분을 위해, 탈 중앙화 방법으로 고객님의 니모닉 보관 서비스를 제공해 드릴 계획입니다.하지만 지금 고객님 본인이 보관을 해주셔야 합니다.고객님의 테이터 안전을 위한 백업을 하지 않은 경우 개인 센터로 이동하여 백업을 완료해주세요. 감사합니다.',
    note: '주의: 니모닉은 소유권이 아닙니다. 저장 과정에서 노출이 되어도 노트 내용이 노출되지 않습니다. 해커는 사용자 승인이 없는 상태에서 노트에 접근 할 수 없습니다.',
    btn1: '백업하러 가기',
    btn2: '백업을 하였습니다',
    txt2: '메모의 안전을 위해 백업 비밀번호를 설정해 주시고, 니모닉 문구를 백업하셨다면 이 알림을 무시하셔도 됩니다!',
  },
  yubikey: {
    title: 'YubiKey로 백업하기',
    linktxt: 'https://fortifyapp.com/#download',
    tips: 'yubikey는 직접 브라우저에서 암호화하거나 복호화할 수가 없기 때문에 frotify（{action}를 설치해서 yubikey의 공유 시크릿 키를 백업해야 합니다. 다음으로 이동하기 전에 frotify 정상적으로 작동하는지 확인해주세요',
    btnName: '네，설치되었습니다',
    btnClickTxt: 'yubikey를 터치해주세요',
    btnWaitTxt: 'yubikey를 PC에 삽입해주세요',
  },
  seedphrase: {
    title: '니모닉 문구',
    condition: {
      one: '하지 마세요',
      one2: '복사 혹인 스크린샷',
      two: 'dstar 노트 내에 니모닉 문구를 저장하지 마세요',
    },
    btnName: '저장되었습니다',
  },
  vseedphrase: {
    title: '니모닉 문구를 인증하기',
    tips: '알맞은 순서대로 니모닉 문구를 입력해 주십시오',
    btnName: '확인',
    error: '니모닉 문구를 잘 못 입력하였습니다,재확인해 주십시오！',
  },
  congratulations: {
    title: '백업 완료되었습니다',
    btnName: '알겠습니다',
  },
  requestotherdevice: {
    option1: '시크릿 키를 동기화',
    option2: '니모닉 문구',
    tips1: '본 장치는 새로운 장치로 확인되었습니다.이 장치로 dstar 노트에 가입을 요청하세요. 시크릿 키를 다른 장치로 업그레이드 해주세요',
    tips2: '고객님의 장치 이름，예시: iPhone 혹은 나의 Mac',
    placehoder: '나의 장치 이름',
    tips3: 'Dstar 노트에 가입되어 있는 다른 장치로 로그인해주시고 권한을 승인해 주십시오',
    tips4: '본 장치는 새로운 장치로 확인되었습니다. 이 장치에서 Dstar 노트를 사용해야 하는 경우 Canister에 새 장치로 등록하거나 독립 실행형 장치 및 백업으로 존재할 수 있는 시드 문구를 가져오십시오.',
    spplacehoder: '니모닉 문구 가져오기',
    btnName: {
      authorize: '승인하기 ',
      authorized: '승인하였습니다',
      response: '응답을 기다리는 중입니다',
      request: '시크릿 키 동기화를 요청합니다',
      success: '업그레이드 하였습니다',
      error: '오류가 발생되었습니다.',
    },
    error: '니모닉 문구를 잘 못 입력하였습니다，다시 확인해주십시오！',
    option3: '비밀번호',
    pwdtips: '본 장치는 새로운 장치로 확인되었습니다.설정한 암호를 사용하여 니모닉을 복구하여 새 장치로 등록하십시오. 암호를 설정하지 않은 경우 다른 복구 방법을 선택하십시오.',
    pwdplaceholder: '비밀번호를 입력해 주세요',
    pwdError: '비밀번호를 잘 못 입력하었습니다，다시 확인해 주십시오！',
  },
  reject: {
    tips: '요청이 거절되었습니다!',
    btnName: '다시 시작하기',
  },
  keyrequest: {
    title: '시크릿 키 업그레이드 요청합니다',
    tips: '요청을 받았습니다. 시크릿 키를 공유하는 권한을 요청합나다.',
    btnName: {
      authorize: '승인',
      authorized: '승인되었습니다',
      reject: '거절',
      rejected: '거절되었습니다',
    },
  },
  public: {
    logout: '로그아웃',
    title: {
      notesTitle: '내 노트',
      walletTitle: '내 지갑',
    },
    address: '지갑 주소',
    create: '새로운 노트',
    notice: '읽지 않은 메시지',
    usercenter: '내 페이지',
    pay: '지급',
    pid: '계정 ID',
    inputnotename: '노트 이름을 입력해주세요！',
  },
  balance: {
    title: '본 주소로 ICP를 입금해주세요',
    btitle: '잔고',
    btnName: {
      copy: '주소를 복사하기',
      copys: '복사',
      copied: '복사 완료되었습니다',
    },
  },
  note: {
    btnName: {
      newNote: '새로운 노트',
      newPwd: '새로운 비밀번호',
      addcycles: '가스를 입금하기',
      changecontroller: '소유권을 이전하기',
      transfer: '내부 전송',
      addcontroller: '컨트롤러를 추가',
      remove: '제거',
      save: '저장',
      saved: '저장하였습니다',
      autosave: '자동 저장',
    },
    sort: {
      timedesc: '시간별 반대로 정렬',
      timeasc: '시간별 정렬',
      collection: '컬렉션별로 정렬',
    },
    empty: '내용이 없습니다',
    noteTopbar: {
      canisterID: 'caniser ID',
      months: '개 월',
      rantips: {
        h: '가스 소모 시간',
        p: '계산 공식은 다음과 같다：',
        fe: '예를 들어，CHF/USD는 1.42，저장 메모리 크기는 10M，남은 Cycles는 10T로 가정하면 Cycles는 다음과 같이 사용 가능할것입니다：',
        n: '이 공식은 정적 저장(static storage)에만 적용됩니다.',
        inmonths: '월단위로 계산',
        cycles: '가스',
        storage: '메모리 크기',
      },
    },
    saveoption: {
      s: '초',
      on: 'on',
      off: 'off',
    },
    notePlaceholder: '제목을 입력해 주세요...',
    noteAreaPlaceholder: 'Dstar 노트를 사용하는 것을 환영합니다! 여기부터 글을 쓰는 것을 즐겨보세요!',
    tag: {
      tagName: 'tag name',
      tagError: '최대 3개 tag name만 가능합니다',
      tagError2: '이미 존재하는 tag name입니다 ',
    },
    nocontroller: '컨트롤러 권한이 없습니다',
    inputnotetitle: '제목을 입력하세요！',
    inputnotecontent: '내용을 입력하세요！',
    areacontent: '로딩중입니다，잠시만 기다려 주세요...',
  },
  aboutas: {
    title: 'About 자동 저장',
    tips: '자동 저장은 더 많은 cycles를 소모될 것입니다. 특히 사진 용량이 크거나 글 내용이 많을 경우 더욱 그렇습니다. cycles를 덜 소모하기 위해 자동 저장 기능을 끊는 것을 권유합니다. 저장에 관련 더 많은 정보를 여기서 확인해 주세요:',
  },
  createnote: {
    title: '노트 작성 진행중',
    tips: '노트는 인터넷 컴퓨터에서 만들어진 canister입니다.노트 내의 모든 데아타가 블록체인에서 저장되어 있습니다. 노트를 만들려면 노트를 만든 비용와 0.2icp의 수수료를 지급하셔야 합니다.',
    placehoder: '노트 이름',
  },
  progress: {
    title: {
      t1: '노트를 새로 만들고 있습니다. 2~3분 소요 됩니다. 잠시만 기다려주세요.',
      t2: '새로고침이나 종료버튼을 누르지 마십시오. 노트를 작성하지 못할 수 있습니다!',
    },
    state: {
      one: '지급중',
      two: '작성 중',
      three: 'cycles를 추가',
    },
  },
  checksave: {
    title: '이 페이지에서 나가시겠습니까?',
    tips: '노트가 아직 저장되지 않았습니다!',
    btnName: {
      save: '저장',
      saving: '저장중...',
      saved: '저장 완료되었습니다.',
      failed: '저장 실패하였습니다.',
      throw: '나가기',
    },
    leaveTips: '이 페이지에서 나가시겠습니까?',
  },
  addcycles: {
    title: 'cycles를 추가',
    cycles: 'cycles',
    charge: '수수료',
  },
  changecontrol: {
    title: '노트 컨트롤러 변경하기',
    tips: '노트의 소유권을 이전하면 이 노트의 Canister 컨트롤러는 더 이상 Dstar의 소유가 아닙니다.고객님의 코드를 유지 서비스를 해드릴 수가 없습니다. 하지만 정상적인 메모를 읽고 쓸 수 있습니다.모든 canister는 고객님의 장치와 직접 인터페이스를 합니다.',
    placehoder: '컨트롤러 ID',
    condition: '나는 컨트롤러 소유권 이전으로 인해 발생하는 모든 위험을 잘 알고있으며,이로 인해 발생한 모든 책임은 본인에게 있습니다.',
    btn: '인터넷을 이용한 신분변경',
  },
  transfer: {
    title: '내부 전송',
    tips: 'canister를 비워진 상태인지 확인해주세요，canister 내 데이타가  있는 경우 전송이 불가능합니다!',
    error: '오류 발생! canister가 비어 있지 않습니다.',
    btn: '인터넷 아이텐티티(ii)로 전송하기',
  },
  remove: {
    title: '노트 제거',
    btn: '제거',
    condition: '노트를 제거하기 전에 컨트롤러를 제거해 주십시오',
  },
  logout: {
    title: '로그아웃',
    tips: 'Dstar 노트에 로그아웃 할 실 겁니까？',
  },
  deletenote: {
    title: '노트를 삭제',
    condition: {
      one: '블록체인에서 삭제하기',
      two: '삭제된 내용이 백업할 수가 없습니다',
    },
  },
  sendnote: {
    title: '노트 보내기',
    tips: '아래와 같이 노트를 보냅니다.',
    items: {
      item1: '-로 보내기',
      item2: '퍼블릭 키',
    },
    placehoder: '수신자의 퍼블릭 키를 삽입해주세요',
    tips2: '퍼블릭 키를 잘 확인해주세요，잘 못 보내질 경우 타인에게 내용 유출 기능성이 있습니다. 모든 전송은 암호화되어 있기 때문에 수진자만 시크릿 키로 관련된 내용을 확인할 수 있습니다.',
  },
  pwd: {
    title: '비밀번호',
    items: {
      item1: '웹사이트',
      item1_sub: '(제목)',
      placehoder1: '웹사이트 혹은 제목',
      item2: '계정',
      placehoder2: '나의 계정',
      item3: '비밀번호',
      item3_sub: '(시크릿 키)',
      placehoder3: '나의 비밀번호',
    },
    btn: '인터넷 아이텐티티(ii(로 표시하기',
    deltitle: '비밀번호 삭제',
    delbtn: '인터넷 아이텐티티(ii)로 삭제',
    delcondition: {
      one: '블록체인에서 삭제됩니다.',
      two: '복구가 불가능합니다.',
    },
  },
  addcontrollers: {
    title: '컨트롤러 추가',
    btnName: '해시 값 인증하기',
    placehoder: '노트 canister ID',
    h1: 'canister 컨트롤러를 아래와 같은 상태로 설정해 주세요.',
    tips: '해당 cainster의 노트인지 확인하기 위해, 고객님의 해시 값 순서를 인증해야 합니다. 변경 전에 해당 cainster의 컨트롤러를 변경하지 마세요.',
    h2: '이 주소로 ICP를 보내기',
  },
  wallet: {
    title: '거래 내역',
    items: {
      item1: '날짜',
      item2: '유형',
      item3: '받음',
      item4: '보내기',
      item5: '수량',
    },
    stitle: {
      st1: '잔고',
      st2: '지갑 주소',
    },
    btnName: {
      deposit: '입금',
      withdraw: '출금',
      all: 'all',
    },
    dtips: '입금하신 모든 ICP는 고객님의 지갑에 입금될 겁니다. 다음에 편하게 사용 가능할 수 있으며, 또한 언제든지 출금할 수 있습니다.',
    wtips: 'Principal ID가 아닌 account주소를 입력해주세요',
    placehoder1: '입금 주소',
    placehoder2: '최소 금액：0.01',
  },
  user: {
    registerTime: '가입 시간',
    publickey: '장치 퍼블릭 키',
    title: {
      t1: '지금 백업하기',
      t2: '내 장치',
    },
    btnName: {
      seed: '니모닉 문구',
      yubikey: 'YubiKey',
      setpwd: '비밀번호 설정하세요',
      changepwd: '비밀번호 수정하세요',
    },
    changevtitle: '프로필 사진을 선택하세요',
    del: {
      title: '장치 삭제',
      tips: '장치를 다시 로그인할 때,시크릿 키는 삭제될 것입니다!',
    },
  },
  BtnName: {
    Register: '가입',
    clickTxt: '잠시만 기다려 주십시오',
    successTxt: '완료되었습니다',
    apply: '신청;',
    keysync: '신청하여 요청하기',
    confirm: '확인',
    cancel: '취소',
    nobalance: '잔고 부족',
    logout: '로그아웃',
    delete: '삭제',
    send: ' 보내기',
    add: '추가',
    update: '업그레이드',
  },
  alertTips: {
    tips1: '이미 등록되어 있는 장치 이름입니다.다른 이름으로 가입하세요',
  },
  nft: {
    title: '보내다',
    name: '행성',
    sub_t: '보내다',
    claimbtn: '주장하다',
    claimtxt: '청구',
    claimtitle: 'NFT 청구',
    claiminfo: '행운을 빕니다! NFT 신청을 시작하세요!',
    claimsuccess: '축하합니다! 클레임 성공!',
    notitle: '공중 투하',
    notips: '에어드랍이 되지 않았습니다!',
    nobtn: '내가 참조',
  },
};