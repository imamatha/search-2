// On-view-load initialization
function init() {
   
    $("#search").click(search);
	//$(".image-button").click(expand);
    gadgets.window.adjustHeight();
   
}
$("li.image-button").live('click', function () {
      var curRowId = $(this).attr("id");
	  if(curRowId.indexOf("DOC") != -1){
		var docID = (curRowId.substring(curRowId.lastIndexOf("-"))).substr(1);
		//alert("found :: "+docID +" "+curRowId);
		console.log("i'm in if section:document");
		expandDocument(docID);
		}
		else
		{
			console.log("i'm in else section");
			expandDiscussion(curRowId);
		}

	
    });
 function monthConvert(d){

  var outMonth="";
    switch (d) {
        case '01':
    outMonth= "Jan";
    break;
  case '02':
   outMonth= "Feb";
    break;
  case '03':
    outMonth= "Mar";
    break;
  case '04':
    outMonth= "Apr";
break;
case '05':
    outMonth= "May";
    break;
  case '06':
    outMonth= "Jun";
    break;
  case '07':
    outMonth= "Jul";
    break;
  case '08':
    outMonth= "Aug";
break;
case '09':
    outMonth= "Sep";
    break;
  case '10':
    outMonth= "Oct";
    break;
  case '11':
    outMonth= "Nov";
    break;
  case '12':
    outMonth= "Dec";
break;
}
return outMonth;
}
function expandDiscussion(id){

	 $(".content").html("");
	$('.firstdiv').css('background-color', '#FFFFFF');
	$('#div_'+id).css('background-color', '#F2F2F2');
	console.log("Expand Row Id::: "+ id);
	var discussionMessage="";
	var correctanswer="";
	var helfulanswer="";
	var rootmessage="";
	var myDate="";
	
	var request = osapi.jive.core.discussions.get({id: id});
	request.execute(function(response) { 
		console.log("Expanding discussion response is " + JSON.stringify(response.data));
		var discussionresult=response.data;
		
		if (response.error) {
			console.log("Error in get: "+response.error.message);
		}
		else{
			
			
		        console.log("I'm inside Root Message Div");
		        rootmessage +='<div class="rootborder">';
			rootmessage +='<ul>';
			rootmessage +='<div ><a href="'+discussionresult.messages.root.resources.html.ref+'" target="_apps">'+discussionresult.messages.root.subject+'</a></div>';
				
			rootmessage +='<div class="root">';
                	rootmessage +='<ul>';                   
                	rootmessage +='<div class="align">'+discussionresult.messages.root.content.text+'</div>';                  
                	rootmessage +='</ul>';
                	rootmessage +='</div>';
				
			rootmessage +='</ul>';
			rootmessage +='</div>';
			
			
			var request = response.data.messages.get( ) ;
			request.execute(function(response) {
			var result = response.data;
				if(!response.error) {
					
					 $.each(result, function(index, row) {
							console.log("Expanding discussion container response is " + JSON.stringify(response.data));
							var count=0;
							if(row.answer){
									myDate=row.creationDate.substr(0,10);                  
									myDate=myDate.split("-"); 
									dateM=myDate[1];
									var finalMonth=monthConvert(dateM);
									var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
									console.log("I'm inside expand if");
									correctanswer +='<div class="answerborder">';
									correctanswer +='<ul>';
									correctanswer +='<div class="correct">Correct Answer</div> ';
									correctanswer +='<div>by&nbsp;';
									correctanswer +='<a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+row.author.username+'>'+row.author.name+'</a>';
									correctanswer +='&nbsp;on&nbsp; '+newDate+'</div>';
									correctanswer +='<div class="root">'+row.content.text+ '</div	>';
									correctanswer +='</ul>';
									correctanswer +='</div>';
									
									
								}
							if(row.helpful){
									myDate=row.creationDate.substr(0,10);                  
									myDate=myDate.split("-"); 
									dateM=myDate[1];
									var finalMonth=monthConvert(dateM);
									var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
									console.log("I'm inside expand if");
									helfulanswer +='<div class="answerborder">';
									helfulanswer +='<ul>';
									helfulanswer +='<div class="helpful">Helpful Answer </div>';
									helfulanswer +='<div>by &nbsp;';
									helfulanswer +='<a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+row.author.username+'>'+row.author.name+'</a>';
									helfulanswer +='&nbsp;on&nbsp; '+ newDate + '</div>';
									helfulanswer +='<div class="root">'+row.content.text+ '</div>';
									helfulanswer +='</ul>';
									helfulanswer +='</div>';
									
									
								}
																
								
					
					});
					discussionMessage +=rootmessage;
					discussionMessage +=correctanswer;
					discussionMessage +=helfulanswer;
					console.log("Html Content:: "+discussionMessage);
								$(".content").show();
								$(".content").html(discussionMessage);
				
				}
			
			
			});
		
		}
	
	
	});
	
	

}

