import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Tree } from 'antd'
import InputImage from '../common/InputImage';
import HtmlEditor from '../common/HtmlEditor';
import Helper from '../../common/Helper'

import styles from '../Style.less'

class AdminOperation extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      checkedKeys: [],
      operationList: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/admin/index')

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
      url: '/admin/operation/list',
      data: {
        user_id: self.props.params.user_id
      },
      success: function(data) {
        self.setState({
          operationList: data
        })

        let checkedArray = []

        for(let i = 0; i < self.state.operationList.length; i++) {
          let item = self.state.operationList[i]

          if(item.selected) {
            checkedArray.push(item.id)
          }
        }

        self.setState({
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
        array.push({
          role_id: self.state.checkedKeys[i]
        })
      }

      values.user_id = self.props.params.user_id
      values.user_role = array


      Helper.ajax({
        url: '/admin/operation/update',
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

  onCheck(checkedKeys, object) {
    this.setState({
      checkedKeys: checkedKeys
    })
  }

  render() {
    const FormItem = Form.Item
    const TreeNode = Tree.TreeNode;
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
                checkedKeys={this.state.checkedKeys}
                onCheck={this.onCheck}
              >
                {
                  this.state.operationList.map(function (item, index) {
                    return (
                      <TreeNode title={item.name} key={item.id}>

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

AdminOperation = Form.create({

})(AdminOperation)

export default withRouter(AdminOperation)