import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Tree } from 'antd'
import InputImage from '../common/InputImage';
import HtmlEditor from '../common/HtmlEditor';
import Helper from '../../common/Helper'

import styles from '../Style.less'

class RoleOperation extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      expandedKeys: [],
      checkedKeys: [],
      operationList: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/role/index')

    this.props.form.setFieldsValue({

    })

    this.load()
  }

  load = function() {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/role/operation/list',
      data: {
        role_id: self.props.params.role_id
      },
      success: function(data) {
        self.setState({
          operationList: data
        })

        let expandedArray = []
        let checkedArray = []

        for(let i = 0; i < self.state.operationList.length; i++) {
          let item = self.state.operationList[i]

          expandedArray.push(item.id)

          for(let j = 0; j < item.children.length; j++) {
            let children = item.children[j]

            expandedArray.push(children.id)

            for(let k = 0; k < children.children.length; k++) {
              let grandson = children.children[k]

              if(grandson.selected) {
                checkedArray.push(grandson.id)
              }
            }
          }
        }

        self.setState({
          expandedKeys: expandedArray,
          checkedKeys: checkedArray
        })
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  onClickBack(event) {
    event.preventDefault()

    this.props.router.goBack()
  }

  onClickSubmit(event) {
    event.preventDefault()

    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return
      }

      let self = this

      self.setState({
        isLoad: true
      })

      let array = []

      for(let i = 0; i < self.state.checkedKeys.length; i++) {
        let item = self.state.checkedKeys[i]
        if(item.length == 32) {
          array.push({
            operation_id: item
          })
        }
      }

      values.role_id = self.props.params.role_id
      values.role_operation = array

      Helper.ajax({
        url: '/role/operation/update',
        data: values,
        success: function(data) {
          Helper.notificationSuccess()

          self.props.router.goBack()
        },
        complete: function() {
          self.setState({
            isLoad: false
          })
        }
      })
    })
  }

  onExpand(expandedKeys) {
    this.setState({
      expandedKeys: expandedKeys
    })
  }

  onCheck(checkedKeys, object) {
    this.setState({
      checkedKeys: checkedKeys
    })
  }

  render() {
    const FormItem = Form.Item
    const TreeNode = Tree.TreeNode
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>角色权限表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>分组角色列表</Breadcrumb.Item>
              <Breadcrumb.Item>角色权限表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <Row>
            <Col span={4}>
            </Col>
            <Col span={20}>
              <Tree className="myCls" showLine checkable
                expandedKeys={this.state.expandedKeys}
                checkedKeys={this.state.checkedKeys}
                onExpand={this.onExpand.bind(this)}
                onCheck={this.onCheck.bind(this)}
              >
                {
                  this.state.operationList.map(function (item, index) {
                    return (
                      <TreeNode title={item.name} key={item.id}>
                        {
                          item.children.map(function (children, i) {
                            return (
                              <TreeNode title={children.name} key={children.id}>
                                {
                                  children.children.map(function (grandson, k) {
                                    return (
                                      <TreeNode title={grandson.name} key={grandson.id}>
                                        {

                                        }
                                      </TreeNode>
                                    )
                                  })
                                }
                              </TreeNode>
                            )
                          })
                        }
                      </TreeNode>
                    )
                  })
                }
              </Tree>
            </Col>
          </Row>
          <br/>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

RoleOperation = Form.create({

})(RoleOperation)

export default withRouter(RoleOperation)