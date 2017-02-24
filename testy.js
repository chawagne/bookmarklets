$("body").append('<div class="stats"><h2 class="title">Test Helper</h2><table class="metrics"></table>');
$.get('https://demo.trackernonprod.com/services/v5/me?fields=capabilities',function(data){
  $(".metrics").append('<tr><th>Capability:</th><th>'+ JSON.stringify(data.capabilities)+'</th></tr>');
});
