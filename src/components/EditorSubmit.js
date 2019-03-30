/* global gapi */

import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import { FILE_UPLOADED_TO_DRIVE } from '../constants/actionTypes';


const mapStateToProps = state => ({
  ...state.editor,
  redirArticleSlug: state.common.redirArticleSlug
});

const mapDispatchToProps = dispatch => ({
  onFileUploadedToDrive: payload =>
    dispatch({ type: FILE_UPLOADED_TO_DRIVE, payload })
});

class EditorSubmit extends React.Component { 
  constructor(props) {
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
        uploadFileRequest();
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

    // Google Drive entry & link binding

    const uploadFileRequest = () => {

      var accessToken = gapi.auth.getToken().access_token;
      var form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(this.props.resource)], {type: 'application/json'}));
      form.append('file', this.props.file);
      
      agent.GoogleDrive.uploadFile(accessToken, form).then(resBody =>{
        const article = {
          title: this.props.title,
          description: resBody.id,
          body: this.props.body,
          tagList: this.props.tagList
        };
        agent.Articles.update(Object.assign(article, {slug: this.props.redirArticleSlug}))
        .then(() => this.props.onFileUploadedToDrive(this.props.redirArticleSlug));
      });
    }

    const proceed = () => {
      if (this.props.file) {
        var user = GoogleAuth.currentUser.get();
        var isAuthorized = user.hasGrantedScopes(scopes);
        if (isAuthorized) {
     	    uploadFileRequest();
        }
        else {
          initSignedIn = true;
          signIn();
        }
      }
      else return;
    }

    return(

		  <button
        className="btn btn-lg pull-xs-right btn-primary"
        type="button"
        disabled={this.props.inProgress}
        onClick={ev => Promise.all([proceed(), this.props.submitForm(ev)])}>
          Publish Task
      </button>

    );

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorSubmit);