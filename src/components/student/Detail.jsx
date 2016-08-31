import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input, Select } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class StudentDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      gradeList: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/student/index')

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
      url: '/student/find',
      data: {
        student_id: self.props.params.student_id
      },
      success: function(data) {
        if(self.props.route.path.indexOf('/edit') > -1) {
          self.props.form.setFieldsValue(data)
        }

        self.setState({
          gradeList: data.gradeList
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

      let type = self.props.route.path.indexOf('/edit') > -1 ? 'update' : 'save'

      values.student_id = self.props.params.student_id

      Helper.ajax({
        url: '/student/' + type,
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
            <h1>学生表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>学生列表</Breadcrumb.Item>
              <Breadcrumb.Item>学生表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <Input {...getFieldProps('user_id')} type="hidden" />
          <FormItem {...Helper.formItemLayout} label="班级" >
            <Select {...getFieldProps('grade_id', {rules: [{required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请选择班级">
              {
                this.state.gradeList.map(function (item) {
                  return (
                    <Option key={item.grade_id} value={item.grade_id}>{item.grade_name}</Option>
                  )
                })
              }
            </Select>
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="名称" >
            <Input {...getFieldProps('student_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入名称" />
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

StudentDetail = Form.create({

})(StudentDetail)

export default withRouter(StudentDetail)