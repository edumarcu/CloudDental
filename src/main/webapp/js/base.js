
/**
 * @fileoverview
 * Provides methods for the interaction with the patientsCRUD API.
 *
 * @author edumarcu
 */

/** global namespace for projects. */
var clouddental = clouddental || {};

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
clouddental.CLIENT_ID = "10565776446-ldbmp8qsn44252158niubhla6b9984i1.apps.googleusercontent.com";

/**
 * Scopes used by the application.
 * @type {string}
 */
clouddental.SCOPES = "https://www.googleapis.com/auth/userinfo.email";

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
clouddental.signedIn = false;

/**
 * Loads the application UI after the user has completed auth.
 */
clouddental.userAuthed = function() {
    var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
        if (!resp.code) {
            clouddental.signedIn = true;
            document.getElementById("signinButton").innerHTML = "Sign out";
        }
    });
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
clouddental.signin = function(mode, callback) {
    gapi.auth.authorize({client_id: clouddental.CLIENT_ID,
        scope: clouddental.SCOPES, immediate: mode},
        callback);
};

/**
 * Presents the user with the authorization popup.
 */
clouddental.auth = function() {
    if (!clouddental.signedIn) {
        clouddental.signin(false,
            clouddental.userAuthed);
    } else {
        clouddental.signedIn = false;
        document.getElementById("signinButton").innerHTML = "Sign in";
    }
};

/**
 * Prints a greeting to the patient log.
 * param {Object} patient Patient to print.
 */
clouddental.print = function(functionType, patient) {
    var element = document.createElement("div");
    element.classList.add("row");
    element.innerHTML = functionType + " " + patient.name + " " + patient.creationDate + " " + patient.id;
    document.getElementById("outputLog").appendChild(element);
};

/**
 * Creates a patient via the API.
 * @param {string} name Name of the patient.
 */
clouddental.createPatient = function(name) {
    gapi.client.patientsCRUD.patients.createPatient({"name": name}).execute(
        function(resp) {
            if (!resp.code) {
                clouddental.print("create", resp);
            } else {
                window.alert(resp.message);
            }
        }
    );
};

/**
 * Gets a numbered patient via the API.
 * @param {string} id ID of the patient.
 */
clouddental.getPatient = function(name) {
    gapi.client.patientsCRUD.patients.getPatient({"name": name}).execute(
        function(resp) {
            if (!resp.code) {
                clouddental.print("get", resp);
            } else {
                window.alert(resp.message);
            }
        }
    );
};

/**
 * Lists patients via the API.
 */
clouddental.listPatients = function() {
    gapi.client.patientsCRUD.patients.listPatients().execute(
        function(resp) {
            if (!resp.code) {
                resp.items = resp.items || [];
                for (var i = 0; i < resp.items.length; i++) {
                    clouddental.print("list " + i, resp.items[i]);
                }
           }
        }
    );
};

/**
 * Enables the button callbacks in the UI.
 */
clouddental.enableButtons = function() {

    document.getElementById("createPatient").onclick = function() {
        clouddental.createPatient(
            document.getElementById("nameCreate").value);
    }

    document.getElementById("getPatient").onclick = function() {
        clouddental.getPatient(
            document.getElementById("nameGet").value);
    }

    document.getElementById("listPatients").onclick = function() {
        clouddental.listPatients();
    }
  
    document.getElementById("signinButton").onclick = function() {
        clouddental.auth();
    }
};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
clouddental.init = function(apiRoot) {
    // Loads the OAuth and patientsCRUD APIs asynchronously, and triggers login
    // when they have completed.
    var apisToLoad;
    var callback = function() {
        if (--apisToLoad == 0) {
            clouddental.enableButtons();
            clouddental.signin(true,
                clouddental.userAuthed);
        }
    }

    apisToLoad = 2; // must match number of calls to gapi.client.load()
    gapi.client.load("patientsCRUD", "v1", callback, apiRoot);
    gapi.client.load("oauth2", "v2", callback);
};