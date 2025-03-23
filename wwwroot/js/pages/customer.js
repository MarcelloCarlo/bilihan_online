$(document).ready(function () {

    var customerID = "";
    var pageName = "Index";
    var submitFormURL = "";
    var headers = {};
    var successMessage = "";
    var btnDismiss = '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btnClose">Ok</button>';

    /**
     * @namespace CustomerObjectTask
     * @description Handles customer-related operations and form management in the application
     * @property {Function} init - Initializes the customer object by calling declaration and setEvent methods
     * @property {Function} declaration - Declares and initializes DOM element references and sets up form based on page context
     * @property {Function} setEvent - Sets up event handlers for various buttons and form actions
     * @property {Function} setSubmitEvent - Handles form submission validation and confirmation modal display
     * @property {Function} setAjaxSendEvent - Performs AJAX requests to server for CRUD operations
     * @property {Function} clearInputs - Clears all input fields in the form
     * @property {Function} formValidate - Sets up jQuery validation rules and custom error handling for the form
     * @property {Function} textOnly - Restricts input to text characters only
     * @property {Function} numbersOnly - Restricts input to numeric characters only
     * @requires jQuery
     * @requires jQuery.validate
     */

    var CustomerObjectTask = {

        init: function () {
            var self = this;
            self.declaration();
            self.setEvent();
        },
        declaration: function () {
            var self = this;

            self.$Token = $('input[name="__RequestVerificationToken"]');
            self.$confirmationModal = $("#confirmationModal");
            self.$modalContent = $("#modalContent");
            self.$modalFooter = $("#modalFooter");
            self.$btnSubmit = $("#btnSubmit");
            self.$btnEdtSubmit = $("#btnEdtSubmit");
            self.$btnConfirm = $("#btnConfirm");
            self.$btnClose = $("#btnClose");
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

                    self.textOnly(self.$FirstName);
                    self.textOnly(self.$LastName);
                    self.numbersOnly(self.$MobileNumber);
                    self.textOnly(self.$City);

                    self.$IsActive = $("#IsActive");

                    self.$CustomerForm = $("#CreateCustomerForm");
                    self.$divErrorMessage = $("#divErrorMessage");

                    self.$divErrorMessage.empty(); // Clear previous errors
                    self.$divErrorMessage.removeClass("alert alert-danger");
                    break;
                case "Edit":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to update this record?</label>');
                    successMessage = 'Record successfully updated.';

                    self.$FirstName = $("#edtFirstName");
                    self.$LastName = $("#edtLastName");
                    self.$MobileNumber = $("#edtMobileNumber");
                    self.$City = $("#edtCity");

                    self.textOnly(self.$FirstName);
                    self.textOnly(self.$LastName);
                    self.numbersOnly(self.$MobileNumber);
                    self.textOnly(self.$City);

                    self.$IsActive = $("#edtIsActive");

                    self.$CustomerForm = $("#EditCustomerForm");
                    self.$divErrorMessage = $("#edtdivErrorMessage");

                    self.$divErrorMessage.empty(); // Clear previous errors
                    self.$divErrorMessage.removeClass("alert alert-danger");
                    break;
                default:
                    self.$FirstName = $("#edtFirstName");
                    self.$LastName = $("#edtLastName");
                    self.$FullName = $("#edtFullName");
                    self.$MobileNumber = $("#edtMobileNumber");
                    self.$City = $("#edtCity");

                    self.textOnly(self.$FirstName);
                    self.textOnly(self.$LastName);
                    self.numbersOnly(self.$MobileNumber);
                    self.textOnly(self.$City);

                    self.$DateCreated = $("#edtDateCreated");
                    self.$CreatedBy = $("#edtCreatedBy");
                    self.$Timestamp = $("#edtTimestamp");
                    self.$UserID = $("#edtUserID");
                    self.$IsActive = $("#edtIsActive");

                    self.$CustomerForm = $("#EditCustomerForm");
                    self.$divErrorMessage = $("#edtdivErrorMessage");

                    self.$divErrorMessage.empty(); // Clear previous errors
                    self.$divErrorMessage.removeClass("alert alert-danger");
                    break;
            }

        },
        setEvent: function () {
            var self = this;

            self.$btnCreate.on('click', function () {
                pageName = "Create";
                submitFormURL = addActionURL;

                self.declaration();
                self.formValidate();
                self.clearInputs();
            });

            self.$btnEdit.on('click', function () {
                pageName = "Index";
                submitFormURL = getActionURL;
                customerID = $(this).attr('value');
                var form_data = new FormData();
                form_data.append("id", customerID);

                self.declaration();
                self.formValidate();
                self.setAjaxSendEvent(form_data);
            });

            //Submit action
            self.$btnSubmit.on('click', function (e) {
                e.preventDefault();

                self.declaration();
                self.setSubmitEvent();
            });

            self.$btnEdtSubmit.on('click', function (e) {
                e.preventDefault();

                pageName = "Edit"
                submitFormURL = editActionURL;

                self.declaration();
                self.setSubmitEvent();
            });

        },
        setSubmitEvent: function () {
            var self = this;

            if (self.$CustomerForm.valid()) {
                self.$divErrorMessage.empty();
                self.$divErrorMessage.removeClass("alert alert-danger");
                self.$confirmationModal.modal('show');

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

            } else {
                self.$divErrorMessage.empty(); // Clear previous errors
                self.$divErrorMessage.removeClass("alert alert-danger");
                self.$CustomerForm.validate().showErrors(); // Show validation errors
            }
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
                            self.$modalFooter.html('')
                            self.$modalFooter.append(btnDismiss);
                            self.$modalContent.html('');
                            self.$modalContent.append('<label>' + successMessage + '</label>');

                            $("#btnClose").on('click', function () {
                                window.location.replace("/Customer");
                            });
                        }
                        else {
                            self.$FirstName.val(data.result.firstName);
                            self.$LastName.val(data.result.lastName);
                            self.$FullName.val(data.result.fullName);
                            self.$MobileNumber.val(data.result.mobileNumber);
                            self.$City.val(data.result.city);

                            self.$DateCreated.val(self.formatDate(data.result.dateCreated));
                            self.$CreatedBy.val(data.result.createdBy);
                            self.$Timestamp.val(self.formatDate(data.result.timestamp));
                            self.$UserID.val(data.result.userID);
                            self.$IsActive.prop("checked", data.result.isActive);
                        }

                    } else {
                        if (data.isListResult) {
                            var msg = "";

                            for (var i = 0; i < data.result.length; i++) {
                                msg += "Error : " + data.result[i] + "\n";
                            }

                            self.$modalFooter.html('')
                            self.$modalFooter.append(btnDismiss);
                            self.$modalContent.html('');
                            self.$modalContent.append('<label>' + msg + '</label>');

                            $("#btnClose").on('click', function () {
                                window.location.replace("/Customer");
                            });
                        }
                        else {

                            self.$modalFooter.html('')
                            self.$modalFooter.append(btnDismiss);
                            self.$modalContent.html('');
                            self.$modalContent.append('<label> Error: ' + data.result + '</label>');

                            $("#btnClose").on('click', function () {
                                window.location.replace("/Customer");
                            });
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    self.$modalFooter.html('')
                    self.$modalFooter.append(btnDismiss);
                    self.$modalContent.html('');
                    self.$modalContent.append('<p class="text-bg-primary text-wrap text-break">Error Status: (' + jqXHR.status + ') ' + jqXHR.responseText + ', ' + textStatus + ', ' + errorThrown + '</p>');

                    $("#btnClose").on('click', function () {
                        window.location.replace("/Customer");
                    });
                },
            });
        },
        clearInputs: function () {
            var self = this;

            customerID = "";

            self.$FirstName.val('');
            self.$LastName.val('');
            self.$MobileNumber.val('');
            self.$City.val('');
            self.$IsActive.val('false');
        },
        formValidate: function () {
            var self = this;
            var ctr = 0;
            var errorCount = 0;
            var requiredErrors = [];
            var otherErrors = []
            validator = self.$CustomerForm.validate({
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
                    self.$divErrorMessage.empty();
                    self.$divErrorMessage.removeClass("alert alert-danger");
                    errorCount = validator.numberOfInvalids();
                },
                errorPlacement: function (error, element) {
                    ctr++;

                    if ($(error).text().indexOf('required') < 0) {
                        otherErrors.push('<span class=\"invalid\"><h5>' + $(error).text() + '</h5></span>');
                    }
                    else {
                        requiredErrors.push('<span class=\"invalid\"><h5>' + $(error).text() + '</h5></span>');
                    }

                    if (ctr == errorCount) {

                        if ((requiredErrors.length == 1 && otherErrors.length == 1) || (requiredErrors.length > 1 || otherErrors.length > 1)) {
                            requiredErrors = [];
                            otherErrors = [];
                            self.$divErrorMessage.append('<span class=\"invalid\"><h5>All fields are required.</h5></span>');
                            self.$divErrorMessage.addClass("alert alert-danger");

                        }
                        else if (requiredErrors.length == 1) {
                            self.$divErrorMessage.append(requiredErrors);
                            self.$divErrorMessage.addClass("alert alert-danger");

                        }
                        else if (otherErrors.length == 1) {
                            self.$divErrorMessage.append(otherErrors);
                            self.$divErrorMessage.addClass("alert alert-danger");

                        }

                        requiredErrors = [];
                        otherErrors = [];
                        ctr = 0;
                    }

                }
            });
        },
        textOnly: function (input) {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Space'];
            const letterPattern = /^[a-zA-Z\s]$/;

            input.on('keydown', function (e) {
                // Allow control keys
                if (allowedKeys.includes(e.key)) {
                    return true;
                }

                // Allow letters and spaces only
                if (!letterPattern.test(e.key)) {
                    e.preventDefault();
                    return false;
                }
            });

            // Clean invalid characters on paste
            input.on('paste', function (e) {
                e.preventDefault();
                const text = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
                const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                $(this).val(cleanedText);
            });
        },
        numbersOnly: function (input) {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
            const numberPattern = /^[0-9]$/;

            input.on('keydown', function (e) {
                // Allow control keys
                if (allowedKeys.includes(e.key)) {
                    return true;
                }

                // Allow numbers only
                if (!numberPattern.test(e.key)) {
                    e.preventDefault();
                    return false;
                }
            });

            // Clean invalid characters on paste
            input.on('paste', function (e) {
                e.preventDefault();
                const text = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
                const cleanedText = text.replace(/[^0-9]/g, '');
                $(this).val(cleanedText);
            });
        },
        formatDate: function (dateToFormat) {
            try {
                // Handle invalid input
                if (!dateToFormat) {
                    console.warn('Invalid date provided:', dateToFormat);
                    return '';
                }

                const dateObject = new Date(dateToFormat);

                // Check for invalid date
                if (isNaN(dateObject.getTime())) {
                    console.warn('Invalid date provided:', dateToFormat);
                    return '';
                }

                // Use modern Intl API for localized date formatting
                return new Intl.DateTimeFormat('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }).format(dateObject);

            } catch (error) {
                console.error('Error formatting date:', error);
                return '';
            }
        }
    }
    var InitialiseCustomerObjectTask = function () {
        var customerObjectTask = Object.create(CustomerObjectTask);
        customerObjectTask.init();
    }

    InitialiseCustomerObjectTask();

});