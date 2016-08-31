import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input, Select, InputNumber } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class AttributeDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/attribute/index')

    this.props.form.setFieldsValue({
      attribute_sort: 0
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
      url: '/attribute/find',
      data: {
        attribute_id: self.props.params.attribute_id
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

      let type = self.props.route.path.indexOf('/edit') > -1 ? 'update' : 'save'

      values.attribute_id = self.props.params.attribute_id

      Helper.ajax({
        url: '/attribute/' + type,
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
    const Option = Select.Option
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>属性表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>属性列表</Breadcrumb.Item>
              <Breadcrumb.Item>属性表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <FormItem {...Helper.formItemLayout} label="属性名称" >
            <Input {...getFieldProps('attribute_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入属性名称" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="类型" >
            <Select {...getFieldProps('attribute_type', {rules: [{required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请选类型">
              <Option value="normal">normal</Option>
              <Option value="sku">sku</Option>
            </Select>
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="输入框" >
            <Select {...getFieldProps('attribute_input_type', {rules: [{required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请选输入框">
              <Option value="text">text</Option>
              <Option value="select">select</Option>
              <Option value="number">number</Option>
              <Option value="datetime">datetime</Option>
              <Option value="image">image</Option>
            </Select>
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="默认值" >
            <Input {...getFieldProps('attribute_default_value')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入默认值" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="排序" >
            <InputNumber {...getFieldProps('attribute_sort', {rules: [{type: 'number', required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请输入排序" min={0} max={99} />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

AttributeDetail = Form.create({

})(AttributeDetail)

export default withRouter(AttributeDetail)