function expandDocument(id){
	$(".content").html("");
	$('.firstdiv').css('background-color', '#FFFFFF');
	$('#div_'+id).css('background-color', '#F2F2F2');
		console.log("You are in document section id ::"+id);
		var request = osapi.jive.core.documents.get({id: id});
		var documentdata="";
		request.execute(function(response) { 
		console.log("Expanding document response is " + JSON.stringify(response.data));
		var discussionresult=response.data;
		var isBinaryDoc=0;
		try {
			if (response.data.content.binary.ref) {
				isBinaryDoc = 1;
			}
			else {
				isBinaryDoc = 0;
			}	
		}
		catch (err) {
			isBinaryDoc = 0;
		}
		
			if (response.error) {
				console.log("Error in get: "+response.error.message);
			}
			else{
				if(isBinaryDoc !=0)
				{
					documentdata +='<div class="rootborder">';
					documentdata +='<div class="document"><font size="+1"><a href="'+response.data.resources.html.ref+'"';
					documentdata += response.data.subject+'</a></font><br/>Description </div>'+response.data.content.binary.description;
					console.log("Desc: "+response.data.content.binary.description);
					//documentdata +='<div class="answerborder">';					
					documentdata +='This document contains an uploaded document (PDF/DOC). Please click below link to open the document';
					documentdata +='<li><a class="nopad" href='+response.data.resources.html.ref+' target="_apps">'+response.data.content.binary.name+'</a></li>';
					documentdata +='</div>';
				}
				else
				{
					documentdata +='<div>';
					documentdata +='<div class="rootborder">';					
					documentdata +='<div class="document">'+response.data.subject+'</div>';
					documentdata +='</div>';
					
					documentdata +='<div class="answerborder">';
					documentdata +='<div class="root">'+response.data.content.text +'</div>';				
                                        documentdata +='</div>';
                                        
                                        documentdata +='</div>';
                                        
				}
			}
			$(".content").show();
			$(".content").html(documentdata);
		});
}
// Perform a search and display the results
function search() {
    
    $("search-results").html("");
	$(".content").html("");
	$(".content").hide();
    gadgets.window.adjustHeight();
    var params = {
        //limit : $("#limit").val(),
        query : $("#query").val(),
        //sort : $("#sort-type").val(),
       // sortOrder : $("#sort-order").val()
        
        
    };

   
    console.log("searching for " + JSON.stringify(params));
    osapi.jive.core.searches.searchContent(params).execute(function(response) {
       console.log("searching response is " + JSON.stringify(response));
       
        if (response.error) {
            alert(response.error.message);
        }
        else {
            var html = "";
			var blog="";
			var discussion="";
			var update="";
			var document="";
			var post="";
			
            var rows = response.data;
            var url="";
            var subject="";
            var contentSummary="";
            var author="";
            var avatar="";
            var createdDate="";           
            var replyCount="";
            var likeCount="";
            var type="";
            var username="";
            var myDate="";
			var isAnswered = 0;
			var isQuestion = 0
         
            $.each(rows, function(index, row) {
            	url=row.resources.html.ref;
				subject=row.subject;
               	contentSummary=row.contentSummary;
                author=row.author.name;
                createdDate=row.creationDate;                   
                likeCount=row.likeCount;
                replyCount=row.replyCount;
                type=row.type;
                avatar=row.author.avatarURL;
                username=row.author.username;
				
				try {
					if (row.question) {
						isQuestion = 1;
					}
					else {
						isQuestion = 0;
					}	
				}
				catch (err) {
					isQuestion = 0;
				}
				
				try {
					if (row.resources.answer.ref) {
						isAnswered = 1;
					}
					else {
						isAnswered = 0;
					}	
				}
				catch (err) {
					isAnswered = 0;
				}
                myDate=row.modificationDate.substr(0,10);                  
                myDate=myDate.split("-"); 
                dateM=myDate[1];
				var finalMonth=monthConvert(dateM);
				var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 


                         if(row.type=="discussion")
               	           {
				var discussionID = (url.substring(url.lastIndexOf("/"))).substr(1);
				var discussionImage="";
				if(isQuestion)
				{
				if(isAnswered != 0){
				discussionImage +='<span class="jive-icon-med jive-icon-discussion-correct"></span>';
								
				 }
				 else
				 {
				  discussionImage +='<span class="jive-icon-med jive-icon-discussion-question"></span>';
				  }						
				}
						
		             else
				{
				  discussionImage +='<span class="jive-icon-med jive-icon-discussion"></span>';
				}
				
                    		discussion +='<div id="div_'+discussionID+'" class="firstdiv">';
				discussion +='<ul>';
				discussion +=discussionImage+'<li><a href="'+url+'" target="_apps">'+subject+'</a></li>';
				discussion +='<li class="image-button" id="'+discussionID+'"></li>';
                    		discussion +='</ul>'; 
					
				discussion +='<div class="root1">';  
                    		discussion +='<ul>';                   
                    		discussion +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
				discussion +='<li>Date:'+newDate+'</li>';                    
                    		discussion +='<li>Replies:'+replyCount+'</li>'; 
                    		discussion +='</ul>';
				discussion +='</div>';
					
				discussion +='<div class="root">';
                                discussion +='<ul>';                   
                   		discussion +='<div class="align">'+contentSummary+'</div>';                  
                    	        discussion +='</ul>';
				discussion +='</div>';
					                
				discussion +='</div>';
				discussion +='<br>';                
                           }
               
               
			 if(row.type=="document")
                           {
				var docID = (url.substring(url.lastIndexOf("-"))).substr(1);
                    		document +='<div id="div_'+docID+'" class="firstdiv"> ';
				document +='<ul>';
                    		document +='<span class="jive-icon-med jive-icon-document"></span><li> <a href="'+url+'" target="_apps">'+subject+'</a></li>';
				document +='<li class="image-button" id="DOC-'+docID+'" ></li>';
                    		document +='</ul>';
                    
				document +='<div class="root1">'; 
                    		document +='<ul>';
                   		document +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
				document +='<li>Date:'+newDate+'</li>';                  
                    		document +='<li>Replies:'+replyCount+'</li>';
                   	 	document +='</ul>';
                    		document +='</div>';
					
				document +='<div class="root">';
                    		document +='<ul>';                    
                    		document +='<div class="align">'+contentSummary+'</div>';                   
                    		document +='</ul>';
				document +='</div>';
                                       
                    		document +='</div>';
                    		document +='<br>';
                      
                         }
               
		       if(row.type=="post")
                          {
                    	  post +='<div>';
			  post +='<ul>';
                          post +='<span class="jive-icon-med jive-icon-blog"></span><li class="post" ><a href="'+url+'" target="_apps">'+subject+'</a></li>';
                          post +='</ul>';
                    
		     	 post +='<div class="root1">'; 
                         post +='<ul>';
			 post +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
			 post +='<li>Date:'+newDate+'</li>';                  
                         post +='<li>Replies:'+replyCount+'</li>'; 
                         post +='</ul>';
			 post +='</div>';
					
			 post +='<div class="root">';    
			 post +='<ul>';  
                         post +='<div class="align">'+contentSummary+'</div>';  
                         post +='</ul>';
			 post +='</div>'; 
                                    
                         post +='</div>';          
                         post +='<br>';              
               }
                                  
            });
                       
                        html +=discussion;
			html +=document;
			html +=post;
				
            console.log(html);
            $("#search-results").html(html);
            $("#search-info").show();
            gadgets.window.adjustHeight();
        }
    });
}
    


// Register our on-view-load handler
gadgets.util.registerOnLoadHandler(init);
