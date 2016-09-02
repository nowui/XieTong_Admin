import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input, InputNumber, Select } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

class CourseDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      gradeList: [],
      teacherList: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/course/index')

    this.props.form.setFieldsValue({
      course_address: '',
      course_remark: '',
      course_content: ''
    })

    this.load()
  }

  load = function() {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/course/find',
      data: {
        course_id: self.props.params.course_id
      },
      success: function(data) {
        if(self.props.route.path.indexOf('/edit') > -1) {
          self.props.form.setFieldsValue(data)
        }

        self.setState({
          gradeList: data.gradeList,
          teacherList: data.teacherList
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

      values.course_id = self.props.params.course_id

      Helper.ajax({
        url: '/course/' + type,
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
            <h1>课程表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>课程列表</Breadcrumb.Item>
              <Breadcrumb.Item>课程表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <FormItem {...Helper.formItemLayout} label="上课班级" >
            <Select {...getFieldProps('course_grade', {rules: [{required: true, message: Helper.required, type: 'array'}]})} style={{width: Helper.inputWidth}} multiple placeholder="请选择上课班级">
              {
                this.state.gradeList.map(function (item) {
                  return (
                    <Option key={item.grade_id} value={item.grade_id}>{item.grade_name}</Option>
                  )
                })
              }
            </Select>
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="上课老师" >
            <Select {...getFieldProps('course_teacher', {rules: [{required: true, message: Helper.required, type: 'array'}]})} style={{width: Helper.inputWidth}} multiple placeholder="请选择上课老师">
              {
                this.state.teacherList.map(function (item) {
                  return (
                    <Option key={item.teacher_id} value={item.teacher_id}>{item.teacher_name}</Option>
                  )
                })
              }
            </Select>
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="课程名称" >
            <Input {...getFieldProps('course_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入课程名称" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="上课时间" >
            <Select {...getFieldProps('course_class', {rules: [{required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请选择上课时间">
              <Option value="17">星期一第七节</Option>
              <Option value="27">星期二第七节</Option>
              <Option value="28">星期二第八节</Option>
              <Option value="47">星期四第七节</Option>
              <Option value="48">星期四第八节</Option>
              <Option value="56">星期五第六节</Option>
            </Select>
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="限制人数" >
            <InputNumber {...getFieldProps('course_apply_limit', {rules: [{type: 'number', required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请输入限制人数" min={0} max={99} />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="上课地点" >
            <Input {...getFieldProps('course_address')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入上课地点" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="自备材料" >
            <Input {...getFieldProps('course_remark')} type="text" style={{width: Helper.inputWidth}} placeholder="请输入自备材料" />
          </FormItem>
          <FormItem {...Helper.formItemLayout} label="课程介绍" >
            <Input {...getFieldProps('course_content')} type="textarea" rows={5} style={{width: Helper.inputWidth}} placeholder="请输入上课地点" />
          </FormItem>
          <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
            <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

CourseDetail = Form.create({

})(CourseDetail)

export default withRouter(CourseDetail)