import { toast } from 'react-toastify'

export const Toast = () => {
  const saved = () => {
    toast.success('保存しました。', {
      position: 'top-center', //ポジションを指定。top-right, top-left, top-center, bottom-left, bottom-right, bottom-centerから選択
      autoClose: 3000, //設定したミリ秒経過時にclose defaultは5000
      hideProgressBar: true, //プログレスバーを制御
      closeOnClick: true, //クリックで消せるか否かを制御
      pauseOnHover: true, //ホバーするとミリ秒の進行が止まる
      draggable: true, //ドラッグしながら消すことができる
      progress: undefined, //プログレスバーの長さを制御 undefinedで問題なし
      theme: 'colored', //背景をlight,dark,cloredから選択
    })
  }
  const updated = () => {
    toast.info('更新しました。', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }
  const deleted = () => {
    toast.error('削除しました。', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }

  const error = (msg: string) => {
    toast.warning(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }
  const success = (msg: string) => {
    toast.success(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }
  return { saved, updated, deleted, error, success }
}
