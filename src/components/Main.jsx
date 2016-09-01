import React, { Component } from 'react'
import { withRouter, Link } from 'react-router'
import { Table, Button, Menu, Breadcrumb, Icon } from 'antd'
import Helper from '../common/Helper'

import styles from './Main.less'

class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      openKeys: ['-1'],
      selectedKeys: ['-1'],
      menuList: [],
      url: ''
    }
  }

  componentDidMount() {
    this.load()
  }

  load = function() {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/user/menu/list',
      data: {

      },
      success: function(data) {
        self.setState({
          menuList: data
        })

        for(let i = 0; i < self.state.menuList.length; i++) {
          for(let k = 0; k < self.state.menuList[i].children.length; k++) {
            let children = self.state.menuList[i].children[k]

            if(children.link == self.state.url) {
              self.setState({
                openKeys: [self.state.menuList[i].id],
                selectedKeys: [children.id]
              })

              break
            }
          }
        }
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
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
      selectedKeys: [item.key]
    })
  }

  onSelectMenu(url) {
    this.setState({
      url: url
    })
  }

  render() {
    const SubMenu = Menu.SubMenu

    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
        onSelectMenu: this.onSelectMenu.bind(this)
     })
    )

    return (
      <div className={styles.layout}>
        <aside className={styles.sider}>
            <Menu className={styles.siderMenu} mode="inline" openKeys={this.state.openKeys} selectedKeys={this.state.selectedKeys} onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)} onClick={this.onClick.bind(this)}>
              {
                this.state.menuList.map(function (item, index) {
                  return (
                    <SubMenu key={item.id} title={<span><Icon className={'anticon ' + item.icon} />{item.name}</span>}>
                      {
                        item.children.map(function (children, i) {
                          return (
                            <Menu.Item key={children.id}><Link to={children.link}>{children.name}</Link></Menu.Item>
                          )
                        })
                      }
                    </SubMenu>
                  )
                })
              }
              <Menu.Item><Link to='/logout'><Icon type="poweroff" />退出系统</Link></Menu.Item>
            </Menu>
        </aside>
        <div className={styles.content}>
          {childrenWithProps}
        </div>
      </div>
    )
  }
}

export default withRouter(Main)