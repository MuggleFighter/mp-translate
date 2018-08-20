//index.js
const translate = require('../util/translate.js')
const langList = require('../assets/langList')
const throttle = require('../util/throttle.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    fromLangList:langList,
    toLangList:langList.slice(1),
    fromLangIndex:0,
    toLangIndex:0,
    canExchange:false,
    translatedText:'',
    loading:false,
    q:'',
    history:wx.getStorageSync('history') || [],
  },
  onLoad() {
    // 节流,input事件触发频繁，需要节流避免频繁发送数据
    this.translate = throttle(this.sendData,this)
  },
  changeFromLang(e) {
    // e.detail.value是字符串
    const value = parseInt(e.detail.value)
    this.setData({
      fromLangIndex:value,
      canExchange:value === 0 ? false : true
    })
    // 切换语言，发送请求
    this.sendData()
  },
  changeToLang(e) {
    this.setData({
      toLangIndex:parseInt(e.detail.value)
    })
    //切换语言，发送请求
    this.sendData()
  },
  exchangeLang() {
    const {canExchange,fromLangIndex,toLangIndex,translatedText} = this.data
    if(!canExchange) return
    this.setData({
      canExchange:fromLangIndex === 0 ? false : true,
      fromLangIndex: toLangIndex + 1,
      toLangIndex:fromLangIndex - 1,
      q:translatedText
    })
    // 交换语言，发送请求
    this.sendData()
  },

  onInput(e) {
    const value = e.detail.value
    this.setData({
      q:value,
    })
    // 当值为空时（删除待翻译文本至空值）,不发送请求,清空翻译结果
    if(!value.trim()) {
      this.setData({
        translatedText:''
      })
      return
    }
    this.translate()
  },
  // 抽离发送请求的函数
  sendData(push){
    const {q,fromLangList,toLangList,fromLangIndex,toLangIndex,history} = this.data
    if(!q.trim()) return
    const from = fromLangList[fromLangIndex].code
    const to = toLangList[toLangIndex].code
    translate({q,from,to}).then(result=> {
      this.setData({
        translatedText:result
      })
      if(push) {
        history.unshift({from,to,q,result,fromLangIndex,toLangIndex})
        this.setData({
          history
        })
        wx.setStorageSync('history',history)
      }
    })
  },
  onConfirm(e) {
    console.log('confirm: ', e)
  },
  setCurrentLang() {

  },
  clearText() {
    this.setData({
      q:'',
      translatedText:''
    })
  },
  pushToHistory() {
    this.sendData(true)
  },
  visitHistory(e) {
    const {q,result} = e.currentTarget.dataset
    this.setData({
      q,
      translatedText:result
    })
  }
})
