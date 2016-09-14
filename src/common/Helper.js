import reqwest from 'reqwest'
import { message } from 'antd'

const Helper = {
  host: 'http://localhost:8080',
  //host: 'http://api.xietong.nowui.com',
  inputWidth: 390,
  inputSearchWidth: 250,
  formItemLayout: {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 }
  },
  platform: 'admin',
  version: '1.0.0',
	limit: 15,
  duration: 1.5,
  message: '提示',
  description: '操作成功',
  token: 'token',
  required: '不能为空',
  delete: '删除后将无法恢复，您确定要删除吗？',
  notificationSuccess: function() {
    message.success(this.description, this.duration)
  },
	ajax: function(config) {
    reqwest({
      url: this.host + config.url,
      type: 'json',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': this.getToken(),
        'platform': this.platform,
        'version': this.version
      },
      data: JSON.stringify(config.data),
      success: function (response) {
        if(response.code == 200) {
          config.success(response.data)
        } else {
          message.error(response.message, this.duration)
        }
      },
      error: function (error) {
        message.error('网络发生错误', this.duration)
      },
      complete: function (response) {
        config.complete()
      }
    })
	},
  getToken() {
    return localStorage.getItem(this.token)
  },
  login: function(token) {
    localStorage.setItem(this.token, token)
  },
  logout: function() {
    localStorage.removeItem(this.token)
  },
  course_class: [{
    value: '17',
    text: '星期一第七节'
  }, {
    value: '27',
    text: '星期二第七节'
  }, {
    value: '28',
    text: '星期二第八节'
  }, {
    value: '47',
    text: '星期四第七节'
  }, {
    value: '48',
    text: '星期四第八节'
  }, {
    value: '56',
    text: '星期五第六节'
  }]
}

export default Helper