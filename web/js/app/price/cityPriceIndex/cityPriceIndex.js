/**定义细分市场LI全局变量*/
var currSegmentLI = null;
/**定义厂商LI全局变量*/
var currManfLI = null;
/**定义品牌LI全局变量*/
var currBrandLI = null;
/**定义子车型LI全局变量*/
var currSubModelLI = null;
/**定义车身形式LI全局变量*/
var currBodyTypeLI = null;
/**定义系别LI全局变量*/
var currOrigLI = null;
var defaultEndTime = endDate;
var segmentPath = "/global/getSegmentAndChildren";
$(document).ready(function(){ 
	
	
	
	/****分级全选开始****/
	$(".selectorHeadTdInput").live("click",function(){
		var ths = $(this);
		var startTr = $(this).parents("tr");//点击input父级位置
		var endTr = $(this).parents("tr").nextAll('.selectorHeadTdTr:eq(0)').index();
		var model = null;
		var choseType = $("#choseType").val();
		if(choseType == 2){
			model = "#tabs-segment";
		} else if(choseType == 3){
			model = "#tabs-brand";
		} else if(choseType == 4){
			model = "#tabs-manf";
		}
		var trs = $(model + " .selectorTable tr").slice($(startTr).index()+1,endTr);//找到区间内的所有tr
		if($(ths).prop("checked")){
			$(trs).find("input").filter(function(){return $(this).parent().css("display") != "none"}).prop("checked",true);
			addResultContainerBySubModel();//把选中的都放到结果集
		} else{
			$(trs).find("input").prop("checked",false);
			addResultContainerBySubModel();//把选中的都放到结果集
		}
		
	});

    /****分级全选结束****/
	/** 价格信息下拉框改变事件*/
	$("#priceType").change(function(){
		
		var priceType = $(this).val();
		
		if("0" == priceType) {
			$("#productConfig").show();
		} else{
			$("#productConfig").hide();
		} 
		
		$('body').showLoading();
		
		//去后台查询成交价的时间范围
		$.ajax({
			   type: "POST",
			   url: ctx+"/cityPriceIndex/tpDate",
			   data: getParams(),
			   success: function(data){
				   if(data)
				   {
					      
					   $.each(data, function(i,k) {
						      if(i=='beginDate'){
						    	  $("#dateYear .dateLIContainer").eq(0).find(".startDate-container input").val(k);
						    	  }
						      if(i=='endDate'){
						    	$("#dateYear .dateLIContainer").eq(0).find(".endDate-container input").val(k);
						      }
						});   
					   
				   }
				   $('body').hideLoading();
			   },
			   error:function(){
				   $('body').hideLoading();
			   }
			});
		
	});
	
	/**
	 * 填充时间多选下拉框
	 
	$('#dateYear').dropdownlist({
		id:'year',
		columns:1,
		selectedtext:'',
		listboxwidth:241,//下拉框宽
		checkbox:true,
		width:190,
		selected:['2014'],
		data:{'2010':'2010','2011':'2011','2012':'2012','2013':'2013','2014':'2014'},//数据，格式：{value:name}
		onchange:function(text,value){
			
		}
	}); */
	
	/**获取时间模板*/
	function getDateTp(type){
		
		if("add" == type)
		{
			defaultBeginDate = parseInt(defaultBeginDate.substr(0,4)) - 1 + "-01";
			endDate = parseInt(endDate.substr(0,4)) - 1 + "-12";
		}
		
		var htmlStr = "";	
		htmlStr += '<li style="list-style: none;margin-bottom:10px;" class="dateLIContainer">';
	    htmlStr += '	<div class="form-inline">';
	    htmlStr += '  		<span class="startDate-container input-append date">';
		htmlStr += '	  		<input type="text" value="'+defaultBeginDate+'"  readonly="readonly" class="input-mini white" placeholder="开始日期"  />';
		htmlStr += '	  		<span class="add-on"><i class="icon-th"></i></span>';
		htmlStr += '		</span>';
		htmlStr += '		<span class="2">至</span>';
	    htmlStr += '  		<span class="endDate-container input-append date">';
		htmlStr += '	  		<input type="text" value="'+endDate+'" readonly="readonly" class="input-mini white"  placeholder="结束日期" />';
		htmlStr += '	  		<span class="add-on"><i class="icon-th"></i></span>';
		htmlStr += '		</span>';
		htmlStr += '		<span style="margin-left:20px;">';
		htmlStr += '			<i class="icon-plus addDateBtn" style="cursor:pointer;" title="增加"></i>';
		htmlStr += '			<i class="icon-minus removeDateBtn" style="margin-left: 20px;cursor:pointer;" title="删除"></i>';
		htmlStr += '		</span>';
		htmlStr += '	</div>';
	 	htmlStr += '</li>';
	 	return htmlStr;
	}
	
	/**获取细分市场模板*/
	function getSegmentTp(){
		var htmlStr = "";
		htmlStr += '<li style="list-style: none;margin-bottom:10px;" class="segmentLIContainer">';
		htmlStr += '	<table style="width:840px;">';
		htmlStr += '		<tr>';
		htmlStr += '			<td valign="top" style="width:220px;">';
		htmlStr += '				<div>';
		htmlStr += '					<select name="objectType" onchange ="changeObjectType(this)">';
		htmlStr += '						<option value="0" selected>级别</option>';
		htmlStr += '						<option value="4">系别</option>';
		htmlStr += '						<option value="2">品牌</option>';
		htmlStr += '						<option value="1">厂商品牌</option>';
		htmlStr += '						<option value="3">车型</option>';
		htmlStr += '					</select>';
		htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" style="width:70px;">';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini segmentSelector" data-toggle="modal">选择级别</a>';
	 	htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:165px">';
		htmlStr += '				<div  style="margin-left:0px" class="segmentModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini bodyTypeSelector" data-toggle="modal">车身形式</a>';
	 	htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:150px;">';
		htmlStr += '				<div  style="margin-left:0px" class="bodyTypeModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:70px;">';
		htmlStr += '				<div class="control-group" style="margin-left:20px;margin-top: 2px;">';
	  	htmlStr += '					<i class="icon-plus addSegmentBtn" style="cursor:pointer;" title="增加" ></i>';
	  	htmlStr += '					<i class="icon-minus removeSegmentBtn" style="margin-left: 20px;cursor:pointer;" title="删除"></i>';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div class="control-group" style="margin-left:10px;margin-top: 2px;">';
	  	htmlStr += '					&nbsp;&nbsp;拆分<input name = "obj_Split" type="checkbox" value="checkbox">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '		</tr>';
		htmlStr += '	</table>';
		htmlStr += '</li>';
		return htmlStr;
	};
	
	/**获取厂商模板*/
	function getManfTp(){
		var htmlStr = "";
		htmlStr += '<li style="list-style: none;margin-bottom:10px;" class="manfLIContainer">';
		htmlStr += '	<table style="width:840px;">';
		htmlStr += '		<tr>';
		htmlStr += '			<td valign="top" style="width:220px;">';
		htmlStr += '				<div>';
		htmlStr += '					<select name="objectType" onchange ="changeObjectType(this)">';
		htmlStr += '						<option value="0">级别</option>';
		htmlStr += '						<option value="4">系别</option>';
		htmlStr += '						<option value="2">品牌</option>';
		htmlStr += '						<option value="1" selected>厂商品牌</option>';
		htmlStr += '						<option value="3">车型</option>';
		htmlStr += '					</select>';
		htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" style="width:70px;">';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini manfSelector" data-toggle="modal">选择厂商</a>';
	 	htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:165px;">';
		htmlStr += '				<div  style="margin-left:0px" class="manfModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini bodyTypeSelector" data-toggle="modal">车身形式</a>';
	 	htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:150px;">';
		htmlStr += '				<div  style="margin-left:0px" class="bodyTypeModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:70px;">';
		htmlStr += '				<div class="control-group" style="margin-left:20px;margin-top: 2px;">';
	  	htmlStr += '					<i class="icon-plus addManfBtn" style="cursor:pointer;" title="增加" ></i>';
	  	htmlStr += '					<i class="icon-minus removeManfBtn" style="margin-left: 20px;cursor:pointer;" title="删除"></i>';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div class="control-group" style="margin-left:10px;margin-top: 2px;">';
	  	htmlStr += '					&nbsp;&nbsp;拆分<input name = "obj_Split" type="checkbox" value="checkbox">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '		</tr>';
		htmlStr += '	</table>';
		htmlStr += '</li>';
		return htmlStr;
	};
	
	   /**
     * 展示城市弹出框
     */
	$('#cityModal').on('show', function () {
		
		showLoading("cityModalBody");
		$('#cityModalBody').load(ctx+"/price/cityPriceIndex/getCityModal",getParams(),function(){
			//设置默认选中项
			$('#cityModalResultContainer input').each(function(){
				var selectedId = $(this).val();
				$("#cityModalBody").find('.cityModalByCity').each(function(){
					if($(this).val() == selectedId){
						$(this).attr("checked",'true');//行全选
					}
				});
			});
			
			//行全选
			$("#cityModal").find(".cityModalByArea").each(function(){
				var allRowCityArr = $(this).parent().parent().parent().find(".cityModalByCity");
				var allRowSelectedCityArr = $(this).parent().parent().parent().find(".cityModalByCity:checked");
				if(allRowCityArr.length == allRowSelectedCityArr.length){
					$(this).attr("checked",'true');//全部全选		
				}else{
					$(this).removeAttr("checked");//全部取消
				}	
			});	
			//全选
			var allCityArr = $("#cityModal").find(".cityModalByCity");
			var allSelectedCityArr = $("#cityModal").find(".cityModalByCity:checked");
			//如果是全国均价则全选城市
			if(0 == $("#cityModalResultContainer div :input").val())
			{
				if($("#myModalLabel :checkbox").attr("checked")) 
				{
					$(".cityModalContainer").find('.cityModalByAll').click();
					$(".cityModalContainer").find('.cityModalByAll').click();
				}
				else
				{
					$(".cityModalContainer").find('.cityModalByAll').click();
				}
			}
			else if(allCityArr.length == allSelectedCityArr.length){
				$(this).parents('#cityModal').find('.cityModalByAll').attr("checked",'true');//全部全选		
			}
			else{
				$(this).parents('#cityModal').find('.cityModalByAll').removeAttr("checked");//全部取消
			}
		});
	});
	
	/**
	 * 城市确认按钮
	 * 
	 */
	/**点击确定生成内容*/
	$(".cityModalContainer").find('.confirm').on('click',function(){
		//appgobal.js里有大部门操作，此地为补充操作
		if($(".cityModalByAll").prop("checked")){
			$("#citySplit").prop("checked",false);
			$("#citySplit").attr("disabled","disabled");
		} else{
			$("#citySplit").removeAttr("disabled");
		}
	});
	
	/**获取品牌模板*/
	function getBrandTp(){
		var htmlStr = "";
		htmlStr += '<li style="list-style: none;margin-bottom:10px;" class="brandLIContainer">';
		htmlStr += '	<table style="width:840px;">';
		htmlStr += '		<tr>';
		htmlStr += '			<td valign="top" style="width:220px;">';
		htmlStr += '				<div>';
		htmlStr += '					<select name="objectType" onchange ="changeObjectType(this)">';
		htmlStr += '						<option value="0">级别</option>';
		htmlStr += '						<option value="4">系别</option>';
		htmlStr += '						<option value="2" selected>品牌</option>';
		htmlStr += '						<option value="1">厂商品牌</option>';
		htmlStr += '						<option value="3">车型</option>';
		htmlStr += '					</select>';
		htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" style="width:70px;">	';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini brandSelector" data-toggle="modal">选择品牌</a>';
	 	htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:165px;">';
		htmlStr += '				<div  style="margin-left:0px" class="brandModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini bodyTypeSelector" data-toggle="modal">车身形式</a>';
	 	htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:150px;">';
		htmlStr += '				<div  style="margin-left:0px" class="bodyTypeModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:70px;">';
		htmlStr += '				<div class="control-group" style="margin-left:20px;margin-top: 2px;">';
	  	htmlStr += '					<i class="icon-plus addBrandBtn" style="cursor:pointer;" title="增加" ></i>';
	  	htmlStr += '					<i class="icon-minus removeBrandBtn" style="margin-left: 20px;cursor:pointer;" title="删除"></i>';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div class="control-group" style="margin-left:10px;margin-top: 2px;">';
	  	htmlStr += '					&nbsp;&nbsp;拆分<input name = "obj_Split" type="checkbox" value="checkbox">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '		</tr>';
		htmlStr += '	</table>';
		htmlStr += '</li>';
		return htmlStr;
	};
	
	/**获取子车型模板*/
	function getSubModelTp(){
		var htmlStr = "";
		htmlStr += '<li style="list-style: none;margin-bottom:10px;" class="subModelLIContainer">';
		htmlStr += '	<table style="width:840px;">';
		htmlStr += '		<tr>';
		htmlStr += '			<td valign="top" style="width:220px;">';
		htmlStr += '				<div>';
		htmlStr += '					<select name="objectType" onchange ="changeObjectType(this)">';
		htmlStr += '						<option value="0">级别</option>';
		htmlStr += '						<option value="4">系别</option>';
		htmlStr += '						<option value="2">品牌</option>';
		htmlStr += '						<option value="1">厂商品牌</option>';
		htmlStr += '						<option value="3" selected>车型</option>';
		htmlStr += '					</select>';
		htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:70px;">';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini bodyTypeSelector" data-toggle="modal">车身形式</a>';
	 	htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:165px;">';
		htmlStr += '				<div  style="margin-left:0px" class="bodyTypeModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" style="width:60px;">	';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini subModelSelector" data-toggle="modal">选择车型</a>';
	 	htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:150px;">';
		htmlStr += '				<div  style="margin-left:0px" class="subModelModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:70px;">';
		htmlStr += '				<div class="control-group" style="margin-left:20px;margin-top: 2px;">';
	  	htmlStr += '					<i class="icon-plus addSubModelBtn" style="cursor:pointer;" title="增加" ></i>';
	  	htmlStr += '					<i class="icon-minus removeSubModelBtn" style="margin-left: 20px;cursor:pointer;" title="删除"></i>';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div class="control-group" style="margin-left:10px;margin-top: 2px;">';
	  	htmlStr += '					&nbsp;&nbsp;拆分<input name = "obj_Split" type="checkbox" value="checkbox">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '		</tr>';
		htmlStr += '	</table>';
		htmlStr += '</li>';
		return htmlStr;
	};
	
	/**获取系别模板*/
	function getOrigTp(){
		var htmlStr = "";
		htmlStr += '<li style="list-style: none;margin-bottom:10px;" class="origLIContainer">';
		htmlStr += '	<table style="width:840px;">';
		htmlStr += '		<tr>';
		htmlStr += '			<td valign="top" style="width:220px;">';
		htmlStr += '				<div>';
		htmlStr += '					<select name="objectType" onchange ="changeObjectType(this)">';
		htmlStr += '						<option value="0">级别</option>';
		htmlStr += '						<option value="4" selected>系别</option>';
		htmlStr += '						<option value="2">品牌</option>';
		htmlStr += '						<option value="1">厂商品牌</option>';
		htmlStr += '						<option value="3">车型</option>';
		htmlStr += '					</select>';
		htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" style="width:70px">	';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini origSelector" data-toggle="modal">选择系别</a>';
	 	htmlStr += '				</div>';
	 	htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:165px;">';
		htmlStr += '				<div  style="margin-left:0px" class="origModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div>';
		htmlStr += '					<a href="#" role="button" class="btn btn-mini bodyTypeSelector" data-toggle="modal">车身形式</a>';
	 	htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:150px;">';
		htmlStr += '				<div  style="margin-left:0px" class="bodyTypeModalResultContainer">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:70px;">';
		htmlStr += '				<div class="control-group" style="margin-left:20px;margin-top: 2px;">';
	  	htmlStr += '					<i class="icon-plus addOrigBtn" style="cursor:pointer;" title="增加" ></i>';
	  	htmlStr += '					<i class="icon-minus removeOrigBtn" style="margin-left: 20px;cursor:pointer;" title="删除"></i>';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '			<td valign="top" nowrap="nowrap" style="width:60px;">';
		htmlStr += '				<div class="control-group" style="margin-left:10px;margin-top: 2px;">';
	  	htmlStr += '					&nbsp;&nbsp;拆分<input name = "obj_Split" type="checkbox" value="checkbox">';
		htmlStr += '				</div>';
		htmlStr += '			</td>';
		htmlStr += '		</tr>';
		htmlStr += '	</table>';
		htmlStr += '</li>';
		return htmlStr;
	};
	
	/** 时间控件初始化*/
	function initDate(type){
		
		$('.startDate-container.input-append.date').datetimepicker({
			format: 'yyyy-mm',
	        language:  'zh-CN',        
	        todayBtn:  0,
			autoclose: 1,				
			startView: 3,		
			maxView:3,
			minView:3,
			startDate:beginDate,
			endDate:defaultEndTime,
	        showMeridian: 1
	    });
	    $('.endDate-container.input-append.date').datetimepicker({
			format: 'yyyy-mm',
	        language:  'zh-CN',        
	        todayBtn:  0,
			autoclose: 1,				
			startView: 3,		
			maxView:3,
			minView:3,
			startDate:beginDate,
			endDate:defaultEndTime,
	        showMeridian: 1
	    });
	}
	
	/**初始化时，加载对象模板*/
	function initPage(){
		$(".dateULContainer").each(function(){ 
			$(this).append(getDateTp());
		});
		var html = "<ul style='margin:0px;' class='segmentULContainer'>"+getSegmentTp()+"</ul>";
		$("#objectDiv .controls").append(html);
		initDate();
		
	};
	//初始化页面
	initPage();
	
	/**
	 * 对象类型切换显示不同类型弹出框
	 * @param {Object} select
	 */
	window.changeObjectType=function(select){
		var ulLength = 0;
		var objectTypeVal = $(select).val();
		if(objectTypeVal == 0){
			ulLength = $("#objectDiv .controls .segmentULContainer").length;
			if(ulLength == 0){
				$("#objectDiv .controls").append("<ul style='margin:0px;' class='segmentULContainer'>"+getSegmentTp()+"</ul>");
			}else{
				$("#objectDiv .controls .segmentULContainer").append(getSegmentTp());
			}
		}else if(objectTypeVal == 1){
			ulLength = $("#objectDiv .controls .manfULContainer").length;
			if(ulLength == 0){
				$("#objectDiv .controls").append("<ul style='margin:0px;' class='manfULContainer'>"+getManfTp()+"</ul>");
			}else{
				$("#objectDiv .controls .manfULContainer").append(getManfTp());
			}
		}else if(objectTypeVal == 2){
			ulLength = $("#objectDiv .controls .brandULContainer").length;
			if(ulLength == 0){
				$("#objectDiv .controls").append("<ul style='margin:0px;' class='brandULContainer'>"+getBrandTp()+"</ul>");
			}else{
				$("#objectDiv .controls .brandULContainer").append(getBrandTp());
			}
		}else if(objectTypeVal == 3){
			ulLength = $("#objectDiv .controls .subModelULContainer").length;
			if(ulLength == 0){
				$("#objectDiv .controls").append("<ul style='margin:0px;' class='subModelULContainer'>"+getSubModelTp()+"</ul>");
			}else{
				$("#objectDiv .controls .subModelULContainer").append(getSubModelTp());
			}
		}else{
			ulLength = $("#objectDiv .controls .origULContainer").length;
			if(ulLength == 0){
				$("#objectDiv .controls").append("<ul style='margin:0px;' class='origULContainer'>"+getOrigTp()+"</ul>");
			}else{
				$("#objectDiv .controls .origULContainer").append(getOrigTp());
			}
		}
		$(select).parents('li').remove();;
	};
	
	/**
	 * 时间对象个数不为一时,拆分时只保存一个时间对象
	 */
	$("#objectDiv").find("input[name='obj_Split']").live('click',function(){
		var dateLiList = $('.dateULContainer').find('.dateLIContainer');
		if(dateLiList.length>1 && $(this).attr('checked') == 'checked'){
			for(var i=1;i<dateLiList.length;i++){
				$(dateLiList[i]).remove();
				defaultBeginDate = parseInt(defaultBeginDate.substr(0,4)) + 1 + "-01";
				endDate = parseInt(endDate.substr(0,4)) + 1 + "-12";
			}
		}
	});
	
	//日期-增加按扭
	$(".addDateBtn").live('click',function(){
		//将拆分勾选去除
		$("#objectDiv").find("input[name='obj_Split']").removeAttr("checked");
		
		if(6 <= $("#dateYear .dateLIContainer").length)
		{
			alert("最多只能添加6个时间段");
			return;
		}
		
		var oUl = $(this).parents('.dateULContainer');
		oUl.append(getDateTp("add"));
		//重新初始化日期控制
		initDate();
	    
		//删除多余对象开始
		var segmentLiList = $('.segmentULContainer').find('.segmentLIContainer');
		var origList = $('.origULContainer').find('.origLIContainer');
		var brandList = $('.brandULContainer').find('.brandLIContainer');
		var manfList = $('.manfULContainer').find('.manfLIContainer');
		var subModelList = $('.subModelULContainer').find('.subModelLIContainer');
		
		//级别对象不为空时删除其他对象
		if(segmentLiList.length != 0){
			if(segmentLiList && segmentLiList.length>1){
				for(var i=1;i<segmentLiList.length;i++){
					$(segmentLiList[i]).remove();
				}
			}
			$('.origULContainer').remove();
			$('.brandULContainer').remove();
			$('.manfULContainer').remove();			
			$('.subModelULContainer').remove();
		}else if(origList.length != 0){
			if(origList && origList.length>1){
				for(var i=1;i<origList.length;i++){
					$(origList[i]).remove();
				}
			}
			$('.brandULContainer').remove();
			$('.manfULContainer').remove();
			$('.subModelULContainer').remove();
		}else if(brandList.length != 0){
			if(brandList && brandList.length>1){
				for(var i=1;i<brandList.length;i++){
					$(brandList[i]).remove();
				}
			}
			$('.manfULContainer').remove();
			$('.subModelULContainer').remove();
		}else if(manfList.length != 0){
			if(manfList && manfList.length>1){
				for(var i=1;i<manfList.length;i++){
					$(manfList[i]).remove();
				}
			}
			$('.subModelULContainer').remove();
		}else if(subModelList.length != 0){
			if(subModelList && subModelList.length>1){
				for(var i=1;i<subModelList.length;i++){
					$(subModelList[i]).remove();
				}
			}
		}
		//删除多余对象-结束
		
	});
	$(".addDateBtn").click();
	
	//日期-删除按扭
	$(".removeDateBtn").live('click',function(){
		var oCurrLi = $(this).parents('.dateLIContainer');
		var liList = $(this).parents('.dateULContainer').find('.dateLIContainer');
		if(liList.length == 1){
			alert("不能删除，至少保留一行！");
			return;
		}
		defaultBeginDate = parseInt(defaultBeginDate.substr(0,4)) + 1 + "-01";
		endDate = parseInt(endDate.substr(0,4)) + 1 + "-12";
		$(oCurrLi).remove();
	});
	
	/** 弹出车身形式对话框*/
	$(".bodyTypeSelector").live('click',function(){
		currBodyTypeLI = $(this).parents('table').find('.bodyTypeModalResultContainer');
		$('#bodyTypeModal').modal('show');
	});
	
	/**展示车身形式弹出框*/
	$('#bodyTypeModal').on('show', function (e) {
		if(e.relatedTarget)  return; //修复bootstrap的modal引入tabpane时，触发事件问题。
		//去掉默认选中的效果
		$('.bodyTypeModalByAll').each(function(){
			$(this).removeAttr("checked");//取消行全选
		});
		//加载子车型数据
		showLoading("bodyTypeModalBody");
		$('#bodyTypeModalBody').load(ctx+"/salesQuery/salesAmountFaw/getBodyType",getParams(),function(){
			//弹出框设置默认选中项结果集		
			$(currBodyTypeLI).find('input').each(function(){
				var bodyTypeId = $(this).val();
				if(bodyTypeId == "0"){
					$('.bodyTypeModalByAll').each(function(){
						$(this).attr("checked",'true');//全选
					});
					$(".bodyTypeModalContainer .bodyTypeModal").each(function(){
						$(this).attr("checked",'true');//行全选
					});
				}else{
					$(".bodyTypeModalContainer .bodyTypeModal").each(function(){
						if($(this).val() == bodyTypeId){
							$(this).attr("checked",'true');//行全选
						}
					});
				}
			});
		});
	});
	
	
	/**点击确定车身形式清空车型*/
	$(".bodyTypeModalContainer").find('.confirm').live('click',function(){
		currBodyTypeLI.parents(".subModelLIContainer").find(".subModelModalResultContainer ul").remove();
	});
	
    /**细分市场开始*/
	
	/** 弹出细分市场对话框*/
	$(".segmentSelector").live('click',function(){
		currSegmentLI = $(this).parents('.segmentLIContainer');
		$('#segmentModal').modal('show');
	});
	
	/** 展示细分市场弹出框*/
	$('#segmentModal').on('show', function (e) {
		if(e.relatedTarget)  return; //修复bootstrap的modal引入tabpane时，触发事件问题。
		//去掉默认选中的效果
		$(".segmentModalByAll").each(function(){
			$(this).prop("checked", false);//取消行全选
		});
		//加载细分市场数据
		showLoading("segmentModalBody");
		$("#segmentModalBody").load(ctx + "/global/getSegmentAndChildren", getParams(), function() {
			//弹出框设置默认选中项结果集		
			var segmentTypeArr = $(".segmentType");
			var inputNum = $(currSegmentLI).find(".segmentModalResultContainer input").map(function(index, input) {
				return input.value;
			}).get();
			var notChoose = new Array();
			for(var i = 0; i < segmentTypeArr.length; i++) {
				var obj = segmentTypeArr[i];
				var segmentValue = $(obj).attr("segmentValue");
				if($.inArray(segmentValue, inputNum) == -1) {
					notChoose.push(segmentValue);
				}
			}
			$(currSegmentLI).find(".segmentModalResultContainer input").each(function() {
				var segmentId = $(this).val();
				if(segmentId == "0") {
					$(".segmentModalByAll").each(function() {
						$(this).attr("checked", "true");//全选
					});
					$(".segmentModalContainer .segmentModalByLevel1").each(function() {
						$(this).attr("checked", "true");//行全选
					});
			 		$(".segmentModalContainer .segmentModalByLevel2").each(function() {
						$(this).attr("checked", "true");//行全选
					});
				} else if(segmentId == "1" || segmentId == "2" || segmentId == "3") {
					var change = false;
					$(".segmentType").each(function() {
						for(var i = 0; i < notChoose.length; i++) {
							var obj = notChoose[i];
							var segment = $(this);
							if(segment.attr("segmentValue") == obj) {
								if(segment.prop("checked")) {
									change = true;
									$(this).trigger("click", "ok");
								}
							}
						}
					});
					if (change) {
						$(".segmentModalByAll").off("segmentChange").on("segmentChange", function() {
							$(".segmentModalByAll").each(function() {
								$(this).prop("checked", true);//全选
							});
							$(".segmentModalContainer .segmentModalByLevel1").each(function() {
								$(this).prop("checked", true);//行全选
							});
					 		$(".segmentModalContainer .segmentModalByLevel2").each(function() {
								$(this).prop("checked", true);//行全选
							});
					 		$(".segmentModalByAll").off("segmentChange");
						});
					} else {
						$(".segmentModalByAll").each(function() {
							$(this).prop("checked", true);//全选
						});
						$(".segmentModalContainer .segmentModalByLevel1").each(function() {
							$(this).prop("checked", true);//行全选
						});
				 		$(".segmentModalContainer .segmentModalByLevel2").each(function() {
							$(this).prop("checked", true);//行全选
						});
					}
			    } else {
					$(".segmentModalContainer .segmentModalByLevel1").each(function() {
						if($(this).val() == segmentId) {
							$(this).attr("checked", "true");//行全选
						}
					});
			 		$(".segmentModalContainer .segmentModalByLevel2").each(function() {
						if($(this).val() == segmentId) {
							$(this).attr("checked", "true");//行全选
						}
					});
				 }
			});
			
			$('.segmentModalContainer').find('.selectorTR').each(function(){
				var oInput = $(this).find('.segmentModalByLevel1:checked');
				if(oInput.attr("checked")){
					$(this).find('.segmentModalByLevel2').each(function(){
						 $(this).attr("checked",'true');//行全选
					});
				}
			});
		});
	});
	
	//细分市场-增加按扭
	$(".addSegmentBtn").live('click',function(){
		var oUl = $(this).parents('.segmentULContainer');
		if(oUl.length == 0){
			var html = "<ul style='margin:0px;' class='segmentULContainer'>"+getSegmentTp()+"</ul>";
			$("#objectDiv .controls").append(html);
		}else{
			oUl.append(getSegmentTp());
		}
		
		var dateLiList = $('.dateULContainer').find('.dateLIContainer');
		if(dateLiList.length>1){
			for(var i=1;i<dateLiList.length;i++){
				$(dateLiList[i]).remove();
				defaultBeginDate = parseInt(defaultBeginDate.substr(0,4)) + 1 + "-01";
				endDate = parseInt(endDate.substr(0,4)) + 1 + "-12";
			}
		}
	});
	//细分市场-删除按扭
	$(".removeSegmentBtn").live('click',function(){
		var oCurrLi = $(this).parents('.segmentLIContainer');
		var segmentLiList = $('.segmentULContainer').find('.segmentLIContainer');
		var manfList = $('.manfULContainer').find('.manfLIContainer');
		var brandList = $('.brandULContainer').find('.brandLIContainer');
		var subModelList = $('.subModelULContainer').find('.subModelLIContainer');
		var origList = $('.origULContainer').find('.origLIContainer');
		if(manfList.length != 0 || brandList.length != 0 || subModelList.length != 0 || origList.length != 0 || segmentLiList.length > 1){
			$(oCurrLi).remove();
		}else{
			alert("不能删除，至少保留一行！");
			return;
		}
	});
	
	/**点击确定生成内容*/
	$(".segmentModalContainer").find(".confirm").live("click",function(){
		var containerId = $(this).parents(".segmentModalContainer").attr("id");
		var relInputName = $(this).attr("relInputName");
		var strHTML = "";
		strHTML += '<ul class="selectorResultContainer">';
		//如果第一级分细市场全部选中，则生成整体市场
		if($("#myModalLabel .segmentModalByAll").prop("checked")) {
			var checkedBox = $(".modal-header #segmentType").find(":checkbox").filter(":checked");
			if(checkedBox.length < 3) {
				for(var i = 0; i < checkedBox.length; i++) {
					var segmentValue;
					var segmentName;
					var obj = $(checkedBox[i]);
					if("Volume" == obj.val()) {
						segmentValue = 1;
						segmentName = "Volume整体市场";
					} else if("Economy" == obj.val()) {
						segmentValue = 2;
						segmentName = "Economy整体市场";
					} else {
						segmentValue = 3;
						segmentName = "Premium整体市场";
					}
					strHTML += '<li>';
					strHTML += '<div class="removeBtn" relContainer="segmentModal" value="' + segmentValue + '" style="cursor:pointer;" title="' + segmentName + '">';
					strHTML += '<input type="hidden" value="' + segmentValue + '" name="selectedSegment" />';
					strHTML += segmentName + '<i class="icon-remove" style="visibility: hidden;"></i>';
					strHTML += '</div>';
					strHTML += '</li>';
				}
				//拆分选项不可选
				$(currSegmentLI).find("tbody td input[name='obj_Split']").attr('checked',false);
				$(currSegmentLI).find("tbody td input[name='obj_Split']").attr('disabled',true);
			} else {
				strHTML += '<li>';
				strHTML += '<div class="removeBtn" relContainer="segmentModal" value="0" style="cursor:pointer;" title="整体市场">';
				strHTML += '<input type="hidden" value="0" name="selectedSegment" />';
				strHTML += '整体市场'
				strHTML += '<i class="icon-remove" style="visibility: hidden;"></i>';
				strHTML += '</div>';
				strHTML += '</li>';
			}
			//拆分选项不可选
			$(currSegmentLI).find("tbody td input[name='obj_Split']").attr('checked',false);
			$(currSegmentLI).find("tbody td input[name='obj_Split']").attr('disabled',true);
		} else {
			$(this).parents(".segmentModalContainer").find(".selectorTR").each(function() {
				var level2RowTotalAmount = $(this).find(".segmentModalByLevel2").length;
				var level2RowSelectedAmount = $(this).find(".segmentModalByLevel2:checked").length;
				if(level2RowTotalAmount == level2RowSelectedAmount){
					$(this).find(".segmentModalByLevel1").each(function() {
						strHTML += '<li>';
						strHTML += '<div class="removeBtn" relContainer="' + containerId + '" value="' + $(this).val() + '" style="cursor:pointer" title="删除：' + $.trim($(this).parent().text()) + '">';
						strHTML += '<input type="hidden" value="' + $(this).val() + '" name="' + relInputName + '" levelType="1" />';
						strHTML += $.trim($(this).parent().text()) + '<i class="icon-remove" style="visibility: hidden;"></i>';
						strHTML += '</div>';
						strHTML += '</li>';
					});
				} else {
					$(this).find(".segmentModalByLevel2:checked").each(function() {
						strHTML += '<li>';
						strHTML += '<div class="removeBtn" relContainer="' + containerId + '" value="' + $(this).val() + '" style="cursor:pointer" title="删除：' + $.trim($(this).parent().text()) + '">';
						strHTML += '<input type="hidden" value="' + $(this).val() + '" name="' + relInputName + '"  levelType="2" />';
						strHTML += $.trim($(this).parent().text()) + '<i class="icon-remove" style="visibility: hidden;"></i>';
						strHTML += '</div>';
						strHTML += '</li>';
					});
				}
			});
			//拆分选项可选
			$(currSegmentLI).find("tbody td input[name='obj_Split']").attr('disabled',false);
		}
		strHTML += '</ul>';
		$(currSegmentLI).find('.segmentModalResultContainer').html(strHTML);
		saveSegmentType();
	});
	
	/**保存已勾选的细分市场大类别**/
	function saveSegmentType() {
		var choosedSegmentType = $("#choosedSegmentType");
		var value = "";
		var count = 0;
		$(".segmentType").each(function() {
			var segment = $(this);
			if(segment.prop("checked")) {
				if(count == 0) {
					value += segment.val();
				} else {
					value += "," + segment.val();
				}
				count++;
			}
		});
		choosedSegmentType.val(value);
	}
	/**细分市场结束*/
	
	
	/** 展示厂商弹出框-开始*/
	//弹出细分市场对话框
	$(".manfSelector").live('click',function(){
		currManfLI = $(this).parents('.manfLIContainer');
		$('#manfModal').modal('show');
	});
	
	$('#manfModal').on('show', function (e) {
		if(e.relatedTarget)  return; //修复bootstrap的modal引入tabpane时，触发事件问题。
		//加载子车型数据
		showLoading("manfModalBody");
		$(".manfModalByAll").prop("checked",false);//厂商全选框清空
		$('#manfModalBody').load(ctx+"/price/cityPriceIndexGlobal/getManf",getParams(),function(){
			//弹出框设置默认选中项结果集		
			var strHTML = '<ul class="inline" >';
			$(currManfLI).find('.manfModalResultContainer input').each(function(){
				var id = $(this).val();
				var name = $(this).attr("manfName");
				var letter = $(this).attr("letter");
				if(id != -1){
					strHTML += '<li style="padding-top:4px;margin-bottom:2px;">';
				  	strHTML += '<div class="removeBtnByResult label label-info" manfId="'+id+'"  letter="'+letter+'" manfName="'+name+'" style="cursor:pointer" title="删除：'+name+'">';
					strHTML += '<i class="icon-remove icon-white"></i>'+name;
				  	strHTML += '</div>';
				 	strHTML += '</li>';
				}
				
			 	$(".manfModalContainer .manfIdInput").each(function(){
					$(this).attr("checked");//行全选
				});
		 		$(".manfModalContainer .manfIdInput").each(function(){
					if($(this).val() == id){
						$(this).attr("checked",'true');//行全选
					}
				});
			});
			strHTML += '</ul>';
			$("#selectorResultContainerByManf").html(strHTML);
			
			//判断厂商全选框要不要全选
			var manfInputChecked = $("#manfModal .selectorTable .selectorTypeTd .manfIdInput:checked");
			var manfInput = $("#manfModal .selectorTable .selectorTypeTd .manfIdInput");
			if($(manfInputChecked).length == $(manfInput).length){
				$(".manfModalByAll").prop("checked",true);//厂商全选框全选
			} else{
				$(".manfModalByAll").prop("checked",false);
			}
		});
	});
	
	/** 厂商品牌全选全不选事件开始*/
	$(".manfModalByAll").live('click',function(){
		if($(this).attr("checked")){
			$(".modal-body input").each(function(index){
				
		 		$(this).attr("checked",'true');//全选
		 	});
			/*把全选厂商品牌放进结果带开始*/
			$("#selectorResultContainerByManf").html("");
			var allObjArr = [];
			$("#manfModal").find('.manfIdInput:checked').each(function(){
				var obj = {};
				obj.id =  $(this).val();
				obj.name =  $.trim($(this).parent().text());
				obj.letter =  $(this).attr("letter");
				allObjArr[allObjArr.length] = obj;
			});
			var strHTML = '<ul class="inline" >';
			for(var i=0;i<allObjArr.length;i++){
				strHTML += '<li style="padding-top:4px;margin-bottom:2px;">';
			  		strHTML += '<div class="removeBtnByResult label label-info" manfId="'+allObjArr[i].id+'"  letter="'+allObjArr[i].letter+'" manfName="'+allObjArr[i].name+'" style="cursor:pointer" title="删除：'+allObjArr[i].name+'">';
				  		strHTML += '<i class="icon-remove icon-white"></i>'+allObjArr[i].name;
			  		strHTML += '</div>';
			 		strHTML += '</li>';
			 }
			 strHTML += '</ul>';
			$("#selectorResultContainerByManf").html(strHTML);
			/*把全选厂商品牌放进结果带结束*/
		}else{
			$("#selectorResultContainerByManf").html("");
			$(".modal-body input").each(function(index){
		 		 $(this).removeAttr("checked");//取消全选
		 	});
			
		} 
	});
	/*删除结果带里的元素时取消全选*/
	$("#manfModal .resultShowContent .removeBtnByResult").live('click',function(){
		$('#manfModal').find('.manfModalByAll').removeAttr("checked");//全选取消
	
});
	/** 厂商品牌全选全不选事件结束*/
	/*厂商checkbox点击事件开始*/
	$(".manfModalContainer").find('.manfIdInput').live('click',function(){
		//判断全选框要不要打钩
		if($('#manfModal .modal-body input:checkbox').length==$('#manfModal .modal-body').find("input:checked").length){
			$('#manfModal').find('.manfModalByAll').attr("checked",true);
		}else{
			$('#manfModal').find('.manfModalByAll').attr("checked",false);
		}
		//显示选中的值	——开始
		//去掉重复选项
		$("#selectorResultContainerByManf").html();
		var allObjArr = [];
		$(".manfModalContainer").find('.manfIdInput:checked').each(function(){
			var obj = {};
			obj.id =  $(this).val();
			obj.name =  $.trim($(this).parent().text());
			obj.letter =  $(this).attr("letter");
			allObjArr[allObjArr.length] = obj;
		});
		var strHTML = '<ul class="inline" >';
		for(var i=0;i<allObjArr.length;i++){
			strHTML += '<li style="padding-top:4px;margin-bottom:2px;">';
		  		strHTML += '<div class="removeBtnByResult label label-info" manfId="'+allObjArr[i].id+'"  letter="'+allObjArr[i].letter+'" manfName="'+allObjArr[i].name+'" style="cursor:pointer" title="删除：'+allObjArr[i].name+'">';
			  		strHTML += '<i class="icon-remove icon-white"></i>'+allObjArr[i].name;
		  		strHTML += '</div>';
		 		strHTML += '</li>';
		 }
		 strHTML += '</ul>';
		$("#selectorResultContainerByManf").html(strHTML);
		//显示选中的值	——结束
	});
	/*厂商checkbox点击事件结束*/
	//厂商-增加按扭
	$(".addManfBtn").live('click',function(){
		var oUl = $(this).parents('.manfULContainer');
		if(oUl.length == 0){
			var html = "<ul style='margin:0px;' class='manfULContainer'>"+getManfTp()+"</ul>";
			$("#objectDiv .controls").append(html);
		}else{
			oUl.append(getManfTp());
		}
		
		var dateLiList = $('.dateULContainer').find('.dateLIContainer');
		if(dateLiList.length>1){
			for(var i=1;i<dateLiList.length;i++){
				$(dateLiList[i]).remove();
				defaultBeginDate = parseInt(defaultBeginDate.substr(0,4)) + 1 + "-01";
				endDate = parseInt(endDate.substr(0,4)) + 1 + "-12";
			}
		}
	});
	//厂商-删除按扭
	$(".removeManfBtn").live('click',function(){
		var oCurrLi = $(this).parents('.manfLIContainer');
		var segmentLiList = $('.segmentULContainer').find('.segmentLIContainer');
		var manfList = $('.manfULContainer').find('.manfLIContainer');
		var brandList = $('.brandULContainer').find('.brandLIContainer');
		var subModelList = $('.subModelULContainer').find('.subModelLIContainer');
		var origList = $('.origULContainer').find('.origLIContainer');
		if(segmentLiList.length != 0 || brandList.length != 0 || subModelList.length != 0 || origList.length != 0 || manfList.length > 1){
			$(oCurrLi).remove();
		}else{
			alert("不能删除，至少保留一行！");
			return;
		}
	});
	/**展示厂商弹出框-结束*/
	
	
	/** 展示品牌弹出框-开始*/
	//弹出品牌对话框
	$(".brandSelector").live('click',function(){
		currBrandLI = $(this).parents('.brandLIContainer');
		$('#brandModal').modal('show');
	});
	
	$('#brandModal').on('show', function (e) {
		if(e.relatedTarget)  return; //修复bootstrap的modal引入tabpane时，触发事件问题。
		//加载子车型数据
		showLoading("brandModalBody");
		$(".brandModalByAll").prop("checked",false);//品牌全选框清空
		$('#brandModalBody').load(ctx+"/price/cityPriceIndexGlobal/getBrand",getParams(),function(){
			//弹出框设置默认选中项结果集		
			var strHTML = '<ul class="inline" >';
			$(currBrandLI).find('.brandModalResultContainer input').each(function(){
				var id = $(this).val();
				var name = $(this).attr("brandName");
				var letter = $(this).attr("letter");
				if(id != -1){
					strHTML += '<li style="padding-top:4px;margin-bottom:2px;">';
				  	strHTML += '<div class="removeBtnByResult label label-info" brandId="'+id+'"  letter="'+letter+'" brandName="'+name+'" style="cursor:pointer" title="删除：'+name+'">';
					strHTML += '<i class="icon-remove icon-white"></i>'+name;
				  	strHTML += '</div>';
				 	strHTML += '</li>';
				}
			 	$(".brandModalContainer .brandIdInput").each(function(){
					$(this).attr("checked");//行全选
				});
		 		$(".brandModalContainer .brandIdInput").each(function(){
					if($(this).val() == id){
						$(this).attr("checked",'true');//行全选
					}
				});
			});
			strHTML += '</ul>';
			$("#selectorResultContainerByBrand").html(strHTML);
			
			//判断全选框要不要全选
			var brandInputChecked = $("#brandModal .selectorTable .selectorTypeTd .brandIdInput:checked");
			var brandInput= $("#brandModal .selectorTable .selectorTypeTd .brandIdInput");
			if($(brandInputChecked).length == $(brandInput).length){
				$(".brandModalByAll").prop("checked",true);//品牌全选框全选
			} else{
				$(".brandModalByAll").prop("checked",false);
			}
		});
	});
	/** 品牌全选全不选事件开始*/
	$('.brandModalByAll').live('click',function(){
		if($(this).attr("checked")){
			$(".modal-body input").each(function(index){
				
		 		$(this).attr("checked",'true');//全选
		 	});
			/*把全选品牌放进结果带开始*/
			$("#selectorResultContainerByBrand").html("");
			var allObjArr = [];
			$(".brandModalContainer").find('.brandIdInput:checked').each(function(){
				var obj = {};
				obj.id =  $(this).val();
				obj.name =  $.trim($(this).parent().text());
				obj.letter =  $(this).attr("letter");
				allObjArr[allObjArr.length] = obj;
			});
			var strHTML = '<ul class="inline" >';
			for(var i=0;i<allObjArr.length;i++){
				strHTML += '<li style="padding-top:4px;margin-bottom:2px;">';
			  		strHTML += '<div class="removeBtnByResult label label-info" brandId="'+allObjArr[i].id+'"  letter="'+allObjArr[i].letter+'" brandName="'+allObjArr[i].name+'" style="cursor:pointer" title="删除：'+allObjArr[i].name+'">';
				  		strHTML += '<i class="icon-remove icon-white"></i>'+allObjArr[i].name;
			  		strHTML += '</div>';
			 		strHTML += '</li>';
			 }
			 strHTML += '</ul>';
			$("#selectorResultContainerByBrand").html(strHTML);
			/*把全选品牌放进结果带结束*/
		}else{
			$("#selectorResultContainerByBrand").html("");
			$(".modal-body input").each(function(index){
		 		 $(this).removeAttr("checked");//取消全选
		 	});
			
		} 
	});
	/*删除结果带数据，全选取消*/
	$(".brandModalContainer .resultShowContent .removeBtnByResult").live('click',function(){
		$('.brandModalContainer').find('.brandModalByAll').attr("checked",false);//全选取消
	});
	/** 品牌全选全不选事件结束*/
	$(".brandModalContainer").find('.brandIdInput').live('click',function(){
		//品牌点击，判断要不要全选打钩
		var allArr = $(this).parents(".brandModalContainer").find(".brandIdInput");
		var allSelectedArr = $(this).parents(".brandModalContainer").find(".brandIdInput:checked");
		if(allArr.length == allSelectedArr.length){
			$(this).parents('.brandModalContainer').find('.brandModalByAll').attr("checked",'true');//全部全选		
		}else{
			$(this).parents('.brandModalContainer').find('.brandModalByAll').removeAttr("checked");//全选取消
		}
		//显示选中的值	——开始
		//去掉重复选项
		$("#selectorResultContainerByBrand").html();
		var allObjArr = [];
		$(".brandModalContainer").find('.brandIdInput:checked').each(function(){
			var obj = {};
			obj.id =  $(this).val();
			obj.name =  $.trim($(this).parent().text());
			obj.letter =  $(this).attr("letter");
			allObjArr[allObjArr.length] = obj;
		});
		var strHTML = '<ul class="inline" >';
		for(var i=0;i<allObjArr.length;i++){
			strHTML += '<li style="padding-top:4px;margin-bottom:2px;">';
		  		strHTML += '<div class="removeBtnByResult label label-info" brandId="'+allObjArr[i].id+'"  letter="'+allObjArr[i].letter+'" brandName="'+allObjArr[i].name+'" style="cursor:pointer" title="删除：'+allObjArr[i].name+'">';
			  		strHTML += '<i class="icon-remove icon-white"></i>'+allObjArr[i].name;
		  		strHTML += '</div>';
		 		strHTML += '</li>';
		 }
		 strHTML += '</ul>';
		$("#selectorResultContainerByBrand").html(strHTML);
		//显示选中的值	——结束
	});
	
	//品牌-增加按扭
	$(".addBrandBtn").live('click',function(){
		var oUl = $(this).parents('.brandULContainer');
		if(oUl.length == 0){
			var html = "<ul style='margin:0px;' class='brandULContainer'>"+getBrandTp()+"</ul>";
			$("#objectDiv .controls").append(html);
		}else{
			oUl.append(getBrandTp());
		}
		
		var dateLiList = $('.dateULContainer').find('.dateLIContainer');
		if(dateLiList.length>1){
			for(var i=1;i<dateLiList.length;i++){
				$(dateLiList[i]).remove();
				defaultBeginDate = parseInt(defaultBeginDate.substr(0,4)) + 1 + "-01";
				endDate = parseInt(endDate.substr(0,4)) + 1 + "-12";
			}
		}
	});
	//品牌-删除按扭
	$(".removeBrandBtn").live('click',function(){
		var oCurrLi = $(this).parents('.brandLIContainer');
		var segmentLiList = $('.segmentULContainer').find('.segmentLIContainer');
		var manfList = $('.manfULContainer').find('.manfLIContainer');
		var brandList = $('.brandULContainer').find('.brandLIContainer');
		var subModelList = $('.subModelULContainer').find('.subModelLIContainer');
		var origList = $('.origULContainer').find('.origLIContainer');
		if(segmentLiList.length != 0 || manfList.length != 0 || subModelList.length != 0 || origList.length != 0 || brandList.length > 1){
			$(oCurrLi).remove();
		}else{
			alert("不能删除，至少保留一行！");
			return;
		}
	});
	
	/**展示品牌弹出框-结束*/
	
	
	
	/**展示车型弹出框-开始*/
	
	//弹出车型对话框
	$(".subModelSelector").live('click',function(){
		currSubModelLI = $(this).parents('.subModelLIContainer');
		//保存获取车形弹出框当前车型下标
		$("#getModelIndexId").val($("#model .subModelULContainer .subModelLIContainer").index(currSubModelLI));
		
		$('#subModelModal').modal('show');
		$(".subModelModalContainer").find('.confirm').unbind('click').bind('click',function(e){
			//event.stopPropagation();
			var containerId = $(this).parents(".subModelModalContainer").attr("id");
			var relInputName = $(this).attr("relInputName");
			var allSubModelArr = [];
			var tis = $(this);
			var strHTML = "";
			//如果车型全部选中，则显示全部
			if($("#modelAll").prop("checked") && $(".subModelModalContainer .resultShowContent .removeBtnByResult").length != 0){
				//拆分选项不可选
				$(currSubModelLI).find("tbody td input[name='obj_Split']").attr('checked',false);
				$(currSubModelLI).find("tbody td input[name='obj_Split']").attr('disabled',true);
				
				strHTML += '<ul class="selectorResultContainer">';
					strHTML += '<li>';
				  	strHTML += '<div class="removeBtn" relContainer="'+containerId+'" value="-1" style="cursor:pointer" title="删除：'+'全部'+'">';
					strHTML += '<input type="hidden" letter="全部" pooAttributeId="全部" subModelName="全部" value="-1" name="'+relInputName+'">';
					strHTML += '全部' + '<i class="icon-remove" style="visibility: hidden;"></i>';
				  	strHTML += '</div>';
			  		strHTML += '</li>';
				strHTML += '</ul>';
				$(tis).parents(".subModelModalContainer").find('.resultShowContent').find('.removeBtnByResult').each(function(){
					var obj = {};
					obj.subModelId =  $(this).attr("subModelId");
					obj.subModelName =  $(this).attr("subModelName");
					obj.letter =  $(this).attr("letter");
					obj.pooAttributeId = $(this).attr("pooAttributeId");
					allSubModelArr[allSubModelArr.length] = obj;
				});
				strHTML += '<ul class="selectorResultContainer"  style="display:none">';
				for(var i=0;i<allSubModelArr.length;i++){
					strHTML += '<li>';
					strHTML += '<div class="removeBtn" relContainer="'+containerId+'" value="'+allSubModelArr[i].subModelId+'" style="cursor:pointer" title="删除：'+allSubModelArr[i].subModelName+'">';
					strHTML += '<input type="hidden" letter="'+allSubModelArr[i].letter+'" pooAttributeId="'+allSubModelArr[i].pooAttributeId+'" subModelName="'+allSubModelArr[i].subModelName+'" value="'+allSubModelArr[i].subModelId+'" name="'+relInputName+'">';
					strHTML += allSubModelArr[i].subModelName + '<i class="icon-remove" style="visibility: hidden;"></i>';
					strHTML += '</div>';
					strHTML += '</li>';
				 }
				strHTML += '</ul>';
			} else{
				//拆分选项可选
				$(currSubModelLI).find("tbody td input[name='obj_Split']").attr('checked',false);
				$(currSubModelLI).find("tbody td input[name='obj_Split']").attr('disabled',false);
				$(this).parents(".subModelModalContainer").find('.resultShowContent').find('.removeBtnByResult').each(function(){
					var obj = {};
					obj.subModelId =  $(this).attr("subModelId");
					obj.subModelName =  $(this).attr("subModelName");
					obj.letter =  $(this).attr("letter");
					obj.pooAttributeId = $(this).attr("pooAttributeId");
					allSubModelArr[allSubModelArr.length] = obj;
				});
				var strHTML = "";
				strHTML += '<ul class="selectorResultContainer">';
				for(var i=0;i<allSubModelArr.length;i++){
					strHTML += '<li>';
				  		strHTML += '<div class="removeBtn" relContainer="'+containerId+'" value="'+allSubModelArr[i].subModelId+'" style="cursor:pointer" title="删除：'+allSubModelArr[i].subModelName+'">';
					  		strHTML += '<input type="hidden" letter="'+allSubModelArr[i].letter+'" pooAttributeId="'+allSubModelArr[i].pooAttributeId+'" subModelName="'+allSubModelArr[i].subModelName+'" value="'+allSubModelArr[i].subModelId+'" name="'+relInputName+'" />';
					  		strHTML += allSubModelArr[i].subModelName + '<i class="icon-remove" style="visibility: hidden;"></i>';
				  		strHTML += '</div>';
			  		strHTML += '</li>';
				 }
				strHTML += '</ul>';
			}
			
			$(currSubModelLI).find('.subModelModalResultContainer').html(strHTML);
		});
	});
	/** 展示车型弹出框*/
	$('#subModelModal').on('show', function (e) {
		//设置车型弹出框过滤车身形式
		var paramsObj = getParams();
		var hatchbackId = currSubModelLI.find(".bodyTypeModalResultContainer li div :input").map(function(){return $(this).val();}).get().join(",");
		paramsObj.hatchbackId = hatchbackId;
		
		if(e.relatedTarget)  return; //修复bootstrap的modal引入tabpane时，触发事件问题。
		//加载子车型数据
		showLoading("subModelModalBody");
		$('#subModelModalBody').load(ctx+"/price/cityPriceIndexGlobal/getSubmodelModal",paramsObj,function(){
			//弹出框设置默认选中项结果集		
			var strHTML = '<ul class="inline" >';
			
			$(currSubModelLI).find('.subModelModalResultContainer input').each(function(){
				if($(this).val() != -1){
				var subModelId = $(this).val();
				var subModelName = $(this).attr("subModelName");
				var pooAttributeId = $(this).attr("pooAttributeId");
				var letter = $(this).attr("letter");
				strHTML += '<li style="padding-top:4px;margin-bottom:2px;">';
			  		strHTML += '<div class="removeBtnByResult label label-info" subModelId="'+subModelId+'"  pooAttributeId="'+pooAttributeId+'" letter="'+letter+'" subModelName="'+subModelName+'" style="cursor:pointer" title="删除：'+subModelName+'">';
			  		strHTML += '<i class="icon-remove icon-white"></i>'+subModelName;
			  		strHTML += '</div>';
			 		strHTML += '</li>';
		 		$(".subModelModalContainer .subModelIdInput").each(function(){
					if($(this).val() == subModelId){
						$(this).attr("checked",'true');
					}
				});
			} 
		});
			
			//如果本竞品页有没有选中的车型全选框取消选中
			$(".subModelModalContainer .subModelIdInput").each(function(){
				if(!$(this).prop("checked")){
					$("#modelAll").prop("checked",false);
					return false;
				}
			});
			
			strHTML += '</ul>';
			$("#selectorResultContainerBySubModel").html(strHTML);
			
			//给变量赋值，默认本竞品
			$("#choseType").val("1");
			//判断车型全选框是不是要勾选
			var num = 0;//用来统计本竞品页显示车型的数量
			$("#tabs-competingProducts").find("input").each(function(){
				var ths = $(this);
				
				if(ths.parent().css("display") != "none"){
					num++;
				}
			});
			if(num == ($("#tabs-competingProducts input:checked").length) && (num != 0)){
				$("#modelAll").attr("checked","checked");
			} else{
				$("#modelAll").prop("checked",false);
			}
		});
	});
	/* 车型细分市场全选按钮点击事件开始*/
	
	
	
	//车型全选
	$("#modelAll").on("click",function(){
		if($(this).attr("checked") == "checked"){
			$(" .selectorHeadTdTr input").prop("checked",true);
			//本竞品
			if($("#choseType").val() == 1){
				$("#tabs-competingProducts").find("input").each(function(){
					var ths = $(this);
					var check = ($(this).attr("checked") == "checked");
					/*if(ths.parent().attr("style") == undefined){
						ths.parent().attr("style","");
					}*/
					
//					//判断是不是隐藏
					if(ths.parent().css("display") != "none"){
						//设置联动
						var currVal = $(this).val();
						$(this).parents('.subModelModalContainer').find('.subModelIdInput').filter(function(){
							return $(this).val() == currVal;
						}).each(function(){
							$(this).attr("checked",'true');
						});
					}
				})
				$("#subModelModal .resultShowContainer .resultShowContent").html("");//先清空再重新放上去
				addResultContainerBySubModel();//把选中的放到车型选择下面的容器中
			}
			//细分市场
			else if($("#choseType").val() == 2){
				
				$("#tabs-segment .selectorContentTd").find("input").each(function(){
					var ths = $(this);
					var check = ($(this).attr("checked") == "checked");
					//判断是不是隐藏
					if($(ths).parent().css("display") != "none"){
						//设置联动(因ie8性能低下，经需求人员确定，全选时非本竞品页不设置联动)
						var currVal = $(ths).val();
						$(ths).parents('#tabs-segment .selectorContentTd').find('input').each(function(){
							if($(this).val() == currVal){
								$(this).attr("checked",'true');
								return false;
							}
						});
					} 
				})
				$("#subModelModal .resultShowContainer .resultShowContent").html("");//先清空再重新放上去
				addResultContainerBySubModelBySegment();//把选中的放到车型选择下面的容器中
				//把父级分类也勾选一下
				$("#tabs-segment .selectorTypeTd").find("input").each(function(){
					if(!$(this).attr("checked")){
						$(this).attr("checked","true");
					}
				});
			}
			//品牌
			else if($("#choseType").val() == 3){
				
				$("#tabs-brand .selectorContentTd").find("input").each(function(){
					var ths = $(this);
					var check = ($(this).attr("checked") == "checked");
					
					//判断是不是隐藏
					if(ths.parent().css("display") != "none"){
						//设置联动(因ie8性能低下，经需求人员确定，全选时非本竞品页不设置联动)
						var currVal = ths.val();
						$(ths).parents('#tabs-brand .selectorContentTd').find('input').each(function(){
							if($(this).val() == currVal){
								$(this).attr("checked",'true');
								return false;
							}
						});
					}
				})
				$("#subModelModal .resultShowContainer .resultShowContent").html("");//先清空再重新放上去
				addResultContainerBySubModelByBrand();//把选中的放到车型选择下面的容器中
				//把父级分类也勾选一下
				$("#tabs-brand .selectorTypeTd").find("input").each(function(){
					if(!$(this).attr("checked")){
						$(this).attr("checked","true");
					}
				});
			}
			//厂商品牌
			else if($("#choseType").val() == 4){
				
				$("#tabs-manf .selectorContentTd").find("input").each(function(){
					var ths = $(this);
					var check = ($(this).attr("checked") == "checked");
					/*if(ths.parent().attr("style") == undefined){
						ths.parent().attr("style","");
					}*/
					
					//判断是不是隐藏
					if(ths.parent().css("display") != "none"){
						//设置联动(因ie8性能低下，经需求人员确定，全选时非本竞品页不设置联动)
						var currVal = ths.val();
						/*$(this).parents('.subModelModalContainer').find('.subModelIdInput').filter(function(){
							return $(this).val() == currVal;
						}).each(function(){
							$(this).attr("checked",'true');
						});*/
						$(ths).parents('#tabs-manf .selectorContentTd').find('input').each(function(){
							if($(this).val() == currVal){
								$(this).attr("checked",'true');
								return false;
							}
						});
					}
					
					
					
				})
				$("#subModelModal .resultShowContainer .resultShowContent").html("");//先清空再重新放上去
				addResultContainerBySubModelByManf();//把选中的放到车型选择下面的容器中
				//把父级分类也勾选一下
				$("#tabs-manf .selectorTypeTd").find("input").each(function(){
					if(!$(this).attr("checked")){
						$(this).attr("checked","true");
					}
				});
			}
		} else{
			//本竞品
			if($("#choseType").val() == 1){
				$("#tabs-competingProducts").find("input").each(function(){
					var ths = $(this);
					var check = ($(this).attr("checked") == "checked");
					//设置联动取消选中
					var currVal = $(this).val();
					$(this).parents('.subModelModalContainer ').find('.subModelIdInput').filter(function(){
						return $(this).val() == currVal;
					}).each(function(){
						$(this).prop("checked",false);//取消选中
					});
					
				})
				$("#subModelModal .resultShowContainer .resultShowContent").html("");//先清空再重新放上去
				addResultContainerBySubModel();//把选中的放到车型选择下面的容器中

			} 
			//细分市场
			else {
				$("#subModelModal .resultShowContainer .resultShowContent").html("");//先清空
				$(".subModelModalContainer .tab-content").find("input").each(function(){
					$(this).prop("checked",false);
				})
			}
		}
	})
	
		//点击下面的车型取消选中，车型总全选框也会取消选中
	$(".subModelModalContainer .subModelIdInput").live('click',function(){
		var ths = $(this);
		var check = ($(this).attr("checked") == "checked");
		if(!check){
			if($("#modelAll").attr("checked") == "checked"){
				$("#modelAll").prop("checked",false);
			}
			
		} else{
			//本竞品
			if($("#choseType").val() == 1){
				var flag = false;
				var num = 0;//用来统计显示车型的数量
				//把所有选择框都判断一遍，都选中则车型总全选框选中
				$("#tabs-competingProducts").find("input").each(function(){
					var ths = $(this);
					
					if(ths.parent().css("display") != "none"){
						num++;
					}
				});
				if((num == $("#tabs-competingProducts input:checked").length) && (num != 0)){
					$("#modelAll").attr("checked","checked");
				} else{
					$("#modelAll").prop("checked",false);
				}
			}
			//细分市场
			else if($("#choseType").val() == 2){
				var flag = false;
				var num = 0;//用来统计显示车型的数量
				//把所有选择框都判断一遍，都选中则车型总全选框选中
				$("#tabs-segment .selectorContentTd").find("input").each(function(){
					var ts = $(this);
					/*if(ts.parent().attr("style") == undefined){
						ts.parent().attr("style","")
					}*/
					//判断是不是隐藏,只对不隐藏的起效果
					if(ts.parent().css("display") != "none"){
						num++;
					}
				});
				if(num == $("#tabs-segment .selectorContentTd input:checked").length && (num != 0)){
					$("#modelAll").attr("checked","checked");
				} else{
					$("#modelAll").prop("checked",false);
				}
						
			}
			//品牌
			else if($("#choseType").val() == 3){
				var flag = false;
				var num = 0;//用来统计显示车型的数量
				//把所有选择框都判断一遍，都选中则车型总全选框选中
				$("#tabs-brand .selectorContentTd").find("input").each(function(){
					var ts = $(this);
					/*if(ts.parent().attr("style") == undefined){
						ts.parent().attr("style","")
					}*/
					//判断是不是隐藏,只对不隐藏的起效果
					if(ts.parent().css("display") != "none"){
						num++;
					}
				});
				if(num == $("#tabs-brand .selectorContentTd input:checked").length && (num != 0)){
					$("#modelAll").attr("checked","checked");
				} else{
					$("#modelAll").prop("checked",false);
				}
						
			}
			//厂商品牌
			else if($("#choseType").val() == 4){
				var flag = false;
				var num = 0;//用来统计显示车型的数量
				//把所有选择框都判断一遍，都选中则车型总全选框选中
				$("#tabs-manf .selectorContentTd").find("input").each(function(){
					var ts = $(this);
					var checkL = ($(this).attr("checked") == "checked");
					/*if(ts.parent().attr("style") == undefined){
						ts.parent().attr("style","")
					}*/
					//判断是不是隐藏,只对不隐藏的起效果
					if(ts.parent().css("display") != "none"){
						num++;
					}
				});
				if(num == $("#tabs-manf .selectorContentTd input:checked").length && (num != 0)){
					$("#modelAll").attr("checked","checked");
				} else{
					$("#modelAll").prop("checked",false);
				}
						
			}
		}
		
		/**中级全选检查打钩情况**/
		checkSelectorHeadTdTrAll($("#choseType").val());
		
		
	});
	
	
	/* 车型细分市场全选按钮点击事件结束*/
	//车型-增加按扭
	$(".addSubModelBtn").live('click',function(){
		var oUl = $(this).parents('.subModelULContainer');
		if(oUl.length == 0){
			var html = "<ul style='margin:0px;' class='subModelULContainer'>"+getSubModelTp()+"</ul>";
			$("#objectDiv .controls").append(html);
		}else{
			$(oUl).append(getSubModelTp());
		}
		
		var dateLiList = $('.dateULContainer').find('.dateLIContainer');
		if(dateLiList.length>1){
			for(var i=1;i<dateLiList.length;i++){
				$(dateLiList[i]).remove();
				defaultBeginDate = parseInt(defaultBeginDate.substr(0,4)) + 1 + "-01";
				endDate = parseInt(endDate.substr(0,4)) + 1 + "-12";
			}
		}
	});
	
	//车型-删除按扭
	$(".removeSubModelBtn").live('click',function(){
		var oCurrLi = $(this).parents('.subModelLIContainer');
		var segmentLiList = $('.segmentULContainer').find('.segmentLIContainer');
		var manfList = $('.manfULContainer').find('.manfLIContainer');
		var brandList = $('.brandULContainer').find('.brandLIContainer');
		var subModelList = $('.subModelULContainer').find('.subModelLIContainer');
		var origList = $('.origULContainer').find('.origLIContainer');
		if(segmentLiList.length != 0 || manfList.length != 0 || brandList.length != 0 || origList.length != 0 || subModelList.length > 1){
			$(oCurrLi).remove();
		}else{
			alert("不能删除，至少保留一行！");
			return;
		}
	});
	
	/**展示车型弹出框-结束*/
	
	/** 展示系别弹出框-开始*/
	//弹出系别对话框
	$(".origSelector").live('click',function(){
		currOrigLI = $(this).parents('.origLIContainer');
		$('#origModal').modal('show');
	});
	
	/**展示车身形式弹出框*/
	$('#origModal').on('show', function (e) {
		if(e.relatedTarget)  return; //修复bootstrap的modal引入tabpane时，触发事件问题。
		//去掉默认选中的效果
		$('.origModalByAll').each(function(){
			$(this).removeAttr("checked");//取消行全选
		});
		//加载子车型数据
		showLoading("origModalBody");
		$('#origModalBody').load(ctx+"/pricesale/competingProductGlobal/getOrig",getParams(),function(){
			//弹出框设置默认选中项结果集		
			$(currOrigLI).find('.origModalResultContainer input').each(function(){
				var origId = $(this).val();
				if(origId == "0"){
					$('.origModalByAll').each(function(){
						$(this).attr("checked",'true');//全选
					});
					$(".origModalContainer .origModal").each(function(){
						$(this).attr("checked",'true');//行全选
					});
				}else{
					$(".origModalContainer .origModal").each(function(){
						if($(this).val() == origId){
							$(this).attr("checked",'true');//行全选
						}
					});
				}
			});
		});
	});
	
	
	//系别-增加按扭
	$(".addOrigBtn").live('click',function(){
		var oUl = $(this).parents('.origULContainer');
		if(oUl.length == 0){
			var html = "<ul style='margin:0px;' class='origULContainer'>"+getOrigTp()+"</ul>";
			$("#objectDiv .controls").append(html);
		}else{
			oUl.append(getOrigTp());
		}
		
		var dateLiList = $('.dateULContainer').find('.dateLIContainer');
		if(dateLiList.length>1){
			for(var i=1;i<dateLiList.length;i++){
				$(dateLiList[i]).remove();
				defaultBeginDate = parseInt(defaultBeginDate.substr(0,4)) + 1 + "-01";
				endDate = parseInt(endDate.substr(0,4)) + 1 + "-12";
			}
		}
	});
	//系别-删除按扭
	$(".removeOrigBtn").live('click',function(){
		var oCurrLi = $(this).parents('.origLIContainer');
		var segmentLiList = $('.segmentULContainer').find('.segmentLIContainer');
		var manfList = $('.manfULContainer').find('.manfLIContainer');
		var brandList = $('.brandULContainer').find('.brandLIContainer');
		var subModelList = $('.subModelULContainer').find('.subModelLIContainer');
		var origList = $('.origULContainer').find('.origLIContainer');
		if(segmentLiList.length != 0 || manfList.length != 0 || subModelList.length != 0 || brandList.length != 0 || origList.length > 1){
			$(oCurrLi).remove();
		}else{
			alert("不能删除，至少保留一行！");
			return;
		}
	});
	
	/**展示系别弹出框-结束*/
	
	
	/**点击确定查询*/
	$('#queryBtn').on('click', function (e) {
		if(paramsValidate()) return;
		$('body').showLoading();
		//默认展示图表
		$("#showChart").click();
		//发送请求
		$.ajax({
			   type: "POST",
			   url: ctx+"/price/cityPriceIndex/getCityPriceIndexAnalyseData",
			   data: getParams(),
			   success: function(data){
				   if(data)
				   {
				     //查询面板折叠
				     $(".queryConditionContainer .buttons .toggle a").click();
					 $("#chartId").height(450);
					 myChart.resize();
					 showChart(data);
					 showGrid(data);
				   }
				   $('body').hideLoading();
			   },
			   error:function(){
				   $('body').hideLoading();
			   }
			});
	});
	
	/**
	 * 重置按钮
	 */
	$('#resetBtn').on('click', function (e) {
		$('#formId :reset');	
		$("#productConfig").show();
		window.location.reload();
	});
	
});

