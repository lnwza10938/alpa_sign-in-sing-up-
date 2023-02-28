var action = "insert";
var id = "";
var hostphp = '../php/userICU.php';
var emailpass;


$(function() {
});

$('form#formT').submit(function(e){
    e.preventDefault();
    
    formData = new FormData(this);
    formData.append('action',action);
    formData.append('id',id);
    $.ajax({
        type: "POST",
        url: hostphp,
        data: formData,
        async: false,
        success: function(res)
        
        {
            alert("กำลังสมัคร");
        }
       ,cache: false,
        contentType: false,
        processData: false
    });
});


$("#pp").click(function() {
    dep();
 });

function hided(){
    $('.yop').hide();
    $('.eop').show();
  }






  $('form#formT3').submit(function(e){
    e.preventDefault();
    alert("กำลังเข้าสู่ระบบ");
    formData = new FormData(this);
    act = "login";
    formData.append('action',act);
    $.ajax({
        type: "POST",
        url: hostphp,
        data: formData,
        async: false,
        success: function(res)
        
        {
            // console.log(JSON.parse(res));
            data = JSON.parse(res)
            if(data.email==''){
                alert('กรอกไม่ผ่านสักอย่าง')
            }else if(data.status==1){
                
                $('#showpage').load('home.html');
            }else{
                alert('กรอกไม่ผ่านสักอย่าง')
            }
            
                edituser = data
                return edituser;
            
        }
       ,cache: false,
        contentType: false,
        processData: false
    });
    
});



function checklogin(){
    $.post(hostphp, {action:"check"},function(git){
        
        data = JSON.parse(git);

        if(data.status != 1){
            $('#showpage').load('register.html');
        }else{
            $('.yop').hide();
            $('#showpage').load('home.html');
            
        }
        if(data.status !=1){
            $('.editU').hide();
        }else{
            $('.editU').show();
        }

        
    })
};
function checkloginhome(){
    $.post(hostphp, {action:"check"},function(git){
        
        data = JSON.parse(git);
        if(data.status !=1){
            $('.editU').hide();
            $('.logout').hide();
            $('.yop').hide();
        }else{
            $('.editU').show();
            $('.logout').show();
            $('.yop').show();
        }

        
    })
};

function logout(){
    $.post(hostphp, {action:"logout"},function(){
        $('#showpage').load('register.html');
        $('.editU').hide()
        $('.yop').show()
    })

};

