var xhr = new XMLHttpRequest(),
  method = "GET",
  url = "https://localprod.pandateacher.com/goals-lab/gitlab-api/goals/project_cycles";

xhr.open(method, url, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();
