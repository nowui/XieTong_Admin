import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Modal, Form, Input, Select } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const confirm = Modal.confirm

let page = 1

class StudentIndex extends Component {

  constructor(props) {
    super(props)

    self = this

    this.state = {
      isLoad: false,
      page: page,
      total: 0,
      list: [],
      gradeList: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/student/index')

    this.load(page)
  }

  onChange = function(currentPage) {
    this.load(currentPage)
  }

  load = function(currentPage) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/student/list',
      data: {
        page: currentPage,
        limit: Helper.limit
      },
      success: function(data) {
        page = currentPage

        self.setState({
          page: currentPage,
          total: data.total,
          list: data.list
        })
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  del = function(student_id) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/student/delete',
      data: {
        student_id: student_id
      },
      success: function(data) {
        self.load(page)
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  export = function(student_id) {
    window.open(Helper.host + '/student/export')
  }

  onClickAdd(event) {
    this.props.router.push({
      pathname: '/student/add',
      query: {

      }
    })
  }

  onClickEdit(student_id) {
    this.props.router.push({
      pathname: '/student/edit/' + student_id,
      query: {

      }
    })
  }

  onClickDel(student_id) {
    let self = this

    confirm({
      title: Helper.message,
      content: Helper.delete,
      onOk() {
        self.del(student_id)
      },
      onCancel() {

      }
    })
  }

  render() {
    const FormItem = Form.Item
    const Option = Select.Option
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    const columns = [{
      title: '班级',
      dataIndex: 'grade_name',
      key: 'grade_name'
    }, {
      title: '姓名',
      dataIndex: 'student_name',
      key: 'student_name'
    }, {
      title: '学号',
      dataIndex: 'student_number',
      key: 'student_number'
    }, {
      title: '性别',
      dataIndex: 'student_sex',
      key: 'student_sex'
    }, {
      width: 150,
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.onClickEdit.bind(this, record.student_id)}>修改</a>
          <span className="ant-divider"></span>
          <a onClick={this.onClickDel.bind(this, record.student_id)}>删除</a>
        </span>
      )
    }]

    const pagination = {
      current: this.state.page,
      total: this.state.total,
      pageSize: Helper.limit,
      onChange: this.onChange.bind(this)
    }

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>学生列表</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>学生列表</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button type="ghost" icon="export" size="default" className="button-reload" onClick={this.export.bind(this, page)}>导出模板</Button>
            <Button type="ghost" icon="export" size="default" className="button-reload" onClick={this.export.bind(this, page)}>导入数据</Button>
            <Button type="primary" icon="plus-circle" size="default" onClick={this.onClickAdd.bind(this)}>新增</Button>
          </Col>
        </Row>

        <Form horizontal className="ant-advanced-search-form">
          <Row>
            <Col sm={12}>
              <FormItem {...Helper.formItemLayout} label="班级" >
                <Select {...getFieldProps('grade_id', {rules: [{required: true, message: Helper.required}]})} style={{width: Helper.inputSearchWidth}} placeholder="请选择班级">
                  {
                    this.state.gradeList.map(function (item) {
                      return (
                        <Option key={item.grade_id} value={item.grade_id}>{item.grade_name}</Option>
                      )
                    })
                  }
                </Select>
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...Helper.formItemLayout} label="姓名" >
                <Input {...getFieldProps('student_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputSearchWidth}} placeholder="请输入名称" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} offset={12} style={{ textAlign: 'right' }}>
              <Button type="ghost" icon="search" size="default" className="button-reload" onClick={this.load.bind(this, page)}>搜索</Button>
            </Col>
          </Row>
        </Form>

        <Table columns={columns} dataSource={this.state.list} pagination={pagination} />
      </Spin>
    )
  }
}

StudentIndex = Form.create({

})(StudentIndex)

export default withRouter(StudentIndex)