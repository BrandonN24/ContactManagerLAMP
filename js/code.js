const urlBase = 'http://COP4331-app.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let userIds = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	if(validLogin(login, password))
	{
		document.getElementById("loginResult").innerHTML = "Invalid Login";
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
				searchContact();

	
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

	if (validRegister(firstName, lastName, userName, password))
	{
		//invalid login empty text fields
		document.getElementById("registerResult").innerHTML = "Invalid Login";
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
			if (this.status == 409)
			{
				document.getElementById("registerResult").innerHTML = 
					"This username is taken";
				return;
			}
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

	if (validateNewContact(firstName, lastName, phoneNumber, emailAdd))
	{
		document.getElementById("addContactResult").innerHTML = "Invalid New Contact";
		return;
	}

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
	let logUserErr = logPassErr = false;
	if (logUser == "")
	{
		console.log("Empty Username");
		logUserErr = true;
	}

	if (logPass == "")
	{
		console.log("Empty Password");
		logPassErr = true;
	}
	if ((logUserErr || logPassErr) == true)
	{
		return true;
	}
	// no error
	else
	{
		return false;
	}
}

function validRegister(regfName,reglName, regUser, regPass)
{
	let regfNameErr = reglNameErr = regUserErr = regPassErr = validRegPass = false;
	if (regUser == "")
	{
		console.log("Empty Username");
		regfNameErr = true;
	}
	if (regfName == "")
	{
		console.log("Empty First Name");
		reglNameErr = true;
	}
	if (reglName == "")
	{
		console.log("Empty Last Name");
		regUserErr = true;
	}
	if (regPass == "")
	{
		console.log("Empty Password");
		regPassErr = true;
	}
	if (!validatePassword(regPass))
	{
		console.log("Invalid Password");
		document.getElementById("registerResult").innerHTML = 
			"Password must be 6-20 char with one Uppercase, one lowercase, and one digit";
		validRegPass = true;
	}
	// there is an error
	if ((regfNameErr || reglNameErr || regUserErr || regPassErr || validRegPass) == true)
	{
		return true;
	}
	// there is no error
	else
	{
		return false;
	}
}

//usable for new Contact and edit Contact
function validateNewContact(newfName, newlName, newPhone, newEmail)
{
	let newfNameErr = newlNameErr = newPhoneErr = newEmailErr = validNewEmailErr = false;
	if (newfName == "")
	{
		console.log("Empty First Name");
		newfNameErr = true;
	}
	if (newlName == "")
	{
		console.log("Empty Last Name");
		newlNameErr = true;
	}
	if (newPhone == "")
	{
		console.log("Empty Phone Number")
		newPhoneErr = true;
	}
	if (newEmail == "")
	{
		console.log("Empty Email");
		newEmailErr = true;
	}
	if (!validateEmail(newEmail))
	{
		console.log("Invalid email");
		document.getElementById("addContactResult").innerHTML = "Invalid Email";
		validNewEmailErr = true;
	}
	console.log(Boolean(newfNameErr || newlNameErr || newPhoneErr || newEmailErr || validNewEmailErr));
	// there is an error
	if ((newfNameErr || newlNameErr || newPhoneErr || newEmailErr || validNewEmailErr) == true)
	{
		return true;
	}
	// no error
	else
	{
		return false;
	}
}

function validatePassword(pass)
{
	const ret = String(pass).match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);
	//debug
	console.log(Boolean(ret))
	return Boolean(ret);
}

function validateEmail(email)
{
  	const ret = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
	//debug
	console.log(Boolean(ret))
	return Boolean( ret );
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

// Startup is a flag boolean that tells the funciton if it's running when the page loads
// Only used to prevent the "Contacts retrieved" message on startup. 
function searchContact(startup)
{
	//document.getElementById("colorSearchResult").innerHTML = "";
	
	//let contactList = "";
 
  let searchFind = "";
  element = document.getElementById('searchText');
  if (element != null) 
  {
    searchFind = element.value;
  }

  let tmp = 
	{
		userId:userId,
		search:searchFind
	};
	console.log(userId);
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			// If the function is run when the page loads, don't display "contacts retrieved" message
			if(!startup) 
			{
				document.getElementById("searchResult").innerHTML = "Contacts(s) have been retrieved";
			}
			
			let jsonObject = JSON.parse( xhr.responseText );

			// Get Contact Div
			let listBox = document.getElementById("contactList");
			listBox.innerHTML = "";
			
			console.log("List of contacts");
			console.log(jsonObject.results);
			
			// If the User has contacts, add them to the div's inner HTML
			if(jsonObject.results == undefined)
			{
				listBox.innerHTML = "No Contacts Found for Current User.";
			}
			else
			{
				for( let i=0; i<jsonObject.results.length; i++ )
					{
						let current = jsonObject.results[i];
						userIds[i] = current.ID;

						//console.log(current.ID);
						//console.log(userIds);
						// Adds the beginning of the contact with all the data, then eddit button, then delete button
						listBox.innerHTML += '<a href="#" id = "' + i + '"> '+current.FirstName+' '+current.LastName;
						listBox.innerHTML += '<button type="button" id="editButton" class="buttons" onclick="doSendToEdit();"> Edit </button>';
						listBox.innerHTML += '<button type="button" id="deleteButton" class="buttons" onclick="deleteContact(' + i + ');"> Delete </button> </a>';
					}
				}
			//document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}

function deleteContact(row)
{
	let listBox = document.getElementById("contactList");
	//let name = document.getElementById(row).textContent;
	if (confirm("Are you sure you want to delete this contact?"))
	{
		tmp = {
			id: userIds[row],
		};

		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + '/DeleteContact.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					console.log("Delete contact");
					console.log(jsonPayload); //Debug
		
					saveCookie();
					searchContact(false);
				}
			};
		xhr.send(jsonPayload);
		}catch(err)
		{
			document.getElementById("searchResult").innerHTML = err.message;
		}	
	}
}

function editContact(contactID)
{

}