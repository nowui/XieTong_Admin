import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class AuthorizationDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/authorization/index')

    this.props.form.setFieldsValue({

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
      url: '/authorization/find',
      data: {
        authorization_id: self.props.params.authorization_id
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

    this.props.router.goBack()
  }

  render() {
    const FormItem = Form.Item
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>授权表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>授权列表</Breadcrumb.Item>
              <Breadcrumb.Item>授权表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <FormItem {...Helper.formItemLayout} label="授权令牌" >
            <Input {...getFieldProps('authorization_token')} type="textarea" rows={8} disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入授权令牌" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="创建时间" >
            <Input {...getFieldProps('authorization_create_time')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入创建时间" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="失效时间" >
            <Input {...getFieldProps('authorization_expire_time')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入失效时间" />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

AuthorizationDetail = Form.create({

})(AuthorizationDetail)

export default withRouter(AuthorizationDetail)