import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Modal, Menu } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const confirm = Modal.confirm

let page = 1
let menu_id = ''

class OperationIndex extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      page: page,
      total: 0,
      list: [],
      isSelect: menu_id == '' ? false : true,
      openKeys: ['-1'],
      selectedKeys: [menu_id],
      menuList: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/operation/index')

    this.loadMenu()
  }

  onChange = function(currentPage) {
    this.load(currentPage)
  }

  loadMenu = function() {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/menu/list',
      data: {

      },
      success: function(data) {
        self.setState({
          menuList: data.children
        })

        let array = []

        for(let i = 0; i < self.state.menuList.length; i++) {
          array.push(self.state.menuList[i].id)
        }

        self.setState({
          openKeys: array
        })

        if(menu_id != '') {
          self.load(page)
        }
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  load = function(currentPage) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/operation/list',
      data: {
        page: currentPage,
        limit: Helper.limit,
        menu_id: menu_id
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

  del = function(operation_id) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/operation/delete',
      data: {
        operation_id: operation_id
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
      pathname: '/operation/add/' + menu_id,
      query: {

      }
    })
  }

  onClickEdit(operation_id) {
    this.props.router.push({
      pathname: '/operation/edit/' + operation_id,
      query: {

      }
    })
  }

  onClickDel(operation_id) {
    let self = this

    confirm({
      title: Helper.message,
      content: Helper.delete,
      onOk() {
        self.del(operation_id)
      },
      onCancel() {

      }
    })
  }

  onOpen(item) {
    this.setState({
      openKeys: item.openKeys
    })
  }

  onClose(item) {
    this.setState({
      openKeys: item.openKeys
    })
  }

  onClick(item) {
    this.setState({
      isSelect: true,
      selectedKeys: [item.key]
    })

    menu_id = item.key

    this.load(page)
  }

  render() {
    const confirm = Modal.confirm
    const SubMenu = Menu.SubMenu
    const MenuItemGroup = Menu.ItemGroup

    const columns = [{
      title: '名称',
      dataIndex: 'operation_name',
      key: 'operation_name'
    }, {
      title: '排序',
      dataIndex: 'operation_sort',
      key: 'operation_sort'
    }, {
      width: 150,
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.onClickEdit.bind(this, record.operation_id)}>修改</a>
          <span className="ant-divider"></span>
          <a onClick={this.onClickDel.bind(this, record.operation_id)}>删除</a>
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
            <h1>菜单操作列表</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>菜单操作列表</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            {
              this.state.isSelect ?
                <Button type="primary" icon="plus-circle" size="default" onClick={this.onClickAdd.bind(this)}>新增</Button>
              :
              <span>&nbsp;</span>
            }
          </Col>
        </Row>
        <div className={styles.content}>
          <div className={styles.left}>
            <Menu className={styles.siderMenu} mode="inline" openKeys={this.state.openKeys} selectedKeys={this.state.selectedKeys} onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)} onClick={this.onClick.bind(this)}>
              {
                this.state.menuList.map(function (item, index) {
                  return (
                    <SubMenu key={item.id} title={<span>{item.name}</span>}>
                      {
                        item.children.map(function (children, i) {
                          return (
                            <Menu.Item key={children.id}>{children.name}</Menu.Item>
                          )
                        })
                      }
                    </SubMenu>
                  )
                })
              }
            </Menu>
          </div>
          <div className={styles.right}>
            <Button type="default" icon="reload" size="default" className="button-reload" onClick={this.load.bind(this, page)}>刷新</Button>
            <Table columns={columns} dataSource={this.state.list} pagination={pagination} />
          </div>
        </div>
      </Spin>
    )
  }
}

export default withRouter(OperationIndex)