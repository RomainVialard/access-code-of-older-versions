// Retrieve the source code linked to a specific version of your Apps Script project
// then save it as a new Apps Script project
function retrieveOldCode() {
  var projectName = "FirebaseApp";
  var projectId = "1hguuh4Zx72XVC1Zldm_vTtcUUKUA6iBUOoGnJUWLfqDWx5WlOJHqYkrt";
  var versionToRetrieve = 11;
  
  // Get the source code behind selected version number
  var content = makeRequest_(projectId, 'content?versionNumber=' + versionToRetrieve);
  
  // Create a new script project
  var payload = JSON.stringify({title:"Backup of " + projectName + " v." + versionToRetrieve});
  var newScriptId = makeRequest_('', '', 'post', payload).scriptId;
  
  // Push old source code into new script project
  makeRequest_(newScriptId, 'content', 'put', JSON.stringify({files:content.files}));
  // Log url to open new script project
  Logger.log("https://script.google.com/d/" + newScriptId + "/edit");
}

/**
 * Make calls to the Apps Script API
 * Required scopes:
 * - https://www.googleapis.com/auth/script.external_request
 * - https://www.googleapis.com/auth/script.deployments
 * - https://www.googleapis.com/auth/script.projects
 *
 * @param  {string} projectId - The script project's Drive ID.
 * @param  {string} resourcePath - The resource path.
 * @param  {string} [method] - the HTTP method for the request.
 * @param  {string} [payload] - the payload (e.g. POST body) for the request.
 *
 * @return {object} The response from the Apps Script API.
 */
function makeRequest_(projectId, resourcePath, method, payload) {
  var baseUrl = "https://script.googleapis.com/v1/projects/";
  if (!projectId) var url = baseUrl;
  else var url = baseUrl + projectId + "/" + resourcePath;
  var options = {
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    }
  };
  if (method == 'post' || method == 'put') {
    options.method = method;
    options.payload = payload;
    options.headers['Content-Type'] = 'application/json';
  }
  return JSON.parse(UrlFetchApp.fetch(url, options));
}
