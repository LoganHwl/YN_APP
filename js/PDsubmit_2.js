//未完成的盘点操作页的js逻辑文件

$(document).ready(function() {

	//获取imc0010gkey
	var IMC0010GKEY = localStorage.getItem('PDGKEY');
	var item_old;
	var obj_old = {};
	var imc0011items_old = [];
	var index_old = 0;
	var i = 0;
	//后台请求imc0021的数据
	mui.ajax({
		type: "get",
		url: server + "/api/Outbound/imc0010/detail",
		data: {
			gkey: IMC0010GKEY
		},
		async: false,
		success: function(data) {
			//						alert(JSON.stringify(data))
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
					obj_old.tsqty = item_old[i].tsqty;
					obj_old.gkey = item_old[i].imc0011gkey;
					obj_old.imc0010gkey = IMC0010GKEY;
					obj_old.mszsct = item_old[i].mszsct;
					obj_old.mbarcode = item_old[i].mbarcode;
					obj_old.mtgkey = item_old[i].mtgkey;
					obj_old.bgkey = item_old[i].bgkey;

					imc0011items_old.push(obj_old);
				}
				obj_old = {};
				index_old--;
				$('#materialcn').val(imc0011items_old[index_old].materialcn);
				$('#mstkno').val(imc0011items_old[index_old].mstkno);
				$('#scqty').val(imc0011items_old[index_old].scqty);
				$('#tsqty').val(imc0011items_old[index_old].tsqty);
				//后台请求尺码
				mui.ajax({
					type: "get",
					url: server + "/api/Outbound/imc0012list",
					data: {
						gkey: imc0011items_old[index_old].gkey
					},
					async: false,
					success: function(data) {
						//						alert(JSON.stringify(data))
						if(data.length == 0) {
							$('#size_div').hide();
						} else {
							var str = '';
							$('#size_div').show();
							for(var i = 0; i < data.length; i++) {
								if(data[i].tsqty == null) {
									data[i].tsqty = ''
								};
								str += '<div class=" border" style="width:100%" >';
								str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + data[i].size + '/' + data[i].scqty + ':     ';
								str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + data[i].tsqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + data[i].scqty + '\')"' + 'value="' + data[i].scqty + '"  />'
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
	var imc0011items = [];
	var item = {};
	//	var index = 0;
	var obj = {};
	var imc0011items_tsqty = [];
	var imc0011items_size = [];
	var imc0011items_scqty = [];
	var imc0011items_sflag = [];
	var sizeArr = [];
	var txts = document.getElementsByTagName("input");

	//更新用
	var gkey_arr = [];

	//上一个
	$('#last').on('click', function() {
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

			if(index_old == 0) {
				alert('已经是第一笔了！')
				return
			} else if(index_old > 0) {

				//								alert('第一个index_old > 0');
				index_old--;
				//				$("#delete").css("display", "block");
				//赋值文本框
				$('#materialcn').val(imc0011items_old[index_old].materialcn);
				$('#mstkno').val(imc0011items_old[index_old].mstkno);
				$('#scqty').val(imc0011items_old[index_old].scqty);
				$('#tsqty').val(imc0011items_old[index_old].tsqty);
				$('#delete').show();
				//后台请求尺码对应出库数量
				mui.ajax({
					type: "get",
					url: server + "/api/Outbound/imc0012list",
					data: {
						gkey: imc0011items_old[index_old].gkey
					},
					async: false,
					success: function(data) {
						if(data.length == 0) {

							$('#size_div').hide();
						} else {
							var str = '';
							$('#size_div').show();
							for(var i = 0; i < data.length; i++) {
								if(data[i].tsqty == null) {
									data[i].tsqty = ''
								}
								str += '<div class=" border" style="width:100%" >';
								str += '<label style="width:16px;height:52px;font-size:16px; margin-left:-15px;"> ' + data[i].size + '/' + data[i].scqty + ':     ';
								str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + data[i].tsqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + data[i].scqty + '\')"' + 'placeholder="库存数量  ' + data[i].scqty + '"  />'
								str += '</label>';
								str += '</div>';
							}
							$("#size_div").html(str);
						}
					}
				})

			}

		} else if((mno === "") || (mcn === "") || (sty === "") || (oty === "")) {
			$('#delete').css('display', 'block')
			alert('当前这笔资料还没填完！');
			return
		} else {
			$('#delete').css('display', 'block')
			if(index_old == 0) {
				alert('已经是第一笔了！')
				return
			} else if(index_old > 0) {

				//判断imc0011gkey对应这笔数据是否已在数据库
				if(imc0011items_old[index_old] == '' || imc0011items_old[index_old] == null) {
					//本地获取扫码内容
					var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
					//新增尺码相关数据获取	
					var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
					for(var i = 0; i < imc0011items_old.length; i++) {
						if(QR1.mstkno === imc0011items_old[i].mstkno) {
							alert('同一个批号对应的材料编号不可重复');
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
								$('#delete').css('display','none')
							return
						}
					}
					//先产生一个imc0021gkey
					mui.ajax({
						type: "get",
						url: server + "/api/Info/gkey",
						async: false,
						success: function(data) {
							localStorage.setItem('imc0011GKEY', data);
						}
					});

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
							obj.imc0010gkey = IMC0010GKEY;
							obj.imc0011gkey = localStorage.getItem('imc0011GKEY');

							sizeArr.push(obj);
						};

					}

					//获取文本框及相应内容
					item.imc0010gkey = IMC0010GKEY,
						item.gkey = localStorage.getItem('imc0011GKEY'),
						item.materialcn = $('#materialcn').val(),
						item.mstkno = QR1.mstkno,
						item.mbarcode = QR1.barcode,
						item.bgkey = QR1.bgkey,
						item.mtgkey = QR1.mtgkey,
						item.scqty = $('#scqty').val(),
						item.tsqty = $('#tsqty').val(),
						item.mszsct = QR1.mszsct,
						item.tsdate = $('#tsdate').val()
					//				将文本框数据存进数组

					imc0011items_old.push(item);
					//提交数据至后台
					mui.ajax({
						type: "put",
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
											type: "put",
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

															}
														});
														break;
													default:
														break;
												}
											}

										})

									} else {
										sizeArr.splice(0, sizeArr.length);
										imc0011items_scqty.splice(0, imc0011items_scqty.length);
										imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
										imc0011items_size.splice(0, imc0011items_size.length);
										imc0011items_sflag.splice(0, imc0011items_sflag.length);
										sizeArr.splice(0, sizeArr.length);
										item = {};
										$('#size_div').hide()

										mui.ajax({
											type: "get",
											url: server + "/api/Info/gkey",
											async: false,
											success: function(data) {
												localStorage.setItem('imc0011GKEY', data);

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
					$('#materialcn').val(imc0011items_old[index_old].materialcn);
					$('#mstkno').val(imc0011items_old[index_old].mstkno);
					$('#scqty').val(imc0011items_old[index_old].scqty);
					$('#tsqty').val(imc0011items_old[index_old].tsqty);

					//后台请求尺码对应出库数量
					if(imc0011items_old[index_old].mszsct == '1') {
						$('#tsqty').attr("disabled", true);
						mui.ajax(server + '/api/Outbound/imc0012list', {
							dataType: 'json', //服务器返回json格式数据
							type: 'get', //HTTP请求类型
							async: false,
							data: {
								gkey: imc0011items_old[index_old].gkey
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
					} else if(imc0011items_old[index_old].mszsct == '0') {
						$("input[name='size']").each(function() {
							$(this).val('');
						});
						$('#size_div').hide();
						$('#tsqty').attr("disabled", false);
					};

					//删除按钮显示

				} else if(imc0011items_old[index_old] != '' || imc0011items_old[index_old] != null) {
					mui.ajax({
						type: "get",
						url: server + "/api/Outbound/imc0011",
						async: false,
						data: {
							gkey: imc0011items_old[index_old].gkey
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
									//后台请求尺码
									mui.ajax({
										type: "get",
										url: server + "/api/Outbound/imc0012list",
										data: {
											gkey: imc0011items_old[index_old].gkey
										},
										async: false,
										success: function(data) {
											if(data.length != 0) {

												localStorage.setItem('out_size', JSON.stringify(data));

											};
										}
									});

									var vt002 = JSON.parse(localStorage.getItem('out_size'));

									//取值文本框
									imc0011items_old[index_old].mstkno = $('#mstkno').val().toUpperCase(),
										imc0011items_old[index_old].materialcn = $('#materialcn').val(),
										imc0011items_old[index_old].scqty = $('#scqty').val(),
										imc0011items_old[index_old].tsqty = $('#tsqty').val()

									//获取尺码
									if(imc0011items_old[index_old].mszsct == '1') {
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
											obj.imc0010gkey = IMC0010GKEY;
											obj.imc0011gkey = imc0011items_old[index_old].gkey;

											sizeArr.push(obj);
										}
										obj = {};
									} else if(imc0011items_old[index_old].mszsct == '0') {
										$('#tsqty').attr("disabled", false);
									};
								} else {
									if(imc0011items_old[index_old].mszsct == '1') {
										//后台删除相应尺码
										mui.ajax({
											type: "delete",
											url: server + "/api/Outbound/imc0012",
											data: {
												gkey: imc0011items_old[index_old].gkey
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
											obj.imc0010gkey = IMC0010GKEY;
											obj.imc0011gkey = imc0011items_old[index_old].gkey;

											sizeArr.push(obj);
										};

									};

									//获取文本框及相应内容
									imc0011items_old[index_old].bgkey = QR1.bgkey,
										imc0011items_old[index_old].mtgkey = QR1.mtgkey,
										imc0011items_old[index_old].mszsct = QR1.mszsct,
										imc0011items_old[index_old].mstkno = QR1.mstkno,
										imc0011items_old[index_old].mbarcode = QR1.barcode,
										imc0011items_old[index_old].materialcn = $('#materialcn').val(),
										imc0011items_old[index_old].scqty = $('#scqty').val(),
										imc0011items_old[index_old].tsqty = $('#tsqty').val()
								};

								//更新数据至后台
								mui.ajax({
									type: "put",
									url: server + "/api/Outbound/imc0011",
									async: false,
									headers: {
										'Content-Type': 'application/json'
									},
									data: imc0011items_old[index_old],
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
												//											alert('更新完成！(上一个按钮)');
												imc0011items_old.splice(index_old, 1, imc0011items_old[index_old]);
												//更新尺码
												if(imc0011items_old[index_old].mszsct == '1') {
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
																	sizeArr.splice(0, sizeArr.length);

																	index_old--;
																	//清空文本框的值				
																	for(i = 0; i < txts.length; i++) {
																		if(txts[i].type == "text") {
																			txts[i].value = "";
																		}
																	};

																	//赋值文本框
																	$('#materialcn').val(imc0011items_old[index_old].materialcn);
																	$('#mstkno').val(imc0011items_old[index_old].mstkno);
																	$('#scqty').val(imc0011items_old[index_old].scqty);
																	$('#tsqty').val(imc0011items_old[index_old].tsqty);

																	//后台请求尺码对应出库数量
																	if(imc0011items_old[index_old].mszsct == '1') {
																		$('#tsqty').attr("disabled", true);
																		mui.ajax(server + '/api/Outbound/imc0012list', {
																			dataType: 'json', //服务器返回json格式数据
																			type: 'get', //HTTP请求类型
																			async: false,
																			data: {
																				gkey: imc0011items_old[index_old].gkey
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
																	} else if(imc0011items_old[index_old].mszsct == '0') {
																		$("input[name='size']").each(function() {
																			$(this).val('');
																		});
																		$('#size_div').hide();
																		$('#tsqty').attr("disabled", false);
																	};

																	//删除按钮显示
																	$("#delete").css("display", "block");
																	break;
																default:
																	break;
															}
														}
													})
												} else if(imc0011items_old[index_old].mszsct == '0') {
													$('#tsqty').attr("disabled", false);
													//將修改后的數據重新放回數組中的原本位置
													//													imc0011items_old.splice(index_old, 1, imc0011items_old[index_old]);
													index_old--;
													//清空文本框的值				
													for(i = 0; i < txts.length; i++) {
														if(txts[i].type == "text") {
															txts[i].value = "";
														}
													};

													//赋值文本框
													$('#materialcn').val(imc0011items_old[index_old].materialcn);
													$('#mstkno').val(imc0011items_old[index_old].mstkno);
													$('#scqty').val(imc0011items_old[index_old].scqty);
													$('#tsqty').val(imc0011items_old[index_old].tsqty);

													//后台请求尺码对应出库数量
													if(imc0011items_old[index_old].mszsct == '1') {
														$('#tsqty').attr("disabled", true);
														mui.ajax(server + '/api/Outbound/imc0012list', {
															dataType: 'json', //服务器返回json格式数据
															type: 'get', //HTTP请求类型
															async: false,
															data: {
																gkey: imc0011items_old[index_old].gkey
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
													} else if(imc0011items_old[index_old].mszsct == '0') {
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
		if(imc0011items_old[index_old] != '' && imc0011items_old[index_old] != null) {
			mui.confirm("数据已保存,是否确定删除?", "警告", ["是", "否"], function(e) {
				if(e.index == 1) {
					return
				} else if(e.index == 0) {
					mui.ajax(server + '/api/Outbound/imc0011', {
						dataType: 'json', //服务器返回json格式数据
						type: 'delete', //HTTP请求类型
						async: false,
						data: {
							gkey: imc0011items_old[index_old].gkey
						},
						success: function(data) {
							if(data == 'ok') {
								imc0011items_old.splice(index_old, 1);
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

								if(imc0011items_old[index_old] != '' && imc0011items_old[index_old] != null) {
									//赋值文本框
									$('#materialcn').val(imc0011items_old[index_old].materialcn);
									$('#mstkno').val(imc0011items_old[index_old].mstkno);
									$('#scqty').val(imc0011items_old[index_old].scqty);
									$('#tsqty').val(imc0011items_old[index_old].tsqty);

									//后台请求尺码对应出库数量
									if(imc0011items_old[index_old].mszsct == '1') {

										$('#tsqty').attr("disabled", true);

										mui.ajax(server + '/api/Outbound/imc0012list', {
											dataType: 'json', //服务器返回json格式数据
											type: 'get', //HTTP请求类型
											async: false,
											data: {
												gkey: imc0011items_old[index_old].gkey
											},
											success: function(data) {
												localStorage.setItem('out_size', JSON.stringify(data));
												var vt002 = JSON.parse(localStorage.getItem('out_size'));
												var str = "";

												if(data == 0) {
													alert('尺码请求没成功')
													//							$('#size_div').hide();
												} else {

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
													$('#size_div').show();
												}
											}
										});
									} else if(imc0011items_old[index_old].mszsct == '0') {
										$('#tsqty').attr("disabled", false);
										$('#size_div').hide();
									}

								} else if(imc0011items_old[index_old] == '' || imc0011items_old[index_old] == null) {
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

			//清除尺码框数据
			$("input[name='size']").each(function() {
				$(this).val('');
			});
			//删除扫码后数据的本地缓存
			localStorage.removeItem('PDQR_code')
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
		//		$('#delete').css('display','block')
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
		if(imc0011items_old[index_old] != {} && imc0011items_old[index_old] != null) {
			$('#delete').css('display', 'block')
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
						gkey: imc0011items_old[index_old].gkey
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
				//				alert(JSON.stringify(imc0011items_old[index_old]));
				imc0011items_old[index_old].mstkno = $('#mstkno').val().toUpperCase(),
					imc0011items_old[index_old].materialcn = $('#materialcn').val(),
					imc0011items_old[index_old].scqty = $('#scqty').val(),
					imc0011items_old[index_old].tsqty = $('#tsqty').val(),
					imc0011items_old[index_old].mtgkey = imc0011items_old[index_old].mtgkey;
				imc0011items_old[index_old].mbarcode = imc0011items_old[index_old].mbarcode;
				imc0011items_old[index_old].bgkey = imc0011items_old[index_old].bgkey;

				//获取尺码
				if(imc0011items_old[index_old].mszsct == '1') {
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
						obj.imc0010gkey = IMC0010GKEY;
						obj.imc0011gkey = imc0011items_old[index_old].gkey;

						sizeArr.push(obj);
					}
					arr3.splice(0, arr3.length);
					obj = {};
					localStorage.removeItem('out_size')
				} else if(imc0011items_old[index_old].mszsct == '0') {
					$('#tsqty').attr("disabled", false);
				};
			} else {
				if(imc0011items_old[index_old].mszsct == '1') {
					//后台删除相应尺码
					mui.ajax({
						type: "delete",
						url: server + "/api/Outbound/imc0012",
						data: {
							gkey: imc0011items_old[index_old].gkey
						},
						async: false,
						success: function(data) {
							//							alert('尺码删除成功')

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
						obj.imc0010gkey = IMC0010GKEY;
						obj.imc0011gkey = imc0011items_old[index_old].gkey;

						sizeArr.push(obj);
					};

				} else {
					$('#tsqty').attr("disabled", false);
				};

				//获取文本框及相应内容
				imc0011items_old[index_old].bgkey = QR1.bgkey,
					imc0011items_old[index_old].mtgkey = QR1.mtgkey,
					imc0011items_old[index_old].mszsct = QR1.mszsct,
					imc0011items_old[index_old].mstkno = QR1.mstkno,
					imc0011items_old[index_old].mbarcode = QR1.barcode,
					imc0011items_old[index_old].materialcn = $('#materialcn').val(),
					imc0011items_old[index_old].scqty = $('#scqty').val(),
					imc0011items_old[index_old].tsqty = $('#tsqty').val()

			};
			//更新数据至后台
			mui.ajax({
				type: "put",
				url: server + "/api/Outbound/imc0011",
				async: false,
				headers: {
					'Content-Type': 'application/json'
				},
				data: imc0011items_old[index_old],
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
							//更新尺码
							if(imc0011items_old[index_old].mszsct == '1') {
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
												imc0011items_size.splice(0, imc0011items_size.length);
												imc0011items_sflag.splice(0, imc0011items_sflag.length);
												gkey_arr.splice(0, gkey_arr.length);
												//將修改后的數據重新放回數組中的原本位置
												imc0011items_old.splice(index_old, 1, imc0011items_old[index_old]);
												break
											default:
												break
												//													
										}
									}
								})
							} else if(imc0011items_old[index_old].mszsct == '0') {
								$('#tsqty').attr("disabled", false);
								//將修改后的數據重新放回數組中的原本位置
								imc0011items_old.splice(index_old, 1, imc0011items_old[index_old]);

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

			index_old++;

			//index加1后再判断当前index对应数组对象是否有值
			if(imc0011items_old[index_old] != {} && imc0011items_old[index_old] != null) {
				$('#delete').css('display', 'block')
				item_2 = imc0011items_old[index_old];

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
									str += '<input name="size" style="width:160px;height:52px; font-size:16px;margin-left:-1px;padding:1px" type="text"' + ' value="' + vt002[i].tsqty + '" onkeyup="control(event,this)"' + 'onclick="Compare(this,\'' + vt002[i].scqty + '\')"' + 'value="' + vt002[i].scqty + '"  />'
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
					$('#tsqty').attr("disabled", false);
				}
			} else {
				$('#delete').css('display', 'none')
				//先产生一个imc0011gkey
				mui.ajax({
					type: "get",
					url: server + "/api/Info/gkey",
					async: false,
					success: function(data) {
						localStorage.setItem('imc0011GKEY', data);
					}
				});
			}
		} else if(imc0011items_old[index_old] == null || imc0011items_old[index_old] == '') {
			$("#delete").css("display", "none");
			//本地获取扫码内容
			var QR1 = JSON.parse(localStorage.getItem('PDQR_code'));
			//新增尺码相关数据获取	
			var VTSK002 = JSON.parse(localStorage.getItem('SIZE'));
			for(var i = 0; i < imc0011items_old.length; i++) {
						if(QR1.mstkno === imc0011items_old[i].mstkno) {
							alert('同一个批号对应的材料编号不可重复');
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
								$('#delete').css('display','none')
							return
						}
					}
			//先产生一个imc0011gkey
			mui.ajax({
				type: "get",
				url: server + "/api/Info/gkey",
				async: false,
				success: function(data) {
					localStorage.setItem('imc0011GKEY', data);
				}
			});
			

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
					obj.imc0010gkey = IMC0010GKEY;
					obj.imc0011gkey = localStorage.getItem('imc0011GKEY');

					sizeArr.push(obj);
				};
			};

			//获取文本框及相应内容
			item.imc0010gkey = IMC0010GKEY,
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

			imc0011items_old.push(item);
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
							//							alert('提交完成！');
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
												//												alert('尺码数据提交成功！');

												sizeArr.splice(0, sizeArr.length);
												index_old++;
												$("#mstkno").val('');
												$("#materialcn").val('');
												$("#scqty").val('');
												$("#tsqty").val('');
												imc0011items_scqty.splice(0, imc0011items_scqty.length);
												imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
												imc0011items_size.splice(0, imc0011items_size.length);
												imc0011items_sflag.splice(0, imc0011items_sflag.length);
												sizeArr.splice(0, sizeArr.length);
												item = {};
												$('#size_div').hide();
												$('#delete').hide()

												mui.ajax({
													type: "get",
													url: server + "/api/Info/gkey",
													async: false,
													success: function(data) {
														localStorage.setItem('imc0011GKEY', data);
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
								$("#tsqty").val('');
								$('#delete').hide()

								imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
								imc0011items_size.splice(0, imc0011items_size.length);
								imc0011items_scqty.splice(0, imc0011items_scqty.length);
								sizeArr.splice(0, sizeArr.length);
								item = {};
								$('#size_div').hide();

								mui.ajax({
									type: "get",
									url: server + "/api/Info/gkey",
									async: false,
									success: function(data) {
										localStorage.setItem('imc0011GKEY', data);
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
			if(imc0011items_old[index_old] != {} && imc0011items_old[index_old] != null) {

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
							gkey: imc0011items_old[index_old].gkey
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
					imc0011items_old[index_old].mstkno = $('#mstkno').val().toUpperCase(),
						imc0011items_old[index_old].materialcn = $('#materialcn').val(),
						imc0011items_old[index_old].scqty = $('#scqty').val(),
						imc0011items_old[index_old].tsqty = $('#tsqty').val()

					//获取尺码
					if(imc0011items_old[index_old].mszsct == '1') {
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
							obj.imc0010gkey = IMC0010GKEY;
							obj.imc0011gkey = imc0011items_old[index_old].gkey;

							sizeArr.push(obj);
						}
						obj = {};
						localStorage.removeItem('out_size')
					} else if(imc0011items_old[index_old].mszsct == '0') {
						$('#tsqty').attr("disabled", false);
					};
				} else {
					if(imc0011items_old[index_old].mszsct == '1') {
						//后台删除相应尺码
						mui.ajax({
							type: "delete",
							url: server + "/api/Outbound/imc0012",
							data: {
								gkey: imc0011items_old[index_old].gkey
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
							obj.imc0010gkey = IMC0010GKEY;
							obj.imc0011gkey = imc0011items_old[index_old].gkey;

							sizeArr.push(obj);
						};

					} else {
						$('#tsqty').attr("disabled", false);
					};

					//获取文本框及相应内容
					imc0011items_old[index_old].bgkey = QR1.bgkey,
						imc0011items_old[index_old].mtgkey = QR1.mtgkey,
						imc0011items_old[index_old].mszsct = QR1.mszsct,
						imc0011items_old[index_old].mstkno = QR1.mstkno,
						imc0011items_old[index_old].mbarcode = QR1.barcode,
						imc0011items_old[index_old].materialcn = $('#materialcn').val(),
						imc0011items_old[index_old].scqty = $('#scqty').val(),
						imc0011items_old[index_old].tsqty = $('#tsqty').val()

				};
				//更新数据至后台
				mui.ajax({
					type: "put",
					url: server + "/api/Outbound/imc0011",
					async: false,
					headers: {
						'Content-Type': 'application/json'
					},
					data: imc0011items_old[index_old],
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
								//								alert('更新完成！');
								//更新尺码
								if(imc0011items_old[index_old].mszsct == '1') {
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
													localStorage.removeItem('PDQR_code');
													localStorage.removeItem('SIZE');
													//													alert('尺码数据更新成功！');

													mui.ajax(server + '/api/Outbound/pandian/ok', {
														dataType: 'json', //服务器返回json格式数据
														type: 'get', //HTTP请求类型
														timeout: 10000, //超时时间设置为10秒；
														data: {
															gkey: IMC0010GKEY
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
																	sizeArr.splice(0, sizeArr.length);

																	imc0011items_scqty.splice(0, imc0011items_scqty.length);
																	imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
																	imc0011items_size.splice(0, imc0011items_size.length);
																	imc0011items_sflag.splice(0, imc0011items_sflag.length);
																	item = {};

																	plus.webview.getWebviewById('sub2_PANDIAN_unfinish.html').reload();
																	plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();
																	//頁面跳轉
																	mui.openWindow({
																		url: "/src/PANDIAN/tab-top-webview-main-PD.html",
																		id: "tab-top-webview-main-PD.html"
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
								} else if(imc0011items_old[index_old].mszsct == '0') {
									mui.ajax(server + '/api/Outbound/pandian/ok', {
										dataType: 'json', //服务器返回json格式数据
										type: 'get', //HTTP请求类型
										timeout: 10000, //超时时间设置为10秒；
										data: {
											gkey: IMC0010GKEY
										},
										success: function(result) {
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
													sizeArr.splice(0, sizeArr.length);

													imc0011items_scqty.splice(0, imc0011items_scqty.length);
													imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
													imc0011items_size.splice(0, imc0011items_size.length);
													imc0011items_sflag.splice(0, imc0011items_sflag.length);
													item = {};

													plus.webview.getWebviewById('sub2_PANDIAN_unfinish.html').reload();
													plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();
													//頁面跳轉
													mui.openWindow({
														url: "/src/PANDIAN/tab-top-webview-main-PD.html",
														id: "tab-top-webview-main-PD.html"
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

					//先产生一个imc0021gkey
					mui.ajax({
						type: "get",
						url: server + "/api/Info/gkey",
						async: false,
						success: function(data) {
							localStorage.setItem('imc0011GKEY', data);
						}
					});

					for(var i = 0; i < arr1.length; i++) {
						obj = {};
						obj.size = arr1[i];
						obj.tsqty = arr2[i];
						obj.scqty = arr3[i];
						obj.sflag = arr4[i];
						obj.imc0010gkey = IMC0010GKEY;
						obj.imc0011gkey = localStorage.getItem('imc0011GKEY');

						sizeArr.push(obj);
					};

				};

				//获取文本框及相应内容
				item.imc0010gkey = IMC0010GKEY,
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

				imc0011items_old.push(item);
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
														timeout: 10000, //超时时间设置为10秒；
														data: {
															gkey: IMC0010GKEY
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
																	sizeArr.splice(0, sizeArr.length);

																	imc0011items_scqty.splice(0, imc0011items_scqty.length);
																	imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
																	imc0011items_size.splice(0, imc0011items_size.length);
																	imc0011items_sflag.splice(0, imc0011items_sflag.length);
																	item = {};

																	plus.webview.getWebviewById('sub2_PANDIAN_unfinish.html').reload();
																	//																	plus.webview.getWebviewById('sub2_PANDIAN_finish.html').reload();
																	plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();
																	mui.openWindow({
																		url: "/src/PANDIAN/tab-top-webview-main-PD.html",
																		id: "tab-top-webview-main-PD.html"
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
									mui.ajax(server + '/api/Outbound/pandian/ok', {
										dataType: 'json', //服务器返回json格式数据
										type: 'get', //HTTP请求类型
										timeout: 10000, //超时时间设置为10秒；
										data: {
											gkey: IMC0010GKEY
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
													sizeArr.splice(0, sizeArr.length);

													imc0011items_scqty.splice(0, imc0011items_scqty.length);
													imc0011items_tsqty.splice(0, imc0011items_tsqty.length);
													imc0011items_size.splice(0, imc0011items_size.length);
													imc0011items_sflag.splice(0, imc0011items_sflag.length);
													item = {};

													plus.webview.getWebviewById('sub2_PANDIAN_unfinish.html').reload();
													//													plus.webview.getWebviewById('sub2_PANDIAN_finish.html').reload();
													plus.webview.getWebviewById('tab-top-webview-main-PD.html').reload();
													//頁面跳轉
													mui.openWindow({
														url: "/src/PANDIAN/tab-top-webview-main-PD.html",
														id: "tab-top-webview-main-PD.html"
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