// FirebaseUI config.
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      var user = authResult.user;
      const name = user.displayName
      const email = user.email
      const firebase_user_id = user.uid

        // pass data to create new account
        $.post(
          "/authentication",
          {
            uid: firebase_user_id,
            username: name,
            email: email
          },
          data => {
            // if result is fail, stop execution and show error message
            if (data.result == "fail") {

              $("#registerErrorMessage").text(
                "You have an account with this google account"
              )
              $("#registerErrorMessage").show()

              return
            }
            // now ready to go to home page
            window.location.replace("/")
          }
        ).fail(error => {
          console.log(error.message)
        })
      return false;
    },
    signInFailure: function(error) {
      return handleUIError(error);
    },
    uiShown: function() {
      document.getElementById('loader').style.display = 'none';
    }
  },
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
  // Query parameter name for mode.
  queryParameterForWidgetMode: 'mode',
  // Query parameter name for sign in success url.
  queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: null,
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      // Invisible reCAPTCHA with image challenge and bottom left badge.
      recaptchaParameters: {
        type: 'image',
        size: 'invisible',
        badge: 'bottomleft'
      }
    }
  ],
  // Terms of service url/callback.
  tosUrl: '<your-tos-url>',
  // Privacy policy url/callback.
  privacyPolicyUrl: function() {
    window.location.assign('<your-privacy-policy-url>');
  }
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());

function registerWithEmailAndPassword(name, email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(data => {
      const firebase_user_id = data.user.uid

      // pass data to local database to create new account
      $.post("/authentication",
        {
          uid: firebase_user_id,
          username: name,
          email: email
        },
        data => {
          // now ready to go to home page
          window.location.replace("/")
          console.log(data);
        }
      ).fail(error => {
        console.log(error.message)
      })
    })
    .catch(function(error) {
      const errorMessage = error.message

      // set the error Message and show it
      $("#registerErrorMessage").text(errorMessage)
      $("#registerErrorMessage").show()
      console.log(errorMessage)
    })
  }

function verifyTokenAndGoToHome(user) {
  // get user token form firebase
  user.getIdToken(/* forceRefresh */ true)
  .then(idToken => {
    // Send token to your backend via HTTPS
    $.post("/login", { token: idToken }, data => {
      // get firebase user id
      const user_id = data.tokenData.sub

      // post the firebase user id to get corresponding user in postgres databse
      $.post("/login", { token_id: user_id }, data => {
        console.log(data)
        // if result is fail, stop execution and show error message
        if (data.result === "fail") {
          const user = firebase.auth().currentUser

          // delete firebase unnecessary current user
          user.delete().then(function() {
            // User deleted.

            $("#loginErrorMessage").text(data.message)
            $("#loginErrorMessage").show()
          })
          return
        }
        // now ready to go to home page
        window.location.replace("/authenticaton/home")
      }).fail(function(error) {
        // Handle error
        console.log("decode error")
      })
    })
  })
  .catch(function(error) {
    // Handle error
    console.log("decode error")
  })
}

// create new user
$(document).on('turbolinks:load', function() {
  $("#registerForm").submit(event => {
    // Stop the browser from submitting the form.
    event.preventDefault()
    // hide error message
    $("#registerErrorMessage").hide()

    const name = event.target.name.value
    const email = event.target.email.value
    const password = event.target.password.value

    registerWithEmailAndPassword(name, email, password)
    })
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);
  })