/**
 * 画线图
 */
window.showChart = function(json)
{
	if(json)
	{
		//图裂显示
		var legends = json.legends;
		var legendsNew = new Array() ;
		for(var i = 0; i < legends.length; i++ ){
			if(legends[i]!=null){
				legendsNew.push(legends[i])
			}
		}
		
		var legendsLength = legendsNew.length;//标题的个数
		
		var cityIds = $("#cityModalResultContainer").find(" ul li div :input").map(function(){return $(this).val();}).get().join(",");
		var cityIdsLength = cityIds.split(",").length;	
		
		var series = json.series;
		
		var colorsNew = new Array();//颜色超过18个之后循环颜色展示。
		
		//线图颜色
		var colors = ["#00235A", "#AED4F8", "#BBC2C5", "#E26700", "#009C0E","#4A6F8A", "#8994A0", "#62C5E2", "#F9A700", 
		                  "#BBC600", "#920A6A", "#E63110", "#005D5B", "#FACE00", "#77001D","#333333","#3B7AB2","#376970"];
		//颜色超过18个之后循环颜色展示。
		var N = 0;
		var j = 0;
			while(N <= 18){
						if(N==18){
							N = 0;
						}
					colorsNew.push(colors[N]);
					N++;
					if(j >= legendsLength+10){
						break;
					}
					j++;
			}
			
		
		
		var k = 0;
		for(var i = 0; i < series.length; i++)
		{
			
			var obj = series[i];
			var show = false;
			if(0 == i) 
			{
				//只有第一天才展示数据标签
				obj.symbol = 'circle';//设置点形状 
				show = true;
			} else{
				show = true;
				obj.symbol = 'circle';//设置点形状 
			}
			
			/*if(obj.name != "-"){
				k++;
				if(i > 0 && k != 1){
					obj.symbol = series[i-1].symbol;
					if(k == cityIdsLength){
						k = 0;
					}
				}
			}*/
			
			/*var color = "";
			if(i < colorsNew.length) color = colorsNew[i];
			else color = colors[colors.length - 1];*/
			
			obj.itemStyle = {normal:{color:colorsNew[i],label:{show:show,position:'top',formatter:function(v1,v2,v3){
				if("-0" == v3)return '';
				return v3 + "%";
			}}}};
			
			
			/*if(i == series.length - 1)
			{*/
				//如果是最后一条，则需要计算柱状图月度差
				//设置柱图
			/*	if("bar" == obj.type)
				{
					var barData = obj.data;
					//alert(Math.min.apply(null, barData));
					for(var j = 0; j < barData.length; j++)
					{
						var dataValue = barData[j];
						var objValue = {};
						if(parseFloat(dataValue) < 0)
						{
							objValue.value = dataValue;
							objValue.itemStyle = {normal:{color:'#FF0000',label:{show:true,position:'bottom',formatter:function(v1,v2,v3){
								return v3 + "%";
							}}}};
						}
						else
						{
							objValue.value = dataValue;
							objValue.itemStyle = {normal:{color:'#339966',label:{show:true,position:'top',formatter:function(v1,v2,v3){
								if("-0" == v3)return '';
								return v3 + "%";
							}}}};
						}
						barData[j] = objValue;
					}
					obj.yAxisIndex = 1;//设置Y轴
					obj.barWidth = 28;//设置宽度
					obj.itemStyle = {normal:{color:'#339966'}};
					obj.tooltip = {show:false}; //设置不展示提示框
					obj.markLine = {
							data:[
							      [
							       {xAxis: 0, yAxis: 0},
							       {xAxis: barData.length-1, yAxis: 0}
							      ]
							]
						,symbol:'none'
						,itemStyle:{normal:{color:'#808080',lineStyle:{type:'solid'}}}
					};
					series[i] = obj;
				}*/
			/*}*/
			
		}
		
		
		var y1Title = "市场成交价指标";
		if("1" == $("#priceType").val()) y1Title = "市场成交价指标";
		
		var option = {
 			    tooltip : {
 			        trigger: 'item',
 			       formatter: function(params) {  
 		              var res = params[0]+'<br/>'; 
 		             res+= params[1]+'<br/>'; 
 		             var value = params[2]+'%';
 		             if(params[2] == '-'){
 		            	 value = params[2]
 		             }
 		              res+= value;  
 		              return res;  
 		        }  
			    },
			    legend: {
			        data:legendsNew
			    },
			    toolbox: {
			        show : false,
			        feature : {
			            mark : false,
			            dataView : {readOnly: false},
			            magicType:['line'],
			            restore : true,
			            saveAsImage : true
			        }
			    },
			    xAxis : [
			        {
			            type : 'category',
			            axisTick:{lineStyle:{color:'#BBBBBB'}},
			            splitLine : {show : false,lineStyle:{color:'#F0F0F0'}},
			            axisLine:{lineStyle:{color:'#BBBBBB'}},
			            axisLabel:{interval:0},
			            data : json.xTitles
			        }
			    ],
			    yAxis : [
			        {
			        	name:y1Title,
			        	nameTextStyle:{color:"#001346"},
			            type : 'value',
			            max : json.boundarys[0],
			            min : json.boundarys[1],
			            splitNumber:json.boundarys[2],
			            splitArea : {show : false},
			            axisLine:{lineStyle:{color:'#BBBBBB'}},
			            splitLine : {show : false,lineStyle:{color:'#F0F0F0'}},
			            axisLabel : {
			                formatter: '{value}%'
			            }
			        }/*,
			        {
			        	name:'价格降幅',
			        	nameTextStyle:{color:"#001346"},
			            type : 'value',
			            min:-2,
			            max:4,
			            splitNumber:6,
			            splitArea : {show : false},
			            axisLine:{lineStyle:{color:'#BBBBBB'}},
			            splitLine : {show : false,lineStyle:{color:'#F0F0F0'}},
			            axisLabel : {
			                formatter: '{value}%'
			            }
			        }*/
			    ],
			    series : series
			};
		
		
		   var dataLi = $("#dateYear .dateLIContainer").length;
		   //如果只有一个时间组
		   if(1 == dataLi) option.yAxis[1] = {};
		   
		   myChart.clear();
 		   myChart.setOption(option);
 		   
 		   $("#yMax").val(json.boundarys[0]);
 		   $("#yMin").val(json.boundarys[1]);
 		   $("#splitNumber").val(json.boundarys[2]);
	}
};

