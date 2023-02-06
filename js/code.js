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
		document.getElementById("registerResult").innerHTML = "Invalid - Password must contain 8 - 16 characters, at least one uppercase and one digit";
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
				document.getElementById("regResult").innerHTML = "Register Complete - Redirecting to Login...";
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
	
				saveCookie();
        
        window.setTimeout(function(){

        window.location.href = "login.html";

        }, 2000);
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
        
        window.setTimeout(function(){

        window.location.href = "contacts.html";

        }, 2000);
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
		//document.getElementById("addContactResult").innerHTML = "Invalid Email";
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" +  userId + ";expires=" + date.toGMTString();
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
				document.getElementById("searchResult").innerHTML = "Successfully retrieved contact(s)";
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
						userIds[i] = current;

						//console.log(current.ID);
						console.log(userIds);
						// Adds the beginning of the contact with all the data, then edit button, then delete button
						listBox.innerHTML += '<a href="#" id = "' + i + '"> '+current.FirstName+' '+current.LastName+' '+current.Email+' '+current.Phone;
						listBox.innerHTML += '<button type="button" id="editButton" class="buttons" onclick="sendToEditContact(' + current.ID + ');"> Edit </button>';
						listBox.innerHTML += '<button type="button" id="deleteButton" class="buttons" onclick="deleteContact(' + current.ID + ');"> Delete </button> </a>';
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

function sendToEditContact(row)
{
	//let contactIdString = userIds[row].ID;
	let contIDint = row.toString();
	localStorage.setItem("contactID", contIDint);

	location.href = ("editContact.html?id="+row);
  //alert(row);   
}

function loadContent()
{
  let addr = new URL(window.location.href);
  let iden = parseInt(addr.searchParams.get('id'));
  let tmp = 
	{
		id:iden
	};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/LoadEditText.' + extension;
	
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

			let current = jsonObject.results[0];
			document.getElementById('FName').value=current.FirstName;
      document.getElementById('LName').value=current.LastName;
      document.getElementById('PNumber').value=current.Phone;
      document.getElementById('EAddress').value=current.Email;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("searchResult").innerHTML = err.message;
   alert('bad time');
	}
}

function btnEditContact()
{
	console.log(localStorage.getItem("contactID"));
	editContact(document.getElementById("FName").value, document.getElementById("LName").value
		, document.getElementById("PNumber").value, document.getElementById("EAddress").value, localStorage.getItem("contactID"));
}

function deleteContact(row)
{

	if (confirm("Are you sure you want to delete this contact?"))
	{
		tmp = {
			id: row
		};
    console.log(row);
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

function editContact(first, last, phone, email, cId)
{

	let tmp = {
		id: cId,
		firstName: first,
		lastName: last,
		phone: phone,
		email: email
	}

	if (validateNewContact(first, last, phone, email))
	{
		document.getElementById("editContactResult").innerHTML = "Invalid Edited Contact";
		return;
	}

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/EditContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log("Edit Contact");
				console.log(jsonPayload); //Debug
				
				location.href = "contacts.html";

				saveCookie();
				searchContact(false);
			}
		};
	xhr.send(jsonPayload);
	}catch(err)
	{
		document.getElementById("editContactResult").innerHTML = err.message;
	}	
}