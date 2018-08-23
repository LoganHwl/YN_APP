//盘点管理操作页的js逻辑文件

$(document).ready(function() {
	//	var server = $('#server').val();
	// 声明一个数组用来接收拼接的字符串  
	var imc0011items = [];
	var item = {};
	var index = 0;
	var obj = {};
	var imc0011items_tsqty = [];
	var imc0011items_size = [];
	var imc0011items_scqty = [];
	var imc0011items_sflag = [];
	var sizeArr = [];
	var txts = document.getElementsByTagName("input");
	var i;
	//更新用
	var gkey_arr = [];
	//获取imc0010gkey
	var IMC0010gkey = localStorage.getItem('PDGKEY');
	//新建一个数组单独存imc0021gkey
	var IMC0011GKEY = [];
	IMC0011GKEY.push(localStorage.getItem('imc0011GKEY'));
	//上一个
	$('#last').on('click', function() {
		//先获取当前的imc0021gkey
		var obj_gkey = IMC0011GKEY[index];
		//本地获取扫码内容
		var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
		//新增尺码相关数据获取	
		var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
		//先判断input框是否填完	
		var mno = $("#mstkno").val();
		var mcn = $("#materialcn").val();
		var sty = $("#scqty").val();
		var oty = $("#tsqty").val();
		if((mno === "") && (mcn === "") && (sty === "") && (oty === "")) {

			if(index == 0) {
				alert('已经是第一笔了！')
				return false
			} else if(index > 0) {
				//												alert('第一个index > 0');
				//												alert(JSON.stringify(imc0011items[index]));
				$("#delete").css("display", "block");
				index--;

				//赋值文本框
				$('#materialcn').val(imc0011items[index].materialcn);
				$('#mstkno').val(imc0011items[index].mstkno);
				$('#scqty').val(imc0011items[index].scqty);
				$('#tsqty').val(imc0011items[index].tsqty);
				//后台请求尺码对应出库数量
				if(imc0011items[index].mszsct == '1') {
					$('#tsqty').attr("disabled", true);
					mui.ajax(server + '/api/Outbound/imc0012list', {
						dataType: 'json', //服务器返回json格式数据
						type: 'get', //HTTP请求类型
						async: false,
						data: {
							gkey: imc0011items[index].gkey
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
									if(vt002[i].tsqty == null) {
										vt002[i].tsqty = ''
									}
									str += '<div class=" border" style="width:100%" >';
									str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
									str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].tsqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'value="' + vt002[i].scqty + '"  />'
									str += '</label>';
									str += '</div>';
								}
								$("#size_div").html(str);
							}
						}
					});
				} else if(imc0011items[index].mszsct == '0') {
					$("input[name='size']").each(function() {
						$(this).val('');
					});
					$('#size_div').hide();
					$('#tsqty').attr("disabled", false);
				};

				//删除按钮显示
				//				$("#delete").css("display", "block");

			}

		} else if((mno === "") || (mcn === "") || (sty === "") || (oty === "")) {
			alert('当前这笔资料还没填完！');
			return
		} else {
			//			alert('当前这笔资料完成了');
			if(index == 0) {
				alert('已经是第一笔了！')
				return
			} else if(index > 0) {
				$("#delete").css("display", "block");
				//								alert('第二个index > 0');
				//								alert(JSON.stringify(imc0011items[index]));
				//判断imc0011gkey对应这笔数据是否已在数据库
				if(imc0011items[index] == '' || imc0011items[index] == null) {
					if(IMC0011GKEY[index] == '' || IMC0011GKEY[index] == null) {
						//先产生一个imc0011gkey
						mui.ajax({
							type: "get",
							url: server + "/api/Info/gkey",
							async: false,
							success: function(data) {
								localStorage.setItem('imc0011GKEY', data);
								IMC0011GKEY.push(localStorage.getItem('imc0011GKEY'));
								//																alert('imc0011gkey:'+JSON.stringify(IMC0011GKEY[index]))
							}
						});
					};

					//本地获取扫码内容
					var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
					//新增尺码相关数据获取	
					var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));

					//获取尺码,库存数量
					if(QR1.mszsct == '1') {
						for(i = 0; i < VTSK002.length; i++) {
							imc0011items_size.push(VTSK002[i].size);
						};
						for(i = 0; i < VTSK002.length; i++) {
							imc0011items_scqty.push(VTSK002[i].scqty);
						};
						for(i = 0; i < VTSK002.length; i++) {
							imc0011items_sflag.push(VTSK002[i].sflag);
						};

						//获取尺码对应出库数量   
						$("input[name='size']").each(function() {
							imc0011items_tsqty.push($(this).val());
						});

						//将所需提交的尺码相关数据整合成一个数组对象
						var arr1 = imc0011items_size;
						var arr2 = imc0011items_tsqty;
						var arr3 = imc0011items_scqty;
						var arr4 = imc0011items_sflag;

						for(var i = 0; i < arr1.length; i++) {
							obj = {};
							obj.size = arr1[i];
							obj.tsqty = arr2[i];
							obj.scqty = arr3[i];
							obj.sflag = arr4[i];
							obj.imc0010gkey = IMC0010gkey;
							obj.imc0011gkey = localStorage.getItem('imc0011GKEY');

							sizeArr.push(obj);
						};
						//					alert(JSON.stringify(sizeArr))
					}

					//获取文本框及相应内容
					item.imc0010gkey = IMC0010gkey,
						item.gkey = localStorage.getItem('imc0011GKEY'),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.mbarcode = QR1.barcode,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.tsqty = $('#tsqty').val(),
						item.mszsct = QR1.mszsct,
						item.tsdate = $('#tsdate').val();

					//				将文本框数据存进数组

					imc0011items.push(item);
					//					alert(JSON.stringify(imc0011items[index]));
					//提交数据至后台
					mui.ajax({
						type: "post",
						url: server + "/api/Outbound/imc0011",
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
								case 'imc0010gkey_null':
									alert('imc0010gkey为空！');
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
								case 'mr001gkey_null':
									alert('mr001gkey为空！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'error':
									alert('提交失败了！');
									sizeArr.splice(0, sizeArr.length);
									return;
								case 'ok':
									localStorage.removeItem('PDQR_code');
									localStorage.removeItem('SIZE');
									//									alert('提交完成！');
									if(QR1.mszsct == '1') {
										$('#tsqty').attr("disabled", true);
										mui.ajax({
											type: "post",
											url: server + "/api/Outbound/imc0012list",
											async: false,
											headers: {
												'Content-Type': 'application/json'
											},
											data: JSON.stringify(sizeArr),
											success: function(res) {
												switch(res) {
													case 'error':
														alert('尺码数据提交失败了！(上一笔)');
														sizeArr.splice(0, sizeArr.length);
														return;
													case 'ok':
														//														alert('尺码数据提交成功！(上一笔)');

														sizeArr.splice(0, sizeArr.length);
														imc0011items_scqty.splice(0, imc0011items_scqty.length);
														imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
														imc0011items_size.splice(0, imc0011items_size.length);
														imc0011items_sflag.splice(0, imc0011items_sflag.length);
														sizeArr.splice(0, sizeArr.length);
														item = {};
														$('#size_div').hide();

														mui.ajax({
															type: "get",
															url: server + "/api/Info/gkey",
															async: false,
															success: function(data) {
																localStorage.setItem('imc0011GKEY', data);
																IMC0011GKEY.push(localStorage.getItem('imc0011GKEY'));

															}
														});
														break;
													default:
														break;
												}
											}

										})

									} else {
										localStorage.removeItem('PDQR_code');
										localStorage.removeItem('SIZE');
										sizeArr.splice(0, sizeArr.length);
										imc0011items_scqty.splice(0, imc0011items_scqty.length);
										imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
										imc0011items_size.splice(0, imc0011items_size.length);
										sizeArr.splice(0, sizeArr.length);
										item = {};
										$('#size_div').hide()

										mui.ajax({
											type: "get",
											url: server + "/api/Info/gkey",
											async: false,
											success: function(data) {
												localStorage.setItem('imc0011GKEY', data);
												IMC0011GKEY.push(localStorage.getItem('imc0011GKEY'));

											}
										})
									};
									break;
								default:
									break;

							}
						}
					});
					index--;
					//赋值文本框
					$('#materialcn').val(imc0011items[index].materialcn);
					$('#mstkno').val(imc0011items[index].mstkno);
					$('#scqty').val(imc0011items[index].scqty);
					$('#tsqty').val(imc0011items[index].tsqty);

					//后台请求尺码对应出库数量
					if(imc0011items[index].mszsct == '1') {
						$('#tsqty').attr("disabled", true);
						mui.ajax(server + '/api/Outbound/imc0012list', {
							dataType: 'json', //服务器返回json格式数据
							type: 'get', //HTTP请求类型
							async: false,
							data: {
								gkey: imc0011items[index].gkey
							},
							success: function(data) {
								localStorage.setItem('out_size', JSON.stringify(data));
								var vt002 = JSON.parse(localStorage.getItem('out_size'));
								var str = "";
								if(data == 'error') {
									alert('imc0011gkey为空')
								} else if(data == 0) {
									$('#size_div').show();
								} else {

									$('#size_div').show();
									for(i = 0; i < vt002.length; i++) {
										if(vt002[i].tsqty == null) {
											vt002[i].tsqty = ''
										}
										str += '<div class=" border" style="width:100%" >';
										str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
										str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-10px" type="text"' + ' value="' + vt002[i].tsqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'value="' + vt002[i].scqty + '"  />'
										str += '</label>';
										str += '</div>';
									}
									$("#size_div").html(str);

								}
							}
						});
					} else if(imc0011items[index].mszsct == '0') {
						$("input[name='size']").each(function() {
							$(this).val('');
						});
						$('#size_div').hide();
						$('#tsqty').attr("disabled", false);
					};
				} else if(imc0011items[index] != '' || imc0011items[index] != null) {
					mui.ajax({
						type: "get",
						url: server + "/api/Outbound/imc0011",
						async: false,
						data: {
							gkey: imc0011items[index].gkey
						},
						success: function(data) {
							if(data == 'null') {
								alert('没有对应imc0011gkey的资料');
								return;
							} else {
								//本地获取扫码内容
								var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
								//新增尺码相关数据获取	
								var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));

								if(!QR1) {
									//									alert('不删除尺码的更新')
									//后台请求尺码
									mui.ajax({
										type: "get",
										url: server + "/api/Outbound/imc0012list",
										data: {
											gkey: imc0011items[index].gkey
										},
										async: false,
										success: function(data) {
											//											alert(JSON.stringify(data));
											if(data.length == 0) {
												//												alert('这笔资料没有尺码')
											} else {
												localStorage.setItem('out_size', JSON.stringify(data));
											}
										}
									});

									var vt002 = JSON.parse(localStorage.getItem('out_size'));

									//取值文本框
									imc0011items[index].mstkno = $('#mstkno').val().toUpperCase(),
										imc0011items[index].materialcn = $('#materialcn').val(),
										imc0011items[index].scqty = $('#scqty').val(),
										imc0011items[index].tsqty = $('#tsqty').val()

									//获取尺码
									if(imc0011items[index].mszsct == '1') {
										$('#tsqty').attr("disabled", true);
										for(i = 0; i < vt002.length; i++) {
											imc0011items_size.push(vt002[i].size);
										}
										for(i = 0; i < vt002.length; i++) {
											gkey_arr.push(vt002[i].gkey);
										}
										for(i = 0; i < vt002.length; i++) {
											imc0011items_scqty.push(vt002[i].scqty);
										};
										for(i = 0; i < vt002.length; i++) {
											imc0011items_sflag.push(vt002[i].sflag);
										};
										//获取尺码对应出库数量    
										$("input[name='size']").each(function() {
											imc0011items_tsqty.push($(this).val());
										});

										//将所需提交的尺码相关数据整合成一个数组对象
										var arr1 = imc0011items_size;
										var arr2 = imc0011items_tsqty;
										var arr3 = imc0011items_scqty;
										var arr4 = gkey_arr;
										var arr5 = imc0011items_sflag;
										for(var i = 0; i < arr1.length; i++) {
											obj = {};
											obj.size = arr1[i];
											obj.tsqty = arr2[i];
											obj.scqty = arr3[i]
											obj.gkey = arr4[i];
											obj.sflag = arr5[i];
											obj.imc0010gkey = IMC0010gkey;
											obj.imc0011gkey = imc0011items[index].gkey;

											sizeArr.push(obj);
										}
										obj = {};
										gkey_arr.splice(0, gkey_arr.length);
										//																				alert('需更新的尺码数据'+sizeArr)
									} else if(imc0011items[index].mszsct == '0') {
										$('#tsqty').attr("disabled", false);
									};
								} else {
									if(imc0011items[index].mszsct == '1') {
										//										alert('删除尺码的更新')
										//后台删除相应尺码
										mui.ajax({
											type: "delete",
											url: server + "/api/Outbound/imc0012",
											data: {
												gkey: imc0011items[index].gkey
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
										//										alert('QR1.mszsct')
										for(i = 0; i < VTSK002.length; i++) {
											imc0011items_size.push(VTSK002[i].size);
										};
										for(i = 0; i < VTSK002.length; i++) {
											imc0011items_scqty.push(VTSK002[i].scqty);
										};
										for(i = 0; i < VTSK002.length; i++) {
											imc0011items_sflag.push(VTSK002[i].sflag);
										};

										//获取尺码对应出库数量   
										$("input[name='size']").each(function() {
											imc0011items_tsqty.push($(this).val());
										});

										//将所需提交的尺码相关数据整合成一个数组对象
										var arr1 = imc0011items_size;
										var arr2 = imc0011items_tsqty;
										var arr3 = imc0011items_scqty;
										var arr4 = imc0011items_sflag;

										for(var i = 0; i < arr1.length; i++) {
											obj = {};
											obj.size = arr1[i];
											obj.tsqty = arr2[i];
											obj.scqty = arr3[i];
											obj.sflag = arr4[i];
											obj.imc0010gkey = IMC0010gkey;
											obj.imc0011gkey = imc0011items[index].gkey;

											sizeArr.push(obj);
										};

									};

									//获取文本框及相应内容
									imc0011items[index].bgkey = QR1.bgkey,
										imc0011items[index].mtgkey = QR1.mtgkey,
										imc0011items[index].mszsct = QR1.mszsct,
										imc0011items[index].mstkno = QR1.mstkno,
										imc0011items[index].mbarcode = QR1.barcode,
										imc0011items[index].materialcn = $('#materialcn').val(),
										imc0011items[index].scqty = $('#scqty').val(),
										imc0011items[index].tsqty = $('#tsqty').val()

								};

								//更新数据至后台
								mui.ajax({
									type: "put",
									url: server + "/api/Outbound/imc0011",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: imc0011items[index],
									success: function(res) {
										switch(res) {
											case 'gkey_null':
												alert('gkey为空！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'imc0010gkey_null':
												alert('imc0010gkey为空！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'mstkno_null':
												alert('mstkno不可为空！');
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
												localStorage.removeItem('PDQR_code');
												localStorage.removeItem('SIZE');
												//												alert('更新完成！(上一个按钮)');
												imc0011items.splice(index, 1, imc0011items[index]);
												//更新尺码
												if(imc0011items[index].mszsct == '1') {
													//																										alert('更新尺码后，开始展示上一笔资料')
													$('#tsqty').attr("disabled", true);
													mui.ajax({
														type: "put",
														url: server + "/api/Outbound/imc0012list",
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
																case 'error':
																	alert('尺码数据更新失败了！');
																	sizeArr.splice(0, sizeArr.length);
																	return;
																case 'ok':
																	//																	alert('尺码数据更新成功！（上一个按钮）');

																	sizeArr.splice(0, sizeArr.length);
																	imc0011items_scqty.splice(0, imc0011items_scqty.length);
																	imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
																	imc0011items_size.splice(0, imc0011items_size.length);
																	imc0011items_sflag.splice(0, imc0011items_sflag.length);
																	gkey_arr.splice(0, gkey_arr.length);

																	index--;
																	//清空文本框的值				
																	for(i = 0; i < txts.length; i++) {
																		if(txts[i].type == "text") {
																			txts[i].value = "";
																		}
																	};

																	//赋值文本框
																	$('#materialcn').val(imc0011items[index].materialcn);
																	$('#mstkno').val(imc0011items[index].mstkno);
																	$('#scqty').val(imc0011items[index].scqty);
																	$('#tsqty').val(imc0011items[index].tsqty);

																	//后台请求尺码对应出库数量
																	if(imc0011items[index].mszsct == '1') {
																		$('#tsqty').attr("disabled", true);
																		mui.ajax(server + '/api/Outbound/imc0012list', {
																			dataType: 'json', //服务器返回json格式数据
																			type: 'get', //HTTP请求类型
																			async: false,
																			data: {
																				gkey: imc0011items[index].gkey
																			},
																			success: function(data) {
																				localStorage.setItem('out_size', JSON.stringify(data));
																				var vt002 = JSON.parse(localStorage.getItem('out_size'));
																				var str = "";
																				if(data == 'error') {
																					alert('imc0011gkey为空')
																				} else if(data == 0) {
																					$('#size_div').show();
																					$("input[name='size']").each(function() {
																						$(this).val('');
																					});
																				} else {

																					$('#size_div').show();
																					for(i = 0; i < vt002.length; i++) {
																						if(vt002[i].tsqty == null) {
																							vt002[i].tsqty = ''
																						}
																						str += '<div class=" border" style="width:100%" >';
																						str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
																						str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].tsqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'value="' + vt002[i].scqty + '"  />'
																						str += '</label>';
																						str += '</div>';
																					}
																					$("#size_div").html(str);

																				}
																			}
																		});
																	} else if(imc0011items[index].mszsct == '0') {
																		$("input[name='size']").each(function() {
																			$(this).val('');
																		});
																		$('#size_div').hide();
																		$('#tsqty').attr("disabled", false);
																	};

																	//删除按钮显示
																	//																	$("#delete").css("display", "block");
																	break;
																default:
																	break;
															}
														}
													})
												} else if(imc0011items[index].mszsct == '0') {
													//													alert('没有更新尺码，开始展示上一笔资料')
													$('#tsqty').attr("disabled", false);
													//將修改后的數據重新放回數組中的原本位置
													//													imc0011items.splice(index, 1, imc0011items[index]);
													index--;
													//清空文本框的值				
													for(i = 0; i < txts.length; i++) {
														if(txts[i].type == "text") {
															txts[i].value = "";
														}
													};

													//赋值文本框
													$('#materialcn').val(imc0011items[index].materialcn);
													$('#mstkno').val(imc0011items[index].mstkno);
													$('#scqty').val(imc0011items[index].scqty);
													$('#tsqty').val(imc0011items[index].tsqty);

													//后台请求尺码对应出库数量
													if(imc0011items[index].mszsct == '1') {
														$('#tsqty').attr("disabled", true);
														mui.ajax(server + '/api/Outbound/imc0012list', {
															dataType: 'json', //服务器返回json格式数据
															type: 'get', //HTTP请求类型
															async: false,
															data: {
																gkey: imc0011items[index].gkey
															},
															success: function(data) {
																localStorage.setItem('out_size', JSON.stringify(data));
																var vt002 = JSON.parse(localStorage.getItem('out_size'));
																var str = "";
																if(data == 'error') {
																	alert('imc0011gkey为空')
																} else if(data == 0) {
																	$('#size_div').show();
																	$("input[name='size']").each(function() {
																		$(this).val('');
																	});
																} else {

																	$('#size_div').show();
																	for(i = 0; i < vt002.length; i++) {
																		if(vt002[i].tsqty == null) {
																			vt002[i].tsqty = ''
																		}
																		str += '<div class=" border" style="width:100%" >';
																		str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
																		str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].tsqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'value="' + vt002[i].scqty + '"  />'
																		str += '</label>';
																		str += '</div>';
																	}
																	$("#size_div").html(str);

																}
															}
														});
													} else if(imc0011items[index].mszsct == '0') {
														$("input[name='size']").each(function() {
															$(this).val('');
														});
														$('#size_div').hide();
														$('#tsqty').attr("disabled", false);
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
		if(imc0011items[index] != '' && imc0011items[index] != null) {
			mui.confirm("数据已保存,是否确定删除?", "警告", ["是", "否"], function(e) {
				if(e.index == 1) {
					return
				} else if(e.index == 0) {
					mui.ajax(server + '/api/Outbound/imc0011', {
						dataType: 'json', //服务器返回json格式数据
						type: 'delete', //HTTP请求类型
						async: false,
						data: {
							gkey: imc0011items[index].gkey
						},
						success: function(data) {
							if(data == 'ok') {
								imc0011items.splice(index, 1);
								IMC0011GKEY.splice(index, 1);
								alert('删除成功');
								$('#size_div').hide();
								//清空文本框的值				
								for(i = 0; i < txts.length; i++) {
									if(txts[i].type == "text") {
										txts[i].value = "";
									}
								};

								$("input[name='size']").each(function() {
									$(this).val('');
								});

								if(imc0011items[index] != '' && imc0011items[index] != null) {
									//赋值文本框
									$('#materialcn').val(imc0011items[index].materialcn);
									$('#mstkno').val(imc0011items[index].mstkno);
									$('#scqty').val(imc0011items[index].scqty);
									$('#tsqty').val(imc0011items[index].tsqty);

									//后台请求尺码对应出库数量
									if(imc0011items[index].mszsct == '1') {
										$('#tsqty').attr("disabled", true);

										mui.ajax(server + '/api/Outbound/imc0012list', {
											dataType: 'json', //服务器返回json格式数据
											type: 'get', //HTTP请求类型
											async: false,
											data: {
												gkey: imc0011items[index].gkey
											},
											success: function(data) {
												localStorage.setItem('out_size', JSON.stringify(data));
												var vt002 = JSON.parse(localStorage.getItem('out_size'));
												var str = "";
												if(data == 0) {
													//										alert('尺码请求没成功')
													$('#size_div').hide();
												} else {

													for(i = 0; i < vt002.length; i++) {
														if(vt002[i].tsqty == null) {
															vt002[i].tsqty = ''
														}
														str += '<div class=" border" style="width:100%" >';
														str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
														str += '<input style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text" name="size"' + 'onkeyup="control(event,this)"' + ' value="' + vt002[i].tsqty + '" ' + 'value="' + vt002[i].scqty + ' " />';
														str += '</label>';
														str += '</div>';
													}
													$('#size_div').show();
													$("#size_div").html(str);
												}
											}
										});
									} else if(imc0011items[index].mszsct == '0') {
										$('#size_div').hide();
										$('#tsqty').attr("disabled", false);
									}

								} else if(imc0011items[index] == '' || imc0011items[index] == null) {
									//						alert('没有数据了');
									$('#size_div').hide();
									$("#delete").hide();
								};

							} else if(data == 'error') {
								alert('删除失败')
							}
						}
					});
				}
			})
		} else {
			//清空文本框的值				
			for(i = 0; i < txts.length; i++) {
				if(txts[i].type == "text") {
					txts[i].value = "";
				}
			};

			//清除尺码框数据
			$("input[name='size']").each(function() {
				$(this).val('');
			});
			//删除扫码后数据的本地缓存
			localStorage.removeItem('PDQR_code');
			localStorage.removeItem('SIZE');
			//隐藏尺码框
			$('#size_div').hide();
			alert('删除成功');
			var mno = $("#mstkno").val();
			var mcn = $("#materialcn").val();
			var sty = $("#scqty").val();
			var tsty = $("#tsqty").val();
			if((mno === "") && (mcn === "") && (sty === "") && (tsty === "")) {
				$('#delete').css('display', 'none')
			};
		}
	});

	//下一个
	$('#next').on('click', function() {
		//		$("#delete").css("display", "block");
		//先判断input框是否填完	
		var mno = $("#mstkno").val();
		var mcn = $("#materialcn").val();
		var sty = $("#scqty").val();
		var oty = $("#tsqty").val();
		if((mno === "") || (mcn === "") || (sty === "") || (oty === "")) {
			alert("还有数据没填完喔！");
			return false;
		};
		//判断当前index下的数组对象内容是否为空，再进行对应操作
		if(imc0011items[index] != {} && imc0011items[index] != null) {

			//本地获取扫码内容
			var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
			//新增尺码相关数据获取	
			var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
			if(!QR1) {
				//后台请求尺码
				mui.ajax({
					type: "get",
					url: server + "/api/Outbound/imc0012list",
					data: {
						gkey: imc0011items[index].gkey
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

				//取值文本框
				imc0011items[index].mstkno = $('#mstkno').val().toUpperCase(),
					imc0011items[index].materialcn = $('#materialcn').val(),
					imc0011items[index].scqty = $('#scqty').val(),
					imc0011items[index].tsqty = $('#tsqty').val()

				//获取尺码
				if(imc0011items[index].mszsct == '1') {
					$('#tsqty').attr("disabled", true);
					for(i = 0; i < vt002.length; i++) {
						imc0011items_size.push(vt002[i].size);
					}
					for(i = 0; i < vt002.length; i++) {
						gkey_arr.push(vt002[i].gkey);
					}
					for(i = 0; i < vt002.length; i++) {
						imc0011items_scqty.push(vt002[i].scqty);
					};
					for(i = 0; i < vt002.length; i++) {
						imc0011items_sflag.push(vt002[i].sflag);
					};
					//获取尺码对应出库数量   
					$("input[name='size']").each(function() {
						imc0011items_tsqty.push($(this).val());
					});

					//将所需提交的尺码相关数据整合成一个数组对象
					var arr1 = imc0011items_size;
					var arr2 = imc0011items_tsqty;
					var arr3 = imc0011items_scqty;
					var arr4 = gkey_arr;
					var arr5 = imc0011items_sflag;
					for(var i = 0; i < arr1.length; i++) {
						obj = {};
						obj.size = arr1[i];
						obj.tsqty = arr2[i];
						obj.scqty = arr3[i]
						obj.gkey = arr4[i];
						obj.sflag = arr5[i];
						obj.imc0010gkey = IMC0010gkey;
						obj.imc0011gkey = imc0011items[index].gkey;

						sizeArr.push(obj);
					}
					obj = {};
				} else if(imc0011items[index].mszsct == '0') {
					$('#tsqty').attr("disabled", false);
				};
			} else {
				if(imc0011items[index].mszsct == '1') {
					//后台删除相应尺码
					mui.ajax({
						type: "delete",
						url: server + "/api/Outbound/imc0012",
						data: {
							gkey: imc0011items[index].gkey
						},
						async: false,
						success: function(data) {
							//							alert('尺码删除成功')

						}
					});

				};

				//从缓存中获取尺码,库存数量
				if(QR1.mszsct == '1') {
					for(i = 0; i < VTSK002.length; i++) {
						imc0011items_size.push(VTSK002[i].size);
					};
					for(i = 0; i < VTSK002.length; i++) {
						imc0011items_scqty.push(VTSK002[i].scqty);
					};
					for(i = 0; i < VTSK002.length; i++) {
						imc0011items_sflag.push(VTSK002[i].sflag);
					};

					//获取尺码对应出库数量   
					$("input[name='size']").each(function() {
						imc0011items_tsqty.push($(this).val());
					});

					//将所需提交的尺码相关数据整合成一个数组对象
					var arr1 = imc0011items_size;
					var arr2 = imc0011items_tsqty;
					var arr3 = imc0011items_scqty;
					var arr4 = imc0011items_sflag;

					for(var i = 0; i < arr1.length; i++) {
						obj = {};
						obj.size = arr1[i];
						obj.tsqty = arr2[i];
						obj.scqty = arr3[i];
						obj.sflag = arr4[i];
						obj.imc0010gkey = IMC0010gkey;
						obj.imc0011gkey = imc0011items[index].gkey;

						sizeArr.push(obj);
					};

				} else {
					$('#tsqty').attr("disabled", false);
				};

				//获取文本框及相应内容
				imc0011items[index].bgkey = QR1.bgkey,
					imc0011items[index].mtgkey = QR1.mtgkey,
					imc0011items[index].mszsct = QR1.mszsct,
					imc0011items[index].mstkno = QR1.mstkno,
					imc0011items[index].materialcn = $('#materialcn').val(),
					imc0011items[index].scqty = $('#scqty').val(),
					imc0011items[index].tsqty = $('#tsqty').val()
			};
			//更新数据至后台
			mui.ajax({
				type: "put",
				url: server + "/api/Outbound/imc0011",
				async: false,
				headers: {
					'Content-Type': 'application/json'
				},
				data: imc0011items[index],
				success: function(res) {
					switch(res) {
						case 'gkey_null':
							alert('gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'imc0010gkey_null':
							alert('imc0010gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'mstkno_null':
							alert('mstkno不可为空！');
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
							localStorage.removeItem('PDQR_code');
							localStorage.removeItem('SIZE');
							//							alert('更新完成！');
							//更新尺码
							if(imc0011items[index].mszsct == '1') {
								$('#tsqty').attr("disabled", true);
								mui.ajax({
									type: "put",
									url: server + "/api/Outbound/imc0012list",
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
											case 'error':
												alert('尺码数据更新失败了！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'ok':
												//												alert('尺码数据更新成功！');

												sizeArr.splice(0, sizeArr.length);
												imc0011items_scqty.splice(0, imc0011items_scqty.length);
												imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
												imc0011items_sflag.splice(0, imc0011items_sflag.length);
												imc0011items_size.splice(0, imc0011items_size.length);
												gkey_arr.splice(0, gkey_arr.length);
												//將修改后的數據重新放回數組中的原本位置
												imc0011items.splice(index, 1, imc0011items[index]);

												break
											default:
												break
										}
									}
								})
							} else if(imc0011items[index].mszsct == '0') {
								$('#tsqty').attr("disabled", false);
								//將修改后的數據重新放回數組中的原本位置
								imc0011items.splice(index, 1, imc0011items[index]);

							};
							break;
						default:
							break

					};

					$("#mstkno").val('');
					$("#materialcn").val('');
					$("#scqty").val('');
					$("#tsqty").val('');

					$('#size_div').hide();
					$("input[name='size']").each(function() {
						$(this).val('');
					});

				},
			});
			index++;
			//			alert(index);
			//index加1后再判断当前index对应数组对象是否有值
			if(imc0011items[index] != {} && imc0011items[index] != null) {
				item_2 = imc0011items[index];
				//					alert(JSON.stringify(item_2))

				//赋值文本框
				$('#materialcn').val(item_2.materialcn)
				$('#mstkno').val(item_2.mstkno)
				$('#scqty').val(item_2.scqty)
				$('#tsqty').val(item_2.tsqty)

				if(item_2.mszsct == '1') {
					//后台请求尺码对应出库数量
					$('#tsqty').attr("disabled", true);
					mui.ajax(server + '/api/Outbound/imc0012list', {
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
									if(vt002[i].tsqty == null) {
										vt002[i].tsqty = ''
									}
									str += '<div class=" border" style="width:100%" >';
									str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + vt002[i].size + '/' + vt002[i].scqty + ':     ';
									str += '<input style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text" name="size"' + 'onkeyup="control(event,this)"' + ' value="' + vt002[i].tsqty + '" ' + 'value="' + vt002[i].scqty + ' " />';
									str += '</label>';
									str += '</div>';
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
				} else if(item_2.mszsct == '0') {
					$('#tsqty').attr("disabled", false);
				}
			} else {
				$("#delete").css("display", "none");
				mui.ajax({
					type: "get",
					url: server + "/api/Info/gkey",
					async: false,
					success: function(data) {
						localStorage.setItem('imc0011GKEY', data);
						IMC0011GKEY.push(localStorage.getItem('imc0011GKEY'));
					}
				});
			}

		} else if(imc0011items[index] == null || imc0011items[index] == '') {
			//			隐藏删除按钮
			$("#delete").css("display", "none");
			//本地获取扫码内容
			var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
			//			alert(JSON.stringify(QR1));
			//新增尺码相关数据获取	
			var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));

			//获取尺码,库存数量
			if(QR1.mszsct == '1') {
				for(i = 0; i < VTSK002.length; i++) {
					imc0011items_size.push(VTSK002[i].size);
				};
				for(i = 0; i < VTSK002.length; i++) {
					imc0011items_scqty.push(VTSK002[i].scqty);
				};
				for(i = 0; i < VTSK002.length; i++) {
					imc0011items_sflag.push(VTSK002[i].sflag);
				};

				//获取尺码对应出库数量   
				$("input[name='size']").each(function() {
					imc0011items_tsqty.push($(this).val());
				});

				//将所需提交的尺码相关数据整合成一个数组对象
				var arr1 = imc0011items_size;
				var arr2 = imc0011items_tsqty;
				var arr3 = imc0011items_scqty;
				var arr4 = imc0011items_sflag;

				for(var i = 0; i < arr1.length; i++) {
					obj = {};
					obj.size = arr1[i];
					obj.tsqty = arr2[i];
					obj.scqty = arr3[i];
					obj.sflag = arr4[i];
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
				item.mbarcode = QR1.barcode,
				item.bgkey = QR1.bgkey,
				item.mtgkey = QR1.mtgkey,
				item.scqty = $('#scqty').val(),
				item.tsqty = $('#tsqty').val(),
				item.mszsct = QR1.mszsct,
				item.tsdate = $('#tsdate').val();
			//				将文本框数据存进数组

			imc0011items.push(item);
			//			alert(JSON.stringify(imc0011items));
			//提交数据至后台
			mui.ajax({
				type: "post",
				url: server + "/api/Outbound/imc0011",
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
						case 'imc0010gkey_null':
							alert('imc0010gkey为空！');
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
						case 'mr001gkey_null':
							alert('mr001gkey为空！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'error':
							alert('提交失败了！');
							sizeArr.splice(0, sizeArr.length);
							return;
						case 'ok':
							localStorage.removeItem('PDQR_code');
							localStorage.removeItem('SIZE');
							$('#delete').hide();
							//							alert('提交完成！');
							index++;
							if(QR1.mszsct == '1') {
								$('#tsqty').attr("disabled", true);
								mui.ajax({
									type: "post",
									url: server + "/api/Outbound/imc0012list",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: JSON.stringify(sizeArr),
									success: function(res) {
										switch(res) {
											case 'error':
												alert('尺码数据提交失败了！');
												sizeArr.splice(0, sizeArr.length);
												return;
											case 'ok':
												//											alert('尺码数据提交成功！');

												sizeArr.splice(0, sizeArr.length);

												imc0011items_scqty.splice(0, imc0011items_scqty.length);
												imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
												imc0011items_size.splice(0, imc0011items_size.length);
												imc0011items_sflag.splice(0, imc0011items_sflag.length);
												item = {};
												$("#mstkno").val('');
												$("#materialcn").val('');
												$("#scqty").val('');
												$("#tsqty").val('');
												$('#size_div').hide();

												mui.ajax({
													type: "get",
													url: server + "/api/Info/gkey",
													async: false,
													success: function(data) {
														localStorage.setItem('imc0011GKEY', data);
														IMC0011GKEY.push(localStorage.getItem('imc0011GKEY'));
													}
												});

										}
									}
								});
							} else if(QR1.mszsct == '0') {
								sizeArr.splice(0, sizeArr.length);
								imc0011items_scqty.splice(0, imc0011items_scqty.length);
								imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
								imc0011items_size.splice(0, imc0011items_size.length);
								imc0011items_sflag.splice(0, imc0011items_sflag.length);
								item = {};

								$("#mstkno").val('');
								$("#materialcn").val('');
								$("#scqty").val('');
								$("#tsqty").val('');

								$('#size_div').hide();
								mui.ajax({
									type: "get",
									url: server + "/api/Info/gkey",
									async: false,
									success: function(data) {
										localStorage.setItem('imc0011GKEY', data);
										IMC0011GKEY.push(localStorage.getItem('imc0011GKEY'));
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
		var oty = $("#tsqty").val();

		if((mno === "") || (mcn === "") || (sty === "") || (oty === "")) {
			alert("还有数据没填完喔！");
			return false;
		} else {
			//判断当前index下的数组对象内容是否为空，再进行对应操作
			if(imc0011items[index] != {} && imc0011items[index] != null) {

				//客户有可能修改数据，监听input框输入值的变化
				//本地获取扫码内容
				var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
				//新增尺码相关数据获取	
				var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
				if(!QR1) {
					//后台请求尺码
					mui.ajax({
						type: "get",
						url: server + "/api/Outbound/imc0012list",
						data: {
							gkey: imc0011items[index].gkey
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
					imc0011items[index].mstkno = $('#mstkno').val().toUpperCase(),
						imc0011items[index].materialcn = $('#materialcn').val(),
						imc0011items[index].scqty = $('#scqty').val(),
						imc0011items[index].tsqty = $('#tsqty').val()

					//获取尺码
					if(imc0011items[index].mszsct == '1') {
						$('#tsqty').attr("disabled", true);
						for(i = 0; i < vt002.length; i++) {
							imc0011items_size.push(vt002[i].size);
						}
						for(i = 0; i < vt002.length; i++) {
							gkey_arr.push(vt002[i].gkey);
						}
						for(i = 0; i < vt002.length; i++) {
							imc0011items_scqty.push(vt002[i].scqty);
						};
						for(i = 0; i < vt002.length; i++) {
							imc0011items_sflag.push(vt002[i].sflag);
						};
						//获取尺码对应出库数量   
						$("input[name='size']").each(function() {
							imc0011items_tsqty.push($(this).val());
						});

						//将所需提交的尺码相关数据整合成一个数组对象
						var arr1 = imc0011items_size;
						var arr2 = imc0011items_tsqty;
						var arr3 = imc0011items_scqty;
						var arr4 = gkey_arr;
						var arr5 = imc0011items_sflag;
						for(var i = 0; i < arr1.length; i++) {
							obj = {};
							obj.size = arr1[i];
							obj.tsqty = arr2[i];
							obj.scqty = arr3[i]
							obj.gkey = arr4[i];
							obj.sflag = arr5[i];
							obj.imc0010gkey = IMC0010gkey;
							obj.imc0011gkey = imc0011items[index].gkey;

							sizeArr.push(obj);
						}
						obj = {};
					} else if(imc0011items[index].mszsct == '0') {
						$('#tsqty').attr("disabled", false);
					};
				} else {
					if(imc0011items[index].mszsct == '1') {
						//后台删除相应尺码
						mui.ajax({
							type: "delete",
							url: server + "/api/Outbound/imc0012",
							data: {
								gkey: imc0011items[index].gkey
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
							imc0011items_size.push(VTSK002[i].size);
						};
						for(i = 0; i < VTSK002.length; i++) {
							imc0011items_scqty.push(VTSK002[i].scqty);
						};
						for(i = 0; i < VTSK002.length; i++) {
							imc0011items_sflag.push(VTSK002[i].sflag);
						};

						//获取尺码对应出库数量   
						$("input[name='size']").each(function() {
							imc0011items_tsqty.push($(this).val());
						});

						//将所需提交的尺码相关数据整合成一个数组对象
						var arr1 = imc0011items_size;
						var arr2 = imc0011items_tsqty;
						var arr3 = imc0011items_scqty;
						var arr4 = imc0011items_sflag;

						for(var i = 0; i < arr1.length; i++) {
							obj = {};
							obj.size = arr1[i];
							obj.tsqty = arr2[i];
							obj.scqty = arr3[i];
							obj.sflag = arr4[i];
							obj.imc0010gkey = IMC0010gkey;
							obj.imc0011gkey = localStorage.getItem('imc0011GKEY');

							sizeArr.push(obj);
						};

					} else {
						$('#tsqty').attr("disabled", false);
					};

					//获取文本框及相应内容
					imc0011items[index].bgkey = QR1.bgkey,
						imc0011items[index].mtgkey = QR1.mtgkey,
						imc0011items[index].mszsct = QR1.mszsct,
						imc0011items[index].mstkno = QR1.mstkno,
						imc0011items[index].mbarcode = QR1.barcode,
						imc0011items[index].materialcn = $('#materialcn').val(),
						imc0011items[index].scqty = $('#scqty').val(),
						imc0011items[index].tsqty = $('#tsqty').val()

				};

				//更新数据至后台
				mui.ajax({
					type: "put",
					url: server + "/api/Outbound/imc0011",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: imc0011items[index],
					success: function(res) {
						switch(res) {
							case 'gkey_null':
								alert('gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'imc0010gkey_null':
								alert('imc0010gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'mstkno_null':
								alert('mstkno不可为空！');
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
								localStorage.removeItem('PDQR_code');
								localStorage.removeItem('SIZE');
								//								alert('更新完成！');
								//更新尺码
								if(imc0011items[index].mszsct == '1') {
									$('#tsqty').attr("disabled", true);
									mui.ajax({
										type: "put",
										url: server + "/api/Outbound/imc0012list",
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
												case 'error':
													alert('尺码数据更新失败了！');
													sizeArr.splice(0, sizeArr.length);
													return;
												case 'ok':
													//													alert('尺码数据更新成功！');
													sizeArr.splice(0, sizeArr.length);
													mui.ajax(server + '/api/Outbound/pandian/ok', {
														dataType: 'json', //服务器返回json格式数据
														type: 'get', //HTTP请求类型
														timeout: 10000, //超时时间设置为10秒；
														data: {
															gkey: IMC0010gkey
														},
														success: function(result) {
															//																window.location.reload();
															switch(result) {
																case 'gkey_null':
																	alert('imc0010gkey为空');
																	return;
																case 'imc0010_no_exsits':
																	alert('找不到相应的imc0010资料');
																	return;
																case 'error':
																	alert('提交失败');
																	return;

																case 'ok':

																	alert('提交完成');
																	plus.webview.getWebviewById('sub2_PANDIAN_unfinish.html').reload();
																	plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();
																	//頁面跳轉
																	mui.openWindow({
																		url: "/src/PANDIAN/tab-top-webview-main-PD.html",
																		id: "tab-top-webview-main-PD.html"
																	});
																	plus.webview.getWebviewById('sub2_PANDIAN_main.html').close();
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
													//													
											}
										}
									})
								} else if(imc0011items[index].mszsct == '0') {

									mui.ajax(server + '/api/Outbound/pandian/ok', {
										dataType: 'json', //服务器返回json格式数据
										type: 'get', //HTTP请求类型
										timeout: 10000, //超时时间设置为10秒；
										data: {
											gkey: IMC0010gkey
										},
										success: function(result) {
											//																window.location.reload();
											switch(result) {
												case 'gkey_null':
													alert('imc0010gkey为空');
													return;
												case 'imc0010_no_exsits':
													alert('找不到相应的imc0010资料');
													return;
												case 'error':
													alert('提交失败');
													return;

												case 'ok':

													alert('提交完成');
													plus.webview.getWebviewById('sub2_PANDIAN_unfinish.html').reload();
													plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();
													//頁面跳轉
													mui.openWindow({
														url: "/src/PANDIAN/tab-top-webview-main-PD.html",
														id: "tab-top-webview-main-PD.html"
													});
													plus.webview.getWebviewById('sub2_PANDIAN_main.html').close();
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
						alert('失败')
					}
				})

			} else {
				//本地获取扫码内容
				var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
				//新增尺码相关数据获取	
				var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));

				//获取尺码,库存数量
				if(QR1.mszsct == '1') {
					for(i = 0; i < VTSK002.length; i++) {
						imc0011items_size.push(VTSK002[i].size);
					};
					for(i = 0; i < VTSK002.length; i++) {
						imc0011items_scqty.push(VTSK002[i].scqty);
					};
					for(i = 0; i < VTSK002.length; i++) {
						imc0011items_sflag.push(VTSK002[i].sflag);
					};

					//获取尺码对应出库数量   
					$("input[name='size']").each(function() {
						imc0011items_tsqty.push($(this).val());
					});

					//将所需提交的尺码相关数据整合成一个数组对象
					var arr1 = imc0011items_size;
					var arr2 = imc0011items_tsqty;
					var arr3 = imc0011items_scqty;
					var arr4 = imc0011items_sflag;
					for(var i = 0; i < arr1.length; i++) {
						obj = {};
						obj.size = arr1[i];
						obj.tsqty = arr2[i];
						obj.scqty = arr3[i];
						obj.sflag = arr4[i];
						obj.imc0010gkey = IMC0010gkey;
						obj.imc0011gkey = localStorage.getItem('imc0011GKEY');

						sizeArr.push(obj);
					}
				};
								alert(JSON.stringify(sizeArr))
				//获取文本框及相应内容
				item.imc0010gkey = IMC0010gkey,
					item.gkey = localStorage.getItem('imc0011GKEY'),
					item.materialcn = $('#materialcn').val(),
					item.mstkno = QR1.mstkno,
					item.mbarcode = QR1.barcode,
					item.bgkey = QR1.bgkey,
					item.mtgkey = QR1.mtgkey,
					item.scqty = $('#scqty').val(),
					item.tsqty = $('#tsqty').val(),
					item.mszsct = QR1.mszsct,
					item.tsdate = $('#tsdate').val();
				//				将文本框数据存进数组

				imc0011items.push(item);
				var UPsize = JSON.stringify(sizeArr);
				//提交数据至后台
				mui.ajax({
					type: "post",
					url: server + "/api/Outbound/imc0011",
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
							case 'imc0010gkey_null':
								alert('imc0010gkey为空！');
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
							case 'mr001gkey_null':
								alert('mr001gkey为空！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'error':
								alert('提交失败了！');
								sizeArr.splice(0, sizeArr.length);
								return;
							case 'ok':
								localStorage.removeItem('PDQR_code');
								localStorage.removeItem('SIZE');
								//								alert('提交完成！');
								if(QR1.mszsct == '1') {
									$('#tsqty').attr("disabled", true);
									mui.ajax({
										type: "post",
										url: server + "/api/Outbound/imc0012list",
										async: false,
										headers: {
											'Content-Type': 'application/json'
										},
										data: UPsize,
										success: function(res) {
											switch(res) {
												case 'error':
													alert('尺码数据提交失败了！');
													sizeArr.splice(0, sizeArr.length);
													return;
												case 'ok':
													//													alert('尺码数据提交成功！');

													mui.ajax(server + '/api/Outbound/pandian/ok', {
														dataType: 'json', //服务器返回json格式数据
														type: 'get', //HTTP请求类型
														//														timeout: 10000, //超时时间设置为10秒；
														data: {
															gkey: IMC0010gkey
														},
														success: function(result) {
															//															window.location.reload();
															switch(result) {
																case 'gkey_null':
																	alert('imc0010gkey为空');
																	return;
																case 'imc0010_no_exsits':
																	alert('找不到相应的imc0010资料');
																	return;
																case 'error':
																	alert('提交失败');
																	return;

																case 'ok':
																alert('提交完成');
																	plus.webview.getWebviewById('sub2_PANDIAN_unfinish.html').reload();
																	//																	plus.webview.getWebviewById('sub2_PANDIAN_finish.html').reload();
																	plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();
																	//頁面跳轉
																	mui.openWindow({
																		url: "src/PANDIAN/tab-top-webview-main-PD.html",
																		id: "tab-top-webview-main-PD.html"
																	});
																	plus.webview.getWebviewById('sub2_check_main.html').close();
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
									mui.ajax(server + '/api/Outbound/pandian/ok', {
										dataType: 'json', //服务器返回json格式数据
										type: 'get', //HTTP请求类型
										//										timeout: 10000, //超时时间设置为10秒；
										data: {
											gkey: IMC0010gkey
										},
										success: function(result) {
											//											window.location.reload();
											switch(result) {
												case 'gkey_null':
													alert('imc0010gkey为空');
													return;
												case 'imc0010_no_exsits':
													alert('找不到相应的imc0010资料');
													return;
												case 'error':
													alert('提交失败');
													return;

												case 'ok':

													alert('提交完成');

													plus.webview.getWebviewById('sub2_PANDIAN_unfinish.html').reload();
													//													plus.webview.getWebviewById('sub2_PANDIAN_finish.html').reload();
													plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();
													//頁面跳轉
													mui.openWindow({
														url: "/YN_APP_2/src/PANDIAN/tab-top-webview-main-PD.html",
														id: "tab-top-webview-main-PD.html"
													});
													plus.webview.getWebviewById('sub2_check_main.html').close();
													plus.webview.currentWebview().close();
													plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();

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
						alert('失败')
					}

				})

			}

		}
	})
})