/**
 * 画表格
 */
window.showGrid = function(json)
{
	//设置动态表格宽度
	var echartsWidth = $("#chartId").width() - 46;//echarts图形宽度
	var xLength = json.xTitles.length;//X轴长度
	var tdWidth = ((echartsWidth-120) / xLength).toFixed(0);
	var firstTdWidth = 120;
	if(xLength > 9) firstTdWidth = parseInt(firstTdWidth) + parseInt(xLength);
	
	var series = json.series; //图形数组
	$("#discountLineTable").width(echartsWidth);
	
	//时间多个时只展示两条数据
	var length = series.length;
	//if(length > 2 && 1 < $("#dateYear .dateLIContainer").length ) length = 2;
	
	var tbodyHtml = "<tbody>";
	for(var i = 0; i < length; i++)
	{
		var obj = series[i];
		var data = obj.data;
		
		var className = "tbodytext";
		if(0 == i % 2) className = "tbodytext odd";
		
		var tdTitle = "TP";
		//if("1" == $("#priceType").val()) tdTitle = "TP";
		
		if("bar" == obj.type) continue;
		if(obj.name != '-'){
			tbodyHtml += "<tr>";
			tbodyHtml += "<td class='"+className.replace('tbodytext','')+"'style='width:"+firstTdWidth+"px;text-align:center;word-break:break-all;word-wrap:break-word;'><span>" + obj.name /*+ " " + tdTitle*/ + "</span></td>";
			for(var j = 0;j < data.length; j++)
			{
				var value = data[j];
				if("-" != value) value += "%";
				else value = "-";
				
				tbodyHtml += "<td class='"+className+"' style='width:"+tdWidth+"px;' >" + value + "</td>";
			}
			tbodyHtml += "</tr>";
		}
		
	}
	tbodyHtml += "</tbody>";
	$("#discountLineTable").html(tbodyHtml);
};

