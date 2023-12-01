/* eslint-disable no-unused-vars */
/**
 * @description: 请求结果集
 */
export enum ResultEnum {
  SUCCESS = 12156200,
  ERROR = 12156400,
  UNAUTHORIZED = 12156401,
  // 原密码不正确
  Old_PASSWORD_ERROR = 12156606,
  // 新密码与原密码相同
  PASSWORD_OLD_EQ_NEW = 12156607,
  CERTNOEXIST = 12156507,
  ErrDomainUnList = 12156909, //域名未添加值dns服务器
  ErrNsStatus = 12156917 //ns状态异常
}

/**
 * @description: 请求方式
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

/**
 * @description:  headers contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}
