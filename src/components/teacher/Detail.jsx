import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const createForm = Form.create
const FormItem = Form.Item

let self

class TeacherDetail extends Component {

  constructor(props) {
    super(props)

    self = this

    self.category_id = ''

    this.state = {
      isLoad: false
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/teacher/index')

    self.props.form.setFieldsValue({

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
      url: '/teacher/find',
      data: {
        teacher_id: self.props.params.teacher_id
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

      let type = self.props.route.path.indexOf('/edit') > -1 ? 'update' : 'save'

      values.teacher_id = self.props.params.teacher_id

      Helper.ajax({
        url: '/teacher/' + type,
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
            <h1>老师表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>老师列表</Breadcrumb.Item>
              <Breadcrumb.Item>老师表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <Input {...getFieldProps('user_id')} type="hidden" />
          <FormItem {...Helper.formItemLayout} label="名称" >
            <Input {...getFieldProps('teacher_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入名称" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="帐号" >
            <Input {...getFieldProps('user_account', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入帐号" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="密码" >
            <Input {...getFieldProps('user_password')} type="password" style={{width: Helper.inputWidth}} placeholder="请输入密码" />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

TeacherDetail = Form.create({

})(TeacherDetail)

export default withRouter(TeacherDetail)