// On-view-load initialization
function init() {
      $("#search").click(search);
      gadgets.window.adjustHeight();
}

	
//	$(function () {
//	var offset = $("#content").offset();
//	var topPadding = 5;
//	$(window).scroll(function () {
//	    if ($(window).scrollTop() > offset.top) {
//	        $("#content").stop().animate({
//	            marginTop: $(window).scrollTop() - offset.top + topPadding
//	        });
//	    } else {
//	        $("#content").stop().animate({
//	            marginTop: 0
//	        });
//	    };
//	});
//	});
//$( document ).ready( function ()
//			{
//				$( '#content' ).scrollFollow();
//			}
//		);
      

//onhover event of expand icon
$("span.image-button").live('mouseover', function () {
                var curRowId = $(this).attr("id");
	        if(curRowId.indexOf("DOC") != -1){
	           var docID = (curRowId.substring(curRowId.lastIndexOf("-"))).substr(1);
	           console.log("i'm in if section:document");
	           expandDocument(docID);
	        }
	        else if(curRowId.indexOf("post") != -1){
			var blogpostId = (curRowId.substring(curRowId.lastIndexOf("-"))).substr(1);
			console.log("i'm in if section:blogID::"+blogpostId);
			var finalBlogId=(blogpostId.substring(blogpostId.lastIndexOf("/"))).substr(1);
			console.log("i'm in if section:PostID::"+finalBlogId)
			expandBlog(finalBlogId,blogpostId);
		}
		else
		{
			console.log("i'm in else section");
			expandDiscussion(curRowId);
		}

 });
    
 //function for tabs   
 $(function() {
         $( "#tabs" ).tabs();
        
 });

//function for date format
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
       
//function for expand button to display the discussions with correct and helpful answers
function expandDiscussion(id){
        
	$("#content").html("");
	$('.firstdiv').css('background-color', '#FFFFFF');
	$('#div_'+id).css('background-color', '#F2F2F2');
	console.log("Expand Row Id::: "+ id);
	var discussionMessage="";
	var correctanswer="";
	var helpfulanswer="";
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
			myDate=response.data.creationDate.substr(0,10);                  
			myDate=myDate.split("-"); 
			dateM=myDate[1];
			var finalMonth=monthConvert(dateM);
			var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
		        console.log("I'm inside Root Message Div");
		        rootmessage +='<div class="rootborder">';
			rootmessage +='<div class="root-header"><a href="'+discussionresult.messages.root.resources.html.ref+'" target="_apps">'+discussionresult.messages.root.subject+'</a></div>';
			rootmessage +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+response.data.author.username+'>'+response.data.author.name+'</a> on '+newDate+'</div>';	
			rootmessage +='<span class="root">'+discussionresult.messages.root.content.text+'</span>';                                        
                        rootmessage +='</div>';				
			rootmessage +='</div>';
		
			var request = response.data.messages.get();
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
									correctanswer +='<div class="correct">Correct Answer</div> ';									
									correctanswer +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+row.author.username+'>'+row.author.name+'</a> on '+newDate+'</div>';									
									correctanswer +='<span class="root">'+row.content.text+ '</span>';								
									correctanswer +='</div>';
							
							  }
							  if(row.helpful){
									myDate=row.creationDate.substr(0,10);                  
									myDate=myDate.split("-"); 
									dateM=myDate[1];
									var finalMonth=monthConvert(dateM);
									var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
									console.log("I'm inside expand if");
									helpfulanswer +='<div class="answerborder">';							
									helpfulanswer +='<div class="helpful">Helpful Answer </div>';								
									helpfulanswer +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+row.author.username+'>'+row.author.name+'</a> on '+newDate+'</div>';									
									helpfulanswer +='<span class="root">'+row.content.text+ '</span>';								
									helpfulanswer +='</div>';
							
							  }
					
					   });
					discussionMessage +=rootmessage;
					discussionMessage +=correctanswer;
					discussionMessage +=helpfulanswer;
					console.log("Html Content:: "+discussionMessage);
					$("#content").show();
					$("#content").html(discussionMessage);
				
				   }
			
			});
		
		}

	});

}


