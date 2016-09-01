import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input, InputNumber } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class MemberLevelDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/member/level/index')

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
      url: '/member/level/find',
      data: {
        member_level_id: self.props.params.member_level_id
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

      values.member_level_id = self.props.params.member_level_id

      Helper.ajax({
        url: '/member/level/' + type,
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
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>会员等级表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>会员等级列表</Breadcrumb.Item>
              <Breadcrumb.Item>会员等级表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <FormItem {...Helper.formItemLayout} label="名称" >
            <Input {...getFieldProps('member_level_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入名称" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="数值" >
            <InputNumber {...getFieldProps('member_level_value', {rules: [{type: 'number', required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请输入数值" min={0} max={99999} />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

MemberLevelDetail = Form.create({

})(MemberLevelDetail)

export default withRouter(MemberLevelDetail)