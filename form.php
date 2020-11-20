<?php

if (isset($_POST['submit'])){
    $name = $_POST['name'];
    $lastname = $_POST['lastname'];
    $email = $_POST['email'];
    $movie = $_POST['movie'];
    $textarea = $_POST['textarea'];
    
    $errorEmpty= false;
    $errorEmail= false;

    if (empty($name) || empty($lastname) || empty($email) || empty($textarea)) {
        echo "<span class='form-error'>Fill in all the fields!</span>";
        $errorEmpty = true;
    }
    
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)){ 
        echo "<span class='form-error'>Write a valid e-mail address</span>";
        $errorEmail = true;
    }
    else {
        echo "<span class='form-success'>Form success!</span>";
    }


}

else {
    echo "<span>There was an error!</span>";
}

?>

<script>

$("#form-name, #form-lastname, #form-email, #form-textarea").removeClass("input-error");

var errorEmpty= "<?php echo $errorEmpty; ?>"
var errorEmail= "<?php echo $errorEmail; ?>"

if(errorEmpty == true){
    $("#form-name, #form-lastname, #form-email, #form-textarea").addClass("input-error");
}
if(errorEmail == true){
    $("#form-email").addClass("input-error");
}
if(errorEmail == false && errorEmpty == false){
    $("#form-name, #form-lastname, #form-email, #form-textarea").val("");
}
</script>