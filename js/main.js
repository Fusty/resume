//Author:  Alex Sterling
//2015-07-28
//Recursive JSON based resume builder
//Inspired by jsonresume.org

$(document).ready(function(){
  loadTemplate("template.html");
});

function loadTemplate(template){
  //Load up template
  $.get(template, function(data){
    $('body').html(data);
    //Load up JSON
    getResumeJSON();
    drawTemplateSelection();
  });
}

function getResumeJSON(){
	$.getJSON("resume.json", function(data){
		//Go populate page
		fillResume("", data);	
  });
}

function drawTemplateSelection(){\
  //Array of available templates
  //TODO: Get this from a json file/object instead
  var templates = {
    "dark" : "Darkened"
  }
  var content = '<h3>Select a Template (I didn\'t build this just for one look!)</h3>';

  //Build the content
  $.each(templates, function(shortName, name){
    content += '<span class="label label-success">'+name+'</span>';
  });

  //Place content on page
  $('.template-selection').html(content);
}

//Recursive resume filling!
function fillResume(index, data){
  //If it's an object dive in, if not try and .text() it's value into it's index-id pair
	if(typeof data == 'object'){
		//If it's an array we'll see if we need to iterate it's container
		if(data instanceof Array){
			$.each(data, function(i,v){
				//If the template exists, fill it!
				if($('#'+index.substring(1)+"-template")[0]){
					//Clear .holding-ground
					$('.holding-ground').html('');

					//Find template, clone it into .holding-ground
					$('#'+index.substring(1)+"-template").clone().appendTo($('.holding-ground'));

					//Hide the template now that we're populating it
					$('#'+index.substring(1)+"-template").hide();

					//Stringify the contents
					var html = $('.holding-ground').html();

					//Do replaces on what needs replaced
					//Change index.substring(1)-template to index.substring(1)-i-container
					var find = new RegExp(index.substring(1)+'-template', 'g');
					html = html.replace(find, index.substring(1)+'-'+i+'-container');

					//Change index.substring(1)-n-subindex.substring(1) to index.substring(1)-i-subindex.substring(1)
					var find = new RegExp(index.substring(1)+'-n', 'g');
					html = html.replace(find, index.substring(1)+'-'+i);

					//Stick the html back in after the template
					$('#'+index.substring(1)+"-template").parent().append(html);
					$('#'+index.substring(1)+'-'+i+'-container').show();
				}
			});
		}
		$.each(data, function(i, v){
			fillResume(index+"-"+i,v);
		});
	}else{
		fillSingleField(index, data);
	}
}

function fillSingleField(index, value){
	//Handle images, hrefs etc.
  //TODO perhaps turn this into an object (unless we've hit abstraction stagnation)
	if(index == 'basics-picture'){
		$('#'+index.substring(1)).attr('src',value);
	}else if(index.match(/-work-[0-9]*-website/)){
		$('#'+index.substring(1).replace('website', 'company')).attr('href', value);
	}else if(index.match(/-publications-[0-9]*-website/)){
		$('#'+index.substring(1).replace('website', 'name')).attr('href', value);
	}else if(index.match(/-basics-profiles-[0-9]*-url/)){
    $('#'+index.substring(1).replace('url', 'network')).attr('href', value);
  }else if(index.match(/-basics-profiles-[0-9]*-network/)){ 
    $('#'+index.substring(1)).addClass('fa-'+value).addClass('link-'+value);
  }else if(index.match(/-basics-picture/)){
    $('#'+index.substring(1)).attr('src', value).text('');
  }else if(index.match(/-basics-email/)){
    $('#'+index.substring(1)).attr('href', 'mailto:'+value).text(value);
  }else{
		$('#'+index.substring(1)).text(value);
	}
}