/**
 * 参数验证
 */
window.paramsValidate = function()
{
	var paramObj = {};
	getObjValueByType(paramObj);
	
	if(!paramObj.cityIds){
		alert("请选择城市")
		return true;
	}
	
	if(!paramObj.objId) {
		alert("请选择对象");
		return true;
	} else if(paramObj.objectType.split("|").length != paramObj.objId.split("|").length) {
		alert("对象选择不完整");
		return true;
	}
	
	getDateGroup(paramObj);
	var dateGroup = (paramObj.dateGroup).substr(0,paramObj.dateGroup.length - 1).split("|");
	for(var i = 0; i < dateGroup.length; i++)
	{
		var date = dateGroup[i].split(",");
		var beginDate = date[0].replace("-","");
		var endDate = date[1].replace("-","");
		
		if(beginDate > endDate)
		{
			alert("第" + (i+1) + "条时间段，开始时间不能大于结束时间");
			return true;
		}
		if(dateGroup.length > 1)
		{
			//如果是多条时间段
			if(endDate.substr(0,4) != beginDate.substr(0,4))
			{
				alert("第" + (i+1) + "条时间段，时间不能跨年");
				return true;
			}
		} else{
			if(endDate.substr(0,4) != beginDate.substr(0,4))
			{
				alert("时间不能跨年");
				return true;
			}
		}
	}
	
	for(var i = 0; i < dateGroup.length; i++)
	{
		var date = dateGroup[i].split(",");
		
		for(var k = 0; k < dateGroup.length; k++){
			
			if(date[0] == dateGroup[k].split(",")[0] && date[1] == dateGroup[k].split(",")[1] && i != k){
				alert("存在重复时间段！");
				return true;
			}
		}
	}
	return false;
};

