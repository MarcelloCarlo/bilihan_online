var customerID = "";
var pageName = "Index";
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
            self.$btnCreate = $("#btnCreate");
            self.$btnEdit = $('a[id^="btnEdit"]');

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
                    self.$CustomerForm = $("#CreateCustomerForm");
                    self.$divErrorMessage = $("#divErrorMessage");
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
                    self.$CustomerForm = $("#EditCustomerForm");
                    self.$divErrorMessage = $("#edtdivErrorMessage");
                    break;
                default:
                    self.$FirstName = $("#edtFirstName");
                    self.$LastName = $("#edtLastName");
                    self.$FullName = $("#edtFullName");
                    self.$MobileNumber = $("#edtMobileNumber");
                    self.$City = $("#edtCity");
                    self.$DateCreated = $("#edtDateCreated");
                    self.$CreatedBy = $("#edtCreatedBy");
                    self.$Timestamp = $("#edtTimestamp");
                    self.$UserID = $("#edtUserID");
                    self.$IsActive = $("#edtIsActive");
                    break;

            }

        },
        setEvent: function () {
            var self = this;

            self.$btnCreate.on('click', function () {
                customerID = "";
                pageName = "Create";
                submitFormURL = addActionURL;
                self.declaration();

                self.$FirstName.val('');
                self.$LastName.val('');
                self.$MobileNumber.val('');
                self.$City.val('');
                self.$IsActive.val('false');

            });

            self.$btnEdit.on('click', function () {

                pageName = "Index";
                submitFormURL = getActionURL;
                customerID = $(this).attr('value');
                var form_data = new FormData();
                form_data.append("id", customerID);
                self.declaration();

                self.setAjaxSendEvent(form_data);
            });

            //Submit action
            self.$btnSubmit.on('click', function () {
                //If the inputs are valid
                //proceed to btnConfirm action
                //else, throw an error
                self.declaration();
                self.formValidate();
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
                pageName = "Edit"
                submitFormURL = editActionURL;
                self.declaration();

                self.formValidate();
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
                data: inputVal,
                headers: headers,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.isSuccess) {
                        if (pageName == "Create" || pageName == "Edit") {
                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label>' + successMessage + '</label>');

                            $("#btnClose").click(function () {
                                window.location.replace("/Customer");
                            });
                        }
                        else {
                            self.$FirstName.val(data.result.firstName);
                            self.$LastName.val(data.result.lastName);
                            self.$FullName.val(data.result.fullName);
                            self.$MobileNumber.val(data.result.mobileNumber);
                            self.$City.val(data.result.city);

                            self.$DateCreated.val(data.result.dateCreated);
                            self.$CreatedBy.val(data.result.createdBy);
                            self.$Timestamp.val(data.result.timestamp);
                            self.$UserID.val(data.result.userID);
                            self.$IsActive.prop("checked", data.result.isActive);
                        }

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
                                window.location.replace("/Customer");
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.result + '</label>');

                            $("#btnClose").click(function () {
                                window.location.replace("/Customer");
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
                        window.location.replace("/Customer");
                    });
                },
            });
        },
        formValidate: function () { 
            var self = this;
            debugger;
            var ctr = 0;
            var errorCount = 0;
            var requiredErrors = [];
            var otherErrors = []
            validator = self.$CustomerForm.validate({
                debug: true,
                errorElement: "span",
                errorClass: "invalid",
                onfocusout: false,
                onkeyup: false,
                onclick: false,
                ignore: [], //to still validate the hidden fields
                rules: {
                    FirstName: {
                        required: true,
                        minlength: 2
                    },
                    LastName: {
                        required: true,
                        minlength: 2
                    },
                    MobileNumber: {
                        required: true,
                        minlength: 10,
                        maxlength: 10
                    },
                    City: {
                        required: true,
                        minlength: 2
                    },
                },
                messages: {
                    FirstName: {
                        required: "First Name is required.",
                        minlength: "First Name requires at least 2 letters."
                    },
                    LastName: {
                        required: "Last Name is required.",
                        minlength: "Last Name requires at least 2 letters."
                    },
                    MobileNumber: {
                        required: "Mobile Number is required.",
                        minlength: "Mobile Number requires at least 10 digits.",
                        maxlength: "Mobile Number only accepts 10-digit numbers."
                    },
                    City: {
                        required: "City is required.",
                        minlength: "City requires at least 2 letters."
                    },
                },
                invalidHandler: function () {
                    $("#errorMessage").empty();
                    $("#errorMessage").css("background-color", "");
                    errorCount = validator.numberOfInvalids();
                },
                errorPlacement: function (error, element) {
                    ctr++;
                    if ($(error).text().indexOf('required') < 0) {
                        otherErrors.push('<span class=\"invalid\"><h5>' + $(error).text() + '.</h5></span> <br />');
                    }
                    else {
                        requiredErrors.push('<span class=\"invalid\"><h5>' + $(error).text() + '.</h5></span> <br />');
                    }
        
                    if (ctr == errorCount) {
        
                        if ((requiredErrors.length == 1 && otherErrors.length == 1) || (requiredErrors.length > 1 || otherErrors.length > 1)) {
                            requiredErrors = [];
                            otherErrors = [];
                            self.$divErrorMessage.append('<span class=\"invalid\"><h5>Highlighted fields are required.</h5></span><br />');
                            self.$divErrorMessage.css({ "background-color": "rgba(183, 2, 2, 0.08)" });
        
                        }
                        else if (requiredErrors.length == 1) {
                            self.$divErrorMessage.append(requiredErrors);
                            self.$divErrorMessage.css({ "background-color": "rgba(183, 2, 2, 0.08)" });
        
                        }
                        else if (otherErrors.length == 1) {
                            self.$divErrorMessage.append(otherErrors);
                            self.$divErrorMessage.css({ "background-color": "rgba(183, 2, 2, 0.08)" });
        
                        }
        
                        requiredErrors = [];
                        otherErrors = [];
                        ctr = 0;
                    }
        
                }
        
            });
        },
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

    // $('a[id^="btnEdit"]').click(function () {
    //     debugger;
    //     pageName = "Edit";
    //     submitFormURL = editActionURL;
    //     customerID = $(this).attr('value');
    //     var form_data = new FormData();
    //     form_data.append("id", customerID)

    //     $.ajax({
    //         url: "/Customer/JsonDetails",
    //         type: "POST",
    //         //data: JSON.stringify(inputVal),
    //         data: form_data,
    //         headers: headers,
    //         //dataType: "json",
    //         contentType: false,
    //         processData: false,
    //         success: function (data) {
    //             if (data.isSuccess) {
    //                 //debugger;
    //                 $("#edtFirstName").val(data.result.firstName);
    //                 $("#edtLastName").val(data.result.lastName);
    //                 $("#edtFullName").val(data.result.fullName);
    //                 $("#edtMobileNumber").val(data.result.mobileNumber);
    //                 $("#edtCity").val(data.result.city);
    //                 $("#edtDateCreated").val(data.result.dateCreated);
    //                 $("#edtCreatedBy").val(data.result.createdBy);
    //                 $("#edtTimestamp").val(data.result.timestamp);
    //                 $("#edtUserID").val(data.result.userID);
    //                 $("#edtIsActive").prop("checked", data.result.isActive);

    //             } else {
    //                 if (data.isListResult) {
    //                     var msg = "";

    //                     for (var i = 0; i < data.result.length; i++) {
    //                         msg += "Error : " + data.result[i] + "\n";
    //                     }

    //                     $("#modalFooter").html('')
    //                     $("#modalFooter").append(btnDismiss);
    //                     $("#modalContent").html('');
    //                     $("#modalContent").append('<label>' + msg + '</label>');

    //                     $("#btnClose").click(function () {
    //                         window.location.replace("/Customer");
    //                     });
    //                 }
    //                 else {

    //                     $("#modalFooter").html('')
    //                     $("#modalFooter").append(btnDismiss);
    //                     $("#modalContent").html('');
    //                     $("#modalContent").append('<label> Error: ' + data.result + '</label>');

    //                     $("#btnClose").click(function () {
    //                         window.location.replace("/Customer");
    //                     });
    //                 }
    //             }
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //             $("#modalFooter").html('')
    //             $("#modalFooter").append(btnDismiss);
    //             $("#modalContent").html('');
    //             $("#modalContent").append('<p class="text-bg-primary text-wrap text-break">Error Status: (' + jqXHR.status + ') ' + jqXHR.responseText + ', ' + textStatus + ', ' + errorThrown + '</p>');

    //             $("#btnClose").click(function () {
    //                 setTimeout(function () {
    //                     window.location.replace("/Customer");
    //                 }, 1000);
    //             });
    //         },
    //     });
    // });

});

