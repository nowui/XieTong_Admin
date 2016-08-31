import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class LogDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/log/index')

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
      url: '/log/find',
      data: {
        log_id: this.props.params.log_id
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
            <h1>日志表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>日志列表</Breadcrumb.Item>
              <Breadcrumb.Item>日志表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <FormItem {...Helper.formItemLayout} label="请求地址" >
            <Input {...getFieldProps('log_url')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入请求地址" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="请求数据" >
            <Input {...getFieldProps('log_request')} type="textarea" rows={8} disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入请求参数" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="返回数据" >
            <Input {...getFieldProps('log_response')} type="textarea" rows={8} disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入返回数据" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="请求状态" >
            <Input {...getFieldProps('log_code')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入请求状态" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="请求终端" >
            <Input {...getFieldProps('log_platform')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入请求状态" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="请求版本" >
            <Input {...getFieldProps('log_version')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入请求版本" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="IP地址" >
            <Input {...getFieldProps('log_ip_address')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入IP地址" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="请求时间" >
            <Input {...getFieldProps('log_create_time')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入请求时间" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="耗时(毫秒)" >
            <Input {...getFieldProps('log_run_time')} type="text" disabled={true} style={{width: Helper.inputWidth}} placeholder="请输入耗时" />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

LogDetail = Form.create({

})(LogDetail)

export default withRouter(LogDetail)