/**
 * 获取页面参数
 */
window.getParams = function()
{
	var beginDate = $("#dateYear .dateLIContainer").eq(0).find(".startDate-container input").val();
	var endDate = $("#dateYear .dateLIContainer").eq(0).find(".endDate-container input").val();
	//数据分析类型默认为销量
	var analysisContentType = "4";
	var segmentType = $(".segmentType").map(function(){if($(this).prop("checked")) {return $(this).val();} else {return null;}}).get().join(",");//细分市场类别
	var priceType = 1;//页面价格类型:默认为成交价
	var equipageType = $("#equipageType").val();//页面装备信息
	var brandAll=$(".selectorResultContainer input[brandName='全部品牌']").attr("brandName");//品牌全选
	var manfAll=$(".selectorResultContainer input[manfName='全部厂商']").attr("manfName");//厂商全选
	var segmentType = $(".segmentType").map(function(){if($(this).prop("checked")) {return $(this).val();} else {return null;}}).get().join(",");//细分市场类别
	var paramObj = {};
	paramObj.beginDate = beginDate.replace("-","");
	paramObj.endDate = endDate.replace("-","");
	paramObj.analysisContentType = analysisContentType;
	paramObj.priceType = priceType;
	paramObj.segmentType = segmentType;
	paramObj.equipageType = equipageType;
	paramObj.brandAll=brandAll;
	paramObj.manfAll=manfAll;
	paramObj.segmentType = segmentType;
	getObjValueByType(paramObj);
	getDateGroup(paramObj);
	getQueryConditionAndBrowser(paramObj);
	return paramObj;
};

