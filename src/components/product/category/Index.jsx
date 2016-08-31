import React, { Component } from 'react'
import { withRouter } from 'react-router'
import CategoryIndex from '../../category/Index'
import Helper from '../../../common/Helper'

class ProductCategoryIndex extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onSelectMenu('/product/category/index')
  }

  render() {
    return (
      <CategoryIndex category_key={'product'} sub_url={'/category'} category_name={'商品分类'} operation={[{"key":"attribute","name":"属性","url":"/product/category/attribute/index"}]} />
    )
  }
}

export default withRouter(ProductCategoryIndex)