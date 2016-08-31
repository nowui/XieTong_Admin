import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input, InputNumber } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class RoleDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/role/index')

    this.props.form.setFieldsValue({
      role_sort: 0
    })

    if(this.props.route.path.indexOf('/edit') > -1) {
      this.load()
    }
  }

  load = function() {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/role/find',
      data: {
        role_id: self.props.params.role_id
      },
      success: function(data) {
        self.props.form.setFieldsValue(data)
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

      let type

      if(self.props.route.path.indexOf('/edit') > -1) {
        type = 'update'

        values.role_id = self.props.params.role_id
      } else {
        type = 'save'

        values.group_id = self.props.params.group_id
      }


      Helper.ajax({
        url: '/role/' + type,
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

  render() {
    const FormItem = Form.Item
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>角色表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>分组角色列表</Breadcrumb.Item>
              <Breadcrumb.Item>角色表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <FormItem {...Helper.formItemLayout} label="名称" >
            <Input {...getFieldProps('role_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入名称" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="键值" >
            <Input {...getFieldProps('role_key')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入键值" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="数值" >
            <Input {...getFieldProps('role_value')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入数值" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="排序" >
            <InputNumber {...getFieldProps('role_sort', {rules: [{type: 'number', required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请输入排序" min={0} max={99} />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

RoleDetail = Form.create({

})(RoleDetail)

export default withRouter(RoleDetail)