//function for expand button to display the documents
function expandDocument(id){
	$("#content").html("");
	$('.firstdiv').css('background-color', '#FFFFFF');
	$('#div_'+id).css('background-color', '#F2F2F2');
       //  $('#div_'+id).css({"background-color":"#F2F2F2","background-repeat": "no-repeat"});
		console.log("You are in document section id ::"+id);
		var request = osapi.jive.core.documents.get({id: id});
		var documentdata="";
		request.execute(function(response) { 
		               console.log("Expanding document response is " + JSON.stringify(response.data));
		               var discussionresult=response.data;
		               var isBinaryDoc=0;
		               var myDate="";
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
				        myDate=response.data.creationDate.substr(0,10);                  
			                myDate=myDate.split("-"); 
			                dateM=myDate[1];
					var finalMonth=monthConvert(dateM);
					var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
					documentdata += '<div class="rootborder">';
					documentdata += '<span class="root-header"><a href="'+response.data.resources.html.ref+'" target="_app">';						
					documentdata += response.data.subject+'</a></span>';
					documentdata +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+response.data.author.username+'>'+response.data.author.name+'</a> on '+newDate+'</div></div>';				
					documentdata += '<div class="answerborder">';
					documentdata +='<span class="root">'+response.data.content.binary.description+'</span>';
					documentdata += '<span class="subtext">This document contains an uploaded document (PDF/DOC). ';
					documentdata += 'Please click <a target="_app" href="'+response.data.resources.html.ref+'">here</a> to open the document</span></div>';
					documentdata +='</div>';
				  }
				  else
				  {
					myDate=response.data.creationDate.substr(0,10);                  
			                myDate=myDate.split("-"); 
			                dateM=myDate[1];
				        var finalMonth=monthConvert(dateM);
					var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 
					documentdata +='<div class="rootborder">';					
					documentdata +='<span class="root-header"><a target="_app" href="'+response.data.resources.html.ref+'">';
					documentdata += response.data.subject+'</a></span>';
					documentdata +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+response.data.author.username+'>'+response.data.author.name+'</a> on '+newDate+'</div>';
					documentdata +='</div>';					
					documentdata +='<div class="answerborder">';
					documentdata +='<span class="root">'+response.data.content.text +'</span></div>';				
                                        
				  }
			    }
			    $("#content").show();
			    $("#content").html(documentdata);
		  });
}

//function for expand button to display the blog
function expandBlog(blogId, blogpostId){
	var postId=blogpostId;
	var finalpostId=postId.substr(0,postId.indexOf('/'))
	console.log("Inside Blog expand and post id is"+finalpostId);
	$("#content").html("");
	$('.firstdiv').css('background-color', '#FFFFFF');
	$('#div_'+finalpostId).css('background-color', '#F2F2F2');
	console.log("Inside Blog expand");
	var blogdata="";
	var request = osapi.jive.core.blogs.get({id:blogId});
		request.execute(function(response) {
		console.log("Blog Post is"+JSON.stringify(response.data));
		var request = response.data.posts.get();
			request.execute(function(response) {
				console.log("Posts in blog"+JSON.stringify(response.data));
				var result = response.data;
				if(!response.error) {
				   $.each(result, function(index, row) {
			           if(finalpostId.indexOf(row.id) != -1)
				     {
				       var postresult=row.get();
				       postresult.execute(function(response) {
				       console.log("Post Post is"+JSON.stringify(response.data));
				       if (response.error) {
					   console.log("Error in get: "+response.error.message);
				        }
				      else{
				          myDate=response.data.creationDate.substr(0,10);                  
                                          myDate=myDate.split("-"); 
                                          dateM=myDate[1];
			                  var finalMonth=monthConvert(dateM);
				          var newDate=finalMonth+" "+myDate[2]+","+myDate[0]; 			    
					  blogdata +='<div class="rootborder">';
				          blogdata +='<span class="root-header"><a target="_app" href="'+response.data.resources.html.ref+'">';
					  blogdata += response.data.subject+'</a></span>';
					  blogdata +='<div class="content-date"> by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+response.data.author.username+'>'+response.data.author.name+'</a> on '+newDate+'</div>';
					  blogdata +='</div>';							
					  blogdata +='<div class="answerborder">';
					  blogdata +='<span class="root">'+response.data.content.text +'</span></div>';	
					}
					  $("#content").show();
					  $("#content").html(blogdata);
				   });


			        }


			    });

			}

		});
	});

}

