import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Modal, Menu } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const confirm = Modal.confirm
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

let self
let page = 1
let group_id = ''

let pagination = {
  total: 0,
  pageSize: Helper.limit,
  onChange(currentPage) {
    self.load(currentPage)
  }
}

const columns = [{
  title: '名称',
  dataIndex: 'role_name',
  key: 'role_name'
}, {
  title: '排序',
  dataIndex: 'role_sort',
  key: 'role_sort'
}, {
  width: 150,
  title: '操作',
  dataIndex: '',
  render: (text, record, index) => (
    <span>
      <a onClick={self.onClickEdit.bind(this, record.role_id)}>修改</a>
      <span className="ant-divider"></span>
      <a onClick={self.onClickAuthorization.bind(this, record.role_id)}>授权</a>
      <span className="ant-divider"></span>
      <a onClick={self.onClickDel.bind(this, record.role_id)}>删除</a>
    </span>
  )
}];

class RoleIndex extends Component {

  constructor(props) {
    super(props)

    self = this

    this.state = {
      isLoad: false,
      list: [],
      isSelect: group_id == '' ? false : true,
      openKeys: ['-1'],
      selectedKeys: [group_id],
      menuList: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/role/index')

    //self.load(page)

    self.loadMenu()
  }

  loadMenu = function() {
    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/group/list',
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

        if(group_id != '') {
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
    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/role/list',
      data: {
        page: currentPage,
        limit: Helper.limit,
        group_id: group_id
      },
      success: function(data) {
        page = currentPage

        pagination.total = data.total

        self.setState({
          list: data.list
        })
      },
      complete: function() {
        pagination.current = page

        self.setState({
          isLoad: false
        })
      }
    })
  }

  del = function(role_id) {
    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/role/delete',
      data: {
        role_id: role_id
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
    self.props.router.push({
      pathname: '/role/add/' + group_id,
      query: {

      }
    })
  }

  onClickEdit(role_id) {
    self.props.router.push({
      pathname: '/role/edit/' + role_id,
      query: {

      }
    })
  }

  onClickAuthorization(role_id) {
    self.props.router.push({
      pathname: '/role/authorization/' + role_id,
      query: {

      }
    })
  }

  onClickDel(role_id) {
    confirm({
      title: Helper.message,
      content: Helper.delete,
      onOk() {
        self.del(role_id)
      },
      onCancel() {

      }
    })
  }

  onOpen(item) {
    self.setState({
      openKeys: item.openKeys
    })
  }

  onClose(item) {
    self.setState({
      openKeys: item.openKeys
    })
  }

  onClick(item) {
    self.setState({
      isSelect: true,
      selectedKeys: [item.key]
    })

    group_id = item.key

    self.load(page)
  }

  render() {
    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>分组角色列表</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>分组角色列表</Breadcrumb.Item>
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
                    <Menu.Item key={item.id}>{item.name}</Menu.Item>
                  )
                })
              }
            </Menu>
          </div>
          <div className={styles.right}>
            <Table columns={columns} dataSource={this.state.list} pagination={pagination} />
          </div>
        </div>
      </Spin>
    )
  }
}

export default withRouter(RoleIndex)