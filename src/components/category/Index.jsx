import React, { Component } from 'react'
import { withRouter, Link } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Modal } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const confirm = Modal.confirm

let page = 1

class CategoryIndex extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      isVisible: false,
      category: {},
      expandedRowKeys: []
    }
  }

  componentDidMount() {
    this.load(page)
  }

  load = function(currentPage) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/' + self.props.category_key + self.props.sub_url + '/list',
      data: {
        category_key: self.props.category_key
      },
      success: function(data) {
        self.checkList(data.children)

        self.setState({
          category: data
        })
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  del = function(category_id) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/' + self.props.category_key + self.props.sub_url + '/delete',
      data: {
        category_id: category_id
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

  checkList(list) {
    for(let i = 0; i < list.length; i++) {
      list[i].key = list[i].id

      this.setState({
        expandedRowKeys: this.state.expandedRowKeys.concat(list[i].id)
      })

      if(list[i].children) {
        this.checkList(list[i].children)
      }
    }
  }

  onClickAdd(parent_id) {
    this.props.router.push({
      pathname: '/' + this.props.category_key + this.props.sub_url + '/add/' + parent_id,
      query: {

      }
    })
  }

  onClickEdit(category_id) {
    this.props.router.push({
      pathname: '/' + this.props.category_key + this.props.sub_url + '/edit/' + category_id,
      query: {

      }
    })
  }

  onClickDel(category_id) {
    let self = this

    confirm({
      title: Helper.message,
      content: '删除后将无法恢复，您确定要删除吗？',
      onOk() {
        self.del(category_id)
      },
      onCancel() {

      }
    })
  }

  onRowClick(expanded, record) {
    let index = -1
    let array = []

    for(let i = 0; i < this.state.expandedRowKeys.length; i++) {
      if(record.id == this.state.expandedRowKeys[i]) {
        index = i

        break
      }
    }

    if(index == -1) {
      array = this.state.expandedRowKeys

      array.push(record.id)
    } else {
      for(let i = 0; i < this.state.expandedRowKeys.length; i++) {
        if(i != index) {
          array.push(this.state.expandedRowKeys[i])
        }
      }
    }

    this.setState({
      expandedRowKeys: array
    })
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort'
    }, {
      width: 150,
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.onClickAdd.bind(this, record.id)}>新增</a>
          <span className="ant-divider"></span>
          <a onClick={this.onClickEdit.bind(this, record.id)}>修改</a>
          <span className="ant-divider"></span>
          {
            this.props.operation.map(function (item, index) {
              return (
                <span key={item.key}>
                  <Link to={item.url + '/' + record.id}>{item.name}</Link>
                  <span className="ant-divider"></span>
                </span>
              )
            })
          }
          <a onClick={this.onClickDel.bind(this, record.id)}>删除</a>
        </span>
      )
    }]

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>{this.props.category_name}列表</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.category_name}列表</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button type="default" icon="reload" size="default" className="button-reload" onClick={this.load.bind(this, page)}>刷新</Button>
            <Button type="primary" icon="plus-circle" size="default" onClick={this.onClickAdd.bind(this, this.state.category.id)}>新增</Button>
          </Col>
        </Row>

        <Table columns={columns} dataSource={this.state.category.children} expandedRowKeys={this.state.expandedRowKeys} pagination={false} onExpand={this.onRowClick.bind(this)} />
      </Spin>
    )
  }
}

CategoryIndex.propTypes = {
    category_key: React.PropTypes.string.isRequired,
    sub_url: React.PropTypes.string.isRequired,
    category_name: React.PropTypes.string.isRequired,
    operation: React.PropTypes.array.isRequired
}

CategoryIndex.defaultTypes = {
    operation:[]
}

export default withRouter(CategoryIndex)