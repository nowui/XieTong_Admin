import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Modal } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const confirm = Modal.confirm

let page = 1

class BrandIndex extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      page: page,
      total: 0,
      list: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/brand/index')

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
      url: '/brand/list',
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

  del = function(brand_id) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/brand/delete',
      data: {
        brand_id: brand_id
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
      pathname: '/brand/add',
      query: {

      }
    })
  }

  onClickEdit(brand_id) {
    this.props.router.push({
      pathname: '/brand/edit/' + brand_id,
      query: {

      }
    })
  }

  onClickDel(brand_id) {
    let self = this

    confirm({
      title: Helper.message,
      content: Helper.delete,
      onOk() {
        self.del(brand_id)
      },
      onCancel() {

      }
    })
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'brand_name',
      key: 'brand_name'
    }, {
      width: 150,
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.onClickEdit.bind(this, record.brand_id)}>修改</a>
          <span className="ant-divider"></span>
          <a onClick={this.onClickDel.bind(this, record.brand_id)}>删除</a>
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
            <h1>品牌列表</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>品牌列表</Breadcrumb.Item>
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

export default withRouter(BrandIndex)