/* global $ */
'use strict';

const api = {

  search: function (query, callback) {
    return $.ajax({
      type: 'GET',
      url: '/api/notes/',
      dataType: 'json',
      data: query,
      success: callback
    });
  },

  details: function (id, callback) {
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `/api/notes/${id}`,
      success: callback
    });
  },

  update: function(id, obj, callback) {
    return $.ajax({
      type: 'PUT',
      url: `/api/notes/${id}`,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(obj),
      success: callback
    });
  },

  remove: function(id, callback){
    return $.ajax({
      type: 'DELETE',
      url: `/api/notes/${id}`,
      dataType: 'json',
      success: callback
    });
  }

};
