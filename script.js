
$("#getImageFromId").click(function (){                 //Function executed on Get image click
	if(!$("#imgurId").val()==""){
		checkAlbum($("#imgurId").val());
		checkImage($("#imgurId").val());
  }else{
    $("#warningAlert").css("display","block");
    $("#warningAlert").html("The input field can't be empty.");
  }
});

$("#signOut").click(function() {                                //Function to logout
 var auth2 = gapi.auth2.getAuthInstance();
 $("#signInButton").css("display","block");
 $("#content").css("display","none");
 auth2.signOut().then(function () {
 });
});

$("#commentSubmit").click(function(){                         //Function executed on Comment button click
  if((!$("#commentText").val()=="")){                           
    var form = new FormData();
    form.append("comment", $("#commentText").val());                          //Get comment text from inputfield

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.imgur.com/3/gallery/"+$("#imgurId").val()+"/comment",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer 7005caec611231a445338b1294f70dbf19124869",
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      alert("Comment submitted sucessfully");
      $("#comments").append('<p class="imageComments">'+$("#commentText").val()+'</p>');
    });

  }else{
    alert("The comment fielf cannot be empty.");
  }
});
function onSuccess(googleUser) {                         //On successful login                         
  $("#welcomeLabel").text("Welcome "+googleUser.getBasicProfile().getName());
  $("#signInButton").css("display","none");
  $("#content").css("display","block");
}
function onFailure(error) {                             //On login failed
 $("#signInButton").css("display","block");
 $("#content").css("display","none");
 alert("Login failed");
 console.log(error);
}
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
function checkId(){
	if($("#flag2").html()=="noresponse2"&&$("#flag1").html()=="noresponse1"){
		$("#warningAlert").css("display","block");
		$("#warningAlert").html("Enter a valid Image ID");
	}
}
function checkAlbum(inputIdText){
		var imageUrl = "https://api.imgur.com/3/gallery/album/"+inputIdText;
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": imageUrl,
			"error":function(result){
				$("#flag1").html("noresponse1");
				checkId();
			},
			"method": "GET",
			"headers": {
				"Authorization": "Client-ID cd63f6451348822"
			}       
		}
		$.ajax(settings).done(function (response1) {
			$("#warningAlert").css("display","none");
			$("#imgurImage").css("display","block");
			$(".displayOnSuccess").css("display","block");
			$("#imgurImage").attr("src",response1.data.images[0].link);
			$("#imageTitle").html(response1.data.title);
			showComments(imageUrl);
		});

}
function checkImage(inputIdText){
	var imageUrl = "https://api.imgur.com/3/gallery/image/"+inputIdText;
		settings = {
			"async": true,
			"crossDomain": true,
			"url": imageUrl,
			"error":function(result){
				$("#flag2").html("noresponse2");
				checkId();
			},
			"method": "GET",
			"headers": {
				"Authorization": "Client-ID cd63f6451348822",
			}
		}
		$.ajax(settings).done(function (response2) {
			if(response2.success){
				$("#warningAlert").css("display","none");
				$("#imgurImage").css("display","block");
				$(".displayOnSuccess").css("display","block");
				$("#imgurImage").attr("src",response2.data.link);
				$("#imageTitle").html(response2.data.title);
				showComments(imageUrl);
			}
		});
}
function showComments(imgUrl){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.imgur.com/3/gallery/"+$("#imgurId").val()+"/comments/",           //URL to fetch comments
    "method": "GET",
    "headers": {
      "Authorization": "Client-ID cd63f6451348822",
    }
  }

  $.ajax(settings).done(function (response) {
    $("#comments").css("display","inline");
    $.each(response.data, function(index, element) {
      $("#comments").append('<p class="imageComments">'+element.comment+'</p>');              //Append comment to #comments div
    });
  });
}

