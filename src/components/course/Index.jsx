import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Table, Button, Modal } from 'antd'
import Helper from '../../common/Helper'

import styles from '../Style.less'

const confirm = Modal.confirm

let page = 1

class CourseIndex extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      page: page,
      total: 0,
      list: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/course/index')

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
      url: '/course/list',
      data: {
        page: currentPage,
        limit: Helper.limit
      },
      success: function(data) {
        page = currentPage

        for(let i = 0; i < data.list.length; i++) {
          let course = data.list[i]

          for(let j = 0; j < Helper.course_class.length; j++) {
            if(course.course_class == Helper.course_class[j].value) {
              course.course_class = Helper.course_class[j].text

              break
            }
          }
        }

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

  del = function(course_id) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/course/delete',
      data: {
        course_id: course_id
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

  onClickAdd(event) {
    this.props.router.push({
      pathname: '/course/add',
      query: {

      }
    })
  }

  onClickEdit(course_id) {
    this.props.router.push({
      pathname: '/course/edit/' + course_id,
      query: {

      }
    })
  }

  onClickDel(course_id) {
    let self = this

    confirm({
      title: Helper.message,
      content: Helper.delete,
      onOk() {
        self.del(course_id)
      },
      onCancel() {

      }
    })
  }

  export = function(student_id) {
    window.open(Helper.host + '/course/export')
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'course_name',
      key: 'course_name'
    }, {
      title: '时间',
      dataIndex: 'course_class',
      key: 'course_class'
    }, {
      width: 150,
      title: '操作',
      dataIndex: '',
      render: (text, record, index) => (
        <span>
          <a onClick={this.onClickEdit.bind(this, record.course_id)}>修改</a>
          <span className="ant-divider"></span>
          <a onClick={this.onClickDel.bind(this, record.course_id)}>删除</a>
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
            <h1>课程列表</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>课程列表</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button type="default" icon="reload" size="default" className="button-reload" onClick={this.load.bind(this, page)}>刷新</Button>
            <Button type="primary" icon="plus-circle" size="default" className="button-reload" onClick={this.onClickAdd.bind(this)}>新增</Button>
            <Button type="default" icon="export" size="default" className="button-reload" onClick={this.export.bind(this, page)}>导出课程报名信息</Button>
          </Col>
        </Row>

        <Table columns={columns} dataSource={this.state.list} pagination={pagination} />
      </Spin>
    )
  }
}

export default withRouter(CourseIndex)