var skuID = "";
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
            self.$btnCreate = $("#btnCreate");
            self.$btnEdit = $('a[id^="btnEdit"]');

            self.$Name = $("#Name");
            self.$Code = $("#Code");
            self.$UnitPrice = $("#UnitPrice");
            self.$ProductImageHolder = $("#ProductImageHolder");
            self.$IsActive = $("#IsActive");


            self.$edtName = $("#edtName");
            self.$edtCode = $("#edtCode");
            self.$edtUnitPrice = $("#edtUnitPrice");
            self.$edtProductImageHolder = $("#edtProductImageHolder");
            self.$edtProductImageString = $("#edtProductImageString");
            self.$edtDateCreated = $("#edtDateCreated");
            self.$edtCreatedBy = $("#edtCreatedBy")
            self.$edtTimestamp = $("#edtTimestamp");
            self.$edtUserID = $("#edtUserID");
            self.$edtIsActive = $("#edtIsActive");

            switch (pageName) {
                case "Create":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to add this record?</label>');
                    successMessage = 'Record successfully saved.';
                    FormValidation();
                    break;
                case "Edit":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to update this record?</label>');
                    successMessage = 'Record successfully updated.';
                    FormValidation();
                    break;

            }

        },
        setEvent: function () {
            var self = this;

            self.$btnCreate.on('click', function () {
                self.$Name.val('');
                self.$Code.val('');
                self.$UnitPrice.val(0);
                self.$ProductImageHolder.val('');

                skuID = "";
                skuPrice = 0;

                pageName = "Create";
                submitFormURL = addActionURL;
            });

            self.$btnEdit.on('click', function () {

                submitFormURL = getActionURL;
                skuID = $(this).attr('value');
                var form_data = new FormData();
                form_data.append("id", skuID);
                self.declaration();

                self.setAjaxSendEvent(form_data);
            });

            //Submit action
            self.$btnSubmit.on('click', function () {
                //If the inputs are valid
                //proceed to btnConfirm action
                //else, throw an error
                self.declaration();
                self.$btnConfirm.on('click', function () {

                    var inputVal = {
                        Id: (skuID == '' || skuID == null ? '0' : skuID),
                        Name: self.$Name.val().trim(),
                        Code: self.$Code.val().trim(),
                        UnitPrice: self.$UnitPrice.val().trim(),
                        IsActive: self.$IsActive.is(":checked") ? "true" : "false"
                    };

                    var ProductImageHolder = self.$ProductImageHolder[0].files;
                    var form_data = new FormData();

                    for (var key in inputVal) {
                        form_data.append(key, inputVal[key]);
                    }
                    form_data.append("ProductImageHolder", ProductImageHolder[0]);

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
                self.$btnConfirm.on('click', function () {

                    var inputVal = {
                        Id: (skuID == '' || skuID == null ? '0' : skuID),
                        Name: self.$edtName.val().trim(),
                        Code: self.$edtCode.val().trim(),
                        UnitPrice: self.$edtUnitPrice.val().trim(),
                        IsActive: self.$edtIsActive.is(":checked") ? "true" : "false"
                    };

                    var ProductImageHolder = self.$edtProductImageHolder[0].files;
                    var form_data = new FormData();

                    for (var key in inputVal) {
                        form_data.append(key, inputVal[key]);
                    }
                    form_data.append("ProductImageHolder", ProductImageHolder[0]);

                    self.setAjaxSendEvent(form_data);

                });

            });

            self.$edtProductImageHolder.on('change', function () {
                if (self.$edtProductImageHolder[0].files) {

                    for (var i = 0; i < self.$edtProductImageHolder[0].files.length; i++) {

                        var file = self.$edtProductImageHolder[0].files[i];

                        var reader = new FileReader();
                        reader.onloadend = function () {
                            self.$edtProductImageString.attr('src', reader.result);
                        }
                        reader.readAsDataURL(file);
                        //$("input").after(img);
                    }
                }

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
                        if (pageName == "Create" || pageName == "Edit") {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label>' + successMessage + '</label>');

                            $("#btnClose").click(function () {
                                window.location.replace("/SKU");
                            });
                        }
                        else {
                            self.$edtName.val(data.result.name);
                            self.$edtCode.val(data.result.code);
                            self.$edtUnitPrice.val(data.result.unitPrice);
                            self.$edtProductImageHolder.val(data.result.productImageHolder);
                            self.$edtProductImageString.attr('src', data.result.productImageString);

                            self.$edtDateCreated.val(self.formatDateTime(data.result.dateCreated));
                            self.$edtCreatedBy.val(data.result.createdBy);
                            self.$edtTimestamp.val(self.formatDateTime(data.result.timestamp));
                            self.$edtUserID.val(data.result.userID);
                            self.$edtIsActive.prop("checked", data.result.isActive);
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
                                window.location.replace("/SKU");
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.result + '</label>');

                            $("#btnClose").click(function () {
                                window.location.replace("/SKU");
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
                        window.location.replace("/SKU");;
                    });
                },
            });
        },
        formatDateTime: function (dateToFormat) {
            var dateObject = new Date(dateToFormat);
            var day = dateObject.getDate();
            var month = dateObject.getMonth() + 1;
            var year = dateObject.getFullYear();
            var hours = dateObject.getHours();
            var mins = dateObject.getMinutes();
            var seconds = dateObject.getSeconds();
            day = day < 10 ? "0" + day : day;
            month = month < 10 ? "0" + month : month;
            hours = hours < 10 ? "0" + hours : hours;
            mins = mins < 10 ? "0" + mins : mins;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            var formattedDateTime = month + "/" + day + "/" + year + " " + hours + ":" + mins + ":" + seconds;
            return formattedDateTime;
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