var customerID = "";
var pageName = "";
var submitFormURL = "";

$(document).ready(function () {

    var headers = {};
    var successMessage = "";
    var btnDismiss = '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btnClose">Ok</button>';

    var CustomerObjectTask = {

        init: function () {
            var self = this;
            self.declaration();
            self.setEvent();
        },
        declaration: function () {
            var self = this;

            self.$Token = $('input[name="__RequestVerificationToken"]');
            self.$modalContent = $("#modalContent");
            self.$modalFooter = $("#modalFooter");
            self.$btnSubmit = $("#btnSubmit");
            self.$btnEdtSubmit = $("#btnEdtSubmit");
            self.$btnConfirm = $("#btnConfirm");

            switch (pageName) {
                case "Create":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to add this record?</label>');
                    successMessage = 'Record successfully saved.';
                    self.$FirstName = $("#FirstName");
                    self.$LastName = $("#LastName");
                    self.$MobileNumber = $("#MobileNumber");
                    self.$City = $("#City");
                    self.$IsActive = $("#IsActive");
                    FormValidation();
                    break;
                case "Edit":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to update this record?</label>');
                    successMessage = 'Record successfully updated.';
                    self.$FirstName = $("#edtFirstName");
                    self.$LastName = $("#edtLastName");
                    self.$MobileNumber = $("#edtMobileNumber");
                    self.$City = $("#edtCity");
                    self.$IsActive = $("#edtIsActive");
                    FormValidation();
                    break;
                case "Index":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to delete this record?</label>');
                    successMessage = 'Record successfully deleted.';
                    break;

            }

        },
        setEvent: function () {
            var self = this;

            //Submit action
            self.$btnSubmit.on('click', function () {
                //If the inputs are valid
                //proceed to btnConfirm action
                //else, throw an error
                self.declaration();
                self.$btnConfirm.on('click', function () {

                    var inputVal = {
                        Id: (customerID == '' || customerID == null ? '0' : customerID),
                        FirstName: self.$FirstName.val().trim(),
                        LastName: self.$LastName.val().trim(),
                        MobileNumber: self.$MobileNumber.val().trim(),
                        City: self.$City.val().trim(),
                        IsActive: self.$IsActive.is(":checked") ? "true" : "false"
                    };

                    var form_data = new FormData();

                    for (var key in inputVal) {
                        form_data.append(key, inputVal[key]);
                    }

                    self.setAjaxSendEvent(form_data);

                });

            });

            self.$btnEdtSubmit.on('click', function () {
                //If the inputs are valid
                //proceed to btnConfirm action
                //else, throw an error
                self.declaration();
                self.$btnConfirm.on('click', function () {

                    var inputVal = {
                        Id: (customerID == '' || customerID == null ? '0' : customerID),
                        FirstName: self.$FirstName.val().trim(),
                        LastName: self.$LastName.val().trim(),
                        MobileNumber: self.$MobileNumber.val().trim(),
                        City: self.$City.val().trim(),
                        IsActive: self.$IsActive.is(":checked") ? "true" : "false"
                    };

                    var form_data = new FormData();

                    for (var key in inputVal) {
                        form_data.append(key, inputVal[key]);
                    }

                    self.setAjaxSendEvent(form_data);

                });

            });
        },
        setAjaxSendEvent: function (inputVal) {
            var self = this;

            headers['RequestVerificationToken'] = self.$Token.val();

            $.ajax({
                url: submitFormURL,
                type: "POST",
                //data: JSON.stringify(inputVal),
                data: inputVal,
                headers: headers,
                //dataType: "json",
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.isSuccess) {
                        $("#modalFooter").html('')
                        $("#modalFooter").append(btnDismiss);
                        $("#modalContent").html('');
                        $("#modalContent").append('<label>' + successMessage + '</label>');

                        $("#btnClose").click(function () {
                            setTimeout(function () {
                                window.location.replace("/Customer");
                            }, 1000);
                        });

                    } else {
                        if (data.isListResult) {
                            var msg = "";

                            for (var i = 0; i < data.result.length; i++) {
                                msg += "Error : " + data.result[i] + "\n";
                            }

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label>' + msg + '</label>');

                            $("#btnClose").click(function () {
                                setTimeout(function () {
                                    window.location.replace("/Customer");
                                }, 1000);
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.result + '</label>');

                            $("#btnClose").click(function () {
                                setTimeout(function () {
                                    window.location.replace("/Customer");
                                }, 1000);
                            });
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#modalFooter").html('')
                    $("#modalFooter").append(btnDismiss);
                    $("#modalContent").html('');
                    $("#modalContent").append('<p class="text-bg-primary text-wrap text-break">Error Status: (' + jqXHR.status + ') ' + jqXHR.responseText + ', ' + textStatus + ', ' + errorThrown + '</p>');

                    $("#btnClose").click(function () {
                        setTimeout(function () {
                            window.location.replace("/Customer");
                        }, 1000);
                    });
                },
            });
        }
    }

    var InitialiseCustomerObjectTask = function () {
        var customerObjectTask = Object.create(CustomerObjectTask);
        customerObjectTask.init();
    }

    InitialiseCustomerObjectTask();

});


$(function () {

    DecimalOnly($("#txtDosage"));
    NameOnly($("#txtDosage"));
    NameOnly($("#txtPatients"));

    var successMessage = '';
    //Added Anti-forgery Token
    var token = $('input[name="__RequestVerificationToken"]').val();
    var headers = {};
    headers['RequestVerificationToken'] = token;
    var btnDismiss = '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btnClose">Ok</button>';

    $('a[id^="btnEdit"]').click(function () {
        debugger;
        pageName = "Edit";
        submitFormURL = editActionURL;
        customerID = $(this).attr('value');
        var form_data = new FormData();
        form_data.append("id", customerID)

        $.ajax({
            url: "/Customer/JsonDetails",
            type: "POST",
            //data: JSON.stringify(inputVal),
            data: form_data,
            headers: headers,
            //dataType: "json",
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.isSuccess) {
                    //debugger;
                    $("#edtFirstName").val(data.result.firstName);
                    $("#edtLastName").val(data.result.lastName);
                    $("#edtFullName").val(data.result.fullName);
                    $("#edtMobileNumber").val(data.result.mobileNumber);
                    $("#edtCity").val(data.result.city);
                    $("#edtDateCreated").val(data.result.dateCreated);
                    $("#edtCreatedBy").val(data.result.createdBy);
                    $("#edtTimestamp").val(data.result.timestamp);
                    $("#edtUserID").val(data.result.userID);
                    $("#edtIsActive").prop("checked", data.result.isActive);

                } else {
                    if (data.isListResult) {
                        var msg = "";

                        for (var i = 0; i < data.result.length; i++) {
                            msg += "Error : " + data.result[i] + "\n";
                        }

                        $("#modalFooter").html('')
                        $("#modalFooter").append(btnDismiss);
                        $("#modalContent").html('');
                        $("#modalContent").append('<label>' + msg + '</label>');

                        $("#btnClose").click(function () {
                            setTimeout(function () {
                                window.location.replace("/Customer");
                            }, 1000);
                        });
                    }
                    else {

                        $("#modalFooter").html('')
                        $("#modalFooter").append(btnDismiss);
                        $("#modalContent").html('');
                        $("#modalContent").append('<label> Error: ' + data.result + '</label>');

                        $("#btnClose").click(function () {
                            setTimeout(function () {
                                window.location.replace("/Customer");
                            }, 1000);
                        });
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#modalFooter").html('')
                $("#modalFooter").append(btnDismiss);
                $("#modalContent").html('');
                $("#modalContent").append('<p class="text-bg-primary text-wrap text-break">Error Status: (' + jqXHR.status + ') ' + jqXHR.responseText + ', ' + textStatus + ', ' + errorThrown + '</p>');

                $("#btnClose").click(function () {
                    setTimeout(function () {
                        window.location.replace("/Customer");
                    }, 1000);
                });
            },
        });
    });

    $("#btnCreate").on('click', function () {
        $("#FirstName").val('');
        $("#LastName").val('');
        $("#MobileNumber").val('');
        $("#City").val('');
        $("#IsActive").val('false');

        pageName = "Create";
        submitFormURL = addActionURL;
    });
});

function FormValidation() {

    // jQuery.validator.addMethod("DecimalFormat", function (value, element, params) {
    //     return this.optional(element) || /^\d{0,3}(\.\d{0,4})?$/i.test(value);
    // }, false);

    var ctr = 0;
    var errorCount = 0;
    var requiredErrors = [];
    var otherErrors = []
    // validator = $("#frmAppForm").validate({
    //     errorElement: "label",
    //     errorClass: "errMessage",
    //     onfocusout: false,
    //     onkeyup: false,
    //     onclick: false,
    //     ignore: [], //to still validate the hidden fields
    //     rules: {
    //         txtDosage: {
    //             required: true
    //         },
    //         txtDrug: {
    //             required: true
    //         },
    //         txtPatients: {
    //             required: true
    //         },
    //     },
    //     messages: {
    //         txtDosage: {
    //             required: 'Dosage is required.'
    //         },
    //         txtDrug: {
    //             required: 'Drug is required.'
    //         },
    //         txtPatients: {
    //             required: 'Patient name is required.'
    //         },

    //     },
    //     invalidHandler: function () {
    //         $("#errorMessage").empty();
    //         $("#errorMessage").css("background-color", "");
    //         errorCount = validator.numberOfInvalids();
    //     },
    //     errorPlacement: function (error, element) {
    //         ctr++;
    //         if ($(error).text().indexOf('required') < 0) {
    //             otherErrors.push('<label class=\"errMessage\"><h5>' + $(error).text() + '.</h5></label> <br />');
    //         }
    //         else {
    //             requiredErrors.push('<label class=\"errMessage\"><h5>' + $(error).text() + '.</h5></label> <br />');
    //         }

    //         if (ctr == errorCount) {

    //             if ((requiredErrors.length == 1 && otherErrors.length == 1) || (requiredErrors.length > 1 || otherErrors.length > 1)) {
    //                 requiredErrors = [];
    //                 otherErrors = [];
    //                 $("#divErrorMessage").append('<label class=\"errMessage\"><h5>Highlighted fields are required.</h5></label><br />');
    //                 $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

    //             }
    //             else if (requiredErrors.length == 1) {
    //                 $("#divErrorMessage").append(requiredErrors);
    //                 $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

    //             }
    //             else if (otherErrors.length == 1) {
    //                 $("#divErrorMessage").append(otherErrors);
    //                 $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

    //             }

    //             requiredErrors = [];
    //             otherErrors = [];
    //             ctr = 0;
    //         }

    //     }

    // });
}

function DecimalOnly(textbox) {
    textbox.keydown(function (e) {
        if ("" + /^[^0-9.]$/.test(e.key) == "true") {
            e.preventDefault();
        }
    });
}

function NameOnly(textbox) {
    textbox.keydown(function (e) {
        if ("" + /^[!@#$%^&*()+=`~?><,\"/\\:;\]\[{}|•√π÷×¶∆£¢€¥°©®™℅¡¿_]$/.test(e.key) == "true") {
            e.preventDefault();
        }
    });
}