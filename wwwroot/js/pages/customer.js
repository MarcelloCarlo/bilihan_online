$(document).ready(function () {

    var headers = {};
    var successMessage = "";
    var btnDismiss = '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btnClose">Ok</button>';

    var MedicationObjectTask = {

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
            self.$btnDelete = $('a[id^="btnDelete"]');
            self.$btnConfirm = $("#btnConfirm");
            self.$btnClear = $("#btnClear");
            self.$txtDosage = $("#txtDosage");
            self.$txtDrug = $("#txtDrug");
            self.$txtPatients = $("#txtPatients");

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
                case "Index":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to delete this record?</label>');
                    successMessage = 'Record successfully deleted.';
                    break;

            }

        },
        setEvent: function () {
            var self = this;

            self.$btnClear.on('click', function () {
                self.$txtDosage.val('');
                self.$txtDrug.val('');
                self.$txtPatients.val('');
            });

            //Submit action
            self.$btnSubmit.on('click', function () {
                //If the inputs are valid
                //proceed to btnConfirm action
                //else, throw an error
                self.$btnConfirm.on('click', function () {

                    var inputVal = {
                        Id: (patientId == '' || patientId == null ? '0' : patientId),
                        Dosage: self.$txtDosage.val().trim(),
                        Drug: self.$txtDrug.val().trim(),
                        Patients: self.$txtPatients.val().trim()
                    };

                    self.setAjaxSendEvent(inputVal);

                });

            });
        },
        setAjaxSendEvent: function (inputVal) {
            var self = this;

            headers['__RequestVerificationToken'] = self.$Token.val();

            $.ajax({
                url: window.submitFormURL,
                type: "POST",
                data: JSON.stringify(inputVal),
                headers: headers,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.IsSuccess) {

                        $("#modalFooter").html('')
                        $("#modalFooter").append(btnDismiss);
                        $("#modalContent").html('');
                        $("#modalContent").append('<label>' + successMessage + '</label>');

                        $("#btnClose").click(function () {
                            setTimeout(function () {
                                window.location.replace("/Medication");
                            }, 1000);
                        });

                    } else {
                        if (data.IsListResult) {
                            var msg = "";

                            for (var i = 0; i < data.Result.length; i++) {
                                msg += "Error : " + data.Result[i] + "\n";
                            }

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label>' + msg + '</label>');

                            $("#btnClose").click(function () {
                                setTimeout(function () {
                                    window.location.replace("/Medication");
                                }, 1000);
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.Result + '</label>');

                            $("#btnClose").click(function () {
                                setTimeout(function () {
                                    window.location.replace("/Medication");
                                }, 1000);
                            });
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#modalFooter").html('')
                    $("#modalFooter").append(btnDismiss);
                    $("#modalContent").html('');
                    $("#modalContent").append('<label> Error: ' + $(jqXHR.responseText).filter('title').text() + ', ' + textStatus + ', ' + errorThrown + '</label>');

                    $("#btnClose").click(function () {
                        setTimeout(function () {
                            window.location.replace("/Medication");
                        }, 1000);
                    });
                },
            });
        }
    }

    var InitialiseMedicationObjectTask = function () {
        var medicationObjectTask = Object.create(MedicationObjectTask);
        medicationObjectTask.init();
    }

    InitialiseMedicationObjectTask();

});


