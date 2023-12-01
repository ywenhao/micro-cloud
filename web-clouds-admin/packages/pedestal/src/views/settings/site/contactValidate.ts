export const contactValidate = {
  phone: {
    reg: /^(?=^.{7,24}$)(?!(^\d{5,} ))(?!^0+$)(\+?\d{1,4} )?(\d{1,4} )?(\d{1,11} )*\d{1,11}$/,
    error: '电话号码格式错误'
  },
  email: {
    // eslint-disable-next-line no-useless-escape
    reg: /^(?=^.{6,50}$)(?!(.*\.\..*))[^!#$%&‘*+\-\/=?^`{|}~@.][^!#$%&‘*+\-\/=?^`{|}~@]*[^!#$%&‘*+\-\/=?^`{|}~@\.]*@([a-zA-Z0-9\-_]{1,63}?\.)+[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$/,
    error: '邮箱格式错误'
  },
  qq: {
    reg: /^[1-9]\d{4,11}$/,
    error: 'QQ格式错误'
  },
  telegram: {
    reg: /^(?=^.{0,100}$)(https|http):\/\/t\.me\/\S+$/,
    error: 'telegram格式错误'
  },
  skype: {
    reg: /^(?=^.{0,100}$)(https|http):\/\/join\.skype\.com\/invite\/\S+$/,
    error: 'skype格式错误'
  }
}
