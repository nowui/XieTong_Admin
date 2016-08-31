import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Row, Col, Breadcrumb, Button, Form, Input, Select, InputNumber, Checkbox, Radio } from 'antd'
import InputImage from '../common/InputImage';
import HtmlEditor from '../common/HtmlEditor';
import Helper from '../../common/Helper'

import styles from '../Style.less'

class ProductDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoad: false,
      categoryList: [],
      brandList: [],
      product_image: [],
      product_content: '',
      categoryAttributeList: [],
      categoryAttributeSkuList: [],
      skuList: []
    }
  }

  componentDidMount() {
    this.props.onSelectMenu('/product/index')

    this.props.form.setFieldsValue({
      product_price: 0.00,
      product_stock: 0,
      product_is_newarrival: false,
      product_is_recommend: false,
      product_is_bargain: false,
      product_status: true
    })

    this.load()
  }

  load = function() {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/product/find',
      data: {
        product_id: self.props.params.product_id
      },
      success: function(data) {
        let categoryList = []

        for(let i = 0; i < data.categoryList.length; i++) {
          let category = data.categoryList[i]

          categoryList.push({
            label: category.category_name,
            value: category.category_id,
            key: category.category_id
          })
        }

        let brandList = []

        for(let i = 0; i < data.brandList.length; i++) {
          let brand = data.brandList[i]

          brandList.push({
            label: brand.brand_name,
            value: brand.brand_id,
            key: brand.brand_id
          })
        }

        let categoryAttributeSkuList = []

        for(let i = 0; i < data.categoryAttributeList.length; i++) {
          let category_attribute = data.categoryAttributeList[i]

          if(category_attribute.attribute_type == 'sku' && category_attribute.attribute_default_value != '') {

            let array = JSON.parse(category_attribute.attribute_default_value)

            let item = []

            for(let k = 0; k < array.length; k++) {
              item.push({
                name: array[k],
                isCheck: false
              })
            }

            categoryAttributeSkuList.push({
              attribute_id: category_attribute.attribute_id,
              item: item
            })
          }
        }

        self.setState({
          categoryList: categoryList,
          brandList: brandList,
          product_image: JSON.parse(data.product_image),
          product_content: data.product_content,
          categoryAttributeList: data.categoryAttributeList,
          categoryAttributeSkuList: categoryAttributeSkuList
        })

        self.props.form.setFieldsValue(data)

        self.setCategoryAttributeFieldsValue()

        self.refs.htmlEditor.init(data.product_content)
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  loadCategoryAttribute = function(categoryId) {
    let self = this

    self.setState({
      isLoad: true
    })

    Helper.ajax({
      url: '/product/category/attribute/list',
      data: {
        product_id: self.props.params.product_id,
        category_id: categoryId
      },
      success: function(data) {
        self.setState({
          categoryAttributeList: data
        })

        self.setCategoryAttributeFieldsValue()
      },
      complete: function() {
        self.setState({
          isLoad: false
        })
      }
    })
  }

  setCategoryAttributeFieldsValue = function() {
    for(let i = 0; i < this.state.categoryAttributeList.length; i++) {
      let categoryAttribute = this.state.categoryAttributeList[i]

      let object = {}

      object['categoryAttributeList.' + categoryAttribute.attribute_id] = categoryAttribute.attribute_value

      this.props.form.setFieldsValue(object)
    }
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

      values.product_id = self.props.params.product_id
      values.product_image = JSON.stringify(self.state.product_image)
      values.product_content = self.state.product_content

      let categoryAttributeList = []
      for(let i = 0; i < self.state.categoryAttributeList.length; i++) {
        let categoryAttribute = self.state.categoryAttributeList[i]

        categoryAttributeList.push({
          attribute_id: categoryAttribute.attribute_id,
          attribute_value: self.props.form.getFieldValue('categoryAttributeList.' + categoryAttribute.attribute_id)
        })
      }

      values.categoryAttributeList = categoryAttributeList

      self.setState({
        isLoad: true
      })

      let type = self.props.route.path.indexOf('/edit') > -1 ? 'update' : 'save'

      Helper.ajax({
        url: '/product/' + type,
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

  onChangeCategory(value) {
    this.loadCategoryAttribute(value)

    this.props.form.setFieldsValue({
      category_id: value
    })
  }

  onChangeSku(attribute_id, value) {
    let index = -1

    for(let i = 0; i < this.state.categoryAttributeSkuList.length; i++) {
      let categoryAttribute = this.state.categoryAttributeSkuList[i]

      if(categoryAttribute.attribute_id == attribute_id) {
        for(let j = 0; j < categoryAttribute.item.length; j++) {
          let item = categoryAttribute.item[j]

          item.isCheck = false

          for(let k = 0; k < value.length; k++) {
            if(item.name == value[k]) {
              item.isCheck = true
            }
          }
        }
      }
    }

    this.check(0, 0, [])
  }

  check(index, count, skuList) {
    if(index >= this.state.categoryAttributeSkuList.length) {
      return
    }

    let list = []

    for(let i = 0; i < this.state.categoryAttributeSkuList.length; i++) {
      if(i == index) {
        let categoryAttribute = this.state.categoryAttributeSkuList[i]

        for(let j = 0; j < categoryAttribute.item.length; j++) {
          let item = categoryAttribute.item[j]

          if(item.isCheck) {
            list.push([item.name])
          }

        }
      }
    }

    if(skuList.length == 0) {
      skuList = list
    } else {
      let array = skuList.concat()

      for(let i = 0; i < array.length; i++) {
        for(let j = 0; j < list.length; j++) {
          skuList[array.length * j + i] = array[i].concat()

          if(typeof(skuList[array.length * j + i][count]) == 'undefined') {
            skuList[array.length * j + i][count] = list[j][0]
          }
        }
      }
    }

    index++

    if(list.length > 0) {
      count++
    }

    if(index == this.state.categoryAttributeSkuList.length) {
      console.log(JSON.stringify(skuList))

      this.setState({
        skuList: skuList
      })
    }

    this.check(index, count, skuList.concat())
  }

  onChangeImage(list) {
    this.setState({
      product_image: list
    })
  }

  onChangeContent(content) {
    this.setState({
      product_content: content
    })
  }

  render() {
    const FormItem = Form.Item
    const Option = Select.Option
    const RadioGroup = Radio.Group
    const CheckboxGroup = Checkbox.Group
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form

    return (
    	<Spin size="large" spinning={this.state.isLoad}>
        <Row className="ant-spin-container-header">
          <Col span={12}>
            <h1>商品表单</h1>
            <Breadcrumb>
              <Breadcrumb.Item>系统首页</Breadcrumb.Item>
              <Breadcrumb.Item>商品列表</Breadcrumb.Item>
              <Breadcrumb.Item>商品表单</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={12} className={styles.menu}>
            <Button icon="circle-left" size="default" onClick={this.onClickBack.bind(this)}>返回</Button>
          </Col>
        </Row>
        <Form horizontal>
          <h2>基本信息</h2>
            <FormItem {...Helper.formItemLayout} label="分类" >
              <Select {...getFieldProps('category_id', {rules: [{required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请选择分类" onChange={this.onChangeCategory.bind(this)}>
                {
                  this.state.categoryList.map(function (item) {
                    return (
                      <Option key={item.key} value={item.value}>{item.label}</Option>
                    )
                  })
                }
              </Select>
            </FormItem>
            <FormItem {...Helper.formItemLayout} label="品牌" >
              <Select {...getFieldProps('brand_id', {rules: [{required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请选择品牌">
                {
                  this.state.brandList.map(function (item) {
                    return (
                      <Option key={item.key} value={item.value}>{item.label}</Option>
                    )
                  })
                }
              </Select>
            </FormItem>
            <FormItem {...Helper.formItemLayout} label="名称" >
              <Input {...getFieldProps('product_name', {rules: [{required: true, message: Helper.required}]})} type="text" style={{width: Helper.inputWidth}} placeholder="请输入名称" />
            </FormItem>
            <FormItem {...Helper.formItemLayout} label="价格" >
              <InputNumber {...getFieldProps('product_price', {rules: [{type: 'number', required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请输入价格" min={0.00} max={9999.00} step={0.01} />
            </FormItem>
            <FormItem {...Helper.formItemLayout} label="库存" >
              <InputNumber {...getFieldProps('product_stock', {rules: [{type: 'number', required: true, message: Helper.required}]})} style={{width: Helper.inputWidth}} placeholder="请输入库存" min={0} max={9999} />
            </FormItem>
            <FormItem {...Helper.formItemLayout} label="图片" >
              <InputImage value={this.state.product_image} onChangeImage={this.onChangeImage.bind(this)} />
            </FormItem>
            <FormItem {...Helper.formItemLayout} label="标记" >
              <Checkbox {...getFieldProps('product_is_bargain', {valuePropName: 'checked'})}>新品</Checkbox>
              <Checkbox {...getFieldProps('product_is_newarrival', {valuePropName: 'checked'})}>推荐</Checkbox>
              <Checkbox {...getFieldProps('product_is_recommend', {valuePropName: 'checked'})}>特价</Checkbox>
            </FormItem>
            <FormItem {...Helper.formItemLayout} label="状态" >
              <RadioGroup {...getFieldProps('product_status')}>
                <Radio value={true}>上架</Radio>
                <Radio value={false}>下架</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem {...Helper.formItemLayout} label="介绍" >
              <HtmlEditor ref="htmlEditor" onChangeContent={this.onChangeContent.bind(this)} />
            </FormItem>
            <div className={styles.hr}></div>
            <h2>SKU</h2>
            {
              this.state.categoryAttributeList.map(function (item) {
                const options = []
                if(item.attribute_type == 'sku') {
                  if(item.attribute_default_value != '') {
                    let array = JSON.parse(item.attribute_default_value)

                    for(let i = 0; i < array.length; i++) {
                      options.push({
                        label: array[i],
                        value: array[i]
                      })
                    }
                  }
                }
                return (
                  item.attribute_type == 'sku' ?
                  <FormItem key={item.attribute_id} {...Helper.formItemLayout} label={item.attribute_name} >
                    <CheckboxGroup options={options} defaultValue={[]} onChange={this.onChangeSku.bind(this, item.attribute_id)} />
                  </FormItem>
                  :
                  ''
                )
              }.bind(this))
            }
            {
              this.state.skuList.map(function (item, index) {
                return (
                  <Row key={index}>
                    <Col span={3}></Col>
                    <Col span={18}>
                      {
                        item.map(function (sku, i) {
                          return (
                            <div key={i}>
                              <div style={{float: 'left', width: '50px', height: '40px'}}>{sku}</div>
                            </div>
                          )
                        })
                      }
                      <div style={{float: 'left', width: '100px', height: '40px'}}><Input placeholder="请输入库存" /></div>
                      <div style={{float: 'left', width: '100px', height: '40px', marginLeft: '20px'}}><Input placeholder="请输入价格" /></div>
                    </Col>
                  </Row>
                )
              }.bind(this))
            }
            <div className={styles.hr}></div>
            <h2>参数信息</h2>
            {
              this.state.categoryAttributeList.map(function (item) {
                return (
                  item.attribute_type == 'normal' ?
                  <FormItem key={item.attribute_id} {...Helper.formItemLayout} label={item.attribute_name} >
                    <Input {...getFieldProps('categoryAttributeList.' + item.attribute_id)} defaultValue={item.attribute_value} type="text" style={{width: Helper.inputWidth}} placeholder={"请输入" + item.attribute_name} />
                  </FormItem>
                  :
                  ''
                )
              }.bind(this))
            }
            <FormItem wrapperCol={{offset: Helper.formItemLayout.labelCol.span}}>
              <Button type="primary" icon="check-circle" size="default" onClick={this.onClickSubmit.bind(this)}>确定</Button>
            </FormItem>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </Form>
      </Spin>
    )
  }
}

ProductDetail = Form.create({

})(ProductDetail)

export default withRouter(ProductDetail)