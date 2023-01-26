<?php
	$inData = getRequestInfo();

	// Capturing input from user
	$firstName = $inData["firstName"]; // take in a new value for the firstName
	$lastName = $inData["lastName"]; // take in a new value for the lastName
	$phone = $inData["phone"];	// take in a new value for the phone number
	$email = $inData["email"];	// take in a new value for the email
	$ID = $inData["id"]; // take in the unique ID of the contact to be edited


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	// Check for spaces in the inputs and remove them
	// This is done to clean up input to be stored into the database
	$firstName = str_replace(" ", "", $firstName);
	$lastName = str_replace(" ", "", $lastName);
	$phone = str_replace(" ", "", $phone);
	$email = str_replace(" ", "", $email);

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	// Checking to see if any of the fields are blank or null.
	else if($firstName == NULL || $lastName == NULL || $phone == NULL || $email == NULL){
		returnWithError("One of the fields are null");
	}
	// now make the check for empty strings  (usually, the NULL checks will catch this)
	else if($firstName == "" || $lastName == "" || $phone == "" || $email == ""){
		returnWithError("One of the fields are blank");
	}
	else
	{
		// unique ID of contact must be known to update it.
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $ID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Contact updated successfully");
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