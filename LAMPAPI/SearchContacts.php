<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// The front side takes name searches as one string rather than separating the first and last names. To account for this, the string will be exploded at all space characters.
		$FullName = $inData["search"];
		$FirstName = "" . explode(" ", $FullName)[0];
		$LastName = "" . explode(" ", $FullName)[1];
		// Unlimited wild card characters ('%') are added separately for clarity
		$FirstName = "%" . $FirstName . "%";
		$LastName = "%" . $LastName . "%";
		
    // If the second character of LastName is % then there was no input supplied for the last name which means the supplied name could be either a first or last name
    if($LastName[1] == '%')
    {
      $stmt = $conn->prepare("select * from Contacts where (FirstName like ? or LastName like ?) and UserID=?");
      $stmt->bind_param("ssi", $FirstName, $FirstName, $inData["userId"]);
		  $stmt->execute();
    }
    else
    {
      $stmt = $conn->prepare("select * from Contacts where (FirstName like ? and LastName like ?) and UserID=?");
      $stmt->bind_param("ssi", $FirstName, $LastName, $inData["userId"]);
  		$stmt->execute();
    }
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			// $searchResults .= '"' . $row["FirstName"] . '"';
			$searchResults .= '{"FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"]. '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '", "ID" : ' . $row["ID"] . '}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"FirstName":"","LastName":"","Phone":"","Email":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>