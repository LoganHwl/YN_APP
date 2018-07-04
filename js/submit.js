	$(document).ready(function() {
		var server = $('#server').val();
		// 声明一个数组用来接收拼接的字符串  
		var imc0021items = [];
		var item = {};
		var index = 0;
		var obj = {};
		var imc0021items_outqty = [];
		var imc0021items_size = [];
		var sizeArr = [];
		var txts = document.getElementsByTagName("input");
		var i
		//更新用
		var sizeArr_2 = []
		var gkey_arr = []
		//从本地存储获取数据
//		var QR1 = JSON.parse(localStorage.getItem('QR_code'));
//		var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
		//获取imc0020gkey
		var IMC0020gkey = localStorage.getItem('GKEY');
		//新增尺码相关数据获取	
//		var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));

		//下一个
	$('#last').on('click', function() {
			if(index == 0) {
				alert('已经是最后一笔了！')
				return
			} else {
				//清空文本框的值				
				for(i = 1; i < txts.length; i++) {
					if(txts[i].type == "text") {
						txts[i].value = "";
					}
				};

				index--;
//				alert(index);
				item_last = imc0021items;
//				alert(JSON.stringify(item));
				//赋值文本框
				$('#materialcn').val(item_last[index].materialcn);
				$('#mstkno').val(item_last[index].mstkno);
				$('#scqty').val(item_last[index].scqty);
				$('#styleno').val(item_last[index].styleno);
				$('#sampleno').val(item_last[index].sampleno);
				$('#outqty').val(item_last[index].outqty);

				//后台请求尺码对应出库数量
			if(item_last[index].mszsct == '1'){
				mui.ajax('http://192.168.1.121:5100/api/Outbound/imc0022list', {
					dataType: 'json', //服务器返回json格式数据
					type: 'get', //HTTP请求类型
					async: false,
					data: {
						gkey: item_last[index].gkey
					},
					success: function(data) {
						var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
						localStorage.setItem('out_size', JSON.stringify(data));
//						alert(out_size);
						var vt002 = JSON.parse(localStorage.getItem('out_size'));
						alert(vt002)
						var str = "";

						if(data == 0) {
							
							$('#size_div').hide();
						} else {
							
							$('#size_div').show();
							for(i = 0; i < vt002.length; i++) {
								str += '<li id="' + i + '" ' + ' class="mui-table-view-cell mui-media ">';
								str += '<div style="font-size:18px; margin: 10px 0px 0px -10px;" >';
								str += '<label> ' + VTSK002[i].size + '/' + VTSK002[i].scqty + ':     ';
								str += '<input type="text-align:center" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].outqty + '" />'
								str += '</label>';
								str += '</div>';
								str += '</li>';
							}
							$("#size_div").html(str);
						}
					}
				});
				}
				//如果尺码出库数量返回的值为'null'，则清空input
				$("input[name='size']").each(function() {
					if($(this).val() == 'null') {
						$(this).val('');
					}
				});
				}
			});
				
				
				//客户有可能修改数据，监听input框输入值的变化
		
		$("form :input").on('input propertychange',function(){
			var vt002 = JSON.parse(localStorage.getItem('out_size'));
//		$("form :input").change(function(){
			if(imc0021items[index] != {} && imc0021items[index] != null){
					var size_arr = []
					var outqty_arr = []
//					var sizeArr_2 = []
 
					//取值文本框
					imc0021items[index].mstkno = $('#mstkno').val(),
					imc0021items[index].materialcn = $('#materialcn').val(),
					imc0021items[index].scqty = $('#scqty').val(),
					imc0021items[index].outqty = $('#outqty').val(),
					imc0021items[index].sampleno = $('#sampleno').val(),
					imc0021items[index].styleno = $('#styleno').val()
					//將修改后的數據重新放回數組中的原本位置
					imc0021items.splice(index, 1, imc0021items[index]);
					//获取尺码
				if(imc0021items[index].mszsct=='1'){
					
				for(i = 0; i < vt002.length; i++) {
					size_arr.push(vt002[i].size);
				}
//				alert(JSON.stringify(size_arr))
				for(i = 0; i < vt002.length; i++) {
					gkey_arr.push(vt002[i].gkey);
				}
				//获取尺码对应出库数量   
				$("input[name='size']").each(function() {
					outqty_arr.push($(this).val());
				});
//				alert(JSON.stringify(outqty_arr))

				//将所需提交的尺码相关数据整合成一个数组对象
				var arr1 = size_arr;
				var arr2 = outqty_arr;
				var arr3 = gkey_arr;
				for(var i = 0; i < arr1.length; i++) {
					obj = {};
					obj.size = arr1[i];
					obj.outqty = arr2[i];
					obj.gkey = arr3[i];
					obj.imc0020gkey = imc0021items[index].imc0020gkey;
					obj.imc0021gkey = imc0021items[index].gkey;
					
					
					sizeArr_2.push(obj);
				}
				obj = {};
			};

//				alert(JSON.stringify(sizeArr_2))
			   }
			  
			});
			
		
		//下一个
		$('#next').on('tap', function() {
			//判断当前index下的数组对象内容是否为空，再进行对应操作
			if(imc0021items[index] != {} && imc0021items[index] != null) {
				//更新数据至后台
				mui.ajax({
					type: "put",
					url: "http://192.168.1.121:5100/api/Outbound/imc0021",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: imc0021items[index],
					success: function(res) {
						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								break;
							case 'imc0020gkey_null':
								alert('imc0020gkey为空！');
								break;
							case 'mstkno_null':
								alert('mstkno不可为空！');
								break;
							case 'outqty>scqty':
								alert('出库数量不能大于库存量！');
								break;
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								break;
							case 'error':
								alert('更新失败了！');
								break;
							case 'ok':
//								alert('更新完成！');
									if(imc0021items[index].mszsct=='1'){
						mui.ajax({
									type: "put",
									url: "http://192.168.1.121:5100/api/Outbound/imc0022list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: JSON.stringify(sizeArr_2),
									success: function(res) {
										switch(res) {
											case 'gkey_null':
											alert('gkey为空！');
											break;
											case 'outqty>scqty':
												alert('出库数量不能大于库存量！');
												break;
											case 'error':
												alert('尺码数据更新失败了！');
												break;
											case 'ok':
//												alert('尺码数据更新成功！');
												sizeArr_2 = [];
//												alert(sizeArr_2);
												break;
										}
									}
								})
						};
				
												break;
											default:
												break;
						};

					}

				});
				//更新尺码
				
				
				$("#mstkno").val('');
				$("#materialcn").val('');
				$("#sampleno").val('');
				$("#styleno").val('');
				$("#scqty").val('');
				$("#outqty").val('');
				
				$('#size_div').hide();
				$("input[name='size']").each(function() {
						$(this).val('');
				});

				index++;
		if(imc0021items[index] != {} && imc0021items[index] != null) {
					item_2 = imc0021items[index];
//					alert(JSON.stringify(item_2))
					
					//赋值文本框
					$('#materialcn').val(item_2.materialcn)
					$('#mstkno').val(item_2.mstkno)
					$('#scqty').val(item_2.scqty)
					$('#styleno').val(item_2.styleno)
					$('#sampleno').val(item_2.sampleno)
					$('#outqty').val(item_2.outqty)
					
				if(item_2.mszsct == '1'){	
					//后台请求尺码对应出库数量

				mui.ajax('http://192.168.1.121:5100/api/Outbound/imc0022list', {
					dataType: 'json', //服务器返回json格式数据
					type: 'get', //HTTP请求类型
					async: false,
					data: {
						gkey: item_2.gkey
					},
					success: function(data) {
						localStorage.setItem('out_size', JSON.stringify(data));
//						alert(JSON.stringify(data));
						var vt002 = JSON.parse(localStorage.getItem('out_size'));
//						alert(vt002)
						var str = "";

						if(data == 0) {
							
							$('#size_div').hide();
						} else {
							
							$('#size_div').show();
							for(i = 0; i < vt002.length; i++) {
								str += '<li id="' + i + '" ' + ' class="mui-table-view-cell mui-media ">';
								str += '<div style="font-size:18px; margin: 10px 0px 0px -10px;" >';
								str += '<label> ' + VTSK002[i].size + '/' + VTSK002[i].scqty + ':     ';
								str += '<input type="text-align:center" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].outqty + '" />'
								str += '</label>';
								str += '</div>';
								str += '</li>';
							}
							$("#size_div").html(str);
						}
					}
				});
			
				//如果尺码出库数量返回的值为'null'，则清空input
				$("input[name='size']").each(function() {
					if($(this).val() == 'null') {
						$(this).val('');
					}
				});
			}
		};
	
		
			} else if(imc0021items[index] == null) {
				var QR1 = JSON.parse(localStorage.getItem('QR_code'));
				var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
				//新增尺码相关数据获取	
				var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
				//先判断input框是否填完	
				var bl = $("#belong").val();
				var mno = $("#mstkno").val();
				var sano = $("#sampleno").val();
				var mcn = $("#materialcn").val();
				var stno = $("#styleno").val();
				var sty = $("#scqty").val();
				var oty = $("#outqty").val();
				if((bl === "") || (mno === "") || (mcn === "") || (oty === "") || (mno === "")) {
					alert("还有数据没填完喔！");
					return false;
				};
//				alert(QR1.mszsct)
				//获取尺码
			if(QR1.mszsct=='1'){
		
				for(i = 0; i < VTSK002.length; i++) {
					imc0021items_size.push(VTSK002[i].size);
				}
//				alert(JSON.stringify(imc0021items_size))

				//获取尺码对应出库数量   
				$("input[name='size']").each(function() {
					imc0021items_outqty.push($(this).val());
				});
//				alert(imc0021items_outqty)

				//将所需提交的尺码相关数据整合成一个数组对象
				var arr1 = imc0021items_size;
				var arr2 = imc0021items_outqty;

				for(var i = 0; i < arr1.length; i++) {
					obj = {};
					obj.size = arr1[i];
					obj.outqty = arr2[i];
					obj.imc0020gkey = IMC0020gkey;
					obj.imc0021gkey = localStorage.getItem('imc0021GKEY');
					
					sizeArr.push(obj);
				}

					
			};
			if(!QR2) {
						item.imc0020gkey = IMC0020gkey,
						item.gkey = localStorage.getItem('imc0021GKEY'),
						item.belong = $('#belong').val(),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.outqty = $('#outqty').val(),
						item.outdate = $('#outdate').val(),
						item.sampleno = $('#sampleno').val(),
						item.styleno = $('#styleno').val(),
						item.mszsct = QR1.mszsct
				} else {
					//获取文本框及相应内容
					item.imc0020gkey = IMC0020gkey,
						item.gkey = localStorage.getItem('imc0021GKEY'),
						item.belong = $('#belong').val(),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.outqty = $('#outqty').val(),
						item.outdate = $('#outdate').val(),
						item.sampleno = $('#sampleno').val(),
						item.styleno = $('#styleno').val(),
						item.mszsct = QR1.mszsct

				};
				//				将文本框数据存进数组
				
				imc0021items.push(item);
//				alert(index);
				var UPsize = JSON.stringify(sizeArr);
				//提交数据至后台
				mui.ajax({
					type: "post",
					url: "http://192.168.1.121:5100/api/Outbound/imc0021",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: item,
					success: function(res) {

						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								break;
							case 'imc0020gkey_null':
								alert('imc0020gkey为空！');
								break;
							case 'mstkno_null':
								alert('mstkno不可为空！');
								break;
							case 'outqty>scqty':
								alert('出库数量不能大于库存量！');
								break;
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								break;
							case 'error':
								alert('提交失败了！');
								break;
							case 'ok':
								alert('提交完成！');
							  if(QR1.mszsct=='1'){
								mui.ajax({
									type: "post",
									url: "http://192.168.1.121:5100/api/Outbound/imc0022list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: UPsize,
									success: function(res) {
										switch(res) {
											case 'outqty>scqty':
												alert('出库数量不能大于库存量！');
												break;
											case 'error':
												alert('尺码数据提交失败了！');
												break;
											case 'ok':
												alert('尺码数据提交成功！');
												localStorage.removeItem('imc0021GKEY');
												sizeArr = [];
												break;
										}
									}
								});
							}
								break;
							default:
								break;
						};

					}

				})
				index++;
				$("#mstkno").val('');
				$("#materialcn").val('');
				$("#sampleno").val('');
				$("#styleno").val('');
				$("#scqty").val('');
				$("#outqty").val('');

				imc0021items_outqty.splice(0, imc0021items_outqty.length);
				imc0021items_size.splice(0, imc0021items_size.length);
				sizeArr.splice(0, sizeArr.length);
				item = {};

//				alert(JSON.stringify(imc0021items));
				$('#size_div').hide()
			}
		});
		//提交數據并返回
	$('#ok').on('click', function() {
			var bl = $("#belong").val();
			var mno = $("#mstkno").val();
			var sano = $("#sampleno").val();
			var mcn = $("#materialcn").val();
			var stno = $("#styleno").val();
			var sty = $("#scqty").val();
			var oty = $("#outqty").val();
			
			if((bl === "") || (mno === "") || (mcn === "") || (oty === "") || (mno === "")) {
				alert("还有数据没填完喔！");
				return false;
			} else {
				var QR1 = JSON.parse(localStorage.getItem('QR_code'));
				var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
				//新增尺码相关数据获取	
				var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
				
				//获取尺码
			if(QR1.mszsct=='1'){
		
				for(i = 0; i < VTSK002.length; i++) {
					imc0021items_size.push(VTSK002[i].size);
				}
//				alert(JSON.stringify(imc0021items_size))

				//获取尺码对应出库数量   
				$("input[name='size']").each(function() {
					imc0021items_outqty.push($(this).val());
				});
//				alert(imc0021items_outqty)

				//将所需提交的尺码相关数据整合成一个数组对象
				var arr1 = imc0021items_size;
				var arr2 = imc0021items_outqty;

				for(var i = 0; i < arr1.length; i++) {
					obj = {};
					obj.size = arr1[i];
					obj.outqty = arr2[i];
					obj.imc0020gkey = IMC0020gkey;
					obj.imc0021gkey = localStorage.getItem('imc0021GKEY');
					
					sizeArr.push(obj);
				}

//				alert(JSON.stringify(sizeArr));
			};
			if(!QR2) {

						item.imc0020gkey = IMC0020gkey,
						item.gkey = localStorage.getItem('imc0021GKEY'),
						item.belong = $('#belong').val(),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.outqty = $('#outqty').val(),
						item.outdate = $('#outdate').val(),
						item.sampleno = $('#sampleno').val(),
						item.styleno = $('#styleno').val(),
						item.mszsct = QR1.mszsct
				} else {
					//获取文本框及相应内容
					item.imc0020gkey = IMC0020gkey,
						item.gkey = localStorage.getItem('imc0021GKEY'),
						item.belong = $('#belong').val(),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.outqty = $('#outqty').val(),
						item.outdate = $('#outdate').val(),
						item.sampleno = $('#sampleno').val(),
						item.styleno = $('#styleno').val(),
						item.mszsct = QR1.mszsct

				};
				
				//提交数据至后台
				mui.ajax({
					type: "post",
					url: "http://192.168.1.121:5100/api/Outbound/imc0021",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: item,
					success: function(res) {

						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								break;
							case 'imc0020gkey_null':
								alert('imc0020gkey为空！');
								break;
							case 'mstkno_null':
								alert('mstkno不可为空！');
								break;
							case 'outqty>scqty':
								alert('出库数量不能大于库存量！');
								break;
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								break;
							case 'error':
								alert('提交失败了！');
								break;
							case 'ok':
								alert('提交完成！');
							 if(QR1.mszsct=='1'){
								mui.ajax({
									type: "post",
									url: "http://192.168.1.121:5100/api/Outbound/imc0022list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: JSON.stringify(sizeArr),
									success: function(res) {
										switch(res) {
											case 'outqty>scqty':
												alert('出库数量不能大于库存量！');
												break;
											case 'error':
												alert('尺码数据提交失败了！');
												break;
											case 'ok':
												alert('尺码数据提交成功！');
												localStorage.removeItem('imc0021GKEY');
												break;
										}
									}
								})
							};
								//頁面跳轉				
								mui.openWindow({
									url: "tab-top-webview-main.html",
									id: "tab-top-webview-main.html"
								});
								break;
							default:
								break;
						}

					}

				})
			}
		})

	})