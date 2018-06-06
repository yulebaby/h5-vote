//var domain = 'http://192.168.1.159:8090';
//http://vote.beibeiyue.com/vote
var domain ="http://101.200.177.83:7993/vote"
//var domain = 'http://vote.beibeiyue.com/vote';
$(function(){
	 /****通过code获得userid，userid在投票接口，修改活动状态接口需要用到****/
	
       $.ajax({
	       	url:domain+'/ding/getSign',
	     	dataType:'json',
	     	type:'get',
	     	async:false,
	     	data:{url:window.location.href},
	     	beforeSend:function(res){
	     		$('.loading,.mackbg2').show();
	     	},
	     	success:function(res){
	     		$('.loading,.mackbg2').hide();
	     		var _config = res.result;
	     		dd.config({
				    agentId: '167529055', //服务端传来的congfig信息
				    corpId: _config.corpId,
				    timeStamp: _config.timeStamp,
				    nonceStr: _config.nonceStr,
				    signature: _config.signature,
				    jsApiList:[]
				});
				dd.ready(function() {
				    dd.runtime.permission.requestAuthCode({
				        corpId: _config.corpId,
				        onSuccess: function(result) {
				       		getUserid(result.code);
				        },
				        onFail : function(err) {
				        	console.log(err)
				        }
				    });
				});
				dd.error(function(err) {
					console.log('dd error: ' + JSON.stringify(err))
//				    logger.e('dd error: ' + JSON.stringify(err));
					alert('权限校验失败，请退出页面重新进入')
				});
	     	},
	     	error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
       });
        $('.start').click(function(){
        	$('.musTxt').html($('.stateTxt').html());
 			$('#changeVotePop01,.mackbg').show();
 		});
 		$('.continue').click(function(){
 			$('.musTxt').html($('.stateTxt').html());
 			$('#changeVotePop03,.mackbg').show();
 		});
 		$('.stop').click(function(){
 			$('.musTxt').html($('.stateTxt').html());
 			$('#changeVotePop02,.mackbg').show();
 		});
 		$('.end').click(function(){
 			$('.musTxt').html($('.stateTxt').html());
 			$('#changeVotePop04,.mackbg').show();
 		});
 		$('.releseBtn').click(function(){
 			$('.musTxt').html($('.stateTxt').html());
 			$('.changeVotePop,.mackbg').hide();
 		})
})
//通过code获取userid
function getUserid(code){
	$.ajax({
       	url:domain+'/ding/getUserid',
     	dataType:'json',
     	type:'get',
     	async:true,
     	data:{code:code,activeCode:'201806'},
     	beforeSend:function(res){
     		$('.loading,.mackbg2').show();
     	},
     	success:function(res){
     		$('.loading,.mackbg2').hide();
     		//alert(res.result.userid);
     		getState();
     		//点击开始活动
     		$('#changeVotePop01 .sureBtn').click(function(){
     			changestatusFn(res.result.userid,0)
     			//$('.stateTxt').html('进行中');
     			
//   			$('.manageBox').removeClass('nostart');
//		        $('.manageBox').removeClass('stoping');
//		        $('.manageBox').removeClass('continueing');
//		        $('.manageBox').removeClass('ending');
//		        
//   			//$('.manageBox').removeClass('nostart,stoping,continueing,ending');
//   			$('.manageBox').addClass('woking');
//		        $(this).addClass('disabled');
//		        $('.stop,.end').removeClass('disabled');
		        
     			
     		});
     		//点击继续活动
     		$('#changeVotePop03 .sureBtn').click(function(){
     			changestatusFn(res.result.userid,3);
     			
     			//$('.stateTxt').html('进行中');
//		        $(this).addClass('disabled');
//		        
//		        $('.manageBox').removeClass('woking');
//		        $('.manageBox').removeClass('nostart');
//		        $('.manageBox').removeClass('ending');
//		        $('.manageBox').removeClass('stoping');
//
//
//		        $('.manageBox').removeClass('woking,nostart,stoping,ending');
//		        $('.manageBox').addClass('continueing');
        
     			
     		});
     		//点击暂停活动
     		$('#changeVotePop02 .sureBtn').click(function(){
     			changestatusFn(res.result.userid,2);
     			
     			//$('.stateTxt').html('暂停中');
     			
//   			$('.manageBox').removeClass('woking');
//		        $('.manageBox').removeClass('nostart');
//		        $('.manageBox').removeClass('continueing');
//		        $('.manageBox').removeClass('ending');
//   			//$('.manageBox').removeClass('woking,nostart,continueing,ending');
//		        $('.manageBox').addClass('stoping');
//		        $(this).addClass('disabled');
//		        $('.start').hide();
//		        $('.continue').show();
//		        $('.continue').removeClass('disabled');
		        
     			
     		});
     		//点击结束活动
     		$('#changeVotePop04 .sureBtn').click(function(){
     			changestatusFn(res.result.userid,1)
     			
     			//$('.stateTxt').html('结束');
     			
//   			$('.manageBox').removeClass('woking');
//		        $('.manageBox').removeClass('nostart');
//		        $('.manageBox').removeClass('continueing');
//		        $('.manageBox').removeClass('stoping');
//   			//$('.manageBox').removeClass('woking,nostart,continueing,stoping');
//   			$('.manageBox').addClass('ending');
//		        $('.operateBox li').addClass('disabled');
		        
     			
     		})
     	},
     	error:function(){
     		alert('网络错误，请刷新重试');
     	}
   });
}
//获取投票状态接口
function getState(){
   	$.ajax({
       	url:domain+'/vote/getState',
     	dataType:'json',
     	type:'get',
     	async:true,
     	data:{activeCode:'201806'},
     	beforeSend:function(res){
     		$('.loading,.mackbg2').show();
     		var date = new Date();
     		//alert('前时间'+date.getMilliseconds());
     	},
     	success:function(res){
     		$('.loading,.mackbg2').hide();
     		var date = new Date();
     		//alert('后时间'+date.getMilliseconds());
     		if(res.code == 1000){
     			//alert(res.result)
     			//0未开始 -1进行中 1已结束 2暂停中，只有是进行中才可以投票
     			//投票状态是未开始，已结束，暂停中，按钮不能置灰
     			if(res.result == -1){
     				$('.headerBox,.operateBox').addClass('woking');
     				$('.stateTxt').html('进行中');
     				$('.start').addClass('disabled');
     				$('.continue').addClass('disabled');
     				$('.continue').css('color','#ccc');
     				$('.stop').removeClass('disabled');
     				$('.stop').css('color','#666');
     				
     				$('.end').removeClass('disabled');
     				//alert(JSON.stringify($('.manageBox').html()))
     			}else if(res.result == 1){
     				$('.headerBox,.operateBox').addClass('ending');
     				$('.stateTxt').html('已结束');
     				
     				$('.continue').hide();
     				$('.start').show();
     				
   					$('.start,.stop,.end,.continue').addClass('disabled');
   					$('.stop').css('color','#ccc');
     				
     				//alert(JSON.stringify($('.manageBox').html()))
     			}else if(res.result == 2){
     				$('.headerBox,.operateBox').addClass('stoping');
     				$('.stateTxt').html('暂停中');		
     				$('.stop').addClass('disabled');
     				$('.stop').css('color','#ccc');
     				
     				$('.start').hide();
     				$('.continue').show();
     				$('.continue').removeClass('disabled');
     				$('.continue').css('color','#666');
     				//alert(JSON.stringify($('.manageBox').html()))
     			}else if(res.result == 0){
     				$('.headerBox,.operateBox').addClass('nostart');
     				     			
     				$('.stateTxt').html('待开始');
     				$('.stop,.end').addClass('disabled');
     				
     				//alert(JSON.stringify($('.manageBox').html()))
     			}
     		}else if(res.code == 1004){
     			alert('tiveCode为空');
     		}else if(res.code == 1005){
     			alert('获取不到当前活动状态信息');
     		}
     	},
     	error:function(){
     		alert('网络错误，请刷新重试');
     	}
   });
}
function changestatusFn(userid,state){
		$.ajax({
	       	url:domain+'/vote/changeState',
	     	dataType:'json',
	     	type:'post',
	     	async:true,
	     	data:{userid:userid,activeCode:'201806',state:state},
	     	beforeSend:function(res){
	     	},
	     	success:function(res){
	     		//alert(res.code)
	     		if(res.code == 1000){
	     			$('.changeVotePop,.mackbg').hide();
	     			getState();
	     		}else if(res.code == 1013){
	     			alert('修改失败');
	     		}else if(res.code == 1003){
	     			alert('userid为空');
	     		}else if(res.code == 1004){
	     			alert('activeCode为null');
	     		}else if(res.code == 1005){
	     			alert('状态码异常');
	     		}else if(res.code == 1014){
	     			alert('您不是管理员');
	     		}
	     	},
	     	error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
     	})
}
