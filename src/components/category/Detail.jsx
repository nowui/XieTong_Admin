import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Form, Input, InputNumber } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class CategoryDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLanch: true,
      isLoad: false,
      category: {}
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      parent_id: '',
      category_sort: 0
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.isLanch) {
      this.setState({
        isLanch: false
      })

      if(this.props.category_id != '') {
        this.load()
      }
    }
  }

  load = function() {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/' + self.props.category_key + self.props.sub_url + '/find',
      data: {
        category_id: self.props.category_id
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

      if(self.props.category_id != '') {
        values.category_id = self.props.category_id
      } else {
        values.parent_id = self.props.parent_id
      }

      let type = self.props.category_id != '' ? 'update' : 'save'

      Helper.ajax({
        url: '/' + self.props.category_key + self.props.sub_url + '/' + type,
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

  onChangeCategory(value) {
    console.log(value)
  }

  onChangeImage(list) {
    this.setState({
      product_image: list
    })
  }

  render() {
    const FormItem = Form.Item
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>{this.props.category_name}表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.category_name}列表</Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.category_name}表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <Input {...getFieldProps('parent_id')} type="hidden" />
          <FormItem {...Helper.formItemLayout} label="名称" >
            <Input {...getFieldProps('category_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入名称" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="键值" >
            <Input {...getFieldProps('category_key')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入键值" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="数值" >
            <Input {...getFieldProps('category_value')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入数值" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="描述" >
            <Input {...getFieldProps('category_description')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入描述" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="排序" >
            <InputNumber {...getFieldProps('category_sort', {rules: [{type: 'number', required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请输入排序" min={0} max={99} />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

CategoryDetail = Form.create({

})(CategoryDetail)

export default withRouter(CategoryDetail)