// function FormValidation() {

//     // jQuery.validator.addMethod("DecimalFormat", function (value, element, params) {
//     //     return this.optional(element) || /^\d{0,3}(\.\d{0,4})?$/i.test(value);
//     // }, false);

//     var ctr = 0;
//     var errorCount = 0;
//     var requiredErrors = [];
//     var otherErrors = []
//     validator = $("#CreateCustomerForm").validate({
//         errorElement: "label",
//         errorClass: "errMessage",
//         onfocusout: false,
//         onkeyup: false,
//         onclick: false,
//         ignore: [], //to still validate the hidden fields
//         rules: {
//             txtDosage: {
//                 required: true
//             },
//             txtDrug: {
//                 required: true
//             },
//             txtPatients: {
//                 required: true
//             },
//         },
//         messages: {
//             txtDosage: {
//                 required: 'Dosage is required.'
//             },
//             txtDrug: {
//                 required: 'Drug is required.'
//             },
//             txtPatients: {
//                 required: 'Patient name is required.'
//             },

//         },
//         invalidHandler: function () {
//             $("#errorMessage").empty();
//             $("#errorMessage").css("background-color", "");
//             errorCount = validator.numberOfInvalids();
//         },
//         errorPlacement: function (error, element) {
//             ctr++;
//             if ($(error).text().indexOf('required') < 0) {
//                 otherErrors.push('<label class=\"errMessage\"><h5>' + $(error).text() + '.</h5></label> <br />');
//             }
//             else {
//                 requiredErrors.push('<label class=\"errMessage\"><h5>' + $(error).text() + '.</h5></label> <br />');
//             }

//             if (ctr == errorCount) {

//                 if ((requiredErrors.length == 1 && otherErrors.length == 1) || (requiredErrors.length > 1 || otherErrors.length > 1)) {
//                     requiredErrors = [];
//                     otherErrors = [];
//                     $("#divErrorMessage").append('<label class=\"errMessage\"><h5>Highlighted fields are required.</h5></label><br />');
//                     $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

//                 }
//                 else if (requiredErrors.length == 1) {
//                     $("#divErrorMessage").append(requiredErrors);
//                     $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

//                 }
//                 else if (otherErrors.length == 1) {
//                     $("#divErrorMessage").append(otherErrors);
//                     $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

//                 }

//                 requiredErrors = [];
//                 otherErrors = [];
//                 ctr = 0;
//             }

//         }

//     });
// }

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