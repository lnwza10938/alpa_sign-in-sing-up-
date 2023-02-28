<?php 
if(!session_start())session_start();
function Connect(){
    $server = "localhost";
    $user = "s64209030002";
    $pass = "Pro@123456";
    $db = "P642_64209030002";
    $conn = new mysqli($server,$user,$pass,$db);
    $conn->set_charset('utf8');
    return $conn;
}
function get($sql,$conn){
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $msg['status'] = 1;
        $msg['msg'] = "พบข้อมูล";
        $msg['data'] = $result->fetch_all(MYSQLI_ASSOC);
        $msg['row'] = $result->num_rows;
    }else{
        $msg['status'] = 0;
        $msg['msg'] = "ไม่พบข้อมูล";
        $msg['row'] = $result->num_rows;
    }
    echo json_encode($msg);
}
function update($sql,$message,$conn){
    if($conn->query($sql)){
        $msg['status'] = 1;
        $msg['msg'] = $message." สำเร็จ";
        $msg['icon'] = "success";
    }else{
        $msg['status'] = 0;
        $msg['msg'] = $message." ไม่สำเร็จ";
        $msg['icon'] = "error";
    }
    echo json_encode($msg);
}


?>

