<?php
	$inData = getRequestInfo();
	
   // Capturing input from user
  $firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
  $phone = $inData["phone"];
  $email = $inData["email"];
	$userId = $inData["userId"];
 

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
 
  // Check for spaces in the inputs and remove them
  $firstName = str_replace(" ", "", $firstName);
  $lastName = str_replace(" ", "", $lastName);
  $phone = str_replace(" ", "", $phone);
  $email = str_replace(" ", "", $email);
 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
  	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Contact created successfully");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>