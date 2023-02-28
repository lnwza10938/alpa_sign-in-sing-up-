var edituser;
$('#formT2').hide();

function dep(){
    // console.log(edituser);
    // $.post(hostphp, {action:"select"},function(data){
    //     data = JSON.parse(data).data;
    //     for(var p=0;p<data.length;p++){
    //        if(data[p].id==edituser.id){
    //         console.log(data[p].id);
    //         user = data[p];
    //         row = data
    //         $("#mon").empty();
    //                 $("#mon").append(`
    //                 <tr>
    //                         <td>${user.id}</td>
    //                         <td>${user.username}</td>
    //                         <td>${user.lastname}</td>
    //                         <td>${user.gender}</td>
    //                         <td>${user.email}</td>
    //                         <td>${user.passw}</td>
    //                         <td>${user.date}</td>
    //                         <td><button class="btn btn-primary" onclick="edit('${p}')" >แก้ไข</button></td>
    //                         <td><button class="btn btn-danger" onclick="del('${user.id}')" >ลบ</button></td>
    //                 </tr>
    //                 `)
    //        }
    //     }
        
    // });
};


$.post(hostphp, {action:"edituser"},function(data){

    data = JSON.parse(data).data;
    row = data[0];
    user = row
    
          $("#mon").html(`
          <tr>
                  <td>${user.id}</td>
                  <td>${user.username}</td>
                  <td>${user.lastname}</td>
                  <td>${user.gender}</td>
                  <td>${user.email}</td>
                  <td>${user.passw}</td>
                  <td>${user.date}</td>
                  <td><button class="btn btn-primary" onclick="edit()" >แก้ไข</button></td>
                  <td><button class="btn btn-danger" onclick="del('${user.id}')" >ลบ</button></td>
          </tr>
          `)
       
});


$('form#formT4').submit(function(e){
    console.log("good");
    e.preventDefault();
    alert("เชื่อมต่อ");
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

            // data = JSON.parse(res)
                console.log("goof");
                console.log(data);
                edituser = data;
                
                return edituser,dep();
            
        }
       ,cache: false,
        contentType: false,
        processData: false
    });
    
});







// function loginyu(){
//     linkedit();
//     $.post(hostphp, {action:"select"},function(data){
        
        
//         data = JSON.parse(data).data;
//         console.log(data);
//         console.log(edituser);
//         for(let i = '0'; i < data.length; ++i){
//             console.log(i);
//             if(data[i].id==edituser){
//                 alert("เข้าสู่ระบบ");
//                 hided();
//                 // document.getElementById("eop").innerHTML = edituser.username;
//             }
//         }
//     }); 
//    }


function del(id){
   $.post(hostphp,{action:"del",id:id},function(data){
    
       data = JSON.parse(data);
       if(data.status==1){
           alert("ลบสำเร็จ");
           kll();
       }
   })
};



function edit() {

$('#formT2').show();
console.log(row);
act = "update";



$('#id').val(row.id);
$('#name1').val(row.username);
$('#lname1').val(row.lastname);
$('#gender1').val(row.gender);
$('#email1').val(row.email);
$('#passw1').val(row.passw);
$('#date1').val(row.date);
$('#profile1').val(row.profile);
}




$('form#formT2').submit(function(e){
      e.preventDefault();
      console.log("oo2");
      
      formData = new FormData(this);
      
      formData.append('action',act);
      $.ajax({
          type: "POST",
          url: hostphp,
          data: formData,
          async: false,
          success: function(res)
          {
              alert(res);
              alert("เพิ่มเสร็จ");
              dep();
          }
         ,cache: false,
          contentType: false,
          processData: false
      });
})