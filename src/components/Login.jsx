import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Form, Input, Button, message } from 'antd'
import Helper from '../common/Helper'

import styles from './Login.less'

class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      user_account: 'admin',
      user_password: 'admin'
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.state)
  }

  onClickSubmit(event) {
    let self = this

    event.preventDefault()

    self.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return
      }

      Helper.ajax({
        url: '/admin/login',
        data: values,
        success: function(data) {
          Helper.login(data.token)

          self.props.router.push({
            pathname: '/course/index',
            query: {

            }
          })
        },
        complete: function() {

        }
      })
    })
  }

  onClickRegister(event) {
    event.preventDefault()

    this.props.router.push({
      pathname: '/register',
      query: {

      }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const createForm = Form.create
    const FormItem = Form.Item
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
      <div className={styles.login}>
        <Form horizontal>
          <FormItem
            {...formItemLayout}
            label="手机号码"
          >
            <Input {...getFieldProps('user_account', {
              rules: [{
                required: true,
                message: '不能为空'
              }],
            })}
            type="text"
            placeholder="请输入账户名"
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
            <Button type="default" icon="plus-circle" style={{ marginLeft: 8 }} size="default" onClick={this.onClickRegister.bind(this)}>注册</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

Login = Form.create({
  onFieldsChange(props, fields) {
    for (var key of Object.keys(fields)) {
      //console.log(key + ": " + fields[key].value)
    }
  }
})(Login)

export default withRouter(Login)