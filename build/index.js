"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var fetch_cookie_1 = require("fetch-cookie");
/**
 * Playdate API client.
 */
var PlaydateClient = /** @class */ (function () {
    /**
     * @param {string} token The authentication token.
     */
    function PlaydateClient(token) {
        this.token = token;
        this.loginToken = null;
        this.fetchCookie = (0, fetch_cookie_1.default)(fetch);
        this.baseURL = "https://play.date/api/v2";
        this.baseWebURL = "https://play.date";
        this.headers = {
            Authorization: "Token ".concat(this.token),
            "Content-Type": "application/json",
        };
        if (!this.token) {
            console.warning("WARNING: there is no provided access token, you can use registerDevice to get one.");
        }
    }
    /**
     * Validates a serial number.
     *
     * The serial number should have a specific structure: PDU1-Y followed by 6 digits.
     * For example: "PDU1-Y123456"
     *
     * @private
     * @param {string} serial - The serial number to validate.
     * @throws {Error} If the serial number does not adhere to the required structure.
     */
    PlaydateClient.prototype._validateSerial = function (serial) {
        // Check for exact length
        if (serial.length !== 12) {
            throw new Error("Invalid serial number: ".concat(serial));
        }
        // Match with regular expression
        var regex = /^PDU1-Y[0-9]{6}$/;
        var match = serial.match(regex);
        // Check if it's a match and not all zeros
        if (!match) {
            throw new Error("Invalid serial number: ".concat(serial));
        }
    };
    /**
     * Makes a request to a specified endpoint and returns the response data.
     *
     * @private
     * @param {string} endpoint - The endpoint to which the request should be made.
     * @param {string} [method="GET"] - The HTTP method to use for the request. Defaults to "GET".
     * @param {Object} [body] - The body of the request, if applicable.
     * @returns {Promise} A promise that resolves to the data returned in the response.
     * @throws {Error} If the request fails, throws an Error with the response message or a default message.
     */
    PlaydateClient.prototype._request = function (endpoint, method, body) {
        if (method === void 0) { method = "GET"; }
        return __awaiter(this, void 0, void 0, function () {
            var options, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.token) {
                            throw new Error("Missing token");
                        }
                        options = {
                            method: method,
                            headers: this.headers,
                        };
                        if (body) {
                            options.body = JSON.stringify(body);
                        }
                        return [4 /*yield*/, fetch("".concat(this.baseURL).concat(endpoint), options)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (!response.ok) {
                            throw new Error(data.message || "Request failed");
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Retrieves a CSRF (Cross-Site Request Forgery) token from a specified URL.
     *
     * @private
     * @param {string} url - The URL from which to fetch the CSRF token.
     * @returns {Promise} A promise that resolves to the CSRF token.
     */
    PlaydateClient.prototype._getMiddlewareToken = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, text, dom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchCookie(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Invalid request.");
                        }
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        dom = new jsdom_1.JSDOM(text);
                        return [2 /*return*/, dom.window.document
                                .querySelector("input[name=\"csrfmiddlewaretoken\"]")
                                .getAttribute("value")];
                }
            });
        });
    };
    /**
     * Method to perform a login operation.
     *
     * @param {string} username The username.
     * @param {string} password The password.
     */
    PlaydateClient.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var url, token, body, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseWebURL, "/signin/");
                        return [4 /*yield*/, this._getMiddlewareToken(url)];
                    case 1:
                        token = _a.sent();
                        body = new URLSearchParams();
                        body.append("csrfmiddlewaretoken", token);
                        body.append("username", username);
                        body.append("password", password);
                        return [4 /*yield*/, this.fetchCookie(url, {
                                body: body.toString(),
                                method: "POST",
                                headers: {
                                    Referer: url,
                                    "Content-Type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 2:
                        result = _a.sent();
                        if (!result.ok) {
                            throw new Error("Login failed.");
                        }
                        this.loginToken = "logged+in";
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Method to remove a device.
     *
     * @param {string} serialNumber The serial number of the device to remove.
     */
    PlaydateClient.prototype.removeDevice = function (serialNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var url, token, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loginToken) {
                            throw new Error("You must be logged in to remove a device");
                        }
                        this._validateSerial(serialNumber);
                        url = "".concat(this.baseWebURL, "/devices/").concat(serialNumber, "/remove/");
                        return [4 /*yield*/, this._getMiddlewareToken(url)];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new Error("Device not found");
                        }
                        body = new URLSearchParams();
                        body.append("csrfmiddlewaretoken", token);
                        return [2 /*return*/, this.fetchCookie(url, {
                                body: body.toString(),
                                method: "POST",
                                headers: {
                                    Referer: url,
                                    "Content-Type": "application/x-www-form-urlencoded",
                                },
                            })];
                }
            });
        });
    };
    /**
     * Method to get registration pin.
     *
     * @param {string} serialNumber The serial number of the device.
     * @returns {Object} The register data.
     */
    PlaydateClient.prototype.getDevicePin = function (serialNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var result, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._validateSerial(serialNumber);
                        this.idempotencyKey = Math.random().toFixed(digit).split(".")[1];
                        return [4 /*yield*/, fetch("".concat(this.baseURL, "/device/register/").concat(serialNumber), {
                                headers: {
                                    "idempotency-key": this.idempotencyKey,
                                },
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        json = _a.sent();
                        return [2 /*return*/, json];
                }
            });
        });
    };
    /**
     * Method to add a register a device.
     *
     * @param {string} pin The pin of the device to add.
     */
    PlaydateClient.prototype.addDevice = function (pin) {
        return __awaiter(this, void 0, void 0, function () {
            var url, token, body, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loginToken) {
                            throw new Error("You must be logged in to add a device");
                        }
                        url = "".concat(this.baseWebURL, "/pin/");
                        return [4 /*yield*/, this._getMiddlewareToken(url)];
                    case 1:
                        token = _a.sent();
                        body = new URLSearchParams();
                        body.append("csrfmiddlewaretoken", token);
                        body.append("pin", pin);
                        return [4 /*yield*/, this.fetchCookie(url, {
                                body: body.toString(),
                                method: "POST",
                                headers: {
                                    Referer: url,
                                    "Content-Type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 2:
                        result = _a.sent();
                        if (!result.ok) {
                            throw new Error("Could not add device.");
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Method to get access token for registered device.
     *
     * @param {string} serialNumber The serial number of the device.
     * @returns {Object} The register complete data.
     */
    PlaydateClient.prototype.getDeviceAccessToken = function (serialNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var result, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.idempotencyKey) {
                            throw new Error("You must first add a device before this can be called.");
                        }
                        this._validateSerial(serialNumber);
                        return [4 /*yield*/, fetch("".concat(this.baseURL, "/device/register/").concat(serialNumber, "/complete/"), {
                                headers: {
                                    "idempotency-key": this.idempotencyKey,
                                },
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        json = _a.sent();
                        this.idempotencyKey = null;
                        return [2 /*return*/, json];
                }
            });
        });
    };
    /**
     * Method to register and initialize a device.
     * This method follows the sequence: removeDevice -> getDeviceRegister -> addDevice -> getDeviceRegisterComplete.
     *
     * @param {string} serialNumber The serial number of the device to register.
     * @returns {Object} The registration data.
     */
    PlaydateClient.prototype.registerDevice = function (serialNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, pin, registerCompleteData, access_token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loginToken) {
                            throw new Error("You must be logged in register a device");
                        }
                        this._validateSerial(serialNumber);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.removeDevice(serialNumber)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, this.getDevicePin(serialNumber)];
                    case 5:
                        pin = (_a.sent()).pin;
                        // Step 3: Add device
                        return [4 /*yield*/, this.addDevice(pin)];
                    case 6:
                        // Step 3: Add device
                        _a.sent();
                        return [4 /*yield*/, this.getDeviceAccessToken(serialNumber)];
                    case 7:
                        registerCompleteData = _a.sent();
                        access_token = registerCompleteData.access_token;
                        // Update this.token with the new token from the registration process
                        this.token = access_token;
                        this.loginToken = access_token;
                        this.headers = {
                            Authorization: "Token ".concat(this.token),
                            "Content-Type": "application/json",
                        };
                        // Return the registration data
                        return [2 /*return*/, registerCompleteData];
                }
            });
        });
    };
    /**
     * Echoes back the sent JSON body.
     * @param {Object} jsonBody - The JSON body to send to the endpoint.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.authEcho = function (jsonBody) {
        return this._request("/auth_echo/", "POST", jsonBody);
    };
    /**
     * Retrieves the player profile for the user that owns the current access token.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getPlayer = function () {
        return this._request("/player/");
    };
    /**
     * Retrieves the player profile for a specific user.
     * @param {string} playerId - The ID of the player to retrieve.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getPlayerById = function (playerId) {
        return this._request("/player/".concat(playerId, "/"));
    };
    /**
     * Uploads avatar data.
     * @param {Object} avatarData - The avatar data to upload.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.uploadAvatar = function (avatarData) {
        return this._request("/player/avatar/", "POST", avatarData);
    };
    /**
     * Retrieves an array of Schedule entries for any seasons that the user has access to.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getGamesScheduled = function () {
        return this._request("/games/scheduled/");
    };
    /**
     * Retrieves an array of Game entries for games that the user has sideloaded.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getGamesUser = function () {
        return this._request("/games/user/");
    };
    /**
     * Retrieves an array of Game entries for additional system applications.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getGamesSystem = function () {
        return this._request("/games/system/");
    };
    /**
     * Retrieves an array of Game entries for games that the user has purchased through Catalog.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getGamesPurchased = function () {
        return this._request("/games/purchased/");
    };
    /**
     * Retrieves an array of Catalog Game entries for games that are available through Catalog.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getGamesCatalog = function () {
        return this._request("/games/catalog");
    };
    /**
     * Retrieves Catalog Game entry for a specific Catalog game.
     * @param {number} idx - The index of the game to retrieve from the Catalog.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getGameCatalogById = function (idx) {
        return this._request("/games/catalog/".concat(idx));
    };
    /**
     * Initiates the purchase flow for a game.
     * @param {string} bundleId - The ID of the game to purchase.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.purchaseGame = function (bundleId) {
        return this._request("/games/".concat(bundleId, "/purchase/"), "POST");
    };
    /**
     * Completes the purchase flow for a game.
     * @param {string} bundleId - The ID of the game to confirm purchase for.
     * @returns {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.confirmPurchase = function (bundleId) {
        return this._request("/games/".concat(bundleId, "/purchase/confirm"), "POST");
    };
    /**
     * Makes a request to fetch firmware based on a provided version number.
     * If no version is provided, it defaults to "1.13.6".
     *
     * @param {string} version - The version of the firmware to fetch.
     * @return {Promise} The server's response to the request.
     */
    PlaydateClient.prototype.getFirmware = function (version) {
        if (version === void 0) { version = "1.13.6"; }
        return this._request("/firmware?current_version=".concat(version));
    };
    return PlaydateClient;
}());
exports.default = PlaydateClient;
