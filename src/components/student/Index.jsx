import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Modal, Form, Input, Select, Upload } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const confirm = Modal.confirm

let page = 1
let gradeList
let grade_id = ''
let student_name = ''

class StudentIndex extends Component {

  constructor(props) {
    super(props)

    self = this

    this.state = {
      isLoad: false,
      page: page,
      total: 0,
      list: [],
      gradeList: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/student/index')

    this.props.form.setFieldsValue({
      grade_id: grade_id,
      student_name: student_name
    })

    this.load(page)

    if(typeof(gradeList) == 'undefined') {
      this.loadGrade()
    } else {
      self.setState({
        gradeList: gradeList
      })
    }
  }

  componentWillUnmount() {
    grade_id = self.props.form.getFieldValue('grade_id')
    student_name = self.props.form.getFieldValue('student_name')
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
        limit: Helper.limit,
        grade_id: self.props.form.getFieldValue('grade_id'),
        student_name: self.props.form.getFieldValue('student_name')
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

  loadGrade = function() {
    let self = this

    Helper.ajax({
      url: '/grade/list2',
      data: {

      },
      success: function(data) {
        gradeList = []

        gradeList.push({
          grade_id: '',
          grade_name: '所有班级'
        })

        gradeList = gradeList.concat(data)

        self.setState({
          gradeList: gradeList
        })
      },
      complete: function() {

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

  del2 = function() {
    let self = this

    let student_id = []

    for(let i = 0; i < self.state.selectedRows.length; i++) {
      student_id.push(self.state.selectedRows[i].student_id)
    }

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/student/delete2',
      data: {
        student_id: student_id
      },
      success: function(data) {
        self.load(page)
      },
      complete: function() {
        self.setState({
          isLoad: false,
          selectedRowKeys: [],
          selectedRows: []
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

  onClickDel2() {
    let self = this

    confirm({
      title: Helper.message,
      content: Helper.delete,
      onOk() {
        self.del2()
      },
      onCancel() {

      }
    })
  }

  onUploadChange(info) {
    if (info.file.status == 'uploading') {
      this.setState({
        isLoad: true
      })
    } else if (info.file.status === 'done') {
      self.load(page)
    }
  }

  render() {
    const FormItem = Form.Item
    const Option = Select.Option
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form
    const { selectedRowKeys } = this.state

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

    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      accept: '.xls,.xlsx',
      action: Helper.host + '/student/upload',
      headers: {
        'token': Helper.getToken(),
        'platform': Helper.platform,
        'version': Helper.version
      },
      onChange: this.onUploadChange.bind(this)
    }

    const rowSelection = {
      selectedRowKeys,
      onChange(selectedRowKeys, selectedRows) {
        self.setState({
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows
        })
      }
    }

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={7}>
            <h1>学生列表</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>学生列表</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={17} className={styles.menu}>
            <Button type="default" icon="reload" size="default" className="button-reload" onClick={this.load.bind(this, page)}>刷新</Button>
            <Button type="primary" icon="plus-circle" size="default" style={{ marginRight: '10px' }} onClick={this.onClickAdd.bind(this)}>新增</Button>
            <Button type="default" icon="delete" size="default" className="button-reload" onClick={this.onClickDel2.bind(this)}>删除所选</Button>
            <Button type="default" icon="export" size="default" className="button-reload" onClick={this.export.bind(this, page)}>导出模板</Button>
            <Upload {...props}>
              <Button type="default" icon="upload" size="default" className="button-reload">导入学生信息</Button>
            </Upload>
          </Col>
        </Row>

        <Form horizontal className="ant-advanced-search-form">
          <Row>
            <Col sm={10}>
              <FormItem {...{labelCol: { span: 6 }, wrapperCol: { span: 18 }}} label="班级" >
                <Select {...getFieldProps('grade_id')} style={{width: Helper.inputSearchWidth}} placeholder="请选择班级">
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
            <Col sm={10}>
              <FormItem {...{labelCol: { span: 6 }, wrapperCol: { span: 18 }}} label="姓名" >
                <Input {...getFieldProps('student_name')} type="text" style={{width: Helper.inputSearchWidth}} placeholder="请输入名称" />
              </FormItem>
            </Col>
            <Col sm={4} style={{ textAlign: 'right'}}>
              <Button type="ghost" icon="search" size="default" className="button-reload" onClick={this.load.bind(this, page)}>搜索</Button>
            </Col>
          </Row>
        </Form>

        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.list} pagination={pagination} />
      </Spin>
    )
  }
}

StudentIndex = Form.create({

})(StudentIndex)

export default withRouter(StudentIndex)