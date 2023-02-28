<?php 

ini_set("display_errors",1);
require("conn.php");
$conn = Connect();
$act = $_POST['action'];




  if($act=="insert"){
    $name = $_POST['name'];
    $lname = $_POST['lname'];
    $gender = $_POST['gender'];
    $email = $_POST['email'];
    $passw = $_POST['passw'];
    $date = $_POST['date'];
    $profile = $_POST['profile'];
    $appointment = $_POST['appointment'];


    $sql = "INSERT INTO `patient1`( `username`, `lastname`, `gender`, `email`, `passw`, `date`, `profile`, `appointment`) 
            VALUES ('$name','$lname','$gender','$email','$passw','$date','$profile','$appointment')";

    $result = update($sql,"บันทึกสำเร็จ",$conn);
    
  };






  

  if($act=="select"){
    $sql = "SELECT * FROM `patient1`";
    echo get($sql,$conn);
  }

  if($act=="select-1"){
    $id = $_POST["id"];
    $sql = "SELECT `id`, `username`, `lastname`, `email`, `passw`, `status`, `type`, `phone` FROM `patient1` WHERE 1";
    echo get($sql,$conn);
  }


  if($act=="del"){
    $id = $_POST["id"];
    $sql = "DELETE FROM `patient1` WHERE id='$id' " ;
    echo update($sql,"ลบ",$conn);
  }

  if($act=="update"){
    $id = $_POST["id"];
    $name = $_POST['name1'];
    $lname = $_POST['lname1'];
    $gender = $_POST['gender1'];
    $email = $_POST['email1'];
    $passw = $_POST['passw1'];
    $date = $_POST['date1'];
    $profile = $_POST['profile1'];
    $appointment = $_POST['appointment1'];

    $sql = "UPDATE `patient1` SET `username`='$name',`lastname`='$lname',`gender`='$gender',`email`='$email',`passw`='$passw',`date`='$date',`profile`='$profile',`appointment`='$appointment' WHERE id='$id'";
    
    echo update($sql,"แก้ไขสำเร็จ",$conn);
  }



  if($act=="login"){

    $email = $_POST['email1'];
    $passw = $_POST['passw1'];
    $sql = "SELECT `id`, `username`, `lastname`, `gender`, `email`, `passw`, `status`, `type`, `date` FROM `patient1` 
    WHERE email='$email' AND passw = '$passw'";

    $result = $conn->query($sql);
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
          $_SESSION['email'] = $row['email'];
          $_SESSION['id'] = $row['id'];
          $_SESSION['status'] = 1;



          $msg['email'] = $_SESSION['email'];
          $msg['id'] = $_SESSION['id'];
          $msg['status'] = 1;
          $msg['msg'] = "พบข้อมูล";

        };

    }else{
        $msg['status'] = 0;
        $msg['msg'] = "ไม่พบข้อมูล";
        $msg['row'] = $result->num_rows;

    }
    echo json_encode($msg);

    
  }

  if($act=="check"){
    if($_SESSION['status']==1){
      $msg['status'] = 1;
      $msg['msg'] = "พบข้อมูล";
      $msg['email'] = $_SESSION['email'];
      $msg['id'] = $_SESSION['id'];

    }else{
      $msg['status'] = 0;
      $msg['msg'] = "ไม่พบข้อมูล";
    }
    echo json_encode($msg);
  };

  if($act=="logout"){
    if(session_destroy()){
      $msg['status'] = 0;
      $msg['msg'] = "You have been logged out";
    }
    echo json_encode($msg);
  };




if($act=="edituser"){
  $id = $_SESSION['id'];
  $sql = "SELECT * FROM `patient1` WHERE id = '$id'";
  
  echo get($sql,$conn);
  
}


?>