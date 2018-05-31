$(function(){
	 /****通过code获得userid，userid在投票接口，修改活动状态接口需要用到****/
       $.ajax({
	       	url:'http://192.168.1.159:8081/ding/getSign',
	     	dataType:'json',
	     	type:'get',
	     	async:false,
	     	data:{url:window.location.href},
	     	success:function(res){
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
					alert('dd error: ' + JSON.stringify(err))
//				    logger.e('dd error: ' + JSON.stringify(err));
				});
	     	},
	     	error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
       });
})
//通过code获取userid
function getUserid(code){
	$.ajax({
       	url:'http://192.168.1.159:8081/ding/getUserid',
     	dataType:'json',
     	type:'get',
     	async:true,
     	data:{code:code,activeCode:123},
     	success:function(res){
     		//alert(res.result.userid);
     		getState();
     		$('.start').click(function(){
     			//alert('开始')
//   			$('.stop,.end').removeClass('disabled');
     			changestatusFn(res.result.userid,0)
     		});
     		$('.continue').click(function(){
     			$('.continue').css('color','#ccc');
     			$('.stop').css('color','#666');
     			$('.continue,.stop,.end').addClass('disabled');
     			changestatusFn(res.result.userid,3);
     		})
     		$('.stop').click(function(){
     			$('.stop').css('color','#ccc');
     			$('.continue').css('color','#666');
     			$('.continue,.end').removeClass('disabled');
     			changestatusFn(res.result.userid,2);
     		})
     		$('.end').click(function(){
     			$('.stop').css('color','#ccc');
     			changestatusFn(res.result.userid,1)
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
       	url:'http://192.168.1.159:8081/vote/getState',
     	dataType:'json',
     	type:'get',
     	async:true,
     	data:{activeCode:123},
     	beforeSend:function(res){
     		var date = new Date();
     		//alert('前时间'+date.getMilliseconds());
     	},
     	success:function(res){
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
     				//alert(JSON.stringify($('.manageBox').html()))
     			}else if(res.result == 1){
     				$('.headerBox,.operateBox').addClass('ending');
     				$('.stateTxt').html('已结束');
     				
     				$('.continue').hide();
     				$('.start').show();
     				
     				$('.start,.stop,.end').addClass('disabled');
     				
     				//alert(JSON.stringify($('.manageBox').html()))
     			}else if(res.result == 2){
     				$('.headerBox,.operateBox').addClass('stoping');
     				$('.stateTxt').html('暂停中');		
     				$('.stop').addClass('disabled');
     				
     				$('.start').hide();
     				$('.continue').show();
     				
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
	       	url:'http://192.168.1.159:8081/vote/changeState',
	     	dataType:'json',
	     	type:'post',
	     	async:true,
	     	data:{userid:userid,activeCode:123,state:state},
	     	beforeSend:function(res){
	     	},
	     	success:function(res){
	     		//alert(res.code)
	     		if(res.code == 1000){
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
