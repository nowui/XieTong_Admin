import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Form, Input, Button, message } from 'antd'
import Helper from '../common/Helper'

import styles from './Register.less'

class Register extends Component {

  constructor(props) {
    super(props)

    this.state = {
      user_phone: '15900672218',
      user_password: '123456'
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.state)
  }

  onClickSubmit(event) {
    event.preventDefault()

    let self = this

    self.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return
      }

      Helper.ajax({
        url: '/member/register',
        data: values,
        success: function(data) {

        },
        complete: function() {

        }
      })
    })
  }

  onClickSms(event) {
    event.preventDefault()

    let self = this

    Helper.ajax({
      url: '/sms/send',
      data: {
        sms_phone: self.props.form.getFieldValue('user_phone')
      },
      success: function(data) {
        //console.log(data)
      },
      complete: function() {

      }
    })
  }

  onClickBack(event) {
    this.props.router.goBack()
  }

  render() {
  	const formItemLayout = {
		  labelCol: { span: 6 },
		  wrapperCol: { span: 14 },
		}
  	const FormItem = Form.Item
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
      <div className={styles.register}>
        <Form horizontal>
          <FormItem
            {...formItemLayout}
            label="手机号码"
          >
            <Input {...getFieldProps('user_phone', {
              rules: [{
                required: true,
                message: '不能为空'
              }],
            })}
            type="text"
            placeholder="请输入账户名"
            name='user_phone'
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="验证码"
          >
            <Input {...getFieldProps('sms_code', {
              rules: [{
                required: true,
                message: '不能为空'
              }],
            })}
            type="text"
            placeholder="请输入验证码"
            name='sms_code'
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码"
          >
            <Input {...getFieldProps('user_password', {
              rules: [{
                required: true,
                message: '不能为空'
              }],
            })}
            type="password"
            placeholder="请输入密码"
            name='user_password'
            />
          </FormItem>
          <FormItem wrapperCol={{ offset: 6 }}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
            <Button type="default" icon="plus-circle" style={{marginLeft: 8}} size="default" onClick={this.onClickSms.bind(this)}>验证码</Button>
            <Button type="default" icon="circle-left" style={{marginLeft: 8}} size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

Register = Form.create({

})(Register)

export default withRouter(Register)