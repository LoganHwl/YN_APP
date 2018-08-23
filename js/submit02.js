//未完成的发料出库操作页的js逻辑文件

$(document).ready(function() {

	//获取imc0020gkey
	var IMC0020GKEY = localStorage.getItem('GKEY');
	var item_old;
	var obj_old = {};
	var imc0021items_old = [];
	var index_old = 0;
	var i = 0;
	//后台请求imc0021的数据
	mui.ajax({
		type: "get",
		url: server + "/api/Outbound/imc0020/detail",
		data: {
			gkey: IMC0020GKEY
		},
		async: false,
		success: function(data) {
			if(data.length != 0) {
				//删除按钮显示
				$("#delete").css("display", "block");
				item_old = data;
				for(i; i < item_old.length; i++) {

					index_old++;
					obj_old = {};
					obj_old.materialcn = item_old[i].materialcn;
					obj_old.mstkno = item_old[i].mstkno;
					obj_old.scqty = item_old[i].scqty;
					obj_old.outqty = item_old[i].outqty;
					obj_old.styleno = item_old[i].styleno;
					obj_old.sampleno = item_old[i].sampleno;
					obj_old.gkey = item_old[i].imc0021gkey;
					obj_old.imc0020gkey = IMC0020GKEY;
					obj_old.mszsct = item_old[i].mszsct;
					obj_old.mbarcode = item_old[i].mbarcode;
					obj_old.mtgkey = item_old[i].mtgkey;
					obj_old.bgkey = item_old[i].bgkey;

					imc0021items_old.push(obj_old);
				}

				obj_old = {};
				index_old--;
				$('#materialcn').val(imc0021items_old[index_old].materialcn);
				$('#mstkno').val(imc0021items_old[index_old].mstkno);
				$('#scqty').val(imc0021items_old[index_old].scqty);
				$('#outqty').val(imc0021items_old[index_old].outqty);
				$('#styleno').val(imc0021items_old[index_old].styleno);
				$('#sampleno').val(imc0021items_old[index_old].sampleno);
				//后台请求尺码
				mui.ajax({
					type: "get",
					url: server + "/api/Outbound/imc0022list",
					data: {
						gkey: imc0021items_old[index_old].gkey
					},
					async: false,
					success: function(data) {
						if(data.length == 0) {
							$('#size_div').hide();
						} else {
							var str = '';
							$('#size_div').show();
							for(var i = 0; i < data.length; i++) {
								if(data[i].outqty == null) {
									data[i].outqty = ''
								}
								str += '<div class=" border" style="width:100%" >';
								str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + data[i].size + '/' + data[i].scqty + ':     ';
								//								str += '<input style="width:200px;height:52px; font-size:16px;margin-left-10px" type="text" name="size"'+'onkeyup="control(event,this)"'+' value="' + data[i].outqty + '" ' + 'placeholder="库存数量 ' + data[i].scqty + '" />';
								str += '<input name="size" style="width:160px;height:52px;padding:1px; font-size:16px;margin-left:-1px" type="text"' + ' value="' + data[i].outqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + data[i].scqty + '\')"' + 'placeholder="库存 ' + data[i].scqty + '"  />'
								str += '</label>';
								str += '</div>';
							}
							$("#size_div").html(str);

							localStorage.setItem('out_size', JSON.stringify(data));

						}
					}
				})
			} else {

			}
		}
	});

	// 声明一个数组用来接收拼接的字符串  
	var imc0021items = [];
	var item = {};
	//	var index = 0;
	var obj = {};
	var imc0021items_outqty = [];
	var imc0021items_size = [];
	var imc0021items_scqty = [];
	var imc0021items_sflag = [];
	var sizeArr = [];
	var txts = document.getElementsByTagName("input");
	//更新用
	var gkey_arr = [];

	//上一个
	$('#last').on('click', function() {

		//本地获取扫码内容
		var QR1 = JSON.parse(localStorage.getItem('QR_code'));
		var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
		//新增尺码相关数据获取	
		var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
		//先判断input框是否填完	
		var mno = $("#mstkno").val();
		var mcn = $("#materialcn").val();
		var sty = $("#scqty").val();
		var oty = $("#outqty").val();
		if((mno === "") && (mcn === "") && (sty === "") && (oty === "")) {

			if(index_old == 0) {
				alert('已经是第一笔了！')
				return
			} else if(index_old > 0) {
				index_old--;
				$("#delete").css("display", "block");
				//赋值文本框
				$('#materialcn').val(imc0021items_old[index_old].materialcn);
				$('#mstkno').val(imc0021items_old[index_old].mstkno);
				$('#scqty').val(imc0021items_old[index_old].scqty);
				$('#outqty').val(imc0021items_old[index_old].outqty);
				$('#styleno').val(imc0021items_old[index_old].styleno);
				$('#sampleno').val(imc0021items_old[index_old].sampleno);
				//后台请求尺码对应出库数量
				mui.ajax({
					type: "get",
					url: server + "/api/Outbound/imc0022list",
					data: {
						gkey: imc0021items_old[index_old].gkey
					},
					async: false,
					success: function(data) {
						if(data.length == 0) {

							$('#size_div').hide();
						} else {
							var str = '';
							$('#size_div').show();
							for(var i = 0; i < data.length; i++) {
								if(data[i].outqty == null) {
									data[i].outqty = ''
								}
								str += '<div class=" border" style="width:100%" >';
								str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + data[i].size + '/' + data[i].scqty + ':     ';
								//								str += '<input name="size" style="width:180px;height:52px; font-size:16px;margin-left:-10px" type="text" onkeyup="control(event,this)"  onclick="Compare(this,\'' + data[i].scqty + '\')" ' + 'id="' + i + '" ' + 'placeholder="库存数量 ' + data[i].scqty + '"  />'
								str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + data[i].outqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + data[i].scqty + '\')"' + 'placeholder="库存 ' + data[i].scqty + '"  />'
								//								str += '<input style="width:180px;height:52px; font-size:16px;margin-left:-10px" type="number" name="size"' + 'id="input' + i + ' " ' + ' value="' + data[i].outqty + '" ' + 'placeholder="库存数量 ' + data[i].scqty + '" />';
								str += '</label>';
								str += '</div>';
							}
							$("#size_div").html(str);
						}
					}
				})

			}

		} else if((mno === "") || (mcn === "") || (sty === "") || (oty === "")) {
			$("#delete").css("display", "block");
			alert('当前这笔资料还没填完！');
			return
		} else {
			$("#delete").css("display", "block");
			if(index_old == 0) {
				alert('已经是第一笔了！')
				return
			} else if(index_old > 0) {
				//判断imc0021gkey对应这笔数据是否已在数据库
				if(imc0021items_old[index_old] == '' || imc0021items_old[index_old] == null) {
					//先产生一个imc0021gkey
					mui.ajax({
						type: "get",
						url: server + "/api/Info/gkey",
						async: false,
						success: function(data) {
							localStorage.setItem('imc0021GKEY', data);
						}
					});

					//本地获取扫码内容
					var QR1 = JSON.parse(localStorage.getItem('QR_code'));
					var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
					//新增尺码相关数据获取	
					var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));

					//获取尺码,库存数量
					if(QR1.mszsct == '1') {
						for(i = 0; i < VTSK002.length; i++) {
							imc0021items_size.push(VTSK002[i].size);
						};
						for(i = 0; i < VTSK002.length; i++) {
							imc0021items_scqty.push(VTSK002[i].scqty);
						};
						for(i = 0; i < VTSK002.length; i++) {
							imc0021items_sflag.push(VTSK002[i].sflag);
						};

						//获取尺码对应出库数量   
						$("input[name='size']").each(function() {
							imc0021items_outqty.push($(this).val());
						});

						//将所需提交的尺码相关数据整合成一个数组对象
						var arr1 = imc0021items_size;
						var arr2 = imc0021items_outqty;
						var arr3 = imc0021items_scqty;
						var arr4 = imc0021items_sflag;

						for(var i = 0; i < arr1.length; i++) {
							obj = {};
							obj.size = arr1[i];
							obj.outqty = arr2[i];
							obj.scqty = arr3[i];
							obj.sflag = arr4[i];
							obj.imc0020gkey = IMC0020GKEY;
							obj.imc0021gkey = localStorage.getItem('imc0021GKEY');

							sizeArr.push(obj);
						};

					}

					//获取文本框及相应内容
					if(!QR2) {
						item.imc0020gkey = IMC0020GKEY,
							item.gkey = localStorage.getItem('imc0021GKEY'),
							item.materialcn = $('#materialcn').val(),
							item.mstkno = QR1.mstkno,
							item.mbarcode = QR1.barcode,
							item.bgkey = QR1.bgkey,
							item.mtgkey = QR1.mtgkey,
							item.scqty = $('#scqty').val(),
							item.outqty = $('#outqty').val(),
							item.mszsct = QR1.mszsct,
							item.outdate = $('#outdate').val(),
							item.sampleno = $('#sampleno').val().toUpperCase(),
							item.styleno = $('#styleno').val().toUpperCase()
					} else {

						item.imc0020gkey = IMC0020GKEY,
							item.gkey = localStorage.getItem('imc0021GKEY'),
							item.materialcn = $('#materialcn').val(),
							item.mstkno = QR1.mstkno,
							item.mbarcode = QR1.barcode,
							item.bgkey = QR1.bgkey,
							item.mtgkey = QR1.mtgkey,
							item.scqty = $('#scqty').val(),
							item.outqty = $('#outqty').val(),
							item.sampleno = $('#sampleno').val().toUpperCase(),
							item.styleno = $('#styleno').val().toUpperCase(),
							item.mszsct = QR1.mszsct,
							item.ba010gkey = QR2.ba010gkey,
							item.outdate = $('#outdate').val();
					};

					//				将文本框数据存进数组

					imc0021items_old.push(item);
					//提交数据至后台
					mui.ajax({
						type: "post",
						url: server + "/api/Outbound/imc0021",
						async: false,
						headers: {
							'Content-Type': 'application/json'
						},
						data: item,
						success: function(res) {

							switch(res) {
								case 'gkey_null':
									alert('gkey为空！');
									sizeArr.splice(0, sizeArr.length);

									return;
								case 'imc0020gkey_null':
									alert('imc0020gkey为空！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'mstkno_null':
									alert('mstkno不可为空！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'mtgkey_null':
									alert('mtgkey不可为空！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'ba010gkey_null':
									alert('ba010gkey不可为空！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'styleno_null':
									alert('styleno不可为空！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'outqty>scqty':
									alert('出库数量不能大于库存量！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'mr001gkey_null':
									alert('mr001gkey为空！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'error':
									alert('提交失败了！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'ok':
									localStorage.removeItem('QR_code');
									localStorage.removeItem('QR_code2');
									localStorage.removeItem('SIZE');
									if(QR1.mszsct == '1') {
										$('#outqty').attr("disabled", true);
										mui.ajax({
											type: "post",
											url: server + "/api/Outbound/imc0022list",
											async: false,
											headers: {
												'Content-Type': 'application/json'
											},
											data: JSON.stringify(sizeArr),
											success: function(res) {
												switch(res) {
													case 'outqty>scqty':
														alert('尺码出库总数量不能大于库存量！');
														sizeArr.splice(0, sizeArr.length);
														return;
													case 'error':
														alert('尺码数据提交失败了！(上一笔)');
														sizeArr.splice(0, sizeArr.length);
														return;
													case 'ok':
														//														alert('尺码数据提交成功！(上一笔)');

														sizeArr.splice(0, sizeArr.length);
														imc0021items_scqty.splice(0, imc0021items_scqty.length);
														imc0021items_outqty.splice(0, imc0021items_outqty.length);
														imc0021items_size.splice(0, imc0021items_size.length);
														imc0021items_sflag.splice(0, imc0021items_sflag.length);
														sizeArr.splice(0, sizeArr.length);
														item = {};
														$('#size_div').hide();

														mui.ajax({
															type: "get",
															url: server + "/api/Info/gkey",
															async: false,
															success: function(data) {
																localStorage.setItem('imc0021GKEY', data);

															}
														});
														break;
													default:
														break;
												}
											}

										})

									} else {
										localStorage.removeItem('QR_code');
										localStorage.removeItem('QR_code2');
										localStorage.removeItem('SIZE');
										sizeArr.splice(0, sizeArr.length);
										imc0021items_scqty.splice(0, imc0021items_scqty.length);
										imc0021items_outqty.splice(0, imc0021items_outqty.length);
										imc0021items_size.splice(0, imc0021items_size.length);
										imc0021items_sflag.splice(0, imc0021items_sflag.length);
										sizeArr.splice(0, sizeArr.length);
										item = {};
										$('#size_div').hide()

										mui.ajax({
											type: "get",
											url: server + "/api/Info/gkey",
											async: false,
											success: function(data) {
												localStorage.setItem('imc0021GKEY', data);

											}
										})
									};
									break;
								default:
									break;

							}
						}
					});
					index_old--;
					//赋值文本框
					$('#materialcn').val(imc0021items_old[index_old].materialcn);
					$('#mstkno').val(imc0021items_old[index_old].mstkno);
					$('#scqty').val(imc0021items_old[index_old].scqty);
					$('#outqty').val(imc0021items_old[index_old].outqty);
					$('#styleno').val(imc0021items_old[index_old].styleno);
					$('#sampleno').val(imc0021items_old[index_old].sampleno);

					//后台请求尺码对应出库数量
					if(imc0021items_old[index_old].mszsct == '1') {
						$('#outqty').attr("disabled", true);
						mui.ajax(server + '/api/Outbound/imc0022list', {
							dataType: 'json', //服务器返回json格式数据
							type: 'get', //HTTP请求类型
							async: false,
							data: {
								gkey: imc0021items_old[index_old].gkey
							},
							success: function(data) {
								localStorage.setItem('out_size', JSON.stringify(data));
								var vt002 = JSON.parse(localStorage.getItem('out_size'));
								var str = "";
								if(data == 'error') {
									alert('imc0021gkey为空')
								} else if(data == 0) {
									$('#size_div').show();
									$("input[name='size']").each(function() {
										$(this).val('');
									});
								} else {

									$('#size_div').show();
									for(i = 0; i < vt002.length; i++) {
										if(vt002[i].outqty == null) {
											vt002[i].outqty = ''
										}
										str += '<div class=" border" style="width:100%" >';
										str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
										str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].outqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'placeholder="库存 ' + vt002[i].scqty + '"  />'
										//										str += '<input style="width:200px;height:52px; font-size:18px;margin-left:30px" type="number" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].outqty + '" ' + 'placeholder="库存数量 ' + vt002[i].scqty + '" />'
										str += '</label>';
										str += '</div>';
									}
									$("#size_div").html(str);

								}
							}
						});
					} else if(imc0021items_old[index_old].mszsct == '0') {
						$("input[name='size']").each(function() {
							$(this).val('');
						});
						$('#size_div').hide();
						$('#outqty').attr("disabled", false);
					};

					//删除按钮显示
					//					$("#delete").css("display", "block");

				} else if(imc0021items_old[index_old] != '' || imc0021items_old[index_old] != null) {

					mui.ajax({
						type: "get",
						url: server + "/api/Outbound/imc0021",
						async: false,
						data: {
							gkey: imc0021items_old[index_old].gkey
						},
						success: function(data) {
							if(data == 'null') {
								alert('没有对应imc0021gkey的资料');
								return;

							} else {
								//本地获取扫码内容
								var QR1 = JSON.parse(localStorage.getItem('QR_code'));
								var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
								//新增尺码相关数据获取	
								var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
								if(!QR1) {

									//后台请求尺码
									mui.ajax({
										type: "get",
										url: server + "/api/Outbound/imc0022list",
										data: {
											gkey: imc0021items_old[index_old].gkey
										},
										async: false,
										success: function(data) {
											if(data.length == 0) {
												//												alert('这笔资料没有尺码')
											} else {

												localStorage.setItem('out_size', JSON.stringify(data));

											}
										}
									});

									var vt002 = JSON.parse(localStorage.getItem('out_size'));

									//取值文本框
									imc0021items_old[index_old].mstkno = $('#mstkno').val().toUpperCase(),
										imc0021items_old[index_old].materialcn = $('#materialcn').val(),
										imc0021items_old[index_old].scqty = $('#scqty').val(),
										imc0021items_old[index_old].outqty = $('#outqty').val(),
										imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
										imc0021items_old[index_old].styleno = $('#styleno').val().toUpperCase();

									//获取尺码
									if(imc0021items_old[index_old].mszsct == '1') {
										$('#outqty').attr("disabled", true);
										for(i = 0; i < vt002.length; i++) {
											imc0021items_size.push(vt002[i].size);
										}
										for(i = 0; i < vt002.length; i++) {
											gkey_arr.push(vt002[i].gkey);
										}
										for(i = 0; i < vt002.length; i++) {
											imc0021items_scqty.push(vt002[i].scqty);
										};
										for(i = 0; i < vt002.length; i++) {
											imc0021items_sflag.push(vt002[i].sflag);
										};
										//获取尺码对应出库数量   
										$("input[name='size']").each(function() {
											imc0021items_outqty.push($(this).val());
										});

										//将所需提交的尺码相关数据整合成一个数组对象
										var arr1 = imc0021items_size;
										var arr2 = imc0021items_outqty;
										var arr3 = imc0021items_scqty;
										var arr4 = gkey_arr;
										var arr5 = imc0021items_sflag;
										for(var i = 0; i < arr1.length; i++) {
											obj = {};
											obj.size = arr1[i];
											obj.outqty = arr2[i];
											obj.scqty = arr3[i]
											obj.gkey = arr4[i];
											obj.sflag = arr5[i];
											obj.imc0020gkey = IMC0020GKEY;
											obj.imc0021gkey = imc0021items_old[index_old].gkey;

											sizeArr.push(obj);
										}
										obj = {};
									} else if(imc0021items_old[index_old].mszsct == '0') {
										$('#outqty').attr("disabled", false);
									};
								} else {
									if(imc0021items_old[index_old].mszsct == '1') {
										//后台删除相应尺码
										mui.ajax({
											type: "delete",
											url: server + "/api/Outbound/imc0022",
											data: {
												gkey: imc0021items_old[index_old].gkey
											},
											async: false,
											success: function(data) {
												//												alert('尺码删除成功')

											},
											error: function() {
												return;
											}
										});

									};
									//从缓存中获取尺码,库存数量
									if(QR1.mszsct == '1') {
										for(i = 0; i < VTSK002.length; i++) {
											imc0021items_size.push(VTSK002[i].size);
										};
										for(i = 0; i < VTSK002.length; i++) {
											imc0021items_scqty.push(VTSK002[i].scqty);
										};
										for(i = 0; i < VTSK002.length; i++) {
											imc0021items_sflag.push(VTSK002[i].sflag);
										};

										//获取尺码对应出库数量   
										$("input[name='size']").each(function() {
											imc0021items_outqty.push($(this).val());
										});

										//将所需提交的尺码相关数据整合成一个数组对象
										var arr1 = imc0021items_size;
										var arr2 = imc0021items_outqty;
										var arr3 = imc0021items_scqty;
										var arr4 = imc0021items_sflag;

										for(var i = 0; i < arr1.length; i++) {
											obj = {};
											obj.size = arr1[i];
											obj.outqty = arr2[i];
											obj.scqty = arr3[i];
											obj.sflag = arr4[i];
											obj.imc0020gkey = IMC0020GKEY;
											obj.imc0021gkey = imc0021items_old[index_old].gkey;

											sizeArr.push(obj);
										};

									};

									//获取文本框及相应内容
									if(!QR2) {
										//取值
										imc0021items_old[index_old].bgkey = QR1.bgkey,
											imc0021items_old[index_old].mtgkey = QR1.mtgkey,
											imc0021items_old[index_old].mszsct = QR1.mszsct,
											imc0021items_old[index_old].mstkno = QR1.mstkno,
											imc0021items_old[index_old].mbarcode = QR1.barcode,
											imc0021items_old[index_old].materialcn = $('#materialcn').val(),
											imc0021items_old[index_old].scqty = $('#scqty').val(),
											imc0021items_old[index_old].outqty = $('#outqty').val(),
											imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
											imc0021items_old[index_old].styleno = $('#styleno').val().toUpperCase()
									} else {
										//取值
										imc0021items_old[index_old].bgkey = QR1.bgkey,
											imc0021items_old[index_old].mtgkey = QR1.mtgkey,
											imc0021items_old[index_old].mszsct = QR1.mszsct,
											imc0021items_old[index_old].mstkno = QR1.mstkno,
											imc0021items_old[index_old].mbarcode = QR1.barcode,
											imc0021items_old[index_old].materialcn = $('#materialcn').val(),
											imc0021items_old[index_old].scqty = $('#scqty').val(),
											imc0021items_old[index_old].outqty = $('#outqty').val(),
											imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
											imc0021items_old[index_old].styleno = $('#styleno').val().toUpperCase(),
											imc0021items_old[index_old].ba010gkey = QR2.ba010gkey

									};

								};

								//更新数据至后台
								mui.ajax({
									type: "put",
									url: server + "/api/Outbound/imc0021",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: imc0021items_old[index_old],
									success: function(res) {
										switch(res) {
											case 'gkey_null':
												alert('gkey为空！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'imc0020gkey_null':
												alert('imc0020gkey为空！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'mstkno_null':
												alert('mstkno不可为空！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'outqty>scqty':
												alert('出库数量不能大于库存量！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'mr001gkey_null':
												alert('mr001gkey为空！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'error':
												alert('更新失败了！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'ok':
												localStorage.removeItem('QR_code');
												localStorage.removeItem('QR_code2');
												localStorage.removeItem('SIZE');
												imc0021items_old.splice(index_old, 1, imc0021items_old[index_old]);
												//更新尺码
												if(imc0021items_old[index_old].mszsct == '1') {
													$('#outqty').attr("disabled", true);
													mui.ajax({
														type: "put",
														url: server + "/api/Outbound/imc0022list",
														async: false,
														headers: {
															'Content-Type': 'application/json'
														},
														data: JSON.stringify(sizeArr),
														success: function(res) {
															switch(res) {
																case 'gkey_null':
																	alert('gkey为空！');
																	sizeArr.splice(0, sizeArr.length);
																	return;
																case 'outqty>scqty':
																	alert('出库数量不能大于库存量！');
																	sizeArr.splice(0, sizeArr.length);
																	return;
																case 'error':
																	alert('尺码数据更新失败了！');
																	sizeArr.splice(0, sizeArr.length);
																	return;
																case 'ok':
																	//																	alert('尺码数据更新成功！（上一个按钮）');

																	sizeArr.splice(0, sizeArr.length);
																	imc0021items_scqty.splice(0, imc0021items_scqty.length);
																	imc0021items_outqty.splice(0, imc0021items_outqty.length);
																	imc0021items_size.splice(0, imc0021items_size.length);
																	imc0021items_sflag.splice(0, imc0021items_sflag.length);
																	gkey_arr.splice(0, gkey_arr.length);
																	sizeArr.splice(0, sizeArr.length);

																	index_old--;
																	//清空文本框的值				
																	for(i = 0; i < txts.length; i++) {
																		if(txts[i].type == "text") {
																			txts[i].value = "";
																		}
																	};

																	//赋值文本框
																	$('#materialcn').val(imc0021items_old[index_old].materialcn);
																	$('#mstkno').val(imc0021items_old[index_old].mstkno);
																	$('#scqty').val(imc0021items_old[index_old].scqty);
																	$('#outqty').val(imc0021items_old[index_old].outqty);
																	$('#styleno').val(imc0021items_old[index_old].styleno);
																	$('#sampleno').val(imc0021items_old[index_old].sampleno);

																	//后台请求尺码对应出库数量
																	if(imc0021items_old[index_old].mszsct == '1') {
																		$('#outqty').attr("disabled", true);
																		mui.ajax(server + '/api/Outbound/imc0022list', {
																			dataType: 'json', //服务器返回json格式数据
																			type: 'get', //HTTP请求类型
																			async: false,
																			data: {
																				gkey: imc0021items_old[index_old].gkey
																			},
																			success: function(data) {
																				localStorage.setItem('out_size', JSON.stringify(data));
																				var vt002 = JSON.parse(localStorage.getItem('out_size'));
																				var str = "";
																				if(data == 'error') {
																					alert('imc0021gkey为空')
																				} else if(data == 0) {
																					$('#size_div').show();
																					$("input[name='size']").each(function() {
																						$(this).val('');
																					});
																				} else {

																					$('#size_div').show();
																					for(i = 0; i < vt002.length; i++) {
																						if(vt002[i].outqty == null) {
																							vt002[i].outqty = ''
																						}
																						str += '<div class=" border" style="width:100%" >';
																						str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
																						str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].outqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'placeholder="库存 ' + vt002[i].scqty + '"  />'
																						//																						str += '<input style="width:200px;height:52px; font-size:18px;margin-left:30px" type="number" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].outqty + '" ' + 'placeholder="库存数量 ' + vt002[i].scqty + '" />'
																						str += '</label>';
																						str += '</div>';
																					}
																					$("#size_div").html(str);

																				}
																			}
																		});
																	} else if(imc0021items_old[index_old].mszsct == '0') {
																		$("input[name='size']").each(function() {
																			$(this).val('');
																		});
																		$('#size_div').hide();
																		$('#outqty').attr("disabled", false);
																	};

																	//删除按钮显示
																	//																	$("#delete").css("display", "block");
																	break;
																default:
																	break;
															}
														}
													})
												} else if(imc0021items_old[index_old].mszsct == '0') {
													$('#outqty').attr("disabled", false);
													//將修改后的數據重新放回數組中的原本位置
													//													imc0021items_old.splice(index_old, 1, imc0021items_old[index_old]);
													index_old--;
													//清空文本框的值				
													for(i = 0; i < txts.length; i++) {
														if(txts[i].type == "text") {
															txts[i].value = "";
														}
													};

													//赋值文本框
													$('#materialcn').val(imc0021items_old[index_old].materialcn);
													$('#mstkno').val(imc0021items_old[index_old].mstkno);
													$('#scqty').val(imc0021items_old[index_old].scqty);
													$('#outqty').val(imc0021items_old[index_old].outqty);
													$('#styleno').val(imc0021items_old[index_old].styleno);
													$('#sampleno').val(imc0021items_old[index_old].sampleno);

													//后台请求尺码对应出库数量
													if(imc0021items_old[index_old].mszsct == '1') {
														$('#outqty').attr("disabled", true);
														mui.ajax(server + '/api/Outbound/imc0022list', {
															dataType: 'json', //服务器返回json格式数据
															type: 'get', //HTTP请求类型
															async: false,
															data: {
																gkey: imc0021items_old[index_old].gkey
															},
															success: function(data) {
																localStorage.setItem('out_size', JSON.stringify(data));
																var vt002 = JSON.parse(localStorage.getItem('out_size'));
																var str = "";
																if(data == 'error') {
																	alert('imc0021gkey为空')
																} else if(data == 0) {
																	$('#size_div').show();
																	$("input[name='size']").each(function() {
																		$(this).val('');
																	});
																} else {

																	$('#size_div').show();
																	for(i = 0; i < vt002.length; i++) {
																		if(vt002[i].outqty == null) {
																			vt002[i].outqty = ''
																		}
																		str += '<div class=" border" style="width:100%" >';
																		str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
																		str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].outqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'placeholder="库存数量  ' + vt002[i].scqty + '"  />'
																		//																		str += '<input style="width:200px;height:52px; font-size:18px;margin-left:30px" type="number" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].outqty + '" ' + 'placeholder="库存数量 ' + vt002[i].scqty + '" />'
																		str += '</label>';
																		str += '</div>';
																	}
																	$("#size_div").html(str);

																}
															}
														});
													} else if(imc0021items_old[index_old].mszsct == '0') {
														$("input[name='size']").each(function() {
															$(this).val('');
														});
														$('#size_div').hide();
														$('#outqty').attr("disabled", false);
													};

													//删除按钮显示
													//													$("#delete").css("display", "block");
												};

												break
											default:
												break
										};

									}

								});

							}

						}

					})
				}
			}
		}
	});

	//删除一笔
	$("#delete").on('click', function() {
		if(imc0021items_old[index_old] != '' && imc0021items_old[index_old] != null) {
			mui.confirm("数据已保存,是否确定删除?", "警告", ["是", "否"], function(e) {
				if(e.index == 1) {
					return
				} else if(e.index == 0) {
					mui.ajax(server + '/api/Outbound/imc0021', {
						dataType: 'json', //服务器返回json格式数据
						type: 'delete', //HTTP请求类型
						async: false,
						data: {
							gkey: imc0021items_old[index_old].gkey
						},
						success: function(data) {
							if(data == 'ok') {
								imc0021items_old.splice(index_old, 1);
								alert('删除成功');
								//清空文本框的值				
								for(i = 0; i < txts.length; i++) {
									if(txts[i].type == "text") {
										txts[i].value = "";
									}
								};

								$("input[name='size']").each(function() {
									$(this).val('');
								});
								$('#size_div').hide();

								if(imc0021items_old[index_old] != '' && imc0021items_old[index_old] != null) {
									$("#delete").css("display", "none");
									//赋值文本框
									$('#materialcn').val(imc0021items_old[index_old].materialcn);
									$('#mstkno').val(imc0021items_old[index_old].mstkno);
									$('#scqty').val(imc0021items_old[index_old].scqty);
									$('#outqty').val(imc0021items_old[index_old].outqty);
									$('#styleno').val(imc0021items_old[index_old].styleno);
									$('#sampleno').val(imc0021items_old[index_old].sampleno);

									//后台请求尺码对应出库数量
									if(imc0021items_old[index_old].mszsct == '1') {
										$('#outqty').attr("disabled", true);

										mui.ajax(server + '/api/Outbound/imc0022list', {
											dataType: 'json', //服务器返回json格式数据
											type: 'get', //HTTP请求类型
											async: false,
											data: {
												gkey: imc0021items_old[index_old].gkey
											},
											success: function(data) {
												localStorage.setItem('out_size', JSON.stringify(data));
												var vt002 = JSON.parse(localStorage.getItem('out_size'));
												var str = "";

												if(data == 0) {
													alert('尺码请求失败')
													//							$('#size_div').hide();
												} else {

													for(i = 0; i < vt002.length; i++) {
														if(vt002[i].outqty == null) {
															vt002[i].outqty = ''
														};
														str += '<div class=" border" style="width:100%" >';
														str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
														str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].outqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'placeholder="库存数量  ' + vt002[i].scqty + '"  />'
														//														str += '<input style="width:200px;height:52px; font-size:18px;margin-left:30px" type="number" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].outqty + '"' + 'placeholder="库存数量 ' + vt002[i].scqty + '" />'
														str += '</label>';
														str += '</div>';
													}
													$("#size_div").html(str);
													$('#size_div').show();
												}
											}
										});
									} else if(imc0021items_old[index_old].mszsct == '0') {
										$('#outqty').attr("disabled", false);
										$('#size_div').hide();
									}

								} else if(imc0021items_old[index_old] == '' || imc0021items_old[index_old] == null) {
									$('#size_div').hide();
									$("#delete").css("display", "none");
								};

							} else if(data == 'error') {
								alert('删除失败')
							}

						}
					});
				}
			});
		} else {
			//清空文本框的值				
			for(i = 0; i < txts.length; i++) {
				if(txts[i].type == "text") {
					txts[i].value = "";
				}
			};
			//清空尺码框
			$("input[name='size']").each(function() {
				$(this).val('');
			});
			//删除扫码后数据的本地缓存
			localStorage.removeItem('QR_code');
			localStorage.removeItem('QR_code2')
			localStorage.removeItem('SIZE');
			//隐藏尺码框
			$('#size_div').hide();
			alert('删除成功');

			var mno = $("#mstkno").val();
			var mcn = $("#materialcn").val();
			var sty = $("#scqty").val();
			var oty = $("#outqty").val();
			var slno = $("#styleno").val();
			var spno = $("#sampleno").val();
			if((mno === "") && (mcn === "") && (sty === "") && (oty === "") && (slno === "") && (spno === "")) {
				$('#delete').css('display', 'none')
			};
		}
	});

	//下一个
	$('#next').on('click', function() {

		//先判断input框是否填完	
		var mno = $("#mstkno").val();
		var mcn = $("#materialcn").val();
		var sty = $("#scqty").val();
		var oty = $("#outqty").val();
		if((mno === "") || (mcn === "") || (sty === "") || (oty === "")) {
			alert("还有数据没填完喔！");
			return false;
		};
		//判断当前index下的数组对象内容是否为空，再进行对应操作
		if(imc0021items_old[index_old] != {} && imc0021items_old[index_old] != null) {
			$('#delete').css('display', 'blck')
			//本地获取扫码内容
			var QR1 = JSON.parse(localStorage.getItem('QR_code'));
			var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
			//新增尺码相关数据获取	
			var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
			if(!QR1) {
				//后台请求尺码
				mui.ajax({
					type: "get",
					url: server + "/api/Outbound/imc0022list",
					data: {
						gkey: imc0021items_old[index_old].gkey
					},
					async: false,
					success: function(data) {
						if(data.length == 0) {
							//							alert('这笔资料没有尺码')
						} else {

							localStorage.setItem('out_size', JSON.stringify(data));
						}
					}
				});

				var vt002 = JSON.parse(localStorage.getItem('out_size'));
				//客户有可能修改数据，监听input框输入值的变化
				//取值文本框
				imc0021items_old[index_old].mstkno = $('#mstkno').val(),
				imc0021items_old[index_old].materialcn = $('#materialcn').val(),
				imc0021items_old[index_old].scqty = $('#scqty').val(),
				imc0021items_old[index_old].outqty = $('#outqty').val(),
				imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
				imc0021items_old[index_old].styleno = $('#styleno').val();
				imc0021items_old[index_old].mtgkey = imc0021items_old[index_old].mtgkey;
				imc0021items_old[index_old].mbarcode = imc0021items_old[index_old].mbarcode;
				imc0021items_old[index_old].bgkey = imc0021items_old[index_old].bgkey;

				//获取尺码
				if(imc0021items_old[index_old].mszsct == '1') {
					$('#outqty').attr("disabled", true);
					for(i = 0; i < vt002.length; i++) {
						imc0021items_size.push(vt002[i].size);
					}
					for(i = 0; i < vt002.length; i++) {
						gkey_arr.push(vt002[i].gkey);
					}
					for(i = 0; i < vt002.length; i++) {
						imc0021items_scqty.push(vt002[i].scqty);
					};
					//获取尺码对应出库数量   
					$("input[name='size']").each(function() {
						imc0021items_outqty.push($(this).val());
					});
					//将所需提交的尺码相关数据整合成一个数组对象
					var arr1 = imc0021items_size;
					var arr2 = imc0021items_outqty;
					var arr3 = imc0021items_scqty;
					var arr4 = gkey_arr;
					for(var i = 0; i < arr1.length; i++) {
						obj = {};
						obj.size = arr1[i];
						obj.outqty = arr2[i];
						obj.scqty = arr3[i]
						obj.gkey = arr4[i];
						obj.imc0020gkey = IMC0020GKEY;
						obj.imc0021gkey = imc0021items_old[index_old].gkey;

						sizeArr.push(obj);
					}
					arr3.splice(0, arr3.length);
					obj = {};
					localStorage.removeItem('out_size')
				} else if(imc0021items_old[index_old].mszsct == '0') {
					$('#outqty').attr("disabled", false);
				};
			} else {
				if(imc0021items_old[index_old].mszsct == '1') {
					//后台删除相应尺码
					mui.ajax({
						type: "delete",
						url: server + "/api/Outbound/imc0022",
						data: {
							gkey: imc0021items_old[index_old].gkey
						},
						async: false,
						success: function(data) {
							//alert('尺码删除成功')
						},
						error: function() {
							alert('error')
						}
					});

				};

				//从缓存中获取尺码,库存数量
				if(QR1.mszsct == '1') {
					for(i = 0; i < VTSK002.length; i++) {
						imc0021items_size.push(VTSK002[i].size);
					};
					for(i = 0; i < VTSK002.length; i++) {
						imc0021items_scqty.push(VTSK002[i].scqty);
					};
					for(i = 0; i < VTSK002.length; i++) {
						imc0021items_sflag.push(VTSK002[i].sflag);
					};

					//获取尺码对应出库数量   
					$("input[name='size']").each(function() {
						imc0021items_outqty.push($(this).val());
					});

					//将所需提交的尺码相关数据整合成一个数组对象
					var arr1 = imc0021items_size;
					var arr2 = imc0021items_outqty;
					var arr3 = imc0021items_scqty;
					var arr4 = imc0021items_sflag;

					for(var i = 0; i < arr1.length; i++) {
						obj = {};
						obj.size = arr1[i];
						obj.outqty = arr2[i];
						obj.scqty = arr3[i];
						obj.sflag = arr4[i];
						obj.imc0020gkey = IMC0020GKEY;
						obj.imc0021gkey = imc0021items_old[index_old].gkey;

						sizeArr.push(obj);
					};

				} else {
					$('#outqty').attr("disabled", false);
				};

				//获取文本框及相应内容
				if(!QR2) {
					//取值
					imc0021items_old[index_old].bgkey = QR1.bgkey,
						imc0021items_old[index_old].mtgkey = QR1.mtgkey,
						imc0021items_old[index_old].mszsct = QR1.mszsct,
						imc0021items_old[index_old].mstkno = QR1.mstkno,
						imc0021items_old[index_old].mbarcode = QR1.barcode,
						imc0021items_old[index_old].materialcn = $('#materialcn').val(),
						imc0021items_old[index_old].scqty = $('#scqty').val(),
						imc0021items_old[index_old].outqty = $('#outqty').val(),
						imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
						imc0021items_old[index_old].styleno = $('#styleno').val().toUpperCase()
				} else {
					//取值
					imc0021items_old[index_old].bgkey = QR1.bgkey,
						imc0021items_old[index_old].mtgkey = QR1.mtgkey,
						imc0021items_old[index_old].mszsct = QR1.mszsct,
						imc0021items_old[index_old].mstkno = QR1.mstkno,
						imc0021items_old[index_old].mbarcode = QR1.barcode,
						imc0021items_old[index_old].materialcn = $('#materialcn').val(),
						imc0021items_old[index_old].scqty = $('#scqty').val(),
						imc0021items_old[index_old].outqty = $('#outqty').val(),
						imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
						imc0021items_old[index_old].styleno = $('#styleno').val().toUpperCase(),
						imc0021items_old[index_old].ba010gkey = QR2.ba010gkey

				};

			};
			//更新数据至后台
			mui.ajax({
				type: "put",
				url: server + "/api/Outbound/imc0021",
				async: false,
				headers: {
					'Content-Type': 'application/json'
				},
				data: imc0021items_old[index_old],
				success: function(res) {
					switch(res) {
						case 'gkey_null':
							alert('gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'imc0020gkey_null':
							alert('imc0020gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'mstkno_null':
							alert('mstkno不可为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'outqty>scqty':
							alert('出库数量不能大于库存量！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'mr001gkey_null':
							alert('mr001gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'error':
							alert('更新失败了！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'ok':
							localStorage.removeItem('QR_code');
							localStorage.removeItem('QR_code2');
							localStorage.removeItem('SIZE');
							imc0021items_old.splice(index_old, 1, imc0021items_old[index_old]);
							//							alert('更新完成！');
							//更新尺码
							if(imc0021items_old[index_old].mszsct == '1') {
								$('#outqty').attr("disabled", true);
								mui.ajax({
									type: "put",
									url: server + "/api/Outbound/imc0022list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: JSON.stringify(sizeArr),
									success: function(res) {
										switch(res) {
											case 'gkey_null':
												alert('gkey为空！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'outqty>scqty':
												alert('出库数量不能大于库存量！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'error':
												alert('尺码数据更新失败了！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'ok':
												//												alert('尺码数据更新成功！');

												sizeArr.splice(0, sizeArr.length);
												imc0021items_scqty.splice(0, imc0021items_scqty.length);
												imc0021items_outqty.splice(0, imc0021items_outqty.length);
												imc0021items_size.splice(0, imc0021items_size.length);
												imc0021items_sflag.splice(0, imc0021items_sflag.length);
												gkey_arr.splice(0, gkey_arr.length);
												//將修改后的數據重新放回數組中的原本位置
												imc0021items_old.splice(index_old, 1, imc0021items_old[index_old]);
												break
											default:
												break
												//													
										}
									}
								})
							} else if(imc0021items_old[index_old].mszsct == '0') {
								$('#outqty').attr("disabled", false);
								//將修改后的數據重新放回數組中的原本位置
								imc0021items_old.splice(index_old, 1, imc0021items_old[index_old]);

							};
							break;
						default:
							break

					};

					$("#mstkno").val('');
					$("#materialcn").val('');
					$("#scqty").val('');
					$("#outqty").val('');
					$('#styleno').val('');
					$('#sampleno').val('');

					$('#size_div').hide();
					$("input[name='size']").each(function() {
						$(this).val('');
					});

				},
			});

			index_old++;

			//index加1后再判断当前index对应数组对象是否有值
			if(imc0021items_old[index_old] != {} && imc0021items_old[index_old] != null) {
				$("#delete").css("display", "block");
				item_2 = imc0021items_old[index_old];

				//赋值文本框
				$('#materialcn').val(item_2.materialcn)
				$('#mstkno').val(item_2.mstkno)
				$('#scqty').val(item_2.scqty)
				$('#outqty').val(item_2.outqty)
				$('#styleno').val(item_2.styleno)
				$('#sampleno').val(item_2.sampleno)

				if(item_2.mszsct == '1') {
					//后台请求尺码对应出库数量
					$('#outqty').attr("disabled", true);
					mui.ajax(server + '/api/Outbound/imc0022list', {
						dataType: 'json', //服务器返回json格式数据
						type: 'get', //HTTP请求类型
						async: false,
						data: {
							gkey: item_2.gkey
						},
						success: function(data) {
							localStorage.setItem('out_size', JSON.stringify(data));

							var vt002 = JSON.parse(localStorage.getItem('out_size'));

							var str = "";

							if(data == 0) {

								$('#size_div').hide();
							} else {

								$('#size_div').show();
								for(i = 0; i < vt002.length; i++) {
									if(vt002[i].outqty == null) {
										vt002[i].outqty = ''
									}
									str += '<div class=" border" style="width:100%" >';
									str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
									str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].outqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'placeholder="库存 ' + vt002[i].scqty + '"  />'
									//									str += '<input style="width:200px;height:52px; font-size:18px;margin-left:30px" type="number" name="size"' + 'id="input' + i + ' " ' + ' value="' + vt002[i].outqty + '"' + 'placeholder="库存数量 ' + vt002[i].scqty + '" />'
									str += '</label>';
									str += '</div>';
								}
								$("#size_div").html(str);
								localStorage.removeItem('out_size')
							}
						}
					});

					//如果尺码出库数量返回的值为'null'，则清空input
					$("input[name='size']").each(function() {
						if($(this).val() == 'null') {
							$(this).val('');
						}
					});
				} else if(item_2.mszsct == '0') {
					$('#outqty').attr("disabled", false);
				}
			} else {
				$("#delete").css("display", "none");
				//先产生一个imc0021gkey
				mui.ajax({
					type: "get",
					url: server + "/api/Info/gkey",
					async: false,
					success: function(data) {
						localStorage.setItem('imc0021GKEY', data);
					}
				});
			}
		} else if(imc0021items_old[index_old] == null || imc0021items_old[index_old] == '') {
			$("#delete").css("display", "none");
			//先产生一个imc0021gkey
			mui.ajax({
				type: "get",
				url: server + "/api/Info/gkey",
				async: false,
				success: function(data) {
					localStorage.setItem('imc0021GKEY', data);
				}
			});
			//本地获取扫码内容
			var QR1 = JSON.parse(localStorage.getItem('QR_code'));
			var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
			//新增尺码相关数据获取	
			var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));

			//获取尺码,库存数量
			if(QR1.mszsct == '1') {
				for(i = 0; i < VTSK002.length; i++) {
					imc0021items_size.push(VTSK002[i].size);
				};
				for(i = 0; i < VTSK002.length; i++) {
					imc0021items_scqty.push(VTSK002[i].scqty);
				};
				for(i = 0; i < VTSK002.length; i++) {
					imc0021items_sflag.push(VTSK002[i].sflag);
				};

				//获取尺码对应出库数量   
				$("input[name='size']").each(function() {
					imc0021items_outqty.push($(this).val());
				});
				//将所需提交的尺码相关数据整合成一个数组对象
				var arr1 = imc0021items_size;
				var arr2 = imc0021items_outqty;
				var arr3 = imc0021items_scqty;
				var arr4 = imc0021items_sflag;

				for(var i = 0; i < arr1.length; i++) {
					obj = {};
					obj.size = arr1[i];
					obj.outqty = arr2[i];
					obj.scqty = arr3[i];
					obj.sflag = arr4[i];
					obj.imc0020gkey = IMC0020GKEY;
					obj.imc0021gkey = localStorage.getItem('imc0021GKEY');

					sizeArr.push(obj);
				};
			};

			//获取文本框及相应内容
			if(!QR2) {
				item.imc0020gkey = IMC0020GKEY,
					item.gkey = localStorage.getItem('imc0021GKEY'),
					item.materialcn = $('#materialcn').val(),
					item.mstkno = QR1.mstkno,
					item.mbarcode = QR1.barcode,
					item.bgkey = QR1.bgkey,
					item.mtgkey = QR1.mtgkey,
					item.scqty = $('#scqty').val(),
					item.outqty = $('#outqty').val(),
					item.mszsct = QR1.mszsct,
					item.outdate = $('#outdate').val(),
					item.sampleno = $('#sampleno').val().toUpperCase(),
					item.styleno = $('#styleno').val().toUpperCase()
			} else {

				item.imc0020gkey = IMC0020GKEY,
					item.gkey = localStorage.getItem('imc0021GKEY'),
					item.materialcn = $('#materialcn').val(),
					item.mstkno = QR1.mstkno,
					item.mbarcode = QR1.barcode,
					item.bgkey = QR1.bgkey,
					item.mtgkey = QR1.mtgkey,
					item.scqty = $('#scqty').val(),
					item.outqty = $('#outqty').val(),
					item.sampleno = $('#sampleno').val().toUpperCase(),
					item.styleno = $('#styleno').val().toUpperCase(),
					item.mszsct = QR1.mszsct,
					item.ba010gkey = QR2.ba010gkey,
					item.outdate = $('#outdate').val();
			};
			//				将文本框数据存进数组

			imc0021items_old.push(item);
			var UPsize = JSON.stringify(sizeArr);
			//提交数据至后台
			mui.ajax({
				type: "post",
				url: server + "/api/Outbound/imc0021",
				async: false,
				headers: {
					'Content-Type': 'application/json'
				},
				data: item,
				success: function(res) {
					switch(res) {
						case 'gkey_null':
							alert('gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'imc0020gkey_null':
							alert('imc0020gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'mstkno_null':
							alert('mstkno不可为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'mtgkey_null':
							alert('mtgkey不可为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'ba010gkey_null':
							alert('ba010gkey不可为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'styleno_null':
							alert('styleno不可为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'outqty>scqty':
							alert('出库数量不能大于库存量！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'mr001gkey_null':
							alert('mr001gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'error':
							alert('提交失败了！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'ok':
							localStorage.removeItem('QR_code');
							localStorage.removeItem('QR_code2');
							localStorage.removeItem('SIZE');
							//							alert('提交完成！');
							if(QR1.mszsct == '1') {
								$('#outqty').attr("disabled", true);
								mui.ajax({
									type: "post",
									url: server + "/api/Outbound/imc0022list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: UPsize,
									success: function(res) {
										switch(res) {
											case 'outqty>scqty':
												alert('出库总数量不能大于库存量！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'error':
												alert('尺码数据提交失败了！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'ok':
												//												alert('尺码数据提交成功！');

												sizeArr.splice(0, sizeArr.length);
												index_old++;
												$("#mstkno").val('');
												$("#materialcn").val('');
												$("#scqty").val('');
												$("#outqty").val('');
												$('#sampleno').val('');
												$('#styleno').val('');
												imc0021items_scqty.splice(0, imc0021items_scqty.length);
												imc0021items_outqty.splice(0, imc0021items_outqty.length);
												imc0021items_size.splice(0, imc0021items_size.length);
												imc0021items_sflag.splice(0, imc0021items_sflag.length);
												sizeArr.splice(0, sizeArr.length);
												item = {};
												$('#size_div').hide();

												mui.ajax({
													type: "get",
													url: server + "/api/Info/gkey",
													async: false,
													success: function(data) {
														localStorage.setItem('imc0021GKEY', data);
													}
												});

										}
									}
								});
							} else if(QR1.mszsct == '0') {
								sizeArr.splice(0, sizeArr.length);
								index_old++;
								$("#mstkno").val('');
								$("#materialcn").val('');
								$("#scqty").val('');
								$("#outqty").val('');
								$('#sampleno').val('');
								$('#styleno').val('');

								imc0021items_outqty.splice(0, imc0021items_outqty.length);
								imc0021items_size.splice(0, imc0021items_size.length);
								imc0021items_scqty.splice(0, imc0021items_scqty.length);
								sizeArr.splice(0, sizeArr.length);
								item = {};
								$('#size_div').hide();

								mui.ajax({
									type: "get",
									url: server + "/api/Info/gkey",
									async: false,
									success: function(data) {
										localStorage.setItem('imc0021GKEY', data);
									}
								});
							}
							break;
						default:
							break;
					};

				}

			});

		}
	});

	//提交數據并返回
	$('#ok').on('click', function() {
		var mno = $("#mstkno").val();
		var mcn = $("#materialcn").val();
		var sty = $("#scqty").val();
		var oty = $("#outqty").val();

		if((mno === "") || (mcn === "") || (sty === "") || (oty === "")) {
			alert("还有数据没填完喔！");
			return false;
		} else {
			//判断当前index下的数组对象内容是否为空，再进行对应操作
			if(imc0021items_old[index_old] != {} && imc0021items_old[index_old] != null) {

				//客户有可能修改数据，监听input框输入值的变化
				//本地获取扫码内容
				var QR1 = JSON.parse(localStorage.getItem('QR_code'));
				var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
				//新增尺码相关数据获取	
				var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
				if(!QR1) {
					//后台请求尺码
					mui.ajax({
						type: "get",
						url: server + "/api/Outbound/imc0022list",
						data: {
							gkey: imc0021items_old[index_old].gkey
						},
						async: false,
						success: function(data) {
							if(data.length == 0) {
								//								alert('这笔资料没有尺码')
							} else {

								localStorage.setItem('out_size', JSON.stringify(data));

							}
						}
					});

					var vt002 = JSON.parse(localStorage.getItem('out_size'));

					//取值文本框
					imc0021items_old[index_old].mstkno = $('#mstkno').val().toUpperCase(),
						imc0021items_old[index_old].materialcn = $('#materialcn').val(),
						imc0021items_old[index_old].scqty = $('#scqty').val(),
						imc0021items_old[index_old].outqty = $('#outqty').val(),
						imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
						imc0021items_old[index_old].styleno = $('#styleno').val().toUpperCase();

					//获取尺码
					if(imc0021items_old[index_old].mszsct == '1') {
						$('#outqty').attr("disabled", true);
						for(i = 0; i < vt002.length; i++) {
							imc0021items_size.push(vt002[i].size);
						}
						for(i = 0; i < vt002.length; i++) {
							gkey_arr.push(vt002[i].gkey);
						}
						for(i = 0; i < vt002.length; i++) {
							imc0021items_scqty.push(vt002[i].scqty);
						};
						for(i = 0; i < vt002.length; i++) {
							imc0021items_sflag.push(vt002[i].sflag);
						};
						//获取尺码对应出库数量   
						$("input[name='size']").each(function() {
							imc0021items_outqty.push($(this).val());
						});

						//将所需提交的尺码相关数据整合成一个数组对象
						var arr1 = imc0021items_size;
						var arr2 = imc0021items_outqty;
						var arr3 = imc0021items_scqty;
						var arr4 = gkey_arr;
						var arr5 = imc0021items_sflag;
						for(var i = 0; i < arr1.length; i++) {
							obj = {};
							obj.size = arr1[i];
							obj.outqty = arr2[i];
							obj.scqty = arr3[i]
							obj.gkey = arr4[i];
							obj.sflag = arr5[i];
							obj.imc0020gkey = IMC0020GKEY;
							obj.imc0021gkey = imc0021items_old[index_old].gkey;

							sizeArr.push(obj);
						}
						obj = {};
						localStorage.removeItem('out_size')
					} else if(imc0021items_old[index_old].mszsct == '0') {
						$('#outqty').attr("disabled", false);
					};
				} else {
					if(imc0021items_old[index_old].mszsct == '1') {
						//后台删除相应尺码
						mui.ajax({
							type: "delete",
							url: server + "/api/Outbound/imc0022",
							data: {
								gkey: imc0021items_old[index_old].gkey
							},
							async: false,
							success: function(data) {
								//								alert('尺码删除成功')

							},
							error: function() {
								alert('error')
							}
						});

					};

					//从缓存中获取尺码,库存数量
					if(QR1.mszsct == '1') {
						for(i = 0; i < VTSK002.length; i++) {
							imc0021items_size.push(VTSK002[i].size);
						};
						for(i = 0; i < VTSK002.length; i++) {
							imc0021items_scqty.push(VTSK002[i].scqty);
						};
						for(i = 0; i < VTSK002.length; i++) {
							imc0021items_sflag.push(VTSK002[i].sflag);
						};

						//获取尺码对应出库数量   
						$("input[name='size']").each(function() {
							imc0021items_outqty.push($(this).val());
						});

						//将所需提交的尺码相关数据整合成一个数组对象
						var arr1 = imc0021items_size;
						var arr2 = imc0021items_outqty;
						var arr3 = imc0021items_scqty;
						var arr4 = imc0021items_sflag;

						for(var i = 0; i < arr1.length; i++) {
							obj = {};
							obj.size = arr1[i];
							obj.outqty = arr2[i];
							obj.scqty = arr3[i];
							obj.sflag = arr4[i];
							obj.imc0020gkey = IMC0020GKEY;
							obj.imc0021gkey = imc0021items_old[index_old].gkey;

							sizeArr.push(obj);
						};

					} else {
						$('#outqty').attr("disabled", false);
					};

					//获取文本框及相应内容
					if(!QR2) {
						//取值
						imc0021items_old[index_old].bgkey = QR1.bgkey,
							imc0021items_old[index_old].mtgkey = QR1.mtgkey,
							imc0021items_old[index_old].mszsct = QR1.mszsct,
							imc0021items_old[index_old].mstkno = QR1.mstkno,
							imc0021items_old[index_old].mbarcode = QR1.barcode,
							imc0021items_old[index_old].materialcn = $('#materialcn').val(),
							imc0021items_old[index_old].scqty = $('#scqty').val(),
							imc0021items_old[index_old].outqty = $('#outqty').val(),
							imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
							imc0021items_old[index_old].styleno = $('#styleno').val().toUpperCase()
					} else {
						//取值
						imc0021items_old[index_old].bgkey = QR1.bgkey,
							imc0021items_old[index_old].mtgkey = QR1.mtgkey,
							imc0021items_old[index_old].mszsct = QR1.mszsct,
							imc0021items_old[index_old].mstkno = QR1.mstkno,
							imc0021items_old[index_old].mbarcode = QR1.barcode,
							imc0021items_old[index_old].materialcn = $('#materialcn').val(),
							imc0021items_old[index_old].scqty = $('#scqty').val(),
							imc0021items_old[index_old].outqty = $('#outqty').val(),
							imc0021items_old[index_old].sampleno = $('#sampleno').val().toUpperCase(),
							imc0021items_old[index_old].styleno = $('#styleno').val().toUpperCase(),
							imc0021items_old[index_old].ba010gkey = QR2.ba010gkey

					};

				};
				//更新数据至后台
				mui.ajax({
					type: "put",
					url: server + "/api/Outbound/imc0021",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: imc0021items_old[index_old],
					success: function(res) {
						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'imc0020gkey_null':
								alert('imc0020gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'mstkno_null':
								alert('mstkno不可为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'outqty>scqty':
								alert('出库数量不能大于库存量！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'error':
								alert('更新失败了！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'ok':
							localStorage.removeItem('QR_code');
												localStorage.removeItem('QR_code2');
												localStorage.removeItem('SIZE');
								imc0021items_old.splice(index_old, 1, imc0021items_old[index_old]);
								//								alert('更新完成！');
								//更新尺码
								if(imc0021items_old[index_old].mszsct == '1') {
									$('#outqty').attr("disabled", true);
									mui.ajax({
										type: "put",
										url: server + "/api/Outbound/imc0022list",
										async: false,
										headers: {
											'Content-Type': 'application/json'
										},
										data: JSON.stringify(sizeArr),
										success: function(res) {
											switch(res) {
												case 'gkey_null':
													alert('gkey为空！');
													sizeArr.splice(0, sizeArr.length);
													return;
												case 'outqty>scqty':
													alert('出库数量不能大于库存量！');
													sizeArr.splice(0, sizeArr.length);
													return;
												case 'error':
													alert('尺码数据更新失败了！');
													sizeArr.splice(0, sizeArr.length);
													return;
												case 'ok':
													//													alert('尺码数据更新成功！');

													mui.ajax(server + '/api/Outbound/chuku/ok', {
														dataType: 'json', //服务器返回json格式数据
														type: 'get', //HTTP请求类型
														timeout: 10000, //超时时间设置为10秒；
														data: {
															gkey: IMC0020GKEY
														},
														success: function(result) {
															//																window.location.reload();
															switch(result) {
																case 'gkey_null':
																	alert('imc0020gkey为空');
																	return;
																case 'imc0020_no_exsits':
																	alert('找不到相应的imc0020资料');
																	return;
																case 'error':
																	alert('提交失败');
																	return;

																case 'ok':

																	alert('提交完成');
																	//																	plus.webview.getWebviewById('sub2_CHUKU.html').reload();
																	plus.webview.getWebviewById('sub2_CHUKU_2.html').reload();
																	plus.webview.getWebviewById('tab-top-webview-main.html').reload();
																	//頁面跳轉
																	mui.openWindow({
																		url: "/YN_APP_2/src/CHUKU/tab-top-webview-main.html",
																		id: "tab-top-webview-main.html"
																	});
																	//																	plus.webview.getWebviewById('sub2_issue_main.html').close();
																	plus.webview.currentWebview().close();
																	break;
																default:
																	break;
															}

														}
													});

													break
												default:
													break
													//													
											}
										}
									})
								} else if(imc0021items_old[index_old].mszsct == '0') {
									mui.ajax(server + '/api/Outbound/chuku/ok', {
										dataType: 'json', //服务器返回json格式数据
										type: 'get', //HTTP请求类型
										timeout: 10000, //超时时间设置为10秒；
										data: {
											gkey: IMC0020GKEY
										},
										success: function(result) {
											//												window.location.reload();
											switch(result) {
												case 'gkey_null':
													alert('imc0020gkey为空');
													return;
												case 'imc0020_no_exsits':
													alert('找不到相应的imc0020资料');
													return;
												case 'error':
													alert('提交失败');
													return;

												case 'ok':

													alert('提交完成');

													//													plus.webview.getWebviewById('sub2_CHUKU.html').reload();
													plus.webview.getWebviewById('sub2_CHUKU_2.html').reload();
													plus.webview.getWebviewById('tab-top-webview-main.html').reload();
													//頁面跳轉
													mui.openWindow({
														url: "/YN_APP_2/src/CHUKU/tab-top-webview-main.html",
														id: "tab-top-webview-main.html"
													});
													//													plus.webview.getWebviewById('sub2_issue_main.html').close();
													plus.webview.currentWebview().close();
													break;
												default:
													break;
											}

										}
									});
								};
								break;
							default:
								break;

						}

					},
					error: function() {

					}
				})

			} else {

				//本地获取扫码内容
				var QR1 = JSON.parse(localStorage.getItem('QR_code'));
				var QR2 = JSON.parse(localStorage.getItem('QR_code2'));
				//新增尺码相关数据获取	
				var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));

				//获取尺码,库存数量
				if(QR1.mszsct == '1') {
					for(i = 0; i < VTSK002.length; i++) {
						imc0021items_size.push(VTSK002[i].size);
					};
					for(i = 0; i < VTSK002.length; i++) {
						imc0021items_scqty.push(VTSK002[i].scqty);
					};
					for(i = 0; i < VTSK002.length; i++) {
						imc0021items_sflag.push(VTSK002[i].sflag);
					};

					//获取尺码对应出库数量   
					$("input[name='size']").each(function() {
						imc0021items_outqty.push($(this).val());
					});

					//将所需提交的尺码相关数据整合成一个数组对象
					var arr1 = imc0021items_size;
					var arr2 = imc0021items_outqty;
					var arr3 = imc0021items_scqty;
					var arr4 = imc0021items_sflag;

					//先产生一个imc0021gkey
					mui.ajax({
						type: "get",
						url: server + "/api/Info/gkey",
						async: false,
						success: function(data) {
							localStorage.setItem('imc0021GKEY', data);
						}
					});

					for(var i = 0; i < arr1.length; i++) {
						obj = {};
						obj.size = arr1[i];
						obj.outqty = arr2[i];
						obj.scqty = arr3[i];
						obj.sflag = arr4[i];
						obj.imc0020gkey = IMC0020GKEY;
						obj.imc0021gkey = localStorage.getItem('imc0021GKEY');

						sizeArr.push(obj);
					};

				};

				//获取文本框及相应内容
				if(!QR2) {
					item.imc0020gkey = IMC0020GKEY,
						item.gkey = localStorage.getItem('imc0021GKEY'),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.mbarcode = QR1.barcode,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.outqty = $('#outqty').val(),
						item.mszsct = QR1.mszsct,
						item.outdate = $('#outdate').val(),
						item.sampleno = $('#sampleno').val().toUpperCase(),
						item.styleno = $('#styleno').val().toUpperCase()
				} else {

					item.imc0020gkey = IMC0020GKEY,
						item.gkey = localStorage.getItem('imc0021GKEY'),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.mbarcode = QR1.barcode,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.outqty = $('#outqty').val(),
						item.sampleno = $('#sampleno').val().toUpperCase(),
						item.styleno = $('#styleno').val().toUpperCase(),
						item.mszsct = QR1.mszsct,
						item.ba010gkey = QR2.ba010gkey,
						item.outdate = $('#outdate').val();
				};
				//				将文本框数据存进数组

				imc0021items_old.push(item);
				var UPsize = JSON.stringify(sizeArr);
				//提交数据至后台
				mui.ajax({
					type: "post",
					url: server + "/api/Outbound/imc0021",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: item,
					success: function(res) {
						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'imc0020gkey_null':
								alert('imc0020gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'mstkno_null':
								alert('mstkno不可为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'mtgkey_null':
								alert('mtgkey不可为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'ba010gkey_null':
								alert('ba010gkey不可为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'styleno_null':
								alert('styleno不可为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'outqty>scqty':
								alert('出库数量不能大于库存量！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'error':
								alert('提交失败了！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'ok':
							localStorage.removeItem('QR_code');
												localStorage.removeItem('QR_code2');
												localStorage.removeItem('SIZE');
								//								alert('提交完成！');
								if(QR1.mszsct == '1') {
									$('#outqty').attr("disabled", true);
									mui.ajax({
										type: "post",
										url: server + "/api/Outbound/imc0022list",
										async: false,
										headers: {
											'Content-Type': 'application/json'
										},
										data: UPsize,
										success: function(res) {
											switch(res) {
												case 'outqty>scqty':
													alert('出库总数量不能大于库存量！');
													sizeArr.splice(0, sizeArr.length);
													return;
												case 'error':
													alert('尺码数据提交失败了！');
													sizeArr.splice(0, sizeArr.length);
													return;
												case 'ok':
													//													alert('尺码数据提交成功！');
													localStorage.removeItem('QR_code');
													localStorage.removeItem('QR_code2');
													localStorage.removeItem('SIZE');

													mui.ajax(server + '/api/Outbound/chuku/ok', {
														dataType: 'json', //服务器返回json格式数据
														type: 'get', //HTTP请求类型
														timeout: 10000, //超时时间设置为10秒；
														data: {
															gkey: IMC0020GKEY
														},
														success: function(result) {
															//															window.location.reload();
															switch(result) {
																case 'gkey_null':
																	alert('imc0020gkey为空');
																	return;
																case 'imc0020_no_exsits':
																	alert('找不到相应的imc0020资料');
																	return;
																case 'error':
																	alert('提交失败');
																	return;

																case 'ok':

																	alert('提交完成');
																	//																	plus.webview.getWebviewById('sub2_CHUKU.html').reload();
																	plus.webview.getWebviewById('sub2_CHUKU_2.html').reload();
																	plus.webview.getWebviewById('tab-top-webview-main.html').reload();
																	//頁面跳轉
																	mui.openWindow({
																		url: "/YN_APP_2/src/CHUKU/tab-top-webview-main.html",
																		id: "tab-top-webview-main.html"
																	});
																	//																	plus.webview.getWebviewById('sub2_issue_main.html').close();
																	plus.webview.currentWebview().close();
																	break;
																default:
																	break;
															}

														}
													});

													break;
												default:
													break;

											}
										}
									});
								} else if(QR1.mszsct == '0') {
									localStorage.removeItem('QR_code');
									localStorage.removeItem('QR_code2');
									localStorage.removeItem('SIZE');
									mui.ajax(server + '/api/Outbound/chuku/ok', {
										dataType: 'json', //服务器返回json格式数据
										type: 'get', //HTTP请求类型
										timeout: 10000, //超时时间设置为10秒；
										data: {
											gkey: IMC0020GKEY
										},
										success: function(result) {
											//											window.location.reload();
											switch(result) {
												case 'gkey_null':
													alert('imc0020gkey为空');
													return;
												case 'imc0020_no_exsits':
													alert('找不到相应的imc0020资料');
													return;
												case 'error':
													alert('提交失败');
													return;

												case 'ok':

													alert('提交完成');
													//													plus.webview.getWebviewById('sub2_CHUKU.html').reload();
													plus.webview.getWebviewById('sub2_CHUKU_2.html').reload();
													plus.webview.getWebviewById('tab-top-webview-main.html').reload();
													//頁面跳轉
													mui.openWindow({
														url: "/YN_APP_2/src/CHUKU/tab-top-webview-main.html",
														id: "tab-top-webview-main.html"
													});
													//													plus.webview.getWebviewById('sub2_issue_main.html').close();
													plus.webview.currentWebview().close();
													break;
												default:
													break;
											}

										}
									});

								}
								break;
							default:
								break;
						}

					},
					error: function() {

					}

				})

			}

		}
	})
})