/**
 * 获取页头查询条件，以及浏览器
 */
window.getQueryConditionAndBrowser = function(paramObj)
{
	paramObj.browser = navigator.appVersion;
	var cityNames =  $("#cityModalResultContainer").find(" ul li div").map(function(){return $(this).text();}).get().join(",");

	var queryCondition = "";
	
	queryCondition += "分析维度 = ";
	var objectType = paramObj.objectType;
	objectType = objectType.replace(/0/g,'级别');
	objectType = objectType.replace(/1/g,'厂商品牌');
	objectType = objectType.replace(/2/g,'品牌');
	objectType = objectType.replace(/3/g,'车型');
	objectType = objectType.replace(/4/g,'系别');
	queryCondition += objectType;
	
	queryCondition += "\n城市= ";
	 queryCondition += cityNames;
	
	/*if ("0" == $("#priceType").val()) {
		queryCondition += "\n装备信息 = ";
		if ("0" == $("#equipageType").val()) queryCondition += "不含装备";
		if ("1" == $("#equipageType").val()) queryCondition += "含装备";
	}*/
	queryCondition += "\n时间= " + paramObj.dateGroup;
	queryCondition += "\n对象= " + paramObj.objName + "     车身形式= " + paramObj.bodyTypeName;
	
	paramObj.queryCondition = queryCondition;
};

