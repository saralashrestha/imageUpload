<?php
// an array of allowed extensions
$allowedExts = array("gif", "jpeg", "jpg", "png", "doc", "docx", "pdf");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);
//check if the file type is image and then extension
// store the files to upload folder
if (in_array($extension, $allowedExts)) {
    if ($_FILES['file']['error'] > 0) {
        echo 'error';
    } else {
        $target = "uploads/";
        // Move the uploaded file from the temporary 
        // directory to the uploads folder:
        move_uploaded_file($_FILES['file']['tmp_name'], $target . $_FILES['file']['name']);
        echo $extension;
    }
} else {
    echo 'invalid extension';
}