$(function () {

    DecimalOnly($("#txtDosage"));
    NameOnly($("#txtDosage"));
    NameOnly($("#txtPatients"));

    var successMessage = '';
    //Added Anti-forgery Token
    var token = $('input[name="__RequestVerificationToken"]').val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;
    var btnDismiss = '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btnClose">Ok</button>';

    if (pageName == 'Create') {
        $("#modalContent").html('');
        $("#modalContent").append('<label>Are you sure you want to add this record?</label>');
        successMessage = 'Record successfully saved.';
        FormValidation();
    }

    if (pageName == 'Edit') {
        $("#modalContent").html('');
        $("#modalContent").append('<label>Are you sure you want to update this record?</label>');
        successMessage = 'Record successfully updated.';
        FormValidation();
    }

    if (pageName == 'Index') {
        $("#modalContent").html('');
        $("#modalContent").append('<label>Are you sure you want to delete this record?</label>');
        successMessage = 'Record successfully deleted.';
    }

    $("#btnSubmit").click(function () {

        //On submit
        $("#btnConfirm").click(function () {

            var inputVal = {
                Id: (patientId == '' || patientId == null ? '0' : patientId),
                Dosage: $("#txtDosage").val().trim(),
                Drug: $("#txtDrug").val().trim(),
                Patients: $("#txtPatients").val().trim()
            };

            $.ajax({
                url: window.submitFormURL,
                type: "POST",
                data: JSON.stringify(inputVal),
                headers: headers,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.IsSuccess) {

                        $("#modalFooter").html('')
                        $("#modalFooter").append(btnDismiss);
                        $("#modalContent").html('');
                        $("#modalContent").append('<label>' + successMessage + '</label>');

                        $("#btnClose").click(function () {
                            setTimeout(function () {
                                window.location.replace("/Medication");
                            }, 1000);
                        });

                    } else {
                        if (data.IsListResult) {
                            var msg = "";

                            for (var i = 0; i < data.Result.length; i++) {
                                msg += "Error : " + data.Result[i] + "\n";
                            }

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label>' + msg + '</label>');

                            $("#btnClose").click(function () {
                                setTimeout(function () {
                                    window.location.replace("/Medication");
                                }, 1000);
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.Result + '</label>');

                            $("#btnClose").click(function () {
                                setTimeout(function () {
                                    window.location.replace("/Medication");
                                }, 1000);
                            });
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#modalFooter").html('')
                    $("#modalFooter").append(btnDismiss);
                    $("#modalContent").html('');
                    $("#modalContent").append('<label> Error: ' + $(jqXHR.responseText).filter('title').text() + ', ' + textStatus + ', ' + errorThrown + '</label>');

                    $("#btnClose").click(function () {
                        setTimeout(function () {
                            window.location.replace("/Medication");
                        }, 1000);
                    });
                },
            });
        });

    });

    $('a[id^="btnDelete"]').click(function () {

        var selectedId = $(this).attr('value');

        $("#btnConfirm").click(function () {

            var inputVal = {
                Id: selectedId
            };

            $.ajax({
                url: window.submitFormURL,
                type: "POST",
                data: JSON.stringify(inputVal),
                headers: headers,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.IsSuccess) {

                        $("#modalFooter").html('')
                        $("#modalFooter").append(btnDismiss);
                        $("#modalContent").html('');
                        $("#modalContent").append('<label>' + successMessage + '</label>');

                        $("#btnClose").click(function () {
                            setTimeout(function () {
                                window.location.replace("/Medication");
                            }, 1000);
                        });

                    } else {
                        if (data.IsListResult) {
                            var msg = "";

                            for (var i = 0; i < data.Result.length; i++) {
                                msg += "Error : " + data.Result[i] + "\n";
                            }

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label>' + msg + '</label>');

                            $("#btnClose").click(function () {
                                setTimeout(function () {
                                    window.location.replace("/Medication");
                                }, 1000);
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.Result + '</label>');

                            $("#btnClose").click(function () {
                                setTimeout(function () {
                                    window.location.replace("/Medication");
                                }, 1000);
                            });
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#modalFooter").html('')
                    $("#modalFooter").append(btnDismiss);
                    $("#modalContent").html('');
                    $("#modalContent").append('<label> Error: ' + $(jqXHR.responseText).filter('title').text() + ', ' + textStatus + ', ' + errorThrown + '</label>');

                    $("#btnClose").click(function () {
                        setTimeout(function () {
                            window.location.replace("/Medication");
                        }, 1000);
                    });
                },
            });

            return false;
        });
    });

    $("#btnClear").click(function () {
        $("#txtDosage").val('');
        $("#txtDrug").val('');
        $("#txtPatients").val('');
    });


});

function FormValidation() {

    jQuery.validator.addMethod("DecimalFormat", function (value, element, params) {
        return this.optional(element) || /^\d{0,3}(\.\d{0,4})?$/i.test(value);
    }, false);

    var ctr = 0;
    var errorCount = 0;
    var requiredErrors = [];
    var otherErrors = []
    validator = $("#frmAppForm").validate({
        errorElement: "label",
        errorClass: "errMessage",
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        ignore: [], //to still validate the hidden fields
        rules: {
            txtDosage: {
                required: true
            },
            txtDrug: {
                required: true
            },
            txtPatients: {
                required: true
            },
        },
        messages: {
            txtDosage: {
                required: 'Dosage is required.'
            },
            txtDrug: {
                required: 'Drug is required.'
            },
            txtPatients: {
                required: 'Patient name is required.'
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
                otherErrors.push('<label class=\"errMessage\"><h5>' + $(error).text() + '.</h5></label> <br />');
            }
            else {
                requiredErrors.push('<label class=\"errMessage\"><h5>' + $(error).text() + '.</h5></label> <br />');
            }

            if (ctr == errorCount) {

                if ((requiredErrors.length == 1 && otherErrors.length == 1) || (requiredErrors.length > 1 || otherErrors.length > 1)) {
                    requiredErrors = [];
                    otherErrors = [];
                    $("#divErrorMessage").append('<label class=\"errMessage\"><h5>Highlighted fields are required.</h5></label><br />');
                    $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

                }
                else if (requiredErrors.length == 1) {
                    $("#divErrorMessage").append(requiredErrors);
                    $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

                }
                else if (otherErrors.length == 1) {
                    $("#divErrorMessage").append(otherErrors);
                    $("#divErrorMessage").css({ "background-color": "rgba(183, 2, 2, 0.08)" });

                }

                requiredErrors = [];
                otherErrors = [];
                ctr = 0;
            }

        }

    });
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