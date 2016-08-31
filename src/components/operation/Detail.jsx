import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input, InputNumber } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const createForm = Form.create
const FormItem = Form.Item

let self

class OperationDetail extends Component {

  constructor(props) {
    super(props)

    self = this

    self.category_id = ''

    this.state = {
      isLoad: false
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/operation/index')

    self.props.form.setFieldsValue({
      operation_sort: 0
    })

    if(self.props.route.path.indexOf('/edit') > -1) {
      self.load()
    }
  }

  load = function() {
    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/operation/find',
      data: {
        operation_id: self.props.params.operation_id
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

    self.props.router.goBack()
  }

  onClickSubmit(event) {
    event.preventDefault()

    self.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return
      }

      self.setState({
        isLoad: true
      })

      let type

      if(self.props.route.path.indexOf('/edit') > -1) {
        type = 'update'

        values.operation_id = self.props.params.operation_id
      } else {
        type = 'save'

        values.menu_id = self.props.params.menu_id
      }


      Helper.ajax({
        url: '/operation/' + type,
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
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>菜单操作表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>菜单操作列表</Breadcrumb.Item>
              <Breadcrumb.Item>菜单操作表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <FormItem {...Helper.formItemLayout} label="名称" >
            <Input {...getFieldProps('operation_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入名称" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="键值" >
            <Input {...getFieldProps('operation_key')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入键值" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="数值" >
            <Input {...getFieldProps('operation_value')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入数值" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="排序" >
            <InputNumber {...getFieldProps('operation_sort', {rules: [{type: 'number', required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请输入排序" min={0} max={99} />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

OperationDetail = Form.create({

})(OperationDetail)

export default withRouter(OperationDetail)