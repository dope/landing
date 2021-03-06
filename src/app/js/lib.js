// Functions/constants used across multiple pages
var Landing = (() => {
  var defaultOptions = {
    bgcolor: "#cccccc",
    lncolor: "#333333",
    lnsize: 2,
    font: "sans-serif",
    txcolor: "#333333",
    txcolorhv: "#0000FF",
    txsize: 20,
    quote: "",
  };

  var getBaseFolder = async function() {
    var bookmarks = await (new Promise(resolve => {
      chrome.bookmarks.getChildren("2", resolve);
    }));

    return bookmarks.find(node => node.title == "landing") ||
      sampleBaseFolder();
  };

  var getOptions = async function() {
    var options = (await (new Promise(resolve => {
      chrome.storage.sync.get("landing_options", resolve);
    }))).landing_options;

    if (options) {
      // Ensure that all option values have set, even if the options from
      // storage have missing values
      for (var o in defaultOptions) {
        if (options[o] == undefined) options[o] = defaultOptions[o];
      }
    } else {
      options = sampleOptions();
    }

    return options;
  };

  var sampleBaseFolder = async function() {
    var landing = await (new Promise(resolve => {
      chrome.bookmarks.create({parentId: "2", title: "landing"}, resolve);
    }));

    var welcome = await (new Promise(resolve => {
      chrome.bookmarks.create({
        parentId: landing.id,
        title: "Welcome!"
      }, resolve);
    }));

    var instructions = await (new Promise(resolve => {
      chrome.bookmarks.create({
        parentId: welcome.id,
        title: "Click here for instructions on how to get started.",
        url: "https://github.com/alex-chew/landing#usage"
      }, resolve);
    }));

    return landing;
  };

  var sampleOptions = function() {
    chrome.storage.sync.set({
      landing_options: defaultOptions
    });
    return defaultOptions;
  };

  return {
    getBaseFolder: getBaseFolder,
    getOptions: getOptions,
    sampleOptions: sampleOptions,
  };
})();
