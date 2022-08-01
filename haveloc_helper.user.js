// ==UserScript==
// @name        Haveloc Helper - Userscript version
// @namespace   LB.HH
// @match       https://app.haveloc.com/FresherJobs
// @grant       none
// @version     1.1
// @author      radiantly
// @require     https://unpkg.com/xhook@latest/dist/xhook.min.js
// @description https://github.com/radiantly/haveloc-helper
// @run-at      document-start
// @unwrap
// ==/UserScript==

console.info("Haveloc Helper loading...");

xhook.before((request, cb) => {
  if (
    !request.url.match(/brokerage\/jobViews\/\d+/) &&
    request.url.match(/brokerage\/jobViews/)
  ) {
    // the default request size is 20. make it 100.
    request.url += "&size=100";
  }
  cb();
});

// Dispatch the event.
xhook.after((request, response, cb) => {
  const dispatchResponse = (result) => {
    result["now"] = Date.now();
    localStorage.setItem("details", JSON.stringify(result));
  };
  if (
    !request.url.match(/brokerage\/jobViews\/\d+/) &&
    request.url.match(/brokerage\/jobViews/)
  ) {
    if (response instanceof Response) {
      response.json().then(dispatchResponse);
    } else {
      dispatchResponse(JSON.parse(response.text));
    }
  }
  cb(response);
});

const htmlToInject = `
<style>
  .jOverlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background: #191919;
    color: #b9bcba;
    z-index: 666;
    overflow: scroll;
  }
  .jTable {
    display: grid;
    grid-template-columns: 1fr 3fr max-content max-content max-content;
  }
  .jTable > * {
    display: contents;
  }
  .jTable .jHeader {
    font-weight: 700;
    text-align: center;
  }
  .jTable > a {
    text-decoration: none;
    color: inherit;
  }
  .jTable > a:nth-child(2n) > div {
    background-color: #202020;
  }
  .jTable > * > div {
    transition: .1s background ease-in;
    padding: 3px 10px;
  }
  .jTable > a:hover > div {
    background: #333;
  }
  .nowrap {
    white-space: nowrap;
  }
  .jOverlay iframe {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
<div class="jOverlay">
  <div id="jTable" class="jTable">
    <div class="jHeader">
      <div>Company name</div>
      <div>Job title</div>
      <div>CTC</div>
      <div>Updated</div>
      <div>Job Type</div>
    </div>
  </div>
  <iframe id="req"></iframe>
</div>
`;

window.addEventListener("load", () => {
  if (!localStorage.details) return;
  const details = JSON.parse(localStorage.details);
  console.log(details);
  document.body.insertAdjacentHTML("beforeend", htmlToInject);

  const formatSalary = (salary) => {
    if (salary == 0) return "-";
    if (salary < 100000) return `${Math.floor(salary / 1000)}k`;
    return `${Math.floor(salary / 100000)} LPA`;
  };

  const jTable = document.getElementById("jTable");
  for (const job of details["_embedded"]["entityModels"]) {
    jTable.insertAdjacentHTML(
      "beforeend",
      `
    <a href="https://app.haveloc.com/FresherJobs/jobs/${
      job.id
    }" target="_blank">
      <div>${job.companyName}</div>
      <div>${job.jobTitle}</div>
      <div class="nowrap">${formatSalary(job.maxCtc)}</div>
      <div>${job.lastModifiedDate}</div>
      <div>${job.jobType}</div>
    </a>`
    );
  }
});