/**
 * 获取时间组
 * paramObj JSON对象
 */
window.getDateGroup = function(paramObj)
{
	var dateGroup = "";
	var dataLi = $("#dateYear .dateLIContainer");
	$.each(dataLi,function(i,n){
		dateGroup += $(n).find(".startDate-container :input").val() + "," + $(n).find(".endDate-container :input").val() + "|";
	});
	if(dataLi.length > 1) paramObj.multiType = "1";//证明时间多选
	paramObj.dateGroup = dateGroup;
};

/**
 * 获取弹出框选择值
 * objectType 页面分析维度
 * paramObj JSON对象
 */
window.getObjValueByType = function(paramObj) {
	var t_objId = "";//定义选择框所选值
	var t_objectType = "";//定义选择框对象类型
	var t_objName = "";//定义选择框所选名称
	var t_bodyTypeName = "";//定义选择框所选车身形式名称
	var t_bodyTypeId = "";//定义选择框所选车身形式ID
	var t_hatchbackId = "";//定义车型选择框车型的车身形式
	
	var citySplit = $("#citySplit").prop("checked");//定义城市是否拆分
	
	//城市
	var cityIds = $("#cityModalResultContainer").find(" ul li div :input").map(function(){return $(this).val();}).get().join(",");
	//选择细分市场
	var segmentObj = $("#objectDiv .segmentLIContainer");
	//选择厂商
	var manfObj = $("#objectDiv .manfLIContainer");
	//选择品牌
	var brandObj = $("#objectDiv .brandLIContainer");
	//选择车型
	var subModelObj = $("#objectDiv .subModelLIContainer");
	//选择系别
	var origObj = $("#objectDiv .origLIContainer");
	
	var objArray = new Array();
	objArray[0] = segmentObj;
	objArray[1] = origObj;
	objArray[2] = brandObj;
	objArray[3] = manfObj;
	objArray[4] = subModelObj;
	for(var k = 0; k < objArray.length; k++) {
		var objId = "";//定义选择框所选值
		var objectType = "";//定义选择框对象类型
		var objName = "";//定义选择框所选名称
		var bodyTypeName = "";//定义选择框所选车身形式名称
		var bodyTypeId = "";//定义选择框所选车身形式ID
		var hatchbackId = "";//定义车型选择框车型的车身形式
		//循环对象
		$.each(objArray[k],function(i,n) {
			//定义获取TD值锁引，如果是车型则需把锁引反过来
			var objValueIndex = 2;
			var bodyTypeIndex = 4;
			var num = 0;
			if($(n).attr("class") == "subModelLIContainer") {
				objValueIndex = 4; bodyTypeIndex = 2;
			}
			
			var obj_spilt = $(n).find("td").eq(6).find("div :checkbox").attr("checked");
			var t_map =$(n).find("td").eq(objValueIndex).find("li div :input").map(function(){if($(this).val() != -1){return $(this).val();}});
			
			var id = t_map.get().join(",");
			if(id) {
			    if(obj_spilt == "checked") {
			    	objId += (id+ "|").replace(/,/g,'|');
			    } else {
			    	objId += id + "|";
			    }
			}
			if(k == 0 && obj_spilt == "checked") {
				num = id.split(",").length;
			} else {
				num = t_map.length;
			}
			var type = $(n).find("td").eq(0).find("select").map(function(){if($(this).val() != -1){return $(this).val();}}).get().join(",");
			if(type) {
				objectType += type + "|";
			}
			//拆分对象情况
			if(obj_spilt == "checked" && num > 1) {
				for(var i = 1; i < num; i ++) {
					objectType += type + "|";
				}
			}
			var name = $(n).find("td").eq(objValueIndex).find("li div").map(function(){if($(this).attr("value") != -1){return $(this).text();}}).get().join(",");
			if(name) {
				if(k == 0) {
					objName += name + "|";
					if(obj_spilt == "checked" && num > 1) {
						for(var i = 1; i < num; i ++) {
							objName += name + "|";
						}
					}
				} else {
					if(obj_spilt == "checked") {
					   	objName += (name+ "|").replace(/,/g,'|');
					} else {
					   	objName += name + "|";
					}
				}
			}
			var bid = $(n).find("td").eq(bodyTypeIndex).find("li div :input").map(function(){if($(this).val() != -1){return $(this).val();}}).get().join(",");
			if(bid) {
				bodyTypeId += bid + "|";
				//拆分对象情况
				if(obj_spilt == "checked" && num > 1) {
					for(var i = 1;i < num; i ++) {
						bodyTypeId += bid + "|";
					}
				} 
			} else {
				if(id) {
					bodyTypeId += "0|";
				}
				//拆分对象情况
				if(obj_spilt == "checked" && num > 1) {
					for(var i = 1; i < num; i ++) {
						bodyTypeId += "0|";
					}
				}
			}
			var bname = $(n).find("td").eq(bodyTypeIndex).find("li div").map(function(){if($(this).attr("value") != -1){return $(this).text();}}).get().join(",");
			if(bname) {
				bodyTypeName += bname + "|";
				//拆分对象情况
				if(obj_spilt == "checked" && num > 1) {
					for(var i = 1; i < num; i ++) {
						bodyTypeName += bname + "|";
					}
				}	
			} else {
				if(id) {
					bodyTypeName += "全部|";
				}
				if(obj_spilt == "checked" && num > 1) {
					for(var i = 1; i < num; i ++) {
						bodyTypeName += "全部|";
					}
				}
			}

		});
		if (objArray[k].length > 0) {
			t_objId += objId;
			t_objectType += objectType;
			t_objName += objName;
			t_bodyTypeId += bodyTypeId;
			t_bodyTypeName += bodyTypeName;
			t_hatchbackId += $("#model .subModelLIContainer").eq($("#getModelIndexId").val()).find("td:eq(1)").find("li div :input").map(function(){return $(this).val();}).get().join(",");
		}
	}
	paramObj.objId = t_objId;
	paramObj.objectType = t_objectType;
	paramObj.objName = t_objName;
	paramObj.bodyTypeId = t_bodyTypeId;
	paramObj.bodyTypeName = t_bodyTypeName;
	paramObj.hatchbackId = t_hatchbackId;
	paramObj.cityIds = cityIds;
	paramObj.citySplit = citySplit;
}

/**
 * 导出Excel
 * @param languageType EN:英文版;ZH:中文版
 */
function exportExcel(languageType)
{
	if(!$.trim($("#discountLineTable").html()))
	{
		alert("暂无数据导出");
		return;
	}
	$("#languageType").val(languageType);
	//$("#citySplitEx").val(citySplitEx);
	$("#exportFormId").submit();
}

/**
 * 车型弹出框
 * @param type
 */
window.showSubModel = function(type)
{
	if(type==1){
		$("#choseType").attr("value","1")//本竞品
	}else if(type==2){
		$("#choseType").attr("value","2")//细分市场
	}else if(type==3){
		$("#choseType").attr("value","3")//品牌
	}else if(type==4){
		$("#choseType").attr("value","4")//厂商
	}
	
	
	
	var inputType = "1"; //弹出框默认多选
	
	if('1' == type) getModelPage("tabs-competingProducts",type,inputType);
	else if('2' == type) getModelPage("tabs-segment",type,inputType);
	else if('3' == type) getModelPage("tabs-brand",type,inputType);
	else getModelPage("tabs-manf",type,inputType);
};
/**
 * 展示页面
 * @param id 展示容器ID
 * @param type 子车型弹出框展示类型2：细分市场,3:品牌,4:厂商，为空则是本品与竟品
 * @param inputType 控件类型1：复选，2：单选;默认为1
 * @param timeType 时间类型1：时间点;2：时间段默认为2
 * 
 */
