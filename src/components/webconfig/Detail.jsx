import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input, DatePicker, TimePicker } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class WebConfigDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/web/config/index')

    this.props.form.setFieldsValue({
      web_config_apply_start_time: '00:00:00',
      web_config_apply_end_time: '00:00:00'
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
      url: '/web/config/find',
      data: {
        web_config_id: self.props.params.web_config_id
      },
      success: function(data) {
        self.props.form.setFieldsValue({
          web_config_apply_start_day: new Date(data.web_config_apply_start_time.substring(0, 10)),
          web_config_apply_end_day: new Date(data.web_config_apply_end_time.substring(0, 10)),
          web_config_apply_start_time: data.web_config_apply_start_time.substring(11, 19),
          web_config_apply_end_time: data.web_config_apply_end_time.substring(11, 19)
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

      values.web_config_id = self.props.params.web_config_id

      let year = values.web_config_apply_start_day.getFullYear()
      let month = values.web_config_apply_start_day.getMonth() + 1
      let day = values.web_config_apply_start_day.getDate()

      if(month < 10) {
        month = '0' + month
      }

      if(day < 10) {
        day = '0' + day
      }

      let web_config_apply_start_time = year + "-" + month + "-" + day + " " +  values.web_config_apply_start_time


      year = values.web_config_apply_end_day.getFullYear()
      month = values.web_config_apply_end_day.getMonth() + 1
      day = values.web_config_apply_end_day.getDate()

      if(month < 10) {
        month = '0' + month
      }

      if(day < 10) {
        day = '0' + day
      }

      let web_config_apply_end_time = year + "-" + month + "-" + day + " " +  values.web_config_apply_end_time

      Helper.ajax({
        url: '/web/config/' + type,
        data: {
          web_config_id: self.props.params.web_config_id,
          web_config_apply_start_time: web_config_apply_start_time,
          web_config_apply_end_time: web_config_apply_end_time
        },
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
            <h1>配置表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>配置列表</Breadcrumb.Item>
              <Breadcrumb.Item>配置表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <FormItem {...{labelCol: { span: 4 }, wrapperCol: { span: 18 }}} label="申请课程开始时间" >
            <DatePicker {...getFieldProps('web_config_apply_start_day', {rules: [{required: true, type: 'date', message: Helper.required}]})} /> <TimePicker {...getFieldProps('web_config_apply_start_time', {getValueFromEvent: (value, timeString) => timeString, rules: [{required: true, message: Helper.required}]})} />

          </FormItem>
          <FormItem {...{labelCol: { span: 4 }, wrapperCol: { span: 18 }}} label="申请课程结束时间" >
            <DatePicker {...getFieldProps('web_config_apply_end_day', {rules: [{required: true, type: 'date', message: Helper.required}]})} /> <TimePicker {...getFieldProps('web_config_apply_end_time', {getValueFromEvent: (value, timeString) => timeString, rules: [{required: true, message: Helper.required}]})} />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

WebConfigDetail = Form.create({

})(WebConfigDetail)

export default withRouter(WebConfigDetail)