<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	$username = $inData["login"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("select Login from Users WHERE Login = ?");
		$stmt->bind_param("s", $username);
		$stmt->execute();

		$result = $stmt->get_result();

		// if no results found, continue to register
		if(!$result->fetch_assoc()){
			$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES (?, ?, ? ,?)");
			$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $username, $inData["password"]);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("");
		}
		// otherwise, throw an error
		else{
			returnWithError("Username taken");
		}


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
