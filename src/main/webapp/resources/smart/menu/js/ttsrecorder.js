// 1. websocket连接：判断浏览器是否兼容，获取websocket url并连接，这里为了方便本地生成websocket url
// 2. 连接websocket，向websocket发送数据，实时接收websocket返回数据
// 3. 处理websocket返回数据为浏览器可以播放的音频数据
// 4. 播放音频数据
// ps: 该示例用到了es6中的一些语法，建议在chrome下运行

var transcode = {
  transToAudioData: function(audioDataStr, fromRate = 16000, toRate = 22505) {
    let outputS16 = transcode.base64ToS16(audioDataStr)
    let output = transcode.transS16ToF32(outputS16)
    output = transcode.transSamplingRate(output, fromRate, toRate)
    output = Array.from(output)
    return {
      data: output, 
      rawAudioData: Array.from(outputS16)
    }
  },
  transSamplingRate: function(data, fromRate = 44100, toRate = 16000) {
    var fitCount = Math.round(data.length * (toRate / fromRate))
    var newData = new Float32Array(fitCount)
    var springFactor = (data.length - 1) / (fitCount - 1)
    newData[0] = data[0]
    for (let i = 1; i < fitCount - 1; i++) {
      var tmp = i * springFactor
      var before = Math.floor(tmp).toFixed()
      var after = Math.ceil(tmp).toFixed()
      var atPoint = tmp - before
      newData[i] = data[before] + (data[after] - data[before]) * atPoint
    }
    newData[fitCount - 1] = data[data.length - 1]
    return newData
  },
  transS16ToF32: function(input) {
    var tmpData = []
    for (let i = 0; i < input.length; i++) {
      var d = input[i] < 0 ? input[i] / 0x8000 : input[i] / 0x7fff
      tmpData.push(d)
    }
    return new Float32Array(tmpData)
  },
  base64ToS16: function(base64AudioData) {
    base64AudioData = atob(base64AudioData)
    const outputArray = new Uint8Array(base64AudioData.length)
    for (let i = 0; i < base64AudioData.length; ++i) {
      outputArray[i] = base64AudioData.charCodeAt(i)
    }
    return new Int16Array(new DataView(outputArray.buffer).buffer)
  },
}


//APPID，APISecret，APIKey在控制台-我的应用-语音合成（流式版）页面获取
const APPID = '5e95c703'
const API_SECRET = '90a820c78484571e17d28fa1ddbafb93'
const API_KEY = '7ccdec0c1819c67489b8b47c4016c0c3'

