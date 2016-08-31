import React from 'react'
import { Modal, Button, Upload, Icon, Spin, Pagination } from 'antd'
import Helper from '../../common/Helper'

import styles from './ModalImage.less'

let activeMap = new Map()
const limit = 16

class ModalImage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      visible: false,
      page: 1,
      total: 0,
      list: []
    }
  }

  componentDidMount() {

  }

  check = function(list) {
    let array = list

    for (let i = 0; i < array.length; i++) {
      array[i].active = false

      for (let key of activeMap.keys()) {
        if (array[i].url == key) {
          array[i].active = true
        }
      }
    }

    this.setState({
      list: array
    })
  }

  load = function(currentPage) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/upload/list',
      data: {
        page: currentPage,
        limit: limit
      },
      success: function(data) {
        for(let i = 0; i < data.list.length; i++) {
          data.list[i].url = Helper.host + data.list[i].url
          data.list[i].active = false
        }

        self.setState({
          page: currentPage,
          total: data.total
        })

        self.check(data.list)
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  onChangePage = function(currentPage) {
    this.load(currentPage)
  }

  onClickOk(event) {
    let array = []

    for (let key of activeMap.keys()) {
      array.push({
        url: key
      })
    }

    activeMap.clear()

    this.check(this.state.list)

    this.setState({
      visible: false
    })

    this.props.onClickSubmitImage(array)
  }

  onClickOpen(event) {
    this.load(1)

    this.setState({
      visible: true
    })
  }

  onClickCancel(event) {
    this.setState({
      visible: false
    })
  }

  onClickActive(url) {
    if (activeMap.has(url)) {
      activeMap.delete(url)
    } else {
      activeMap.set(url, '')
    }

    this.check(this.state.list)
  }

  onChange(info) {
    if (info.file.status === 'done') {
      this.load(this.state.page)
    }
  }

  render() {
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      accept: 'image/jpg,image/jpeg,image/png,image/gif',
      action: Helper.host + '/upload/image',
      headers: {
        'token': Helper.getToken(),
        'platform': Helper.platform,
        'version': Helper.version
      },
      onChange: this.onChange.bind(this)
    }

    return (
      <Modal title="我的图片" width={910} visible={this.state.visible} closable={false} maskClosable={false} onOk={this.onClickOk} onCancel={this.onClickCancel} footer={[
        <div key="upload" style={{float: 'left', marginLeft: 5}}>
          <Upload {...props}>
            <Button type="ghost">
              <Icon type="cloud-upload" />点击上传
            </Button>
          </Upload>
        </div>,
        <Button key="back" type="ghost" size="default" icon="cross-circle" onClick={this.onClickCancel.bind(this)}>关闭</Button>,
        <Button key="submit" type="primary" size="default" icon="check-circle" onClick={this.onClickOk.bind(this)}>
          确定
        </Button>
      ]}>
        <Spin size="large" spinning={this.state.isLoad}>
          <div style={{clear: 'both', display: 'table', content: '', minHeight: 100}}>
            {
              this.state.list.map(function (item) {
                return (
                  <div key={item.url} className={"ant-upload-list ant-upload-list-picture-card " + styles.card}>
                    <div className="ant-upload-list-item ant-upload-list-item-done" style={{padding: '0px'}}>
                      <div className={"ant-upload-list-item-info " + styles.info + " " + (item.active ? styles.active : "")} onClick={this.onClickActive.bind(this, item.url)}>
                        <a className="ant-upload-list-item-thumbnail" style={{backgroundImage: 'url(' + item.url + ')', backgroundPosition: 'center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}>
                        </a>
                      </div>
                      <i className={"anticon anticon-check " + styles.check} style={item.active ? {} : {display: 'none'}} onClick={this.onClickActive.bind(this, item.url)}></i>
                    </div>
                  </div>
                )
              }.bind(this))
            }
          </div>
          <div style={{height: '25px'}}>
            <div style={{float: 'right'}}>
              <Pagination pageSize={limit} current={this.state.page} total={this.state.total} onChange={this.onChangePage.bind(this)} />
            </div>
          </div>
        </Spin>
      </Modal>
    )
  }
}

export default ModalImage
