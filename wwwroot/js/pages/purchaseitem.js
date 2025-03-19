var customerID = "";
var skuID = "";
var skuPrice = 0;
var orderItemID = "";
var pageName = "Index";
var submitFormURL = "";

$(document).ready(function () {

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
            self.$modalContent = $("#modalContent");
            self.$modalFooter = $("#modalFooter");
            self.$btnSubmit = $("#btnSubmit");
            self.$btnEdtSubmit = $("#btnEdtSubmit");
            self.$btnConfirm = $("#btnConfirm");
            self.$btnCreate = $("#btnCreate");
            self.$customerSearchResult = $("#customerSearchResult");
            self.$searchDiv = $("#searchDiv");
            self.$productSearchResult = $("#productSearchResult");
            self.$searchSKUDiv = $("#searchSKUDiv");
            self.$btnEdit = $('a[id^="btnEdit"]');

            self.$Customer = $("#Customer");
            self.$DeliveryDate = $("#DeliveryDate");
            self.$Status = $("#Status");

            self.$SKUName = $("#SKUName");
            self.$Quantity = $("#Quantity");
            self.$SubTotal = $("#SubTotal");

            self.$edtSKUName = $("#edtSKUName");
            self.$edtQuantity = $("#edtQuantity");
            self.$edtSubTotal = $("#edtSubTotal");

            self.$AmountDue = $("#AmountDue");

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
                    if (orderID != 0 && orderID) {
                        submitFormURL = orderDetailsURL;
                        var form_data = new FormData();
                        form_data.append("id", orderID);
                        self.setAjaxGetDetails(form_data);
                    }
                    break;

            }

        },
        setEvent: function () {
            var self = this;

            self.$btnCreate.on('click', function () {
                self.$SKUName.val('');
                self.$Quantity.val('');
                self.$SubTotal.val('');

                skuID = "";
                skuPrice = 0;
                orderItemID = "";

                pageName = "Create";
                submitFormURL = addActionURL;
            });

            self.$btnEdit.on('click', function () {
                pageName = "Edit";
                submitFormURL = orderItemDetails;
                orderItemID = $(this).attr('value');
                var form_data = new FormData();
                form_data.append("id", orderItemID);
                self.declaration();

                self.setAjaxGetOrderItemDetails(form_data);
            });

            //Submit action
            self.$btnSubmit.on('click', function () {
                //If the inputs are valid
                //proceed to btnConfirm action
                //else, throw an error
                self.declaration();
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
                        submitFormURL = editActionURL;
                        var inputVal = {
                            ID: orderItemID,
                            Quantity: self.$edtQuantity.val().trim(),
                            Price: self.$edtSubTotal.val().trim()
                        }

                        var form_data = new FormData();

                        for (var key in inputVal) {
                            form_data.append(key, inputVal[key]);
                        }
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
                    submitFormURL = editActionURL;
                    var inputVal = {
                        ID: orderItemID,
                        Quantity: self.$edtQuantity.val().trim(),
                        Price: self.$edtSubTotal.val().trim()
                    }

                    var form_data = new FormData();

                    for (var key in inputVal) {
                        form_data.append(key, inputVal[key]);
                    }

                    self.setAjaxSendEvent(form_data);

                });

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

            self.$DeliveryDate.datepicker({
                format: 'dd/mm/yyyy',
                startDate: '0d'
            });

            self.$Quantity.on('keyup change', function () {
                if (self.$Quantity.val().length <= 0) {
                    self.$SubTotal.val(0);
                }
                else {
                    var quantity = self.$Quantity.val();
                    self.$SubTotal.val(quantity * skuPrice);

                }
                
            });

            self.$edtQuantity.on('keyup change', function () {
                if (self.$edtQuantity.val().length <= 0) {
                    self.$edtSubTotal.val(0);
                }
                else {
                    var quantity = self.$edtQuantity.val();
                    self.$edtSubTotal.val(quantity * skuPrice);

                }
                
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

                        $("#btnClose").on('click', function () {
                            setTimeout(function () {
                                window.location.replace("/PurchaseItem");
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
                                    window.location.replace("/PurchaseItem");
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

                            self.$productSearchResult.append('<a type="button" class="list-group-item list-group-item-action" id="selectedProduct' + value.id + '" value="' + value.id + '"><div class="d-flex w-100 justify-content-between" value="' + value.name + '"><h5 class="mb-1">' + value.name + '</h5><img src="' + value.productImageString + '" alt="..." class="img-thumbnail search-thumbnail"></div><p class="mb-1">SKU: ' + value.code + '</p><small class="unit-price" value="' + value.unitPrice + '">Unit Price: ' + value.unitPrice + '</small></a>');

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
                        self.$DeliveryDate.val(self.formatDate(data.result[0].dateOfDelivery));
                        self.$DeliveryDate.attr('disabled', true);
                        self.$Status.val(data.result[0].status);
                        self.$AmountDue.val(data.result[0].amountDue);
                        self.$AmountDue.text(data.result[0].amountDue);


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

                        self.$edtSKUName.val(data.result.skuid.name);
                        self.$edtQuantity.val(data.result.quantity);
                        self.$edtSubTotal.val(data.result.price);

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
        formatDate: function (dateToFormat) {
            var dateObject = new Date(dateToFormat);
            var day = dateObject.getDate();
            var month = dateObject.getMonth() + 1;
            var year = dateObject.getFullYear();
            day = day < 10 ? "0" + day : day;
            month = month < 10 ? "0" + month : month;
            var formattedDate = day + "/" + month + "/" + year;
            return formattedDate;
        }

    }

    var InitialisePurchaseItemObjectTask = function () {
        var purchaseItemObjectTask = Object.create(PurchaseItemObjectTask);
        purchaseItemObjectTask.init();
    }

    InitialisePurchaseItemObjectTask();

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

    //$('a[id^="btnEdit"]').on('click', function () {

    //    pageName = "Edit";
    //    submitFormURL = orderItemDetails;
    //    orderItemID = $(this).attr('value');
    //    var form_data = new FormData();
    //    form_data.append("id", orderItemID)

    //    $.ajax({
    //        url: submitFormURL,
    //        type: "POST",
    //        //data: JSON.stringify(inputVal),
    //        data: form_data,
    //        headers: headers,
    //        //dataType: "json",
    //        contentType: false,
    //        processData: false,
    //        success: function (data) {
    //            if (data.isSuccess) {

    //                orderItemID = data.result.id;
    //                skuPrice = data.result.skuid.unitPrice;
    //                skuID = data.result.skuid.id;

    //                $("#edtSKUName").val(data.result.skuid.name);

    //                $("#edtQuantity").val(data.result.quantity);
    //                $("#edtSubTotal").val(data.result.price);

    //            } else {
    //                if (data.isListResult) {
    //                    var msg = "";

    //                    for (var i = 0; i < data.result.length; i++) {
    //                        msg += "Error : " + data.result[i] + "\n";
    //                    }

    //                    $("#modalFooter").html('')
    //                    $("#modalFooter").append(btnDismiss);
    //                    $("#modalContent").html('');
    //                    $("#modalContent").append('<label>' + msg + '</label>');

    //                    $("#btnClose").click(function () {
    //                        setTimeout(function () {
    //                            window.location.replace("/Customer");
    //                        }, 1000);
    //                    });
    //                }
    //                else {

    //                    $("#modalFooter").html('')
    //                    $("#modalFooter").append(btnDismiss);
    //                    $("#modalContent").html('');
    //                    $("#modalContent").append('<label> Error: ' + data.result + '</label>');

    //                    $("#btnClose").click(function () {
    //                        setTimeout(function () {
    //                            window.location.replace("/Customer");
    //                        }, 1000);
    //                    });
    //                }
    //            }
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            $("#modalFooter").html('')
    //            $("#modalFooter").append(btnDismiss);
    //            $("#modalContent").html('');
    //            $("#modalContent").append('<label> Error: ' + $(jqXHR.responseText).filter('title').text() + ', ' + textStatus + ', ' + errorThrown + '</label>');

    //            $("#btnClose").click(function () {
    //                setTimeout(function () {
    //                    window.location.replace("/Customer");
    //                }, 1000);
    //            });
    //        },
    //    });
    //});

    //$("#btnCreate").on('click', function () {
    //    $("#SKUName").val('');
    //    $("#Quantity").val('');
    //    $("#SubTotal").val('');

    //    skuID = "";

    //    pageName = "Create";
    //    submitFormURL = addActionURL;
    //});
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

