$(document).ready(function(){
    $('#package-help-info').popover({'title': 'Package info', 'content': 'Package can be "ult,ent,corp,pro,com"'});

    $('a[name="duplicateBuild"]').each(function(i, domEle){
      $(domEle).click(function(){
        var task_id = $(domEle).attr("id").split("-");
        $.get('getbuild',
          {"task_id": task_id[1]},
          function(data){
            buildObj = $.parseJSON(data);
            $('#popView-repos').val(buildObj['repos']);
            $('#popView-branch').val(buildObj['branch']); 
            $('#popView-version').val(buildObj['version']); 
            $('#popView-author').val(buildObj['author']);
            $('#popView-styleguide_repo').val(buildObj['styleguide_repo']);
            $('#popView-styleguide_branch').val(buildObj['styleguide_branch']);
            $('#popView-sidecar_repo').val(buildObj['sidecar_repo']);
            $('#popView-sidecar_branch').val(buildObj['sidecar_branch']);
            $('#popView-package_list').val(buildObj['package_list']);
            
            //Hide status input textfield
            $('#popView-control-status').hide();

            //Set selectAction as editBuild
            $('#popView-selectAction').val('duplicateBuild');

            //Update the popup view title and build ID
            $('#popView-title').text('Duplicate build -- Task ID ' + task_id[1]);

            $('#popView-selectBuildID').val(task_id[1]);
          }
        );
      });  
    });

    $('a[name="editBuild"]').each(function(i, domEle){
      $(domEle).click(function(){
        var task_id = $(domEle).attr("id").split("-");
        $.get('getbuild',
          {"task_id": task_id[1]},
          function(data){
            buildObj = $.parseJSON(data);
            $('#popView-repos').val(buildObj['repos']);
            $('#popView-branch').val(buildObj['branch']); 
            $('#popView-version').val(buildObj['version']); 
            $('#popView-author').val(buildObj['author']);
            $('#popView-styleguide_repo').val(buildObj['styleguide_repo']);
            $('#popView-styleguide_branch').val(buildObj['styleguide_branch']);
            $('#popView-sidecar_repo').val(buildObj['sidecar_repo']);
            $('#popView-sidecar_branch').val(buildObj['sidecar_branch']);
            $('#popView-package_list').val(buildObj['package_list']);

            //User can update status by entering password
            //Show status input textfield
            $('#popView-control-status').show();
            $('#popView-status').val(buildObj['status']);
            $('#popView-status').attr('readonly', 'readonly');
            $('#popView-edit-status').text('edit');
            
            //Set selectAction as editBuild
            $('#popView-selectAction').val('editBuild');

            //Update the popup view title and build ID
            $('#popView-title').text('Edit build -- Task ID ' + task_id[1]);
            $('#popView-selectBuildID').val(task_id[1]);
          }
        );
      });  
    });
  
    $('#popView-Save').click(function(){
      //Check form validate firstly
      if (! $('#popView-actionBuildForm').valid()){
        return false;
      }

      if ($('#popView-selectAction').val() == 'duplicateBuild') {
        $.post('add', 

          {
           "repos": $('#popView-repos').val(),
           "branch": $('#popView-branch').val(), 
           "version": $('#popView-version').val(), 
           "author": $('#popView-author').val(),
           "styleguide_repo": $('#popView-styleguide_repo').val(),
           "styleguide_branch": $('#popView-styleguide_branch').val(),
           "sidecar_repo": $('#popView-sidecar_repo').val(),
           "sidecar_branch": $('#popView-sidecar_branch').val(),
           "package_list": $('#popView-package_list').val()
           },

           function(data){
            $("#popupViewBuild").modal("hide");
            location.reload();
           }
        );
      } else if ($('#popView-selectAction').val() == 'editBuild'){
        $.post('updatebuild', 

          {
           "task_id": $('#popView-selectBuildID').val(), 
           "repos": $('#popView-repos').val(),
           "branch": $('#popView-branch').val(), 
           "version": $('#popView-version').val(), 
           "package_list": $('#popView-package_list').val(),
           "styleguide_repo": $('#popView-styleguide_repo').val(),
           "styleguide_branch": $('#popView-styleguide_branch').val(),
           "sidecar_repo": $('#popView-sidecar_repo').val(),
           "sidecar_branch": $('#popView-sidecar_branch').val(),
           "author": $('#popView-author').val(),
           "status": $('#popView-status').val()
           },

           function(data){
            $("#popupViewBuild").modal("hide");

            location.reload();
           }
        );
      }
    });

    $('#popView-edit-status').click(function(){
      if ($(this).text() == 'edit') {
        $('#popView-status').removeAttr('readonly');
        $('#popView-edit-status').text('cancel');
      } else if ($(this).text() == 'cancel'){
        $('#popView-status').attr('readonly', 'readonly');
        $('#popView-edit-status').text('edit');
      }
    });

    $('#mailToAdmin').click(function(){
        $('#popView-MailFrom').val(""),
        $('#popView-MailSubject').val("");
        $('#popView-MailMessage').val("");
    });

    $('#popView-Send').click( function(){
      if ($('#popView-sendMailForm').valid()) {
        $.post('sendmail',
          {
            "from_address": $('#popView-MailFrom').val(),
            "to": $('#popView-MailTo').val(),
            "subject": $('#popView-MailSubject').val(),
            "message": $('#popView-MailMessage').val()
          },
          function(data){
            $("#popupViewMail").modal("hide");
          }
        );
      }
    });
  
    setInterval(function(){
      $.get(
        'cron',
        function(data){
          var data = jQuery.parseJSON(data);

          if (data){
            for (x in data) {
              if (typeof x.task_id != 'undefined'){
                console.log(x.status);
                $('#build_status_' + x.task_id.toString()).text(x.status)
                $('#build_status_' + x.task_id.toString()).attr("class", x.status)
              }
            }
          } else {
            $('td[name="list_status"]').each( function(domE){
              $(domE).text('Available');            
              $(domE).removeAttr('class');            
            });
          }
          
        }
      );

    }, 5000);
    
  });
