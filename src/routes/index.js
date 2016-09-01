import React, { PropTypes } from 'react'
import { Router, Route, IndexRedirect } from 'react-router'
import NotFound from '../components/NotFound'
import Login from '../components/Login'
import Logout from '../components/Logout'
import Register from '../components/Register'
import Main from '../components/Main'
import ProductIndex from '../components/product/Index'
import ProductDetail from '../components/product/Detail'
import ProductCategoryIndex from '../components/product/category/Index'
import ProductCategoryDetail from '../components/product/category/Detail'
import ProductCategoryAttributeIndex from '../components/product/category/attribute/Index'
import ProductCategoryAttributeDetail from '../components/product/category/attribute/Detail'
import BrandIndex from '../components/brand/Index'
import BrandDetail from '../components/brand/Detail'
import ShopIndex from '../components/shop/Index'
import ShopDetail from '../components/shop/Detail'
import AuthorizationIndex from '../components/authorization/Index'
import AuthorizationDetail from '../components/authorization/Detail'
import AdminIndex from '../components/admin/Index'
import AdminDetail from '../components/admin/Detail'
import AdminAuthorization from '../components/admin/authorization'
import GroupIndex from '../components/group/Index'
import GroupDetail from '../components/group/Detail'
import MenuIndex from '../components/menu/Index'
import MenuDetail from '../components/menu/Detail'
import LogIndex from '../components/log/Index'
import LogDetail from '../components/log/Detail'
import AttributeIndex from '../components/attribute/Index'
import AttributeDetail from '../components/attribute/Detail'
import OperationIndex from '../components/operation/Index'
import OperationDetail from '../components/operation/Detail'
import RoleIndex from '../components/role/Index'
import RoleDetail from '../components/role/Detail'
import RoleAuthorization from '../components/role/authorization'
import MemberIndex from '../components/member/Index'
import MemberDetail from '../components/member/Detail'
import TeacherIndex from '../components/teacher/Index'
import TeacherDetail from '../components/teacher/Detail'
import StudentIndex from '../components/student/Index'
import StudentDetail from '../components/student/Detail'
import GradeIndex from '../components/grade/Index'
import GradeDetail from '../components/grade/Detail'
import CourseIndex from '../components/course/Index'
import CourseDetail from '../components/course/Detail'
import WebConfigIndex from '../components/webconfig/Index'
import WebConfigDetail from '../components/webconfig/Detail'
import Helper from '../common/Helper'

const validate = function (next, replace, callback) {
    if (!Helper.getToken() && next.location.pathname != '/login') {
        replace('/login')
    }
    callback()
}

const Routes = ({ history }) =>
  <Router history={history}>
    <Route path="/" onEnter={validate}>
    	<IndexRedirect to="course/index" />
    	<Route component={Main}>
        <Route path="product/index" component={ProductIndex}></Route>
        <Route path="product/add" component={ProductDetail}></Route>
        <Route path="product/edit/:product_id" component={ProductDetail}></Route>
        <Route path="product/category/index" component={ProductCategoryIndex}></Route>
        <Route path="product/category/add/:parent_id" component={ProductCategoryDetail}></Route>
        <Route path="product/category/edit/:category_id" component={ProductCategoryDetail}></Route>
        <Route path="product/category/attribute/index/:category_id" component={ProductCategoryAttributeIndex}></Route>
        <Route path="product/category/attribute/add/:category_id" component={ProductCategoryAttributeDetail}></Route>
        <Route path="product/category/attribute/edit/:category_id/:attribute_id" component={ProductCategoryAttributeDetail}></Route>
        <Route path="brand/index" component={BrandIndex}></Route>
        <Route path="brand/add" component={BrandDetail}></Route>
        <Route path="brand/edit/:brand_id" component={BrandDetail}></Route>
        <Route path="shop/index" component={ShopIndex}></Route>
        <Route path="shop/add" component={ShopDetail}></Route>
        <Route path="shop/edit/:shop_id" component={ShopDetail}></Route>
        <Route path="authorization/index" component={AuthorizationIndex}></Route>
        <Route path="authorization/edit/:authorization_id" component={AuthorizationDetail}></Route>
        <Route path="admin/index" component={AdminIndex}></Route>
        <Route path="admin/add" component={AdminDetail}></Route>
        <Route path="admin/edit/:admin_id" component={AdminDetail}></Route>
        <Route path="admin/authorization/:user_id" component={AdminAuthorization}></Route>
        <Route path="group/index" component={GroupIndex}></Route>
        <Route path="group/add/:parent_id" component={GroupDetail}></Route>
        <Route path="group/edit/:category_id" component={GroupDetail}></Route>
        <Route path="menu/index" component={MenuIndex}></Route>
        <Route path="menu/add/:parent_id" component={MenuDetail}></Route>
        <Route path="menu/edit/:category_id" component={MenuDetail}></Route>
        <Route path="log/index" component={LogIndex}></Route>
        <Route path="log/edit/:log_id" component={LogDetail}></Route>
        <Route path="attribute/index" component={AttributeIndex}></Route>
        <Route path="attribute/add" component={AttributeDetail}></Route>
        <Route path="attribute/edit/:attribute_id" component={AttributeDetail}></Route>
        <Route path="operation/index" component={OperationIndex}></Route>
        <Route path="operation/add/:menu_id" component={OperationDetail}></Route>
        <Route path="operation/edit/:operation_id" component={OperationDetail}></Route>
        <Route path="role/index" component={RoleIndex}></Route>
        <Route path="role/add/:group_id" component={RoleDetail}></Route>
        <Route path="role/edit/:role_id" component={RoleDetail}></Route>
        <Route path="role/authorization/:role_id" component={RoleAuthorization}></Route>
        <Route path="member/index" component={MemberIndex}></Route>
        <Route path="member/edit/:member_id" component={MemberDetail}></Route>
        <Route path="teacher/index" component={TeacherIndex}></Route>
        <Route path="teacher/add" component={TeacherDetail}></Route>
        <Route path="teacher/edit/:teacher_id" component={TeacherDetail}></Route>
        <Route path="student/index" component={StudentIndex}></Route>
        <Route path="student/add" component={StudentDetail}></Route>
        <Route path="student/edit/:student_id" component={StudentDetail}></Route>
        <Route path="grade/index" component={GradeIndex}></Route>
        <Route path="grade/add" component={GradeDetail}></Route>
        <Route path="grade/edit/:grade_id" component={GradeDetail}></Route>
        <Route path="course/index" component={CourseIndex}></Route>
        <Route path="course/add" component={CourseDetail}></Route>
        <Route path="course/edit/:course_id" component={CourseDetail}></Route>
        <Route path="web/config/index" component={WebConfigIndex}></Route>
        <Route path="web/config/add" component={WebConfigDetail}></Route>
        <Route path="web/config/edit/:web_config_id" component={WebConfigDetail}></Route>
    	</Route>
	    <Route path="login" component={Login}></Route>
        <Route path="logout" component={Logout}></Route>
        <Route path="register" component={Register}></Route>
	    <Route path="*" component={NotFound}></Route>
    </Route>
  </Router>

Routes.propTypes = {
  history: PropTypes.any,
}

export default Routes
