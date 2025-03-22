$(document).ready(function () {
	var skuID = "";
	var pageName = "Index";
	var submitFormURL = "";
	var headers = {};
	var successMessage = "";
	var btnDismiss = '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btnClose">Ok</button>';

	$.validator.addMethod('extension', function (value, element, param) {
		param = typeof param === 'string' ? param.replace(/,/g, '|') : 'png|jpe?g';
		return this.optional(element) || value.match(new RegExp('.(' + param + ')$', 'i'));
	}, 'Please upload a valid image file (jpg, jpeg, or png).');

	$.validator.addMethod('filesize', function (value, element, param) {
		return this.optional(element) || (element.files[0].size <= param * 1024 * 1024);
	}, 'File size must be less than {0} MB');


	/**
	 * @namespace SKUObjectTask
	 * @description Handles SKU (Stock Keeping Unit) management operations including creation, editing, and form validation
	 * @property {Function} init - Initializes the SKU management functionality
	 * @property {Function} declaration - Declares and initializes jQuery selectors and form elements
	 * @property {Function} setEvent - Sets up event handlers for various UI interactions
	 * @property {Function} setSubmitEvent - Handles form submission logic and validation
	 * @property {Function} setAjaxSendEvent - Manages AJAX requests for form submission
	 * @property {Function} clearInputs - Clears form input fields
	 * @property {Function} formValidate - Implements form validation rules and error handling
	 * @property {Function} textOnly - Restricts input to text characters only
	 * @property {Function} decimalOnly - Restricts input to decimal numbers only
	 * @property {Function} formatDate - Formats date strings to localized format
	 * 
	 * @requires jQuery
	 * @requires jQuery.validate
	 * 
	 * @example
	 * SKUObjectTask.init();
	 */
	var SKUObjectTask = {

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

					self.$Name = $("#Name");
					self.$Code = $("#Code");
					self.$UnitPrice = $("#UnitPrice");

					self.textOnly(self.$Name);
					self.textOnly(self.$Code);
					self.decimalOnly(self.$UnitPrice);

					self.$ProductImageHolder = $("#ProductImageHolder");
					self.$IsActive = $("#IsActive");

					self.$SKUForm = $("#CreateSKUForm");
					self.$divErrorMessage = $("#divErrorMessage");

					self.$divErrorMessage.empty(); // Clear previous errors
					self.$divErrorMessage.removeClass("alert alert-danger");
					break;
				case "Edit":
					self.$modalContent.html('');
					self.$modalContent.append('<label>Are you sure you want to update this record?</label>');
					successMessage = 'Record successfully updated.';

					self.$Name = $("#edtName");
					self.$Code = $("#edtCode");
					self.$UnitPrice = $("#edtUnitPrice");

					self.textOnly(self.$Name);
					self.textOnly(self.$Code);
					self.decimalOnly(self.$UnitPrice);

					self.$ProductImageHolder = $("#edtProductImageHolder");
					self.$ProductImageString = $("#edtProductImageString");
					self.$IsActive = $("#edtIsActive");

					self.$DateCreated = $("#edtDateCreated");
					self.$CreatedBy = $("#edtCreatedBy")
					self.$Timestamp = $("#edtTimestamp");
					self.$UserID = $("#edtUserID");

					self.$SKUForm = $("#EditSKUForm");
					self.$divErrorMessage = $("#edtdivErrorMessage");

					self.$divErrorMessage.empty(); // Clear previous errors
					self.$divErrorMessage.removeClass("alert alert-danger");
					break;
				default:
					self.$Name = $("#edtName");
					self.$Code = $("#edtCode");
					self.$UnitPrice = $("#edtUnitPrice");

					self.textOnly(self.$Name);
					self.textOnly(self.$Code);
					self.decimalOnly(self.$UnitPrice);

					self.$ProductImageHolder = $("#edtProductImageHolder");
					self.$ProductImageString = $("#edtProductImageString");
					self.$IsActive = $("#edtIsActive");

					self.$DateCreated = $("#edtDateCreated");
					self.$CreatedBy = $("#edtCreatedBy")
					self.$Timestamp = $("#edtTimestamp");
					self.$UserID = $("#edtUserID");

					self.$SKUForm = $("#EditSKUForm");
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
				skuID = $(this).attr('value');
				var form_data = new FormData();
				form_data.append("id", skuID);

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

			self.$ProductImageHolder.on('change', function () {
				if (self.$ProductImageHolder[0].files && pageName !== "Create") {

					for (var i = 0; i < self.$ProductImageHolder[0].files.length; i++) {

						var file = self.$ProductImageHolder[0].files[i];

						var reader = new FileReader();
						reader.onloadend = function () {
							self.$ProductImageString.attr('src', reader.result);
						}
						reader.readAsDataURL(file);
					}
				}

			});
		},
		setSubmitEvent: function () {
			var self = this;

			if (self.$SKUForm.valid()) {
				self.$divErrorMessage.empty();
				self.$divErrorMessage.removeClass("alert alert-danger");
				self.$confirmationModal.modal('show');

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

			} else {
				self.$divErrorMessage.empty(); // Clear previous errors
				self.$divErrorMessage.removeClass("alert alert-danger");
				self.$SKUForm.validate().showErrors(); // Show validation errors
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
								window.location.replace("/SKU");
							});
						}
						else {
							self.$Name.val(data.result.name);
							self.$Code.val(data.result.code);
							self.$UnitPrice.val(data.result.unitPrice);
							self.$ProductImageHolder.val(data.result.productImageHolder);
							self.$ProductImageString.attr('src', data.result.productImageString);

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
								window.location.replace("/SKU");
							});
						}
						else {

							self.$modalFooter.html('')
							self.$modalFooter.append(btnDismiss);
							self.$modalContent.html('');
							self.$modalContent.append('<label> Error: ' + data.result + '</label>');

							$("#btnClose").on('click', function () {
								window.location.replace("/SKU");
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
						window.location.replace("/SKU");;
					});
				},
			});
		},
		clearInputs: function () {
			var self = this;

			skuID = "";

			self.$divErrorMessage.empty();
			self.$divErrorMessage.removeClass("alert alert-danger");

			self.$Name.val('');
			self.$Code.val('');
			self.$UnitPrice.val(0);
			self.$ProductImageHolder.val('');
		},
		formValidate: function () {
			var self = this;
			var ctr = 0;
			var errorCount = 0;
			var requiredErrors = [];
			var otherErrors = []
			var uploadRequired = pageName === "Create" ? true : false;
			validator = self.$SKUForm.validate({
				errorElement: "span",
				errorClass: "invalid",
				onfocusout: false,
				onkeyup: false,
				onclick: false,
				ignore: [], //to still validate the hidden fields
				rules: {
					Name: {
						required: true,
						minlength: 2
					},
					Code: {
						required: true,
						minlength: 2
					},
					UnitPrice: {
						required: true,
					},
					ProductImageHolder: {
						required: uploadRequired,
						extension: "jpg|jpeg|png",
						filesize: 2
					},
				},
				messages: {
					FirstName: {
						required: "Name is required.",
						minlength: "Name requires at least 2 letters."
					},
					Code: {
						required: "Code is required.",
						minlength: "Code requires at least 2 letters."
					},
					UnitPrice: {
						required: "Unit Price is required.",
					},
					ProductImageHolder: {
						required: "Image File is required.",
						extension: "Image File must be in jpg, jpeg or png format.",
						filesize: "Image File must not exceed 2MB."

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
			const letterPattern = /^[a-zA-Z0-9\s\-_\.\(\)\[\]]$/;

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
				const cleanedText = text.replace(/[a-zA-Z0-9\s\-_\.\(\)\[\]]/g, '');
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
				return new Intl.DateTimeFormat('en-GB', {
					day: '2-digit',
					month: '2-digit',
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

	var InitialiseSKUObjectTask = function () {
		var skuObjectTask = Object.create(SKUObjectTask);
		skuObjectTask.init();
	}

	InitialiseSKUObjectTask();

});