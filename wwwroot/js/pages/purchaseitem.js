$(document).ready(function () {

    var customerID = "";
    var skuID = "";
    var skuPrice = 0;
    var orderItemID = "";
    var pageName = "Index";
    var submitFormURL = "";

    var headers = {};
    var successMessage = "";
    var btnDismiss = '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btnClose">Ok</button>';

    var PurchaseItemObjectTask = {

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
            self.$btnConfirm = $("#btnConfirm");
            self.$btnCreate = $("#btnCreate");
            self.$btnEdit = $('a[id^="btnEdit"]');
            self.$modalCreateNew = $("#modalCreateNew");
            self.$modalEdit = $("#modalEdit");

            self.$btnSubmit = $("#btnSubmit");
            self.$btnEdtSubmit = $("#btnEdtSubmit");

            self.$customerSearchResult = $("#customerSearchResult");
            self.$searchDiv = $("#searchDiv");

            self.$Customer = $("#Customer");
            self.$DeliveryDate = $("#DeliveryDate");
            self.$Status = $("#Status");

            self.textOnly(self.$Customer);
            self.dateOnly(self.$DeliveryDate);

            self.$SKUName = $("#SKUName");
            self.$Quantity = $("#Quantity");
            self.$SubTotal = $("#SubTotal");

            self.textOnly(self.$SKUName);
            self.numberOnly(self.$Quantity);
            self.decimalOnly(self.$SubTotal);

            self.$edtQuantity = $("#edtQuantity");
            self.numberOnly(self.$edtQuantity);

            self.$CustomerForm = $("#GetCustomerForm");
            self.$divErrorMessage = $("#initdivErrorMessage");

            self.$productSearchResult = $("#productSearchResult");
            self.$searchSKUDiv = $("#searchSKUDiv");

            self.$AmountDue = $("#AmountDue");

            switch (pageName) {
                case "Create":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to add this record?</label>');
                    successMessage = 'Record successfully saved.';

                    self.$productSearchResult = $("#productSearchResult");
                    self.$searchSKUDiv = $("#searchSKUDiv");

                    self.$SKUName = $("#SKUName");
                    self.$Quantity = $("#Quantity");
                    self.$SubTotal = $("#SubTotal");

                    self.textOnly(self.$SKUName);
                    self.numberOnly(self.$Quantity);
                    self.decimalOnly(self.$SubTotal);

                    self.$ProductItemForm = $("#CreateProductItemForm");
                    self.$divErrorMessage = $("#divErrorMessage");

                    self.$divErrorMessage.empty();
                    self.$divErrorMessage.removeClass("alert alert-danger");
                    break;
                case "Edit":
                    self.$modalContent.html('');
                    self.$modalContent.append('<label>Are you sure you want to update this record?</label>');
                    successMessage = 'Record successfully updated.';

                    self.$SKUName = $("#edtSKUName");
                    self.$edtQuantity = $("#edtQuantity");
                    self.$SubTotal = $("#edtSubTotal");

                    self.textOnly(self.$SKUName);
                    self.numberOnly(self.$Quantity);
                    self.decimalOnly(self.$SubTotal);

                    self.$ProductItemForm = $("#EditProductItemForm");
                    self.$divErrorMessage = $("#edtdivErrorMessage");

                    self.$divErrorMessage.empty();
                    self.$divErrorMessage.removeClass("alert alert-danger");
                    break;
                default:
                    if (orderID != 0 && orderID) {
                        submitFormURL = orderDetailsURL;
                        var form_data = new FormData();
                        form_data.append("id", orderID);
                        self.setAjaxGetDetails(form_data);
                    }

                    self.$CustomerForm = $("#GetCustomerForm");
                    self.$divErrorMessage = $("#initdivErrorMessage");

                    self.$divErrorMessage.empty();
                    self.$divErrorMessage.removeClass("alert alert-danger");

                    self.formCustomerValidate();
                    break;
            }

        },
        setEvent: function () {
            var self = this;

            self.$btnCreate.on('click', function () {

                if (self.$CustomerForm.valid() || (orderID != 0 && orderID)) {
                    pageName = "Create";

                    self.$divErrorMessage.empty();
                    self.$divErrorMessage.removeClass("alert alert-danger");

                    self.declaration();
                    self.formItemValidate();
                    self.clearInputs();

                    submitFormURL = addActionURL;
                    self.$modalCreateNew.modal('show');
                }

            });

            self.$btnEdit.on('click', function () {
                pageName = "Edit";

                submitFormURL = orderItemDetails;
                orderItemID = $(this).attr('value');
                var form_data = new FormData();
                form_data.append("id", orderItemID);

                self.declaration();
                self.formItemValidate();

                self.setAjaxGetOrderItemDetails(form_data);
            });

            //Submit action
            self.$btnSubmit.on('click', function (e) {
                self.setSubmitEvent();
            });

            self.$btnEdtSubmit.on('click', function (e) {
                pageName = "Edit"
                submitFormURL = editActionURL;

                //self.declaration();
                self.setSubmitEvent();
            });

            self.$Customer.on('keyup change', function () {
                if (self.$Customer.val() <= 0) {
                    self.$searchDiv.collapse('hide');
                }
                else {
                    submitFormURL = customerSearchURL;
                    self.$searchDiv.collapse('show');
                    var form_data = new FormData();
                    form_data.append("name", self.$Customer.val().trim());
                    self.setAjaxSearchCustomer(form_data);
                }
                ;
            });

            self.$customerSearchResult.on('click', '.list-group-item', function () {
                //var bubble = self.$customerSearchResult;
                customerID = $(this).attr('value').trim();

                var custName = $(this).children(".badge").attr('value').trim();
                self.$Customer.val(custName);

                self.$searchDiv.collapse('hide');

                self.$customerSearchResult.html('');
            });

            self.$DeliveryDate.datepicker({
                format: 'mm/dd/yyyy',
                startDate: '0d'
            });

            self.$Status.on('keyup change', function () {
                if (orderID != 0 && orderID) {

                    submitFormURL = orderUpdateStatus;
                    var inputVal = {
                        ID: (orderID == '' || orderID == null ? 0 : orderID),
                        Status: self.$Status.val().trim(),
                    };

                    var form_data = new FormData();

                    for (var key in inputVal) {
                        form_data.append(key, inputVal[key]);
                    }

                    self.setAjaxSendEvent(form_data);
                }
            });

            self.$SKUName.on('keyup change', function () {
                if (self.$SKUName.val() <= 0) {
                    self.$searchSKUDiv.collapse('hide');
                }
                else {
                    submitFormURL = productSearchURL;
                    self.$searchSKUDiv.collapse('show');
                    var form_data = new FormData();
                    form_data.append("product", self.$SKUName.val().trim());
                    self.setAjaxSearchSKU(form_data);
                }
            });

            self.$productSearchResult.on('click', '.list-group-item', function () {

                //var bubble = self.$customerSearchResult;
                skuID = $(this).attr('value').trim();

                var productName = $(this).children(".justify-content-between").attr('value').trim();
                var unitPrice = $(this).children(".unit-price").attr('value').trim();
                self.$SKUName.val(productName);
                self.$Quantity.val("1");
                self.$SubTotal.val(unitPrice);
                skuPrice = unitPrice;

                self.$searchSKUDiv.collapse('hide');

                self.$productSearchResult.html('');
                submitFormURL = addActionURL;
            });

            self.$Quantity.on('keyup change', function () {
                if (self.$Quantity.val().length <= 0) {
                    self.$SubTotal.val(0);
                }
                else {
                    var amount = self.$Quantity.val() * skuPrice;
                    self.$SubTotal.val(amount.toFixed(2));
                }

            });

            self.$edtQuantity.on('keyup change', function () {
                if (self.$edtQuantity.val().length <= 0) {
                    self.$SubTotal.val(0);
                }
                else {
                    var amount = self.$edtQuantity.val() * skuPrice;
                    self.$SubTotal.val(amount.toFixed(2));
                }

            });

        },
        setSubmitEvent: function () {
            var self = this;
            if (self.$ProductItemForm.valid()) {
                self.$divErrorMessage.empty();
                self.$divErrorMessage.removeClass("alert alert-danger");
                self.$confirmationModal.modal('show');

                self.$btnConfirm.on('click', function () {

                    if (pageName == "Create") {
                        var inputVal = {
                            PurchaseOrderModel: {
                                ID: (orderID == '' || orderID == null ? '0' : orderID),
                                CustomerID: { ID: customerID },
                                DateOfDelivery: self.$DeliveryDate.val().trim(),
                                Status: self.$Status.val().trim(),
                                AmountDue: (orderID == '' || orderID == null ? self.$SubTotal.val().trim() : self.$AmountDue.val().trim())
                            },
                            PurchaseItemModel: {
                                SKUID: { ID: skuID },
                                Quantity: self.$Quantity.val().trim(),
                                Price: self.$SubTotal.val().trim()
                            }
                        };

                        var form_data = new FormData();

                        for (var key in inputVal) {
                            if (inputVal.hasOwnProperty(key)) {
                                for (var subKey in inputVal[key]) {
                                    if (inputVal[key].hasOwnProperty(subKey)) {
                                        if (typeof inputVal[key][subKey] === 'object') {
                                            for (var innerKey in inputVal[key][subKey]) {
                                                if (inputVal[key][subKey].hasOwnProperty(innerKey)) {
                                                    form_data.append(key + '.' + subKey + '.' + innerKey, inputVal[key][subKey][innerKey]);
                                                }
                                            }
                                        } else {
                                            form_data.append(key + '.' + subKey, inputVal[key][subKey]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        var inputVal = {
                            ID: orderItemID,
                            Quantity: self.$edtQuantity.val().trim(),
                            Price: self.$SubTotal.val().trim()
                        }

                        var form_data = new FormData();

                        for (var key in inputVal) {
                            form_data.append(key, inputVal[key]);
                        }
                    }
                    debugger;
                    self.setAjaxSendEvent(form_data);

                });

            } else {
                self.$divErrorMessage.empty(); // Clear previous errors
                self.$divErrorMessage.removeClass("alert alert-danger");
                self.$ProductItemForm.validate().showErrors(); // Show validation errors
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
                        self.$modalFooter.html('')
                        self.$modalFooter.append(btnDismiss);

                        if (pageName == "Create" || pageName == "Edit") {
                            self.$modalContent.html('');
                            self.$modalContent.append('<label>' + successMessage + '</label>');
                        }
                        else {
                            self.$modalContent.html('');
                            self.$modalContent.append('<label>Status Updated Successfully.</label>');
                            self.$confirmationModal.modal('show');
                        }

                        $("#btnClose").on('click', function () {
                            window.location.replace("/PurchaseItem");
                        });

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

                            if (pageName != "Edit" && pageName != "Create") {
                                self.$confirmationModal.modal('show');
                            }

                            $("#btnClose").on('click', function () {
                                window.location.replace("/PurchaseItem");
                            });
                        }
                        else {

                            self.$modalFooter.html('')
                            self.$modalFooter.append(btnDismiss);
                            self.$modalContent.html('');
                            self.$modalContent.append('<label> Error: ' + data.result + '</label>');

                            if (pageName != "Edit" && pageName != "Create") {
                                self.$confirmationModal.modal('show');
                            }

                            $("#btnClose").on('click', function () {
                                window.location.replace("/PurchaseItem");
                            });
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    self.$modalFooter.html('')
                    self.$modalFooter.append(btnDismiss);
                    self.$modalContent.html('');
                    self.$modalContent.append('<p class="text-bg-primary text-wrap text-break">Error Status: (' + jqXHR.status + ') ' + jqXHR.responseText + ', ' + textStatus + ', ' + errorThrown + '</p>');

                    if (pageName != "Edit" && pageName != "Create") {
                        self.$confirmationModal.modal('show');
                    }

                    $("#btnClose").on('click', function () {
                        window.location.replace("/PurchaseItem");;
                    });
                },
            });
        },
        setAjaxSearchCustomer: function (inputVal) {
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

                        self.$customerSearchResult.html('');

                        $.each(data.result, function (key, value) {
                            self.$customerSearchResult.append('<a type="button" class="list-group-item d-flex justify-content-between align-items-center" id="selectedCustomer' + value.id + '" value="' + value.id + '">' + value.fullName + '<span class="badge bg-primary rounded-pill" value="' + value.fullName + '">' + value.mobileNumber + '</span> </a>'); // return empty
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
                                    window.location.replace("/PurchaseItem");
                                }, 1000);
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.result + '</label>');

                            $("#btnClose").on('click', function () {
                                setTimeout(function () {
                                    window.location.replace("/PurchaseItem");
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
                            window.location.replace("/PurchaseItem");
                        }, 1000);
                    });
                },
            });
        },
        setAjaxSearchSKU: function (inputVal) {
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

                        self.$productSearchResult.html('');

                        $.each(data.result, function (key, value) {

                            self.$productSearchResult.append('<a type="button" class="list-group-item list-group-item-action" id="selectedProduct' + value.id + '" value="' + value.id + '"><div class="d-flex w-100 justify-content-between" value="' + value.name + '"><h5 class="mb-1">' + value.name + '</h5><img src="' + value.productImageString + '" alt="..." class="img-thumbnail search-thumbnail w-100"></div><p class="mb-1">SKU: ' + value.code + '</p><small class="unit-price" value="' + value.unitPrice + '">Unit Price: ' + value.unitPrice + '</small></a>');

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
                                    window.location.replace("/PurchaseItem");
                                }, 1000);
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.result + '</label>');

                            $("#btnClose").on('click', function () {
                                setTimeout(function () {
                                    window.location.replace("/PurchaseItem");
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
                            window.location.replace("/PurchaseItem");
                        }, 1000);
                    });
                },
            });
        },
        setAjaxGetDetails: function (inputVal) {
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


                        self.$Customer.val(data.result[0].customerID.fullName);
                        self.$Customer.attr('disabled', true);
                        self.$DeliveryDate.val(self.formatDateOnly(data.result[0].dateOfDelivery));
                        self.$DeliveryDate.attr('disabled', true);
                        self.$Status.val(data.result[0].status);
                        self.$AmountDue.val(data.result[0].amountDue);
                        self.$AmountDue.text(data.result[0].amountDue.toFixed(2));


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
                                    window.location.replace("/PurchaseItem");
                                }, 1000);
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.result + '</label>');

                            $("#btnClose").on('click', function () {
                                setTimeout(function () {
                                    window.location.replace("/PurchaseItem");
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
                            window.location.replace("/PurchaseItem");
                        }, 1000);
                    });
                },
            });
        },
        setAjaxGetOrderItemDetails: function (inputVal) {
            var self = this;

            headers['__RequestVerificationToken'] = self.$Token.val();

            $.ajax({
                url: submitFormURL,
                type: "POST",
                data: inputVal,
                headers: headers,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.isSuccess) {

                        orderItemID = data.result.id;
                        skuPrice = data.result.skuid.unitPrice;
                        skuID = data.result.skuid.id;

                        self.$SKUName.val(data.result.skuid.name);
                        self.$edtQuantity.val(data.result.quantity);
                        self.$SubTotal.val(data.result.price);

                        self.declaration();

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
                                    window.location.replace("/PurchaseItem");
                                }, 1000);
                            });
                        }
                        else {

                            $("#modalFooter").html('')
                            $("#modalFooter").append(btnDismiss);
                            $("#modalContent").html('');
                            $("#modalContent").append('<label> Error: ' + data.result + '</label>');

                            $("#btnClose").on('click', function () {
                                setTimeout(function () {
                                    window.location.replace("/PurchaseItem");
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
                            window.location.replace("/PurchaseItem");
                        }, 1000);
                    });
                },
            });
        },
        clearInputs: function () {
            var self = this;

            skuID = "";
            skuPrice = 0;
            orderItemID = "";

            self.$divErrorMessage.empty();
            self.$divErrorMessage.removeClass("alert alert-danger");

            self.$SKUName.val('');
            self.$Quantity.val(0);
            self.$SubTotal.val(0);

        },
        formCustomerValidate: function () {
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
                    Customer: {
                        required: true,
                        minlength: 2
                    },
                    DeliveryDate: {
                        required: true,
                    },
                    Status: {
                        required: true,
                    },
                },
                messages: {
                    Customer: {
                        required: "Customer is required.",
                        minlength: "Customer field requires at least 2 letters."
                    },
                    DeliveryDate: {
                        required: "Delivery date is required.",
                    },
                    Status: {
                        required: "Status field is required.",
                    }
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
                            self.$divErrorMessage.append('<span class=\"invalid\"><h5>Customer and Delivery Date field is required.</h5></span>');
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
        formItemValidate: function () {
            var self = this;
            var ctr = 0;
            var errorCount = 0;
            var requiredErrors = [];
            var otherErrors = [];

            validator = self.$ProductItemForm.validate({
                errorElement: "span",
                errorClass: "invalid",
                onfocusout: false,
                onkeyup: false,
                onclick: false,
                ignore: [], //to still validate the hidden fields
                rules: {
                    SKUName: {
                        required: true,
                        minlength: 2
                    },
                    Quantity: {
                        required: true,
                    },
                    SubTotal: {
                        required: true,
                    },
                },
                messages: {
                    SKUName: {
                        required: "SKU is required.",
                        minlength: "SKU field requires at least 2 letters."
                    },
                    Quantity: {
                        required: "Quantity field is required.",
                    },
                    SubTotal: {
                        required: "Subtotal field is required.",
                    }
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
            const letterPattern = /^[a-zA-Z0-9\s\-_\.\(\)\[\],]$/;

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
                const cleanedText = text.replace(/[a-zA-Z0-9\s\-_\.\(\)\[\],]/g, '');
                $(this).val(cleanedText);
            });
        },
        decimalOnly: function (input) {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
            const numberPattern = /^[0-9.]$/;

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
                const cleanedText = text.replace(/[^0-9.]/g, '');
                $(this).val(cleanedText);
            });
        },
        numberOnly: function (input) {
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
        formatDateOnly: function (dateToFormat) {
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
                    year: 'numeric'
                }).format(dateObject);

            } catch (error) {
                console.error('Error formatting date:', error);
                return '';
            }
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
        },
        dateOnly: function (input) {
            input.on('keydown keyup', function (e) {
                // Allow special keys
                if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                    return true;
                }

                // Block non-numeric keys except '/'
                if (!/^\d$/.test(e.key) && e.key !== '/') {
                    e.preventDefault();
                    return false;
                }

                let value = $(this).val();

                // Auto-add slashes
                if (value.length === 2 && e.key !== 'Backspace') {
                    $(this).val(value + '/');
                }
                if (value.length === 5 && e.key !== 'Backspace') {
                    $(this).val(value + '/');
                }

                // Prevent more than 10 characters (MM/dd/yyyy)
                if (value.length >= 10 && e.key !== 'Backspace') {
                    e.preventDefault();
                    return false;
                }

                // Validate day (01-12)
                if (value.length === 2) {
                    let month = parseInt(value.split('/')[1]);
                    if (month < 1 || month > 12) {
                        $(this).val(value.substring(0, 3));
                        return false;
                    }
                }

                // Validate month (01-31) 
                if (value.length === 5) {
                    let day = parseInt(value);
                    if (day < 1 || day > 31) {
                        $(this).val('');
                        return false;
                    }
                }
            });

            // Clean invalid characters on paste
            input.on('paste', function (e) {
                e.preventDefault();
                let text = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
                let cleaned = text.replace(/[^0-9/]/g, '');
                if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);
                $(this).val(cleaned);
            });
        }

    }

    var InitialisePurchaseItemObjectTask = function () {
        var purchaseItemObjectTask = Object.create(PurchaseItemObjectTask);
        purchaseItemObjectTask.init();
    }

    InitialisePurchaseItemObjectTask();

});

