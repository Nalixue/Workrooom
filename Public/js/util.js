var global = global || {};

global.validator = {
    types: {

        //用户名
        namelengthLimit: {
            validate: function(option) {
                return new RegExp('^[a-z|A-Z]\\w{' + (option.min - 1) + ',' + (option.max - 1) + '}$').test(option.con);
            },
            instructions: function(option) {
                return '首字母为必须为字母，大于' + option.min + '位，小于' + option.max + '位';
            }
        },
        
        //长度限制
        lengthLimit: {
            validate: function(option) {
               return new RegExp('^\\S{' + option.min + ',' + option.max + '}$').test(option.con);
            },
            instructions: function(option) {
                return '大于' + option.min + '位，小于' + option.max + '位';
            }
        },

        //密码是否相同
        isPsdSame: {
            validate: function(option) {
                return (option.psd1 === option.psd2);
            },
            instructions: function(option) {
                return '输入两次密码不同';
            }
        },

        //是否为空
        isEmpty: {
            validate: function(option) {
                return option.length !== 0;
            },
            instructions: function(option) {
                return '不能为空';
            }
        }
    },

    config: {
        uName: 'namelengthLimit',
        psd: 'lengthLimit',
        psdSame: 'isPsdSame',
        empty: 'isEmpty',
        emptyC: 'isEmpty'
    },

    //错误信息
    message: {},

    validate: function(data) {

        var i, type, result_ok;
       
        this.message = {};
   
        for(i in data) {
        
            if(data.hasOwnProperty(i)) {              
                type = this.config[i];
                checker = this.types[type];

                if(!type) {
                    continue;
                }

                if(!checker) {
                    throw {
                        name: 'ValidationError',
                        message: 'No handler to validate type' + type
                    };
                }
                result_ok = checker.validate(data[i]);

                if(!result_ok) {

                    this.message[i] = checker.instructions(data[i]);
                }
            }
        }
        return this.hasErrors();
    },

    //判断是否有错误信息
    hasErrors: function() {
        return !this._isEmpty(this.message);
    },

    //判断是否为空对象
    _isEmpty: function(obj) {
        for(var i in obj) {
            return false;
        }
        return true;
    }
};