function getModelPage(id,type,inputType,timeType)
{
	//如果内容不为空则触发请求
	if(!$.trim($('#' + id).html())){
		
		//获取时间
		var beginDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		var hatchbackId = "";
		
		//数据分析类型如果没有默认为成交价
		var analysisContentType = $("#analysisContentType").val();
		if(!analysisContentType) analysisContentType = "3";
		
		//如果数据分析类型是销量校验
		if("4" == analysisContentType)
		{
			beginDate = $("#dateYear .dateLIContainer").eq(0).find(".startDate-container input").val().replace("-","");
			endDate = $("#dateYear .dateLIContainer").eq(0).find(".endDate-container input").val().replace("-","");
			hatchbackId = $(".subModelLIContainer .bodyTypeModalResultContainer").find("li div :input").map(function(){return $(this).val();}).get().join(",");
		}
		
		//传递参数
		var params = {inputType:inputType,subModelShowType:type,beginDate:beginDate,endDate:endDate,analysisContentType:analysisContentType,timeType:timeType,hatchbackId:hatchbackId};
		//触发请求
		showLoading(id);
		$('#' + id).load(ctx+"/price/cityPriceIndexGlobal/getSubmodelModal",params,function(){
			var choseType = $("#choseType").val(); 
			//把结果集里选中的都打钩	
			if(choseType ==1){
				var ty = $("#tabs-competingProducts .subModelIdInput");
				ty.each(function(){
						$(this).prop("checked",false);
				});
				$("#selectorResultContainerBySubModel .removeBtnByResult").each(function(){
					var subModelId = $(this).attr("subModelId");
					ty.each(function(){
						if($(this).val() == subModelId){
							$(this).prop("checked",true);//行全选
						} 
					});
				});
			} else if(choseType ==2){
				var ty = $("#tabs-segment .subModelIdInput");
				ty.each(function(){
					$(this).prop("checked",false);
			});
				
				$("#selectorResultContainerBySubModel .removeBtnByResult").each(function(){
					var subModelId = $(this).attr("subModelId");
					ty.each(function(){
						if($(this).val() == subModelId) {
							$(this).prop("checked",true);//行全选
							return false;
						}
					});
				});
			} else if(choseType ==3){
				var ty = $("#tabs-brand .subModelIdInput");
				ty.each(function(){
					$(this).prop("checked",false);
			});
				$("#selectorResultContainerBySubModel .removeBtnByResult").each(function(){
					var subModelId = $(this).attr("subModelId");
					ty.each(function(){
						if($(this).val() == subModelId){
							$(this).prop("checked",true);//行全选
							return false;
						} 
					});
				});
			} else if(choseType ==4){
				var ty = $("#tabs-manf .subModelIdInput");
				ty.each(function(){
					$(this).prop("checked",false);
			});
				$("#selectorResultContainerBySubModel .removeBtnByResult").each(function(){
					var subModelId = $(this).attr("subModelId");
					ty.each(function(){
						if($(this).val() == subModelId) {
							$(this).prop("checked",true);//行全选
							return false;
						}
					});
				});
			}
			/*}*/
			
			
			/*根据选择条件隐藏*/
			var pooAttributeIdArr = [];
			$(".subModelModalContainer").find('.pooAttributeIdInput').each(function(){
				
				if($(this).attr("checked")){
					
					pooAttributeIdArr[pooAttributeIdArr.length] = $(this).val();
				}
			});	
			
			$(".subModelModalContainer").find(".subModelIdInput").each(function(){
				var flag = false;
				for(var i=0;i<pooAttributeIdArr.length;i++){
					if(pooAttributeIdArr[i] == $(this).attr("pooAttributeId")){
						flag = true;
						break;
					}
				}
				if(flag){
					$(this).parent().show();
				}else{
					$(this).parent().hide();
				}
			});
			/*根据选择条件隐藏结束*/
			checkAll(type);
			/*车型全选框勾选判断*/
			//如果整个页面显示的车型有没有选中的，车型全选框不选；
			var flag = false;
			var flag3 = false;//判断有没有显示的车型
			if(choseType == 1){
				$("#tabs-competingProducts .subModelIdInput").each(function(){
					   var ths = $(this);
						/*if(ths.parent().attr("style") == undefined){
							ths.parent().attr("style","");
						}*/
						//判断是不是隐藏
					   if(ths.parent().css("display") != "none"){
						   flag3 = true;
							if(!$(this).attr("checked")){
								$("#modelAll").prop("checked",false);
								flag = true;
							}
						}
						
					});
			} else if(choseType == 2){
				$("#tabs-segment .subModelIdInput").each(function(){
					   var ths = $(this);
						/*if(ths.parent().attr("style") == undefined){
							ths.parent().attr("style","");
						}*/
						//判断是不是隐藏
					   if(ths.parent().css("display") != "none"){
						   flag3 = true;
							if(!$(this).attr("checked")){
								$("#modelAll").prop("checked",false);
								flag = true;
							}
						}
						
					});
			} else if(choseType == 3){
				$("#tabs-brand .subModelIdInput").each(function(){
					   var ths = $(this);
						/*if(ths.parent().attr("style") == undefined){
							ths.parent().attr("style","");
						}*/
						//判断是不是隐藏
					   if(ths.parent().css("display") != "none"){
						   flag3 = true;
							if(!$(this).attr("checked")){
								$("#modelAll").prop("checked",false);
								flag = true;
							}
						}
						
					});
			} else if(choseType == 4){
				$("#tabs-manf .subModelIdInput").each(function(){
					   var ths = $(this);
						/*if(ths.parent().attr("style") == undefined){
							ths.parent().attr("style","");
						}*/
						//判断是不是隐藏
					   if(ths.parent().css("display") != "none"){
						   flag3 = true;
							if(!$(this).attr("checked")){
								$("#modelAll").prop("checked",false);
								flag = true;
							}
						}
					});
			}
			if(!flag){
				$("#modelAll").prop("checked",true);
			}
			if(!flag3){
				$("#modelAll").prop("checked",false);//如果页面上没有显示的车型则不全选
			}
			/*$(".subModelModalContainer .tab-content").find(".subModelIdInput").each(function(){
				   var ths = $(this);
					if(ths.parent().attr("style") == undefined){
						ths.parent().attr("style","");
					}
					//判断是不是隐藏
				   if(ths.parent().css("display") != "none"){
						if(!$(this).attr("checked")){
							$("#modelAll").prop("checked",false);
							return false;
						}
					}
					
				});*/
			
			/*车型全选框勾选判断结束*/
			/**中级全选检查打钩情况**/
			checkSelectorHeadTdTrAll($("#choseType").val());
		});
	} else{
		/*根据选择条件隐藏*/
		var pooAttributeIdArr = [];
		$(".subModelModalContainer").find('.pooAttributeIdInput').each(function(){
			
			if($(this).attr("checked")){
				
				pooAttributeIdArr[pooAttributeIdArr.length] = $(this).val();
			}
		});	
		
		$(".subModelModalContainer").find(".subModelIdInput").each(function(){
			var flag = false;
			for(var i=0;i<pooAttributeIdArr.length;i++){
				if(pooAttributeIdArr[i] == $(this).attr("pooAttributeId")){
					flag = true;
					break;
				}
			}
			if(flag){
				$(this).parent().show();
			}else{
				if($(this).prop("checked")){
					$(this).prop("checked",false);
				}
				$(this).parent().hide();
			}
		});
		/*根据选择条件隐藏结束*/
		
		//清空本页的选项
		//把结果集里选中的都打钩	
		var choseType = $("#choseType").val();
		if(choseType ==1){
			var ty = $("#tabs-competingProducts .subModelIdInput");
			ty.each(function(){
					$(this).prop("checked",false);
			});
			$("#selectorResultContainerBySubModel .removeBtnByResult").each(function(){
				var subModelId = $(this).attr("subModelId");
				ty.each(function(){
					if($(this).val() == subModelId){
						$(this).prop("checked",true);//行全选
					} 
				});
			});
		} else if(choseType ==2){
			var ty = $("#tabs-segment .subModelIdInput");
			ty.each(function(){
				$(this).prop("checked",false);
		});
			
			$("#selectorResultContainerBySubModel .removeBtnByResult").each(function(){
				var subModelId = $(this).attr("subModelId");
				ty.each(function(){
					if($(this).val() == subModelId) {
						$(this).prop("checked",true);//行全选
						return false;
					}
				});
			});
		} else if(choseType ==3){
			var ty = $("#tabs-brand .subModelIdInput");
			ty.each(function(){
				$(this).prop("checked",false);
		});
			$("#selectorResultContainerBySubModel .removeBtnByResult").each(function(){
				var subModelId = $(this).attr("subModelId");
				ty.each(function(){
					if($(this).val() == subModelId){
						$(this).prop("checked",true);//行全选
						return false;
					} 
				});
			});
		} else if(choseType ==4){
			var ty = $("#tabs-manf .subModelIdInput");
			ty.each(function(){
				$(this).prop("checked",false);
		});
			$("#selectorResultContainerBySubModel .removeBtnByResult").each(function(){
				var subModelId = $(this).attr("subModelId");
				ty.each(function(){
					if($(this).val() == subModelId) {
						$(this).prop("checked",true);//行全选
						return false;
					}
				});
			});
		}
		
		/* 车型全选框勾选判断 结束*/
		checkAll(type);
		
		//如果整个页面显示的车型有没有选中的，车型全选框不选；
		var flag = false;
		var flag2 = false;//判断页面上有没有显示的车型
		if(choseType == 1){
			$("#tabs-competingProducts .subModelIdInput").each(function(){
				   var ths = $(this);
					//判断是不是隐藏
				   if(ths.parent().css("display") != "none"){
					   flag2 = true;
						if(!$(this).attr("checked")){
							$("#modelAll").prop("checked",false);
							flag = true;
						}
					}
					
				});
		} else if(choseType == 2){
			$("#tabs-segment .subModelIdInput").each(function(){
				   var ths = $(this);
					//判断是不是隐藏
				   if(ths.parent().css("display") != "none"){
					   flag2 = true;
						if(!$(this).attr("checked")){
							$("#modelAll").prop("checked",false);
							flag = true;
						}
					}
					
				});
			if($("#tabs-segment").html()!="" && !flag){
				$("#modelAll").prop("checked",true);
			}
			//如果没有显示全选框不全选
			if(!flag2){
				$("#modelAll").prop("checked",false);
			}
		} else if(choseType == 3){
			$("#tabs-brand .subModelIdInput").each(function(){
				   var ths = $(this);
					//判断是不是隐藏
				   if(ths.parent().css("display") != "none"){
					   flag2 = true;
						if(!$(this).attr("checked")){
							$("#modelAll").prop("checked",false);
							flag = true;
						}
					}
					
				});
			if($("#tabs-brand").html()!="" && !flag){
				$("#modelAll").prop("checked",true);
			}
			//如果没有显示全选框不全选
			if(!flag2){
				$("#modelAll").prop("checked",false);
			}
		} else if(choseType == 4){
			$("#tabs-manf .subModelIdInput").each(function(){
				   var ths = $(this);
					//判断是不是隐藏
				   if(ths.parent().css("display") != "none"){
					   flag2 = true;
						if(!$(this).attr("checked")){
							$("#modelAll").prop("checked",false);
							flag = true;
						}
					}
				});
			if($("#tabs-manf").html()!="" && !flag ){
				$("#modelAll").prop("checked",true);
			}
			//如果没有显示全选框不全选
			if(!flag2){
				$("#modelAll").prop("checked",false);
			}
		}
		/**中级全选检查打钩情况**/
		checkSelectorHeadTdTrAll($("#choseType").val());
	}
};


$(document).ready(function(){
	
	
	
	/**品牌选择确定按扭---*/
	$(".brandModalContainer").find('.confirm').live('click',function(event){
		var containerId = $(this).parents(".brandModalContainer").attr("id");
		var relInputName = $(this).attr("relInputName");
		
		var allArr = [];
		$(this).parents(".brandModalContainer").find('.resultShowContent').find('.removeBtnByResult').each(function(){
			var obj = {};
			obj.brandId =  $(this).attr("brandId");
			obj.brandName =  $(this).attr("brandName");
			obj.letter =  $(this).attr("letter");
			allArr[allArr.length] = obj;
		});
		var strHTML = "";

		if($(".brandModalContainer").find('.brandModalByAll').prop("checked")){
			//拆分选项不可选
			$(currBrandLI).find("tbody td input[name='obj_Split']").attr('checked',false);
			$(currBrandLI).find("tbody td input[name='obj_Split']").attr('disabled',true);
			strHTML += '<ul class="selectorResultContainer" style="display:block">';
				strHTML += '<li>';
				strHTML += '<div class="removeBtn" relContainer="'+containerId+'" value="-1" style="cursor:pointer" title="删除：全部品牌">';
		  		strHTML += '<input type="hidden" letter="" brandName="全部品牌" value="-1" name="'+relInputName+'" />';
		  		strHTML += '全部品牌' + '<i class="icon-remove" style="visibility: hidden;"></i>';
				strHTML += '</div>';
				strHTML += '</li>';
			strHTML += '</ul>';
		
			strHTML += '<ul class="selectorResultContainer" style="display:none">';
		} else{
			//拆分选项可选
			$(currBrandLI).find("tbody td input[name='obj_Split']").attr('checked',false);
			$(currBrandLI).find("tbody td input[name='obj_Split']").attr('disabled',false);
			strHTML += '<ul class="selectorResultContainer" style="display:block">';
		}
			for(var i=0;i<allArr.length;i++){
				strHTML += '<li>';
			  		strHTML += '<div class="removeBtn" relContainer="'+containerId+'" value="'+allArr[i].subModelId+'" style="cursor:pointer" title="删除：'+allArr[i].brandName+'">';
				  		strHTML += '<input type="hidden" letter="'+allArr[i].letter+'" brandName="'+allArr[i].brandName+'" value="'+allArr[i].brandId+'" name="'+relInputName+'" />';
				  		strHTML += allArr[i].brandName + '<i class="icon-remove" style="visibility: hidden;"></i>';
			  		strHTML += '</div>';
		  		strHTML += '</li>';
			 }
		
		strHTML += '</ul>';
		$(currBrandLI).find('.brandModalResultContainer').html(strHTML);
		
	});
	
	/**厂商选择确定按扭---开始*/
	$(".manfModalContainer").find('.confirm').live('click',function(event){
		//event.stopPropagation();
		var containerId = $(this).parents(".manfModalContainer").attr("id");
		var relInputName = $(this).attr("relInputName");
		
		var allArr = [];
		$(this).parents(".manfModalContainer").find('.resultShowContent').find('.removeBtnByResult').each(function(){
			var obj = {};
			obj.manfId =  $(this).attr("manfId");
			obj.manfName =  $(this).attr("manfName");
			obj.letter =  $(this).attr("letter");
			allArr[allArr.length] = obj;
		});
		var strHTML = "";
		
		if($("#manfModal .manfModalByAll").prop("checked")){
			//拆分选项不可选
			$(currManfLI).find("tbody td input[name='obj_Split']").attr('checked',false);
			$(currManfLI).find("tbody td input[name='obj_Split']").attr('disabled',true);
			strHTML += '<ul class="selectorResultContainer" style="display:block">';
				strHTML += '<li>';
		  		strHTML += '<div class="removeBtn" relContainer="'+containerId+'" value="-1" style="cursor:pointer" title="删除：全部厂商">';
			  		strHTML += '<input type="hidden" letter="" manfName="全部厂商" value="-1" name="'+relInputName+'" />';
			  		strHTML += '全部厂商' + '<i class="icon-remove" style="visibility: hidden;"></i>';
		  		strHTML += '</div>';
		  		strHTML += '</li>';
	  		strHTML += '</ul>';
	  		strHTML += '<ul class="selectorResultContainer" style="display:none">';
		}else{
			//拆分选项可选
			$(currManfLI).find("tbody td input[name='obj_Split']").attr('checked',false);
			$(currManfLI).find("tbody td input[name='obj_Split']").attr('disabled',false);
			strHTML += '<ul class="selectorResultContainer" style="display:block">';
		}
		for(var i=0;i<allArr.length;i++){
			strHTML += '<li>';
		  		strHTML += '<div class="removeBtn" relContainer="'+containerId+'" value="'+allArr[i].subModelId+'" style="cursor:pointer" title="删除：'+allArr[i].manfName+'">';
			  		strHTML += '<input type="hidden" letter="'+allArr[i].letter+'" manfName="'+allArr[i].manfName+'" value="'+allArr[i].manfId+'" name="'+relInputName+'" />';
			  		strHTML += allArr[i].manfName + '<i class="icon-remove" style="visibility: hidden;"></i>';
		  		strHTML += '</div>';
	  		strHTML += '</li>';
		 }
		
		strHTML += '</ul>';
		$(currManfLI).find('.manfModalResultContainer').html(strHTML);
	});
	

	/** 车型控件值鼠标经过事件*/
	$(".removeBtn").live('mouseover',function(){
		$(this).find(".icon-remove").css({visibility:'visible'});
	});

	/**车型控件值鼠标离开事件*/
	$(".removeBtn").live('mouseout',function(){
		$(this).find(".icon-remove").css({visibility:'hidden'});
	});
})

/**中级全选检查打钩情况**/
function checkSelectorHeadTdTrAll(type){
	
	var model = "";
	if("2" == type){
		model = "#tabs-segment";
	} else if("3" == type){
		model = "#tabs-brand";
	} else if("4" == type){
		model = "#tabs-manf";
	} else if("1" == type){
		return;
	}
	
		var allObj = $(model+" .selectorHeadTdTr");
		$(allObj).each(function(){
			var ths = $(this);
			var startTr = $(this);//点击input父级位置
			var endTr = $(this).nextAll('.selectorHeadTdTr:eq(0)').index();
			var trs = $(model+" .selectorTable tr").slice($(startTr).index()+1,endTr);//找到区间内的所有tr
			
			var showLength = $(trs).find(".selectorContentTd input").filter(function(){return $(this).parent().css("display") != "none"}).length;//显示的checkbox数量
			var showCheckedLength = $(trs).find(".selectorContentTd input").filter(function(){return $(this).prop("checked") == true }).length;//显示的打钩checkbox的数量
			if(showLength == showCheckedLength && showLength > 0){
				ths.find("input").prop("checked",true);
			} else{
				ths.find("input").prop("checked",false);
			}
			
		})
}