// Perform a search and display the results
function search() {
    
    $("search-results").html("");
    $("#content").html("");
    $("#content").hide();
    gadgets.window.adjustHeight();
    var html ="";
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
               var all1 ="";
               var all2 ="";
               var all3 ="";
               var all4 ="";
      
        	
            var all ="";
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
		 //checking whether it is a discussion,if discussion display the result of discussions along answered,helpful answered ,assumed answered discussions 
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
                               	discussion +='</ul>'; 
                                discussion +='<ul>';
				discussion +='<span class="jive-icon-med image-button" id="'+discussionID+'"></span>';
                    		discussion +='</ul>'; 
					
				discussion +='<div class="root1">';  
                    		discussion +='<ul>';                   
                    		discussion +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
				discussion +='&nbsp;&nbsp<li>Date:'+newDate+'</li>';                    
                    		discussion +='&nbsp;&nbsp<li>Replies:'+replyCount+'</li>'; 
                    		discussion +='</ul>';
				discussion +='</div>';
					
				discussion +='<div class="root">';
                                discussion +='<ul>';                   
                   		discussion +='<div>'+contentSummary+'</div>';                  
                    	        discussion +='</ul>';
				discussion +='</div>';				                
				discussion +='</div>';
				discussion +='<br>';  
			
                           }
               
               //checks for document,if document displays all the documents in searchresult
			 if(row.type=="document")
                           {
				var docID = (url.substring(url.lastIndexOf("-"))).substr(1);
				
                    		document +='<div id="div_'+docID+'" class="firstdiv"> ';
				document +='<ul>';
                    		document +='<span class="jive-icon-med jive-icon-document"></span><li> <a href="'+url+'" target="_apps">'+subject+'</a></li>';
                    		document +='</ul>';
                    		document +='<ul>';
				document +='<span class="jive-icon-med image-button" id="DOC-'+docID+'" ></span>';
                    		document +='</ul>';
                    
				document +='<div class="root1">'; 
                    		document +='<ul>';
                   		document +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
				document +='&nbsp;&nbsp<li>Date:'+newDate+'</li>';                  
                    		document +='&nbsp;&nbsp<li>Replies:'+replyCount+'</li>';
                   	 	document +='</ul>';
                    		document +='</div>';
					
				document +='<div class="root">';
                    		document +='<ul>';                    
                    		document +='<div>'+contentSummary+'</div>';                   
                    		document +='</ul>';
				document +='</div>';
                                       
                    		document +='</div>';
                    		document +='<br>';
                    		
                      
                          }
                   //checks for blog post,if blog post displays all the posts in searchresult
		          if(row.type=="post")
                            {
	  			var postDetailsId=row.resources.self.ref;
				var blogSummaryId=row.blogSummary.resources.self.ref;
				var blogId = (blogSummaryId.substring(blogSummaryId.lastIndexOf("/"))).substr(1);
				var postId = (postDetailsId.substring(postDetailsId.lastIndexOf("/"))).substr(1);
				
	                    	post +='<div id="div_'+postId+'" class="firstdiv"> ';
				post +='<ul>';
	                        post +='<span class="jive-icon-med jive-icon-blog"></span><li class="post" ><a href="'+url+'" target="_apps">'+subject+'</a></li>';
	                        post +='</ul>';
	                        post +='<ul>';
	                        post +='<span class="jive-icon-med image-button" id="post-'+postId+'/'+blogId+'" ></span>';                            
	                        post +='</ul>';
	                    
			     	post +='<div class="root1">'; 
	                        post +='<ul>';
				post +='<li>Created by <a class="nopad" href=https://apps-onprem.jivesoftware.com/people/'+username+'>'+author+'</a></li>';
				post +='&nbsp;&nbsp<li>Date:'+newDate+'</li>';                  
	                        post +='&nbsp;&nbsp<li>Replies:'+replyCount+'</li>'; 
	                        post +='</ul>';
				post +='</div>';
						
				post +='<div class="root">';    
				post +='<ul>';  
	                        post +='<div>'+contentSummary+'</div>';  
	                        post +='</ul>';
				post +='</div>'; 
	                                    
	                        post +='</div>';          
	                        post +='<br>';
	                     
	               }

            });  

	      all1 +=discussion;   
	      all2 +=document;	 
	      all3 +=post;
	     
             all +=all1+all2+all3;
             $("#tabs-1").html(all); 
             $("#tabs-2").html(all1);            
             $("#tabs-3").html(all2);              
             $("#tabs-4").html(all3);             
             $("#search-info").show();
             
             gadgets.window.adjustHeight();
        }
    });
}
    


// Register our on-view-load handler
gadgets.util.registerOnLoadHandler(init);
