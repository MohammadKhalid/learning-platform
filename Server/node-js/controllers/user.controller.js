const { User } = require('../models');

const changeOnlineStatus = async function (data, status) {
       await User.update({
        isLogin: status
    },
        {
            where: {
                id: data.user_id
            }
        })
}
module.exports.changeOnlineStatus = changeOnlineStatus;