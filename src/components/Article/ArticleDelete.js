/* global gapi */

import React from 'react';
import agent from '../../agent';

const ArticleDelete = props => {

  var GoogleAuth;
	var apiKey = 'AIzaSyBzJ0rNPRElfBoaNQfT9dBgOolsizy6bg8';
  var clientId = '19259875273-s0orqp2r6lada0rlcdm3366kj9lg292s.apps.googleusercontent.com';
	var scopes = 'https://www.googleapis.com/auth/drive';
     
  (function handleClientLoad() {
    gapi.load('client', initClient);
  })();

  function initClient() {
   	gapi.client.init({
    	apiKey: apiKey,
    	clientId: clientId,
    	scope: scopes
    }).then(function(){
    	GoogleAuth = gapi.auth2.getAuthInstance();

     	// Listen for sign-in state changes
 	  	GoogleAuth.isSignedIn.listen(updateSigninStatus);

     	var user = GoogleAuth.currentUser.get();
  		setSigninStatus();
     });
  }

  function signIn() {
  	gapi.auth2.getAuthInstance().signIn();
  }

  // Track

  var initSignedIn = false;

	function setSigninStatus(isSignedIn) {
    if (initSignedIn) {
      var accessToken = gapi.auth.getToken().access_token;
      agent.GoogleDrive.removeFile(accessToken, props.description);
    }

    // For testing purposes; uncomment to auto-signout on page load
    /*
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(scopes);
    if (isAuthorized) {
      if (GoogleAuth.isSignedIn.get()) {
        GoogleAuth.signOut();
      }
    }
    else {
      console.log('not authorized');
    }
    */
  	}

  	function updateSigninStatus(isSignedIn) {
    	setSigninStatus();
  	}

  	// Google Drive entry & fieldset elements switching

    const removeFile = ev => {
     	ev.preventDefault();
      if (props.description.length > 1) {
     	  var user = GoogleAuth.currentUser.get();
     	  var isAuthorized = user.hasGrantedScopes(scopes);
     	  if (isAuthorized) {
       		var accessToken = gapi.auth.getToken().access_token;
          agent.GoogleDrive.removeFile(accessToken, props.description);
     	  }
     	  else {
        	initSignedIn = true;
    		  signIn();
      	}
      }
      props.del();
    }

	return(

		<button className="btn btn-outline-danger btn-sm" onClick={removeFile}>
      <i className="ion-trash-a"></i> Delete Task
    </button>	

	);
  
}

export default ArticleDelete;