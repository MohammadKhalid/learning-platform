const { to, ReE, ReS } = require('../../services/util.service');

const dashboard = function(req, res){
	let user = req.user.id;
	return res.json({success:true, message:'it worked', data:'user name is :'});
}
module.exports.dashboard = dashboard