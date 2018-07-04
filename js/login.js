$(document).ready(function() {
	$('#loginFrm').show();

	$('#loginBtn').click(function() {
		var user = $('#loginUser').val().toString();
		var pswd = $('#loginPswd').val();

		if(user == "" || pswd == "") {
			alert("请输入账号或密码.");
			return;
		}

		var myParams = {
			account: user,
			password: pswd
		}

		doLogin(myParams);
	})

	function doLogin(myParams) {
		if(myParams == null || typeof(myParams) === 'undefined') {
			window.alert("账号或密码有误！");
			return;
		}
		server = $('#server').val();

		$.ajax({
			url:server + '/api/token',
			type: 'POST',
			data: {
				username: myParams.account,
				password: myParams.password
			},
			success: function(jResponse) {
//				alert(JSON.stringify(jResponse))
				localStorage.setItem('token', 'Bearer ' + jResponse.token)
				localStorage.setItem('username', jResponse.username)
				localStorage.setItem('login_gkey', jResponse.login_gkey)
				//全局ajax请求载入令牌
				if(localStorage.getItem('token') != null) {
					$.ajaxSetup({
						headers: {
							"Authorization": localStorage.getItem('token')
						}
					});
					//这里写登陆成功之后的逻辑
					mui.toast('登陆成功',{ duration:'long', type:'div' }) 
//					alert('登陆成功')
					$.ajax({
						type: "get",
						url: server+'/api/Info/userinfo',
						async: false,
						data: {
							login_gkey: localStorage.getItem('login_gkey')
						},
						success: function(log) {
							//			alert(JSON.stringify(log))
							localStorage.setItem('user_info', JSON.stringify(log))
						}
					});
					window.location.href = "main.html"
				} else {
					window.location.href = "login.html"
				}
			},
			error: function(jError) {
				if(jError.status == 401) {
					alert("账号或密码错误，请重试！")
				}
				// Handle your error
			}
		});
	}

});