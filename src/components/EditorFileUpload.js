/* global gapi */

import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import { FILE_ASSIGN, FILE_REMOVED } from '../constants/actionTypes';
import './App.css';

const mapStateToProps = state => ({
  ...state.editor
});

const mapDispatchToProps = dispatch => ({
  onFileAssign: payload =>
    dispatch({ type: FILE_ASSIGN, payload }),
  onFileRemoved: payload =>
    dispatch({ type: FILE_REMOVED, payload })  
});

class EditorFileUpload extends React.Component {
  constructor(props){
    super();
  }

  render() {

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
        agent.GoogleDrive.removeFile(accessToken, this.props.description).then(() =>{
        this.props.onFileRemoved(agent.Articles.update(Object.assign(article, {slug: this.props.slug})));
        });
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

  	// Google Drive remove file

    const article = {
          title: this.props.title,
          description: '-',
          body: this.props.body,
          tagList: this.props.tagList
    };

    const removeFile = ev => {
      ev.preventDefault();
      var user = GoogleAuth.currentUser.get();
      var isAuthorized = user.hasGrantedScopes(scopes);
      if (isAuthorized) {
        var accessToken = gapi.auth.getToken().access_token;
        agent.GoogleDrive.removeFile(accessToken, this.props.description).then(() =>{
        this.props.onFileRemoved(agent.Articles.update(Object.assign(article, {slug: this.props.slug})));
        });
      }
      else {
        initSignedIn = true;
        signIn();
      }
    }

    let resource = {}; //metadata to send to Google Drive
    let uploadFile = React.createRef();
    let fileAssign = () => {
      let fileSource = uploadFile.current.files[0];
      resource.name = fileSource.name;
      resource.mimeType = fileSource.type;
      this.props.onFileAssign([fileSource, resource]);
    }

    let fileLink = React.createRef();
    let removeButton = React.createRef();

    if (this.props.description && this.props.description.length > 1) {

      return(

		    <fieldset className="form-group">
          <span ref={fileLink}><a href={'https://drive.google.com/open?id=' + this.props.description} target="_blank">
          File on Google Drive <i className="ion-link"></i></a></span>
          <button
            ref={removeButton}
            className="btn-sm btn-outline-danger editor-remove-button"
       	    onClick={removeFile} >
       	      Remove File
          </button>
        </fieldset>

		  );
    }
    else if (this.props.description && this.props.description.length < 2) {

      return(

          <fieldset className="form-group">
            <input
              ref={uploadFile}
              className="form-control"
              type="file"
              onChange={fileAssign} />
          </fieldset>

        );

    }
    else {

      return (

        <fieldset className="form-group">
          <input
            ref={uploadFile}
            className="form-control"
            type="file"
            onChange={fileAssign} />
        </fieldset>

      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorFileUpload);