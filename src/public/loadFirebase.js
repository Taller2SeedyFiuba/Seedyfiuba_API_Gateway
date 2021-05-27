
document.addEventListener("DOMContentLoaded", loadFirebase);

function loadFirebase() {
  let myScript = document.createElement("script");
  myScript.setAttribute("src", "https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js");
  document.body.appendChild(myScript);

  myScript = document.createElement("script");
  myScript.setAttribute("src", "https://www.gstatic.com/firebasejs/8.5.0/firebase-auth.js");
  document.body.appendChild(myScript);

  myScript.addEventListener('load', function() {
    console.log("Firebase Loaded");
    console.log(firebase);
    firebase.initializeApp({
      apiKey: "AIzaSyD8G1wvl54_IRTAeovpZpejhIrDxYm_q7o",
      authDomain: "seedyfiuba-autenticacion.firebaseapp.com",
      projectId: "seedyfiuba-autenticacion",
      storageBucket: "seedyfiuba-autenticacion.appspot.com",
      messagingSenderId: "261422775782",
      appId: "1:261422775782:web:426e4ed7f29d650a3d2a27",
      measurementId: "G-XPS2V73FZN"
    });
    firebase.auth().onAuthStateChanged(firebaseUser => {
      firebaseUser.getIdToken().then(setApiKey).catch(function(error) {
        // Handle error
      });
   });  
  });

};

const setApiKey = (apiToken) => {
  console.log(apiToken);
  const divEl = document.getElementById("idToken");

  divEl.insertAdjacentText('afterbegin', apiToken);
}

const userLogin = (e) => {
  e.preventDefault();
  const form = document.getElementById("login-form");
  console.log(form);

  const formEntries = new FormData(form).entries();
  const { email, password } = Object.assign(...Array.from(formEntries, ([name, value]) => ({[name]: value})));

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}

window.addEventListener('DOMContentLoaded', (event) => {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="firebase-panel swagger-ui information-container wrapper">
      <h2>Firebase Login System</h2>
      <div class="firebase-login-container">
        <form  method="POST" enctype="multipart/form-data" id="login-form" onsubmit="userLogin(event)">
          <input type="email" name="email" placeholder="email"/>
          <input type="password" name="password" placeholder="password"/>
          <input type="submit" class="btn modal-btn auth authorize button" value="Ingresar" />

        </form>
      </div>
      <div class="firebase-token-display">
        <p>ApiToken: </p>
        <pre id="idToken">
        </pre>
      </div>
    </div>
  `);
});
