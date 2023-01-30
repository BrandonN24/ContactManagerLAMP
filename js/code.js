const urlBase = 'http://COP4331-app.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	if(!validLogin(login, password))
	{
		document.getElementById("loginResult").innerHTML = "Empty Textboxs";
		return;
	}
	
	//clears login result
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	firstName = document.getElementById("FName").value;
	lastName = document.getElementById("LName").value;
	let userName = document.getElementById("regName").value;
	let password = document.getElementById("regPassword").value;

	if (!validRegister(firstName, lastName, userName, password))
	{
		//invalid login empty text fields
		document.getElementById("registerResult").innerHTML = "Empty Textboxs";
		return;
	}

	document.getElementById("registerResult").innerHTML = "";

	//JSON
	let tmp = {
		firstName:firstName,
		lastName:lastName,
		login: userName,
		password: password
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log(jsonPayload);
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				document.getElementById("regResult").innerHTML = "Register Complete";
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
	
				saveCookie();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("regResult").innerHTML = err.message;
	}

}

function addContact()
{
	firstName = document.getElementById("FName").value;
	lastName = document.getElementById("LName").value;
	let phoneNumber = document.getElementById("PNumber").value;
	let emailAdd = document.getElementById("EAddress").value;

	//make sure that it is valid

	document.getElementById("addContactResult").innerHTML = "";

	let tmp = 
	{
		userId:userId,
		firstName:firstName,
		lastName:lastName,
		phone:phoneNumber,
		email:emailAdd
	};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log(jsonPayload); //Debug
				document.getElementById("addContactResult").innerHTML = "Added Contact";
	
				saveCookie();

			}
		};
		xhr.send(jsonPayload);

	}catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}

function validLogin(logUser, logPass)
{
	var correctField = true;
	if (logUser == "")
	{
		console.log("Empty Username");
		correctField = false;
	}

	if (logPass == "")
	{
		console.log("Empty Password");
		correctField = false;
	}
	return correctField;
}

function validRegister(regfName,reglName, regUser, regPass)
{
	var correctField = true;
	if (regUser == "")
	{
		console.log("Empty Username");
		correctField = false;
	}
	if (regfName == "")
	{
		console.log("Empty First Name");
		correctField = false;
	}
	if (reglName == "")
	{
		console.log("Empty Last Name");
		correctField = false;
	}
	if (regPass == "")
	{
		console.log("Empty Password");
		correctField = false;
	}
	return correctField;
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		console.log("Logged in as " + firstName + " " + lastName) ;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
