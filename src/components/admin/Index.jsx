import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Modal } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const confirm = Modal.confirm

let page = 1

class AdminIndex extends Component {

  constructor(props) {
    super(props)

    self = this

    this.state = {
      isLoad: false,
      page: page,
      total: 0,
      list: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/admin/index')

    this.load(page)
  }

  onChange = function(currentPage) {
    this.load(currentPage)
  }

  load = function(currentPage) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/admin/list',
      data: {
        page: currentPage,
        limit: Helper.limit
      },
      success: function(data) {
        page = currentPage

        self.setState({
          page: currentPage,
          total: data.total,
          list: data.list
        })
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  del = function(admin_id) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/admin/delete',
      data: {
        admin_id: admin_id
      },
      success: function(data) {
        self.load(page)
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  onClickAdd(event) {
    this.props.router.push({
      pathname: '/admin/add',
      query: {

      }
    })
  }

  onClickEdit(admin_id) {
    this.props.router.push({
      pathname: '/admin/edit/' + admin_id,
      query: {

      }
    })
  }

  onClickAuthorization(admin_id) {
    this.props.router.push({
      pathname: '/admin/authorization/' + admin_id,
      query: {

      }
    })
  }

  onClickDel(admin_id) {
    let self = this

    confirm({
      title: Helper.message,
      content: Helper.delete,
      onOk() {
        self.del(admin_id)
      },
      onCancel() {

      }
    })
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'admin_name',
      key: 'admin_name'
    }, {
      width: 150,
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.onClickEdit.bind(this, record.admin_id)}>修改</a>
          <span className="ant-divider"></span>
          <a onClick={this.onClickAuthorization.bind(this, record.user_id)}>授权</a>
          <span className="ant-divider"></span>
          <a onClick={this.onClickDel.bind(this, record.admin_id)}>删除</a>
        </span>
      )
    }]

    const pagination = {
      current: this.state.page,
      total: this.state.total,
      pageSize: Helper.limit,
      onChange: this.onChange.bind(this)
    }

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>管理员列表</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>管理员列表</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button type="default" icon="reload" size="default" className="button-reload" onClick={this.load.bind(this, page)}>刷新</Button>
            <Button type="primary" icon="plus-circle" size="default" onClick={this.onClickAdd.bind(this)}>新增</Button>
          </Col>
        </Row>

        <Table columns={columns} dataSource={this.state.list} pagination={pagination} />
      </Spin>
    )
  }
}

export default withRouter(AdminIndex)