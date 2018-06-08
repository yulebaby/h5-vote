var userid = '';
var voteInfo = '';//投票状态
var activeIndex = '';
var nowIndex = '';
var swiper = '';
var clikFlag = true;
//var timer = null;
var domain = 'http://vote.beibeiyue.com/vote';      //线上
//var domain = 'http://192.168.1.159:8090';           //本地
//http://vote.beibeiyue.com/vote;
//var domain ="http://101.200.177.83:7993/vote"    //测试
//var domain = 'http://101.200.177.83:7993/vote';
$(function () {
		/***获取候选人列表***/
		getCodeConut();
		//实时刷新
		setInterval(function(){
	   		autoUpdateCount();
	   		getState();
	    },1000);
//	   timer = setInterval(function(){
//	   	 getState();
//	   })
        //点击投票
        $('.voteBtn').click(function(){
        	$('.votePopBox,.mackbg').show();
        });
        $('.sureVote').click(function(){
//      	alert(userid)
//      	alert(activeIndex);
//      	alert(nowIndex)
        	sendVote(userid,activeIndex);
        });
        $('.closeBtn').click(function(){
        	$('.votePopBox,.mackbg').hide();
        });
        $('.voteContent li').click(function(){
        	$(this).addClass('current').siblings('li').removeClass('current');
        	$('.swiper-pagination').find('.swiper-pagination-bullet').eq($(this).index()).click();
        });
        /****通过code获得userid，userid在投票接口，修改活动状态接口需要用到****/
       $.ajax({
	       	url:domain+'/ding/getSign',
	     	dataType:'json',
	     	type:'get',
	     	async:false,
	     	data:{url:window.location.href},
	     	beforeSend:function(res){
	     		$('.loading,.mackbg').show();
	     	},
	     	success:function(res){
	     		$('.loading,.mackbg').hide();
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
    });
    //获取票数
    function getCodeConut(){
    	$.ajax({
	       	url:domain+'/vote/getCandidate',
	     	dataType:'json',
	     	type:'get',
	     	async:true,
	     	data:{activeCode:'201806'},
	     	beforeSend:function(res){
	     		$('.loading,.mackbg').show();
	     	},
	     	success:function(res){
	     		$('.loading,.mackbg').hide();
	     		var voteObj = res.result;
	     		activeIndex = voteObj[0].candidateId;
	     		nowIndex = 0;
		        var voteData = [];
		        var voteName = [];
		        for (var i = 0; i < voteObj.length; i++) {
		            voteData.push(voteObj[i].ticketCount);
		            voteName.push(voteObj[i].name);
		        }
		        var html = '';
		        //动态追加页面元素
		        for(var j = 0; j < voteObj.length; j++){
		        	html+='<div class="swiper-slide">'+
			            '<img src="images/bg'+(j+1)+'.jpg">'+
			            '<div class="voteDetailsBox">'+
			                '<h3 class="voteCounts"><em>'+voteObj[j].ticketCount+'</em>票</h3>'+
			                '<input type="hidden" value="'+voteObj[j].candidateId+'"/>'+
			                '<p class="card">拼搏之星候选人<br>'+voteObj[j].department+'</p>'+
			                '<p class="personName">'+voteObj[j].name+'</p></div></div>'
		        }
		        $('.swiper-wrapper').html(html);
		        //console.log($('.swiper-wrapper .swiper-slide').length);
		        //TODO 这个必须在 swiper 初始化之前，swiper 会前后各追加一个。。  成了   5+2
				$.each(voteObj, function (index, val) {
		           //$('.swiper-wrapper .swiper-slide').eq(index).find('input[type=hidden]').val(val.candidateId);
		           //$('.swiper-wrapper .swiper-slide').eq(index).find('.voteCounts em').html(val.ticketCount);
		           $('.voteDataBox ul li').eq(index).find('.voteName').html(val.name);
		           //$('.swiper-wrapper .swiper-slide').eq(index).find('.personName').html(val.name)
		        });
		        //柱状图显示，获取投票数最大值，柱状图显示比例高度=一个柱状图高度 *（投票数/最大投票数）；
				var maxVote = Math.max.apply(null, voteData);
		        var fullHeight = $('.voteDataBox ul').height();
		
		        $.each(voteData, function (index, val) {
		            $('.histogramBox').eq(index).css('height', function () {
		                return fullHeight * (val / maxVote);
		            });
		            $('.voteDataBox ul li').eq(index).find('span').html(val);
		        });
		        
		        //轮播图
		        swiper = new Swiper('.swiper-container', {
		            spaceBetween: 30,
		            effect: 'fade',
		            loop: true,
		            navigation: {
		                nextEl: '.swiper-button-next',
		                prevEl: '.swiper-button-prev',
		            },
		            pagination: {
			            el: '.swiper-pagination',
			            clickable: true
		            },
		            on: {
		                init: function (swiper) {
		                },
		                slideChange: function () {
							if(swiper){
								//alert('轮播索引'+swiper.activeIndex)
								//最后一个特殊处理
								//nowIndex = swiper.activeIndex-1;
								if(swiper.activeIndex === 6){
									$('.introduction p').eq(0).show();
									$('.introduction p').eq(4).hide();
									activeIndex = $('.swiper-container').find('.swiper-slide').eq(1).find('input[type=hidden]').val();
									nowIndex = 0;
									//alert('最后一个')
									$('.voteContent li').eq(0).addClass('current');
									$('.voteContent li').eq(4).removeClass('current');
								}else{
									$('.introduction p').eq(swiper.activeIndex-1).show().siblings().hide();
									activeIndex = $('.swiper-container').find('.swiper-slide').eq(swiper.activeIndex).find('input[type=hidden]').val();
									$('.voteContent li').eq(swiper.activeIndex-1).addClass('current').siblings('li').removeClass('current');
									nowIndex = swiper.activeIndex-1;
									//alert('滑动')
								}
								
							}
		                }
		            }
		        });
	     		//alert(JSON.stringify(voteObj));
	     	},
	     	error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
       });
    }
    //通过code获取userid
    function getUserid(code){
    	$.ajax({
	       	url:domain+'/ding/getUserid',
	     	dataType:'json',
	     	type:'get',
	     	async:true,
	     	data:{code:code,activeCode:'201806'},
	     	beforeSend:function(res){
	     		$('.loading,.mackbg').show();
	     	},
	     	success:function(res){
	     		$('.loading,.mackbg').hide();
	     		//alert(res.result.voteInfo);
	     		if(res.code == 1000){
	     			userid = res.result.userid;
	     			voteInfo = res.result.voteInfo;
	     		}else if(res.code == 1003){
	     			userid = '';
	     		}
	     		getState();
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
//	     	beforeSend:function(res){
//	     		$('.loading,.mackbg').show();
//	     	},
	     	success:function(res){
//	     		$('.loading,.mackbg').hide();
//	     		alert(res.result)
//	     		alert(userid)
//	     		alert(voteInfo)
	     		if(res.code == 1000){
	     			//0未开始 -1进行中 1已结束 2暂停中，只有是进行中才可以投票
	     			//投票状态是未开始，已结束，暂停中，按钮不能置灰
	     			if(res.result == 0 || res.result == 1 || res.result == 2){
	     				$('.voteBtn').addClass('disabled');
	     				$('.voteBtn .lightBtn').hide();
	     				$('.voteBtn .grayBtn').show();
	     				//只有状态是进行中，并且是公司内部的员工，并且没投过票，(0没有投过票，1投过票)才可以高亮投票按钮
	     			}else if(res.result == -1){
	     				if(userid !=''){
	     					if(voteInfo == 0){
	     						$('.voteStateTxt').html('').hide();
	     						$('.voteBtn').removeClass('disabled');
			     				$('.voteBtn .lightBtn').show();
			     				$('.voteBtn .grayBtn').hide();
	     					}else{
	     						$('.voteBtn').addClass('disabled');
			     				$('.voteBtn .lightBtn').hide();
			     				$('.voteBtn .grayBtn').show();
			     				$('.voteStateTxt').show().html('已投票');
	     					}
	     				}else{
	     					$('.voteBtn').addClass('disabled');
		     				$('.voteBtn .lightBtn').hide();
		     				$('.voteBtn .grayBtn').show();
	     				}
	     			}
	     			//显示按钮文案
	     			if(res.result == 0){
	     				$('.voteStateTxt').show().html('未开始');
	     			}
	     			if(res.result == 1){
	     				$('.voteStateTxt').show().html('已结束');
	     			}
	     			if(res.result == 2){
	     				$('.voteStateTxt').show().html('暂停中');
	     			}
	     		}else if(res.code == 1004){
	     			alert('ativeCode为空');
	     		}else if(res.code == 1005){
	     			alert('获取不到当前活动状态信息');
	     		}
	     	},
	     	error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
       });
   }
   //点击进行投票
   function sendVote(userid,candidateId){
   		if(clikFlag){
			clikFlag = false;
	   	$.ajax({
	       	url:domain+'/vote/sendVote',
	     	dataType:'json',
	     	type:'post',
	     	async:true,
	     	data:{userid:userid,candidateId:candidateId,activeCode:'201806'},
	     	beforeSend:function(res){
	     		$('.loading,.mackbg').show();
	     	},
	     	success:function(res){
	     		$('.loading,.mackbg').hide();
	     		if(res.code == 1000){
	     			clikFlag = true;
	     			//clearInterval(timer)
	     			//alert('投票成功');
	     			//投票成功，投票按钮置灰
	     			$('.voteBtn').addClass('disabled');
	     			$('.voteBtn .lightBtn').hide();
	     			$('.voteBtn .grayBtn').show();
	     			$('.voteStateTxt').show().html('已投票');
	     			voteInfo = 1;
	     			//当前弹出框关闭
	     			$('.votePopBox,.mackbg').hide();
	     			//点赞的弹出框展示
	     			$('.zan,.mackbg').show();
	     			//投完票以后刷新投票数据
	     			//updateCount();
	     			handleUpdateCount();
	     			//1.5秒之后点赞的弹出框关闭
		        	setTimeout(function(){
		        		$('.zan,.mackbg').hide();
		        	},15000)
	     		}else if(res.code == 1003){
	     			alert('userid为null');
	     		}else if(res.code == 1004){
	     			alert('activeCode为空');
	     		}else if(res.code == 1006){
	     			alert('参选人为null');
	     		}else if(res.code == 1010){
	     			alert('活动状态异常');
	     		}else if(res.code == 1012){
	     			if(res.result == 1){
	     				alert('投票活动已结束');
	     			}else if(res.result == 2){
	     				alert('投票活动已暂停');
	     			}else if(res.result == 0){
	     				alert('投票活动未开始');
	     			}
	     			
	     		}
	     	},
	     	error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
       });
       }
   }
   //前端jq改变轮播图数据
   function handleUpdateCount(){
   		$.ajax({
	       	url:domain+'/vote/getCandidate',
	     	dataType:'json',
	     	type:'get',
	     	async:true,
	     	data:{activeCode:'201806'},
	     	beforeSend:function(res){
	     		$('.loading,.mackbg').show();
	     	},
	     	success:function(res){
	     		$('.loading,.mackbg').hide();
	     		var voteObj = res.result;
	     		activeIndex = voteObj[0].candidateId;
		        var voteData = [];
		        var voteName = [];
		        for (var i = 0; i < voteObj.length; i++) {
		            voteData.push(voteObj[i].ticketCount);
		            voteName.push(voteObj[i].name);
		        }
		         //柱状图显示，获取投票数最大值，柱状图显示比例高度=一个柱状图高度 *（投票数/最大投票数）；
				var maxVote = Math.max.apply(null, voteData);
		        var fullHeight = $('.voteDataBox ul').height();
		
		        $.each(voteData, function (index, val) {
		            $('.histogramBox').eq(index).css('height', function () {
		                return fullHeight * (val / maxVote);
		            });
		            $('.voteDataBox ul li').eq(index).find('span').html(val);
		        });
		        //jq改变轮播图票数
		        console.log('当前索引' + (nowIndex))
			    var nowCounts = $('[data-swiper-slide-index="' + nowIndex + '"]').find('.voteCounts').find('em').html();
			    console.log('当前票数' + nowCounts);
			    var newCounts = parseInt(nowCounts) + 1;
			    $('[data-swiper-slide-index="' + nowIndex + '"]').find('.voteCounts').find('em').html(newCounts);
			    
		    },error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
		})
   }
   //刷新投票数据，暂时不用
   function updateCount(){
	   	$.ajax({
	       	url:domain+'/vote/getCandidate',
	     	dataType:'json',
	     	type:'get',
	     	async:true,
	     	data:{activeCode:'201806'},
	     	beforeSend:function(res){
	     		$('.loading,.mackbg').show();
	     	},
	     	success:function(res){
	     		$('.loading,.mackbg').hide();
	     		var voteObj = res.result;
	     		activeIndex = voteObj[0].candidateId;
		        var voteData = [];
		        var voteName = [];
		        for (var i = 0; i < voteObj.length; i++) {
		            voteData.push(voteObj[i].ticketCount);
		            voteName.push(voteObj[i].name);
		        }
		        var html = '';
		        //动态追加页面元素
		        for(var j = 0; j < voteObj.length; j++){
		        	html+='<div class="swiper-slide">'+
			            '<img src="images/bg'+(j+1)+'.jpg">'+
			            '<div class="voteDetailsBox">'+
			                '<h3 class="voteCounts"><em>'+voteObj[j].ticketCount+'</em>票</h3>'+
			                '<input type="hidden" value="'+voteObj[j].candidateId+'"/>'+
			                '<p class="card">优秀员工候选人<br>互联网产品设计部门</p>'+
			                '<p class="personName">'+voteObj[j].name+'</p></div></div>'
		        }
		        $('.swiper-wrapper').html(html);
		        //console.log($('.swiper-wrapper .swiper-slide').length);
		        //TODO 这个必须在 swiper 初始化之前，swiper 会前后各追加一个。。  成了   5+2
				$.each(voteObj, function (index, val) {
		           //$('.swiper-wrapper .swiper-slide').eq(index).find('input[type=hidden]').val(val.candidateId);
		           //$('.swiper-wrapper .swiper-slide').eq(index).find('.voteCounts em').html(val.ticketCount);
		           $('.voteDataBox ul li').eq(index).find('.voteName').html(val.name);
		           //$('.swiper-wrapper .swiper-slide').eq(index).find('.personName').html(val.name)
		        });
		        //柱状图显示，获取投票数最大值，柱状图显示比例高度=一个柱状图高度 *（投票数/最大投票数）；
				var maxVote = Math.max.apply(null, voteData);
		        var fullHeight = $('.voteDataBox ul').height();
		
		        $.each(voteData, function (index, val) {
		            $('.histogramBox').eq(index).css('height', function () {
		                return fullHeight * (val / maxVote);
		            });
		            $('.voteDataBox ul li').eq(index).find('span').html(val);
		        });
		        swiper.destroy(false); //这个false？true？
		        
		        //轮播图
		        swiper = new Swiper('.swiper-container', {
		            spaceBetween: 30,
		            effect: 'fade',
		            loop: true,
		            navigation: {
		                nextEl: '.swiper-button-next',
		                prevEl: '.swiper-button-prev',
		            },
		            pagination: {
			            el: '.swiper-pagination',
			            clickable: true
		            },
		            on: {
		                init: function (swiper) {
		                	//$('.swiper-pagination').find('.swiper-pagination-bullet').eq(activeIndex).click();
		                },
		                slideChange: function () {
							if(swiper){
								//最后一个特殊处理
								if(swiper.activeIndex  === 6){
									$('.introduction p').eq(0).show();
									$('.introduction p').eq(4).hide();
									activeIndex = $('.swiper-container').find('.swiper-slide').eq(1).find('input[type=hidden]').val();
									$('.voteContent li').eq(0).addClass('current');
									$('.voteContent li').eq(4).removeClass('current');
								}else{
									$('.introduction p').eq(swiper.activeIndex-1).show().siblings().hide();
									activeIndex = $('.swiper-container').find('.swiper-slide').eq(swiper.activeIndex).find('input[type=hidden]').val();
									$('.voteContent li').eq(swiper.activeIndex-1).addClass('current').siblings('li').removeClass('current');
								}
								
							}
		                }
		            }
		        });
		    },
	     	error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
		});
   }
   //前端jq改变轮播图数据
   function autoUpdateCount(){
   		$.ajax({
	       	url:domain+'/vote/getCandidate',
	     	dataType:'json',
	     	type:'get',
	     	async:true,
	     	data:{activeCode:'201806'},
	     	success:function(res){
	     		var voteObj = res.result;
		        var voteData = [];
		        var voteName = [];
		        for (var i = 0; i < voteObj.length; i++) {
		            voteData.push(voteObj[i].ticketCount);
		            voteName.push(voteObj[i].name);
		        }
		         //柱状图显示，获取投票数最大值，柱状图显示比例高度=一个柱状图高度 *（投票数/最大投票数）；
				var maxVote = Math.max.apply(null, voteData);
		        var fullHeight = $('.voteDataBox ul').height();
		
		        $.each(voteData, function (index, val) {
		            $('.histogramBox').eq(index).css('height', function () {
		                return fullHeight * (val / maxVote);
		            });
		            $('.voteDataBox ul li').eq(index).find('span').html(val);
		            $('[data-swiper-slide-index="' + index + '"]').find('.voteCounts').find('em').html(val);
		        });
		    },error:function(){
	     		alert('网络错误，请刷新重试');
	     	}
		})
   }
   
   



