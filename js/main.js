/**
 * 
 * @param {type} formData
 * @param {type} status
 * @returns {undefined}
 */
function sendFileToServer(formData, status)
{
    var uploadURL = "upload.php"; //Upload URL
    var extraData = {}; //Extra Data.
    var jqXHR = $.ajax({
        xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            if (xhrobj.upload) {
                xhrobj.upload.addEventListener('progress', function(event) {
                    var percent = 0;
                    var position = event.loaded || event.position;
                    var total = event.total;
                    if (event.lengthComputable) {
                        percent = Math.ceil(position / total * 100);
                    }
                    //Set progress
                    status.setProgress(percent);
                }, false);
            }
            return xhrobj;
        },
        url: uploadURL,
        type: "POST",
        contentType: false,
        processData: false,
        cache: false,
        data: formData,
        success: function(data) {
            console.log(data);
            status.setProgress(100);

            //$("#status1").append("File upload Done<br>");
        }
    });

    status.setAbort(jqXHR);
}

var rowCount = 0;
function createStatusbar(obj)
{
    rowCount++;
    var row = "odd";
    if (rowCount % 2 == 0)
        row = "even";
    this.statusbar = $("<div class='statusbar " + row + "'></div>");//create div statutsbar
    this.filename = $("<div class='filename'></div>").appendTo(this.statusbar);//create div filename
    this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);//create div filesize
    this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);//create div progressBar
    this.abort = $("<div class='abort'>Abort</div>").appendTo(this.statusbar);
    obj.after(this.statusbar);

    //add data to div called filename and filesize
    this.setFileNameSize = function(name, size)
    {
        var sizeStr = "";
        var sizeKB = size / 1024;
        if (parseInt(sizeKB) > 1024)
        {
            var sizeMB = sizeKB / 1024;
            sizeStr = sizeMB.toFixed(2) + " MB";
        }
        else
        {
            sizeStr = sizeKB.toFixed(2) + " KB";
        }
        var fileFormat = name.split('.');
        var format = fileFormat[1];
        if (format == 'pdf') {
            this.filename.html('<img src="images/pdf.png">');
        } else if(format == 'doc' || format == 'docx'){
            this.filename.html('<img src="images/docx.png">');
        } else {
            this.filename.html('<img src="uploads/' + name + '">');
        }

        this.size.html(sizeStr);
    }

    this.setProgress = function(progress)
    {
        var progressBarWidth = progress * this.progressBar.width() / 100;
        this.progressBar.find('div').animate({width: progressBarWidth}, 10).html(progress + "% ");
        if (parseInt(progress) >= 100)
        {
            this.abort.hide();
        }
    }

    this.setAbort = function(jqxhr)
    {
        var sb = this.statusbar;
        this.abort.click(function()
        {
            jqxhr.abort();
            sb.hide();
        });
    }
}
/*
 * upload files to server
 */
function handleFileUpload(files, obj)
{
    for (var i = 0; i < files.length; i++)
    {
        var fd = new FormData();
        fd.append('file', files[i]);
        var status = new createStatusbar(obj);
        status.setFileNameSize(files[i].name, files[i].size);
        sendFileToServer(fd, status);
    }
}


$(document).ready(function()
{
    var obj = $("#dragandrophandler");
    obj.on('dragenter', function(e)
    {
            e.stopPropagation();
            e.preventDefault();
            $(this).css('border', '1px solid #6fc9ef');
    });
    obj.on('dragover', function(e)
    {
             e.stopPropagation();
             e.preventDefault();
    });
    obj.on('drop', function(e)
    {
         $(this).css('border', '1px dotted #0B85A1');
             e.preventDefault();
             var files = e.originalEvent.dataTransfer.files;
                     //Send dropped files to Server
             handleFileUpload(files, obj);
    });
    $(document).on('dragenter', function(e)
    {
            e.stopPropagation();
            e.preventDefault();
    });
    $(document).on('dragover', function(e)
    {
          e.stopPropagation();
          e.preventDefault();
          obj.css('border', '1px dotted #0B85A1');
    });
    $(document).on('drop', function(e)
    {
            e.stopPropagation();
            e.preventDefault();
    });
 
});