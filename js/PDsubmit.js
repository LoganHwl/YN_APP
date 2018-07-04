	$(document).ready(function() {
		var server = $('#server').val();
		// 声明一个数组用来接收拼接的字符串  
		var imc0011items = [];
		var item = {};
		var index = 0;
		var obj = {};
		var imc0011items_tsqty = [];
		var imc0011items_size = [];
		var sizeArr = [];
		var txts = document.getElementsByTagName("input");
		var i
		//更新用
		var sizeArr_2 = []
		var gkey_arr = []
		//获取imc0020gkey
		var IMC0010gkey = localStorage.getItem('PDGKEY');
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
				item_last = imc0011items;
//				alert(JSON.stringify(item));
				//赋值文本框
				$('#materialcn').val(item_last[index].materialcn);
				$('#mstkno').val(item_last[index].mstkno);
				$('#scqty').val(item_last[index].scqty);
				$('#tsqty').val(item_last[index].tsqty);

				//后台请求尺码对应出库数量
			if(item_last[index].mszsct == '1'){
				mui.ajax('http://192.168.1.121:5100/api/Outbound/imc0012list', {
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
								str += '<input type="text-align:center" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].tsqty + '" />'
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
			if(imc0011items[index] != {} && imc0011items[index] != null){
					var size_arr = []
					var tsqty_arr = []
//					var sizeArr_2 = []
 
					//取值文本框
					imc0011items[index].mstkno = $('#mstkno').val(),
					imc0011items[index].materialcn = $('#materialcn').val(),
					imc0011items[index].scqty = $('#scqty').val(),
					imc0011items[index].tsqty = $('#tsqty').val(),
					//將修改后的數據重新放回數組中的原本位置
					imc0011items.splice(index, 1, imc0011items[index]);
					//获取尺码
				if(imc0011items[index].mszsct=='1'){
					
				for(i = 0; i < vt002.length; i++) {
					size_arr.push(vt002[i].size);
				}
//				alert(JSON.stringify(size_arr))
				for(i = 0; i < vt002.length; i++) {
					gkey_arr.push(vt002[i].gkey);
				}
				//获取尺码对应出库数量   
				$("input[name='size']").each(function() {
					tsqty_arr.push($(this).val());
				});
//				alert(JSON.stringify(tsqty_arr))

				//将所需提交的尺码相关数据整合成一个数组对象
				var arr1 = size_arr;
				var arr2 = tsqty_arr;
				var arr3 = gkey_arr;
				for(var i = 0; i < arr1.length; i++) {
					obj = {};
					obj.size = arr1[i];
					obj.tsqty = arr2[i];
					obj.gkey = arr3[i];
					obj.imc0010gkey = imc0011items[index].imc0010gkey;
					obj.imc0011gkey = imc0011items[index].gkey;
					
					
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
			if(imc0011items[index] != {} && imc0011items[index] != null) {
				//更新数据至后台
				mui.ajax({
					type: "put",
					url: "http://192.168.1.121:5100/api/Outbound/imc0011",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: imc0011items[index],
					success: function(res) {
						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								return;
								break;
							case 'imc0010gkey_null':
								alert('imc0010gkey为空！');
								return;
								break;
							case 'mstkno_null':
								alert('mstkno不可为空！');
								return;
								break;
							case 'tsqty>scqty':
								alert('盘点数量不能大于库存量！');
								return;
								break;
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								return;
								break;
							case 'error':
								alert('更新失败了！');
								return;
								break;
							case 'ok':
//								alert('更新完成！');
									if(imc0011items[index].mszsct=='1'){
						mui.ajax({
									type: "put",
									url: "http://192.168.1.121:5100/api/Outbound/imc0012list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: JSON.stringify(sizeArr_2),
									success: function(res) {
										switch(res) {
											case 'gkey_null':
											alert('gkey为空！');
											return;
											break;
											case 'tsqty>scqty':
												alert('盘点数量不能大于库存量！');
												return;
												break;
											case 'error':
												alert('尺码数据更新失败了！');
												return;
												break;
											case 'ok':
												alert('尺码数据更新成功！');
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
				$("#scqty").val('');
				$("#tsqty").val('');
				
				$('#size_div').hide();
				$("input[name='size']").each(function() {
						$(this).val('');
				});

				index++;
		if(imc0011items[index] != {} && imc0011items[index] != null) {
					item_2 = imc0011items[index];
//					alert(JSON.stringify(item_2))
					
					//赋值文本框
					$('#materialcn').val(item_2.materialcn)
					$('#mstkno').val(item_2.mstkno)
					$('#scqty').val(item_2.scqty)
					$('#tsqty').val(item_2.tsqty)
					
				if(item_2.mszsct == '1'){	
					//后台请求尺码对应出库数量

				mui.ajax('http://192.168.1.121:5100/api/Outbound/imc0012list', {
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
								str += '<input type="text-align:center" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].tsqty + '" />'
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
	
		
			} else if(imc0011items[index] == null) {
				var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
				//新增尺码相关数据获取	
				var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
				//先判断input框是否填完
				var mno = $("#mstkno").val();
				var mcn = $("#materialcn").val();
				var sty = $("#scqty").val();
				var oty = $("#tsqty").val();
				if((mno === "") || (mcn === "") || (oty === "") || (mno === "")) {
					alert("还有数据没填完喔！");
					return false;
				};
//				alert(QR1.mszsct)
				//获取尺码
			if(QR1.mszsct=='1'){
		
				for(i = 0; i < VTSK002.length; i++) {
					imc0011items_size.push(VTSK002[i].size);
				}
//				alert(JSON.stringify(imc0021items_size))

				//获取尺码对应出库数量   
				$("input[name='size']").each(function() {
					imc0011items_tsqty.push($(this).val());
				});
//				alert(imc0021items_tsqty)

				//将所需提交的尺码相关数据整合成一个数组对象
				var arr1 = imc0011items_size;
				var arr2 = imc0011items_tsqty;

				for(var i = 0; i < arr1.length; i++) {
					obj = {};
					obj.size = arr1[i];
					obj.tsqty = arr2[i];
					obj.imc0010gkey = IMC0010gkey;
					obj.imc0011gkey = localStorage.getItem('imc0011GKEY');
					
					sizeArr.push(obj);
				}

					
			};
			
					//获取文本框及相应内容
					item.imc0010gkey = IMC0010gkey,
						item.gkey = localStorage.getItem('imc0011GKEY'),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.tsqty = $('#tsqty').val(),
						item.outdate = $('#outdate').val(),
						item.mszsct = QR1.mszsct

				//				将文本框数据存进数组
				
				imc0011items.push(item);
//				alert(index);
				var UPsize = JSON.stringify(sizeArr);
				//提交数据至后台
				mui.ajax({
					type: "post",
					url: "http://192.168.1.121:5100/api/Outbound/imc0011",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: item,
					success: function(res) {

						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								return;
								break;
							case 'imc0010gkey_null':
								alert('imc0010gkey为空！');
								return;
								break;
							case 'mstkno_null':
								alert('mstkno不可为空！');
								return;
								break;
							case 'tsqty>scqty':
								alert('盘点数量不能大于库存量！');
								return;
								break;
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								return;
								break;
							case 'error':
								alert('提交失败了！');
								return;
								break;
							case 'ok':
								alert('提交完成！');
							  if(QR1.mszsct=='1'){
								mui.ajax({
									type: "post",
									url: "http://192.168.1.121:5100/api/Outbound/imc0012list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: UPsize,
									success: function(res) {
										switch(res) {
											case 'tsqty>scqty':
												alert('出库数量不能大于库存量！');
												return;
												break;
											case 'error':
												alert('尺码数据提交失败了！');
												return;
												break;
											case 'ok':
												alert('尺码数据提交成功！');
												localStorage.removeItem('imc0011GKEY');
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
				$("#scqty").val('');
				$("#tsqty").val('');

				imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
				imc0011items_size.splice(0, imc0011items_size.length);
				sizeArr.splice(0, sizeArr.length);
				item = {};

//				alert(JSON.stringify(imc0021items));
				$('#size_div').hide()
			}
		});
		//提交數據并返回
	$('#ok').on('click', function() {
			var mno = $("#mstkno").val();
			var mcn = $("#materialcn").val();
			var sty = $("#scqty").val();
			var oty = $("#tsqty").val();
			
			if((mno === "") || (mcn === "") || (oty === "") || (mno === "")) {
				alert("还有数据没填完喔！");
				return false;
			} else {
				var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
				//新增尺码相关数据获取	
				var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
				
				//获取尺码
			if(QR1.mszsct=='1'){
		
				for(i = 0; i < VTSK002.length; i++) {
					imc0011items_size.push(VTSK002[i].size);
				}
//				alert(JSON.stringify(imc0021items_size))

				//获取尺码对应出库数量   
				$("input[name='size']").each(function() {
					imc0011items_tsqty.push($(this).val());
				});
//				alert(imc0021items_tsqty)

				//将所需提交的尺码相关数据整合成一个数组对象
				var arr1 = imc0011items_size;
				var arr2 = imc0011items_tsqty;

				for(var i = 0; i < arr1.length; i++) {
					obj = {};
					obj.size = arr1[i];
					obj.tsqty = arr2[i];
					obj.imc0010gkey = IMC0010gkey;
					obj.imc0011gkey = localStorage.getItem('imc0011GKEY');
					
					sizeArr.push(obj);
				}

//				alert(JSON.stringify(sizeArr));
			};
			if(!QR2) {

						item.imc0010gkey = IMC0010gkey,
						item.gkey = localStorage.getItem('imc0011GKEY'),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.tsqty = $('#tsqty').val(),
						item.outdate = $('#outdate').val(),
						item.mszsct = QR1.mszsct
				} else {
					//获取文本框及相应内容
					item.imc0010gkey = IMC0010gkey,
						item.gkey = localStorage.getItem('imc0011GKEY'),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.tsqty = $('#tsqty').val(),
						item.outdate = $('#outdate').val(),
						item.mszsct = QR1.mszsct

				};
				
				//提交数据至后台
				mui.ajax({
					type: "post",
					url: "http://192.168.1.121:5100/api/Outbound/imc0011",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: item,
					success: function(res) {

						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								return;
								break;
							case 'imc0010gkey_null':
								alert('imc0010gkey为空！');
								return;
								break;
							case 'mstkno_null':
								alert('mstkno不可为空！');
								return;
								break;
							case 'tsqty>scqty':
								alert('盘点数量不能大于库存量！');
								return;
								break;
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								return;
								break;
							case 'error':
								alert('提交失败了！');
								return;
								break;
							case 'ok':
								alert('提交完成！');
							 if(QR1.mszsct=='1'){
								mui.ajax({
									type: "post",
									url: "http://192.168.1.121:5100/api/Outbound/imc0012list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: JSON.stringify(sizeArr),
									success: function(res) {
										switch(res) {
											case 'tsqty>scqty':
												alert('出库数量不能大于库存量！');
												return;
												break;
											case 'error':
												alert('尺码数据提交失败了！');
												return;
												break;
											case 'ok':
												alert('尺码数据提交成功！');
												localStorage.removeItem('imc0011GKEY');
												break;
										}
									}
								})
							};
								//頁面跳轉				
								mui.openWindow({
									url: "tab-top-webview-main-PD.html",
									id: "tab-top-webview-main-PD.html"
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