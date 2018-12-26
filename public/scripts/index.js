/* global $ noteful */
'use strict';

$(document).ready(function () {
  noteful.bindEventListeners();

  api.search({}, response => {
    store.notes = response;
    noteful.render();
  });

});