function getWebsocketUrl() {
  return new Promise((resolve, reject) => {
    var apiKey = API_KEY
    var apiSecret = API_SECRET
    var url = 'wss://tts-api.xfyun.cn/v2/tts'
    var host = location.host
    var date = new Date().toGMTString()
    var algorithm = 'hmac-sha256'
    var headers = 'host date request-line'
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    var signature = CryptoJS.enc.Base64.stringify(signatureSha)
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    var authorization = btoa(authorizationOrigin)
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
    resolve(url)
  })
}
class TTSRecorder {
  constructor({
    speed = 50,
    voice = 50,
    pitch = 50,
    voiceName = 'xiaoyan',
    appId = APPID,
    text = '',
    textTemp = '',
    layerConter = '',
    tte = 'UTF8',
    defaultText = '监测站的AQI达到119，为轻度污染，首要污染物PM2.5,浓度达到90μg/m³。污染方位可能来自东南方向16公里内。',
  } = {}) {
    this.speed = speed
    this.voice = voice
    this.pitch = pitch
    this.voiceName = voiceName
    this.text = text
    this.textTemp = ''
    this.layerConter = ''
    this.tte = tte
    this.defaultText = defaultText
    this.appId = appId
    this.audioData = []
    this.rawAudioData = []
    this.audioDataOffset = 0
    this.status = 'init'

  }
  // 修改录音听写状态
  setStatus(status) {
    this.onWillStatusChange && this.onWillStatusChange(this.status, status)
    this.status = status
  }
  //语音播报时换成“氮氧化物”  “SO2”换成“二氧化硫”
  replaceVideoPltName(value) {
      value = value || '';
      value = value.replace('NOx', '氮氧化物');
      let labelObj = {
          SO2: '二氧化硫',
          'SO₂': '二氧化硫',
          'NO₂': '二氧化氮',
          NO2: '二氧化氮',
          'mg/m³': '毫克每立方米',
          'μg/m³': '微克每立方米',
          'O₃': '臭氧',
          O3: '臭氧',
          CO: '一氧化碳',
          'PM2.5': '颗粒物',
          'PM₂.₅': '颗粒物',
          PM25: '颗粒物',
          'PM₁₀': '细颗粒物',
          PM10: '细颗粒物'
      };
      return value.replace(/\w+[0-9]+\.*[0-9]*/g, function() {
          return labelObj[arguments[0]] || arguments[0];
      });
  }
//设置合成相关参数
  setText(text) {
	this.audioStop()
	var sayText = this.replaceVideoPltName(text);
    sayText = sayText.replace(/mg\/m³/g, '毫克每立方米');
    sayText = sayText.replace(/μg\/m³/g, '微克每立方米');
//    console.log(sayText);
    this.text = sayText;
    this.resetAudio()
  }
  // 设置合成相关参数
  setParams({ speed, voice, pitch, text, voiceName, tte }) {
    speed !== undefined && (this.speed = speed)
    voice !== undefined && (this.voice = voice)
    pitch !== undefined && (this.pitch = pitch)
    text && (this.text = text)
    tte && (this.tte = tte)
    voiceName && (this.voiceName = voiceName)
    this.resetAudio()
  }
  // 连接websocket
  connectWebSocket() {
    this.setStatus('ttsing')
    return getWebsocketUrl().then(url => {
      let ttsWS
      if ('WebSocket' in window) {
        ttsWS = new WebSocket(url)
      } else if ('MozWebSocket' in window) {
        ttsWS = new MozWebSocket(url)
      } else {
        alert('浏览器不支持WebSocket')
        return
      }
      this.ttsWS = ttsWS
      ttsWS.onopen = e => {
        this.webSocketSend()
        this.playTimeout = setTimeout(() => {
          this.audioPlay()
        }, 1000)
      }
      ttsWS.onmessage = e => {
        this.result(e.data)
      }
      ttsWS.onerror = e => {
        clearTimeout(this.playTimeout)
        this.setStatus('errorTTS')
        alert('WebSocket报错，请f12查看详情')
        console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`)
      }
      ttsWS.onclose = e => {
        console.log(e)
      }
    })
  }
  // 处理音频数据
  transToAudioData(audioData) {}
  // websocket发送数据
  webSocketSend() {
    var params = {
      common: {
        app_id: this.appId, // APPID
      },
      business: {
        aue: 'raw',
        auf: 'audio/L16;rate=16000',
        vcn: this.voiceName,
        speed: this.speed,
        volume: this.voice,
        pitch: this.pitch,
        bgs: 1,
        tte: this.tte,
      },
      data: {
        status: 2,
        text: this.encodeText(
          this.text || this.defaultText,
          this.tte === 'unicode' ? 'base64&utf16le' : ''
        )
      },
    }
    this.ttsWS.send(JSON.stringify(params))
  }
  encodeText (text, encoding) {
    switch (encoding) {
      case 'utf16le' : {
        let buf = new ArrayBuffer(text.length * 4)
        let bufView = new Uint16Array(buf)
        for (let i = 0, strlen = text.length; i < strlen; i++) {
          bufView[i] = text.charCodeAt(i)
        }
        return buf
      }
      case 'buffer2Base64': {
        let binary = ''
        let bytes = new Uint8Array(text)
        let len = bytes.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
      }
      case 'base64&utf16le' : {
        return this.encodeText(this.encodeText(text, 'utf16le'), 'buffer2Base64')
      }
      default : {
        return Base64.encode(text)
      }
    }
  }
  // websocket接收数据的处理
  result(resultData) {
    let jsonData = JSON.parse(resultData)
    // 合成失败
    if (jsonData.code !== 0) {
      alert(`合成失败: ${jsonData.code}:${jsonData.message}`)
      console.error(`${jsonData.code}:${jsonData.message}`)
      this.resetAudio()
      return
    }
    //转换audio
//    transWorker.postMessage(jsonData.data.audio)
    var trreturn = transcode.transToAudioData(jsonData.data.audio);
    this.audioData.push(...trreturn.data)
    this.rawAudioData.push(...trreturn.rawAudioData)

    if (jsonData.code === 0 && jsonData.data.status === 2) {
      this.ttsWS.close()
    }
  }
  // 重置音频数据
  resetAudio() {
    this.audioStop()
    this.setStatus('init')
    this.audioDataOffset = 0
    this.audioData = []
    this.rawAudioData = []
    this.ttsWS && this.ttsWS.close()
    clearTimeout(this.playTimeout)
  }
  // 音频初始化
  audioInit() {
//    console.log('class init');
    let AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      this.audioContext = new AudioContext()
      this.audioContext.resume()
      this.audioDataOffset = 0
    } 
  }
  // 音频播放
  audioPlay() {
//    console.log('class play');
    this.setStatus('play')
    let audioData = this.audioData.slice(this.audioDataOffset)
    this.audioDataOffset += audioData.length
    let audioBuffer = this.audioContext.createBuffer(1, audioData.length, 22050)
    let nowBuffering = audioBuffer.getChannelData(0)
    if (audioBuffer.copyToChannel) {
      audioBuffer.copyToChannel(new Float32Array(audioData), 0, 0)
    } else {
      for (let i = 0; i < audioData.length; i++) {
        nowBuffering[i] = audioData[i]
      }
    }
    let bufferSource = this.bufferSource = this.audioContext.createBufferSource()
    bufferSource.buffer = audioBuffer
    bufferSource.connect(this.audioContext.destination)
    bufferSource.start()
    bufferSource.onended = event => {
      if (this.status !== 'play') {
        return
      }
      if (this.audioDataOffset < this.audioData.length) {
        this.audioPlay()
      } else {
        this.audioStop()
      }
    }
  }
  // 音频播放结束
  audioStop() {
//    console.log('class stop');
    this.setStatus('endPlay')
    clearTimeout(this.playTimeout)
    this.audioDataOffset = 0
    if (this.bufferSource) {
      try {
        this.bufferSource.stop()
      } catch (e) {
        console.log(e)
      }
    }
  }
  start() {
//    console.log('class start');
	  this.dingPlay()
    if(this.audioData.length) {
      this.audioPlay()
    } else {
      if (!this.audioContext) {
        this.audioInit()
      }
      if (!this.audioContext) {
        alert('该浏览器不支持webAudioApi相关接口')
        return
      }
      this.connectWebSocket()
    }
  }
  stop() {
    this.audioStop()
  }
  dingPlay() {
	  var d = document.createElement("audio");
	  var path = Common.webRoot() + "/resources/smart/menu/sound/";
      navigator.userAgent.match("Firefox/") ? d.setAttribute("src", path + "bigbox.ogg") : d.setAttribute("src", path +  "bigbox.mp3");
      d.addEventListener("load", function() { d.play()}, !0);
      d.play()
  }
}

// ======================开始调用=============================
let ttsRecorder = new TTSRecorder()
ttsRecorder.onWillStatusChange = function(oldStatus, status) {
  let btnState = {
    init: '立即合成',
    ttsing: '正在合成',
    play: '停止播放',
    endPlay: '重新播放',
    errorTTS: '合成失败',
  }
//  console.log